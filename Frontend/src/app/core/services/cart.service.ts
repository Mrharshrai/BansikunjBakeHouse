import { Injectable, computed, inject, signal } from '@angular/core';
import { tap } from 'rxjs';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { CartOut } from '../models/cart.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  private readonly cartSignal = signal<CartOut>({ items: [], line_count: 0, item_count: 0, subtotal: '0.00', is_empty: true });
  private readonly drawerOpen = signal(false);
  private readonly loadingSignal = signal(false);
  readonly cart = this.cartSignal.asReadonly();
  readonly items = computed(() => this.cartSignal().items);
  readonly count = computed(() => this.cartSignal().item_count);
  readonly subtotal = computed(() => Number(this.cartSignal().subtotal || 0));
  readonly discount = computed(() => 0);
  readonly deliveryCharge = computed(() => 0);
  readonly total = computed(() => this.subtotal());
  readonly summary = computed(() => ({ subtotal: this.subtotal(), deliveryCharge: 0, discount: 0, total: this.total() }));
  readonly isOpen = this.drawerOpen.asReadonly();
  readonly isEmpty = computed(() => this.cartSignal().is_empty);
  readonly loading = this.loadingSignal.asReadonly();

  load(): void {
    if (!this.auth.isAuthenticated()) { this.cartSignal.set({ items: [], line_count: 0, item_count: 0, subtotal: '0.00', is_empty: true }); return; }
    this.loadingSignal.set(true);
    this.api.get<CartOut>('/cart/items').subscribe({ next: (c) => { this.cartSignal.set(c); this.loadingSignal.set(false); }, error: () => this.loadingSignal.set(false) });
  }

  add(product: { id: string } | string, quantity = 1) {
    if (!this.auth.isAuthenticated()) return;
    const product_id = typeof product === 'string' ? product : product.id;
    this.api.post<CartOut>('/cart/items', { product_id, quantity }).subscribe({ next: (c) => this.cartSignal.set(c) });
  }
  setQuantity(productId: string, quantity: number) {
    if (!this.auth.isAuthenticated()) return;
    if (quantity <= 0) { this.remove(productId); return; }
    this.api.put<CartOut>(`/cart/items/${productId}`, { quantity }).subscribe({ next: (c) => this.cartSignal.set(c) });
  }
  increment(productId: string) { const i = this.items().find(x=>x.product_id===productId); if(i) this.setQuantity(productId, i.quantity+1); }
  decrement(productId: string) { const i = this.items().find(x=>x.product_id===productId); if(i) this.setQuantity(productId, i.quantity-1); }
  remove(productId: string) { if (!this.auth.isAuthenticated()) return; this.api.delete<CartOut>(`/cart/items/${productId}`).subscribe({ next: (c)=>this.cartSignal.set(c) }); }
  clear() { if (!this.auth.isAuthenticated()) { this.cartSignal.set({ items: [], line_count: 0, item_count: 0, subtotal: '0.00', is_empty: true }); return; } this.api.delete<CartOut>('/cart/items').subscribe({ next: (c)=>this.cartSignal.set(c) }); }
  openDrawer() { this.drawerOpen.set(true); }
  closeDrawer() { this.drawerOpen.set(false); }
  toggleDrawer() { this.drawerOpen.update(v=>!v); }
}
