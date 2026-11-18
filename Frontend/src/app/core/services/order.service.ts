import { Injectable, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { ApiService } from './api.service';
import { Order, OrderCreatePayload, OrderPage, OrderStatus } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly api = inject(ApiService);
  private readonly ordersSignal = signal<Order[]>([]);
  private readonly loadingSignal = signal(false);
  readonly orders = this.ordersSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();

  loadOrders(page = 1, limit = 20): void {
    this.loadingSignal.set(true);
    this.api.get<OrderPage>('/orders', { page, limit }).subscribe({ next: (p)=>{ this.ordersSignal.set(p.orders); this.loadingSignal.set(false); }, error: ()=>this.loadingSignal.set(false) });
  }

  placeOrder(payload: OrderCreatePayload): Observable<Order> {
    return this.api.post<Order>('/orders', payload).pipe(tap((o)=> this.ordersSignal.update(l=>[o,...l])));
  }
  getOrder(id: string) { return this.api.get<Order>(`/orders/${id}`); }
  cancelOrder(id: string) { return this.api.post<Order>(`/orders/${id}/cancel`, {}).pipe(tap((o)=>this.replace(o))); }

  // admin
  loadAllOrders(params: any = {}) { this.loadingSignal.set(true); this.api.get<OrderPage>('/orders/admin/all', params).subscribe({ next:(p)=>{this.ordersSignal.set(p.orders); this.loadingSignal.set(false);}, error:()=>this.loadingSignal.set(false)}); }
  getAdminOrder(id: string) { return this.api.get<Order>(`/orders/admin/${id}`); }
  updateStatus(id: string, status: OrderStatus) { return this.api.patch<Order>(`/orders/admin/${id}/status`, { status }).pipe(tap((o)=>this.replace(o))); }

  private replace(o: Order) { this.ordersSignal.update(list => { const i=list.findIndex(x=>x.id===o.id); if(i===-1) return [o,...list]; const c=[...list]; c[i]=o; return c; }); }
}
