import { Product } from './product.model';
export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'cod' | 'online';
export type PaymentStatus = 'not_required' | 'not_started' | 'created' | 'paid' | 'failed' | 'refunded';
export interface ShippingAddress { line1: string; line2?: string | null; city: string; state: string; pincode: string; country?: string; }
export interface OrderItemOut { product_id: string; product_name: string; unit_price: string; quantity: number; line_total: string; product?: Product | null; }
export interface Order {
  id: string; user_id: string; status: OrderStatus; payment_method: PaymentMethod; payment_status: PaymentStatus;
  customer_name: string; customer_email: string; customer_phone: string; address: string; shipping_address: ShippingAddress;
  items: OrderItemOut[]; line_count: number; item_count: number; subtotal: string; delivery_charge: string; discount: string; total: string;
  cancelled_at?: string | null; delivered_at?: string | null; created_at: string; updated_at: string; is_cancellable: boolean; free_delivery_applied: boolean;
}
export interface OrderPage { orders: Order[]; total: number; page: number; limit: number; pages: number; }
export interface OrderCreatePayload { name: string; email: string; phone: string; address: ShippingAddress; payment_method: PaymentMethod; items?: { product_id: string; quantity: number }[] | null; }
