import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, finalize, of, tap } from 'rxjs';
import { ApiService } from './api.service';
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from '../mock/data.mock';
import { Category, Product, ProductQuery, SortOption } from '../models/product.model';

/**
 * Product catalogue state. Tries the FastAPI backend first and
 * transparently falls back to mock data when the API is unreachable,
 * so the app is fully functional offline / before the backend exists.
 */
@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly api = inject(ApiService);

  private readonly loaded = signal(false);
  private readonly productsSignal = signal<Product[]>([]);
  private readonly categoriesSignal = signal<Category[]>([]);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly products = this.productsSignal.asReadonly();
  readonly categories = this.categoriesSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  readonly productCount = computed(() => this.productsSignal().length);

  /** Load the catalogue once. Safe to call from anywhere. */
  loadCatalogue(force = false): void {
    if (this.loaded() && !force) {
      return;
    }
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.api
      .get<Product[]>('/products')
      .pipe(
        catchError(() => {
          this.errorSignal.set('Backend unavailable — showing offline catalogue.');
          return of(MOCK_PRODUCTS);
        }),
        finalize(() => this.loadingSignal.set(false)),
        tap(() => this.loaded.set(true)),
      )
      .subscribe((products) => this.productsSignal.set(products));

    this.api
      .get<Category[]>('/categories')
      .pipe(catchError(() => of(MOCK_CATEGORIES)))
      .subscribe((categories) => this.categoriesSignal.set(categories));
  }

  /** Fetch a single product. Falls back to the loaded/mock catalogue. */
  getProduct(id: string): Observable<Product | undefined> {
    const found = this.productsSignal().find((p) => p.id === id);
    if (found) {
      return of(found);
    }

    return this.api.get<Product>(`/products/${id}`).pipe(
      catchError(() => of(this.productsSignal().find((p) => p.id === id))),
    );
  }

  // ---------------------------------------------------------------------------
  //  Queries over the loaded catalogue
  // ---------------------------------------------------------------------------
  getById(id: string): Product | undefined {
    return this.productsSignal().find((p) => p.id === id);
  }

  byCategory(slug: string): Product[] {
    const products = this.productsSignal();
    if (!slug || slug === 'all') {
      return products;
    }
    if (slug === 'bestsellers') {
      return products.filter((p) => p.isBestSeller);
    }
    return products.filter((p) => p.category === slug);
  }

  bestSellers(): Product[] {
    return this.productsSignal().filter((p) => p.isBestSeller);
  }

  byCategorySlug(slug: string): Product[] {
    return this.byCategory(slug);
  }

  queryProducts(query: ProductQuery): Product[] {
    const q = (query.q ?? '').trim().toLowerCase();
    let result = this.productsSignal();

    if (query.category && query.category !== 'all') {
      result = this.byCategory(query.category);
    }

    if (query.tag) {
      result = result.filter((p) => p.tags.includes(query.tag!));
    }

    if (q) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }

    if (query.minPrice != null) {
      result = result.filter((p) => p.price >= query.minPrice!);
    }
    if (query.maxPrice != null) {
      result = result.filter((p) => p.price <= query.maxPrice!);
    }

    return this.sort(result, query.sort ?? 'popular', query.limit);
  }

  private sort(products: Product[], sort: SortOption, limit?: number): Product[] {
    const sorted = [...products];

    switch (sort) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
      default:
        sorted.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }

    return limit ? sorted.slice(0, limit) : sorted;
  }

  categoryBySlug(slug: string): Category | undefined {
    return this.categoriesSignal().find((c) => c.slug === slug);
  }

  /** Create/edit/delete products (admin). Works against the API, mock locally. */
  createProduct(product: Product): Observable<Product> {
    return this.api.post<Product>('/products', product).pipe(
      catchError(() => {
        this.upsertLocal(product);
        return of(product);
      }),
    );
  }

  updateProduct(product: Product): Observable<Product> {
    return this.api.put<Product>(`/products/${product.id}`, product).pipe(
      catchError(() => {
        this.upsertLocal(product);
        return of(product);
      }),
    );
  }

  deleteProduct(id: string): Observable<void> {
    return this.api.delete<void>(`/products/${id}`).pipe(
      catchError(() => {
        this.productsSignal.set(this.productsSignal().filter((p) => p.id !== id));
        return of(undefined);
      }),
    );
  }

  private upsertLocal(product: Product): void {
    const exists = this.productsSignal().some((p) => p.id === product.id);
    this.productsSignal.set(
      exists ? this.productsSignal().map((p) => (p.id === product.id ? product : p)) : [product, ...this.productsSignal()],
    );
  }
}
