import { Product } from './product.model';
export interface CartItemOut {
  product_id: string; quantity: number; unit_price: string; line_total: string;
  is_available: boolean; available_stock: number; product?: Product | null;
}
export interface CartOut { items: CartItemOut[]; line_count: number; item_count: number; subtotal: string; is_empty: boolean; }
