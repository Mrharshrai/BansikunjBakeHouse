import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { ApiService } from './api.service';
import { Category, CategoryList, InventoryPage, Product, ProductPage, ProductQuery, SingleCategory, SingleProduct, SortOption, TagList } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly api = inject(ApiService);
  private readonly productsSignal = signal<Product[]>([]);
  private readonly categoriesSignal = signal<Category[]>([]);
  private readonly pageSignal = signal<ProductPage | null>(null);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);
  readonly products = this.productsSignal.asReadonly();
  readonly categories = this.categoriesSignal.asReadonly();
  readonly page = this.pageSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly productCount = computed(() => this.pageSignal()?.total ?? this.productsSignal().length);

  loadCatalogue(force = false): void {
    if (this.productsSignal().length && !force) return;
    this.fetchProducts({ limit: 100 });
    this.fetchCategories().subscribe({ error: () => {} });
  }

  fetchProducts(query: ProductQuery = {}): void {
    this.loadingSignal.set(true); this.errorSignal.set(null);
    this.api.get<ProductPage>('/products', query as any).subscribe({
      next: (p) => { this.pageSignal.set(p); this.productsSignal.set(p.products); this.loadingSignal.set(false); },
      error: (e) => { this.errorSignal.set(this.msg(e)); this.loadingSignal.set(false); },
    });
  }

  getProduct(reference: string): Observable<Product> {
    return this.api.get<SingleProduct>(`/products/${reference}`).pipe(map((d) => d.product));
  }

  fetchCategories(includeInactive = false): Observable<Category[]> {
    const q = includeInactive ? { include_inactive: true } : undefined;
    return this.api.get<CategoryList>('/categories', q as any).pipe(map((d) => d.categories), tap((c) => this.categoriesSignal.set(c)));
  }

  getCategory(slug: string) { return this.api.get<SingleCategory>(`/categories/${slug}`).pipe(map((d) => d.category)); }
  getTags() { return this.api.get<TagList>('/products/tags').pipe(map((d) => d.tags)); }

  getById(id: string) { return this.productsSignal().find((p) => p.id === id || p.slug === id); }
  byCategory(slug: string) {
    const ps = this.productsSignal();
    if (!slug || slug === 'all') return ps;
    if (slug === 'bestsellers') return ps.filter((p) => p.is_best_seller);
    return ps.filter((p) => p.category === slug || p.category_slug === slug);
  }
  bestSellers() { return this.productsSignal().filter((p) => p.is_best_seller); }
  byCategorySlug(slug: string) { return this.byCategory(slug); }
  categoryBySlug(slug: string) { return this.categoriesSignal().find((c) => c.slug === slug); }

  queryProducts(query: { q?: string; category?: string; tag?: string; sort?: SortOption; limit?: number }) {
    const q = (query.q ?? '').trim().toLowerCase();
    let res = [...this.productsSignal()];
    if (query.category && query.category !== 'all') res = this.byCategory(query.category);
    if (query.tag) res = res.filter((p) => p.tags?.includes(query.tag!));
    if (q) res = res.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || (p.tags||[]).some(t=>t.toLowerCase().includes(q)));
    return this.sort(res, query.sort ?? 'popular', query.limit);
  }

  private sort(items: Product[], sort: SortOption, limit?: number) {
    const s = [...items];
    const num = (v: any) => Number(v ?? 0);
    if (sort === 'price-asc') s.sort((a,b)=>num(a.price)-num(b.price));
    else if (sort === 'price-desc') s.sort((a,b)=>num(b.price)-num(a.price));
    else if (sort === 'rating') s.sort((a,b)=>num(b.rating)-num(a.rating));
    else if (sort === 'newest') s.sort((a,b)=>String(b.created_at||'').localeCompare(String(a.created_at||'')));
    else s.sort((a,b)=>(b.review_count||0)-(a.review_count||0));
    return limit ? s.slice(0,limit) : s;
  }

  createProduct(body: any) { return this.api.post<SingleProduct>('/products', body).pipe(map(d=>d.product), tap(()=>this.loadCatalogue(true))); }
  updateProduct(ref: string, body: any) { return this.api.patch<SingleProduct>(`/products/${ref}`, body).pipe(map(d=>d.product), tap(()=>this.loadCatalogue(true))); }
  deleteProduct(ref: string) { return this.api.delete(`/products/${ref}`).pipe(tap(()=>this.loadCatalogue(true))); }
  adjustStock(ref: string, body: any) { return this.api.patch(`/products/${ref}/stock`, body); }
  getInventory(params: any = {}) { return this.api.get<InventoryPage>('/products/inventory', params); }
  createCategory(body: any) { return this.api.post<SingleCategory>('/categories', body).pipe(tap(()=>this.fetchCategories(true).subscribe())); }
  updateCategory(id: string, body: any) { return this.api.patch<SingleCategory>(`/categories/${id}`, body).pipe(tap(()=>this.fetchCategories(true).subscribe())); }
  deleteCategory(id: string) { return this.api.delete(`/categories/${id}`).pipe(tap(()=>this.fetchCategories(true).subscribe())); }
  deactivateCategory(id: string) { return this.api.post<SingleCategory>(`/categories/${id}/deactivate`, {}).pipe(tap(()=>this.fetchCategories(true).subscribe())); }

  private msg(e: any) { return e?.error?.message || e?.error?.detail || e?.message || 'Request failed'; }
}
