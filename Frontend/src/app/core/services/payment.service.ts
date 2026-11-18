import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly api = inject(ApiService);
  getPayment(orderId: string) { return this.api.get(`/payments/orders/${orderId}`); }
  createRazorpay(orderId: string) { return this.api.post<any>(`/payments/orders/${orderId}/razorpay`, {}); }
  verify(orderId: string, payload: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) {
    return this.api.post(`/payments/orders/${orderId}/verify`, payload);
  }
  refund(orderId: string, payload: any) { return this.api.post(`/payments/orders/${orderId}/refund`, payload); }
}
