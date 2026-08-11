import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, finalize, of } from 'rxjs';
import { STORAGE } from '../constants/storage';
import { Order, CheckoutPayload } from '../models/order.model';
import { ApiService } from './api.service';
import { CartService } from './cart.service';

/**
 * Order history + checkout. Persists locally until the backend is available,
 * then reads/writes through the FastAPI endpoints.
 */
@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly api = inject(ApiService);
  private readonly cart = inject(CartService);

  private readonly ordersSignal = signal<Order[]>(this.readLocal());
  private readonly loadingSignal = signal(false);

  readonly orders = this.ordersSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();

  loadOrders(): void {
    this.loadingSignal.set(true);
    this.api
      .get<Order[]>('/orders')
      .pipe(
        catchError(() => of(this.readLocal())),
        finalize(() => this.loadingSignal.set(false)),
      )
      .subscribe((orders) => this.ordersSignal.set(orders));
  }

  getOrder(id: string): Order | undefined {
    return this.ordersSignal().find((order) => order.id === id);
  }

  placeOrder(payload: CheckoutPayload): Observable<Order> {
    return this.api.post<Order>('/orders', payload).pipe(
      catchError(() => {
        const order = this.buildLocalOrder(payload);
        this.saveLocally(order);
        return of(order);
      }),
    );
  }

  private buildLocalOrder(payload: CheckoutPayload): Order {
    const address = payload.address;
    return {
      id: `BK-${Date.now().toString(36).toUpperCase()}`,
      items: this.cart.items(),
      subtotal: this.cart.subtotal(),
      deliveryCharge: this.cart.deliveryCharge(),
      discount: this.cart.discount(),
      total: this.cart.total(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      customerName: payload.name,
      address: `${address.line1}${address.line2 ? ', ' + address.line2 : ''}, ${address.city}, ${address.state} ${address.pincode}`,
      paymentMethod: payload.paymentMethod,
    };
  }

  private saveLocally(order: Order): void {
    const orders = [...this.ordersSignal(), order];
    localStorage.setItem(STORAGE.orders, JSON.stringify(orders));
    this.ordersSignal.set(orders);
  }

  private readLocal(): Order[] {
    try {
      const raw = localStorage.getItem(STORAGE.orders);
      return raw ? (JSON.parse(raw) as Order[]) : [];
    } catch {
      return [];
    }
  }
}
