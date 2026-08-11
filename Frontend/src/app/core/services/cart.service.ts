import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { catchError, of } from 'rxjs';
import { STORAGE } from '../constants/storage';
import {
  CartItem,
  CartItemView,
  CartSummary,
  DELIVERY_CHARGE,
  FREE_DELIVERY_THRESHOLD,
} from '../models/cart.model';
import { Product } from '../models/product.model';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { ProductService } from './product.service';

/**
 * Cart state is localStorage-first (instant + works offline) with
 * best-effort sync to the FastAPI backend when a user is signed in.
 */
@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  private readonly productService = inject(ProductService);

  private readonly rawItems = signal<CartItem[]>(this.readStorage());
  private readonly drawerOpen = signal(false);

  /** Enriched items joined with product catalogue. */
  readonly items = computed<CartItemView[]>(() => {
    const catalogue = this.productService.products();
    return this.rawItems()
      .map((raw) => {
        const product = catalogue.find((p) => p.id === raw.productId);
        return product
          ? { product, quantity: raw.quantity, lineTotal: product.price * raw.quantity }
          : null;
      })
      .filter((item): item is CartItemView => item !== null);
  });

  readonly count = computed(() => this.rawItems().reduce((sum, item) => sum + item.quantity, 0));
  readonly subtotal = computed(() => this.items().reduce((sum, item) => sum + item.lineTotal, 0));
  readonly discount = computed(() =>
    this.items().reduce((sum, item) => {
      const perUnit = item.product.mrp ? item.product.mrp - item.product.price : 0;
      return sum + perUnit * item.quantity;
    }, 0),
  );
  readonly deliveryCharge = computed(() => {
    const subtotal = this.subtotal();
    if (subtotal === 0 || subtotal >= FREE_DELIVERY_THRESHOLD) {
      return 0;
    }
    return DELIVERY_CHARGE;
  });
  readonly total = computed(() => this.subtotal() + this.deliveryCharge());

  readonly isOpen = this.drawerOpen.asReadonly();
  readonly isEmpty = computed(() => this.rawItems().length === 0);

  readonly summary = computed<CartSummary>(() => ({
    subtotal: this.subtotal(),
    deliveryCharge: this.deliveryCharge(),
    discount: this.discount(),
    total: this.total(),
  }));

  constructor() {
    effect(() => {
      localStorage.setItem(STORAGE.cart, JSON.stringify(this.rawItems()));
    });
  }

  add(product: Product, quantity = 1): void {
    this.rawItems.update((items) => {
      const existing = items.find((item) => item.productId === product.id);
      if (existing) {
        return items.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + quantity } : item,
        );
      }
      return [...items, { productId: product.id, quantity }];
    });
    this.syncAdd(product.id, quantity);
  }

  increment(productId: string): void {
    this.rawItems.update((items) =>
      items.map((item) => (item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item)),
    );
    this.syncUpdate(productId);
  }

  decrement(productId: string): void {
    let removed = false;
    this.rawItems.update((items) =>
      items
        .map((item) => {
          if (item.productId !== productId) {
            return item;
          }
          if (item.quantity <= 1) {
            removed = true;
            return null;
          }
          return { ...item, quantity: item.quantity - 1 };
        })
        .filter((item): item is CartItem => item !== null),
    );
    if (removed) {
      this.syncRemove(productId);
    } else {
      this.syncUpdate(productId);
    }
  }

  setQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.remove(productId);
      return;
    }
    this.rawItems.update((items) =>
      items.map((item) => (item.productId === productId ? { ...item, quantity } : item)),
    );
    this.syncUpdate(productId);
  }

  remove(productId: string): void {
    this.rawItems.update((items) => items.filter((item) => item.productId !== productId));
    this.syncRemove(productId);
  }

  clear(): void {
    this.rawItems.set([]);
  }

  toApiItems(): CartItem[] {
    return this.rawItems();
  }

  // ---------------------------------------------------------------------------
  //  Drawer
  // ---------------------------------------------------------------------------
  openDrawer(): void {
    this.drawerOpen.set(true);
  }

  closeDrawer(): void {
    this.drawerOpen.set(false);
  }

  toggleDrawer(): void {
    this.drawerOpen.update((open) => !open);
  }

  // ---------------------------------------------------------------------------
  //  Best-effort API sync (silently ignored when backend is down)
  // ---------------------------------------------------------------------------
  private syncAdd(productId: string, quantity: number): void {
    if (!this.auth.isAuthenticated()) {
      return;
    }
    this.api
      .post<CartItem>('/cart/items', { productId, quantity })
      .pipe(catchError(() => of(null)))
      .subscribe();
  }

  private syncUpdate(productId: string): void {
    if (!this.auth.isAuthenticated()) {
      return;
    }
    const item = this.rawItems().find((i) => i.productId === productId);
    if (!item) {
      return;
    }
    this.api
      .put<CartItem>(`/cart/items/${productId}`, { quantity: item.quantity })
      .pipe(catchError(() => of(null)))
      .subscribe();
  }

  private syncRemove(productId: string): void {
    if (!this.auth.isAuthenticated()) {
      return;
    }
    this.api
      .delete<unknown>(`/cart/items/${productId}`)
      .pipe(catchError(() => of(null)))
      .subscribe();
  }

  private readStorage(): CartItem[] {
    try {
      const raw = localStorage.getItem(STORAGE.cart);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  }
}
