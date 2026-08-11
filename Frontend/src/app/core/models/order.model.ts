import { CartItem, CartItemView } from './cart.model';

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface AddressPayload {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface CheckoutPayload {
  name: string;
  email: string;
  phone: string;
  address: AddressPayload;
  paymentMethod: 'cod' | 'online';
  items: CartItem[];
}

export interface Order {
  id: string;
  items: CartItemView[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  customerName: string;
  address: string;
  paymentMethod: 'cod' | 'online';
}
