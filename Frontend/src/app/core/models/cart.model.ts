import { Product } from './product.model';

/** Cart item as stored / sent to the API */
export interface CartItem {
  productId: string;
  quantity: number;
}

/** Cart item enriched with product + computed line total for the UI */
export interface CartItemView {
  product: Product;
  quantity: number;
  lineTotal: number;
}

export interface CartSummary {
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  total: number;
}

/** Flat delivery fee below the free-delivery threshold */
export const DELIVERY_CHARGE = 99;
/** Orders at or above this value ship free */
export const FREE_DELIVERY_THRESHOLD = 499;
