export interface Category {
  id: string; name: string; slug: string; description?: string | null; image_url?: string | null;
  is_active: boolean; display_order: number; product_count: number; created_at?: string; updated_at?: string;
}
export interface Product {
  id: string; name: string; slug: string; description: string; weight?: string | null;
  price: string | number; mrp?: string | number | null; discount_percent?: number | null;
  in_stock: boolean; stock_quantity: number; category_id: string; category?: string | null;
  category_name?: string | null; category_slug?: string | null; image_url: string;
  tags: string[]; is_active: boolean; is_best_seller: boolean; rating?: string | number | null;
  review_count: number; created_at?: string; updated_at?: string;
}
export interface ProductPage { products: Product[]; total: number; page: number; limit: number; pages: number; }
export interface SingleProduct { product: Product; }
export interface CategoryList { categories: Category[]; }
export interface SingleCategory { category: Category; }
export interface TagList { tags: string[]; }
export type SortOption = 'popular' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
export interface ProductQuery {
  q?: string; category?: string; tag?: string; min_price?: number | string; max_price?: number | string;
  is_best_seller?: boolean; in_stock?: boolean; sort?: SortOption; page?: number; limit?: number;
}
export interface InventoryItem extends Product {}
export interface InventoryPage { products: InventoryItem[]; total: number; page: number; limit: number; pages: number; out_of_stock: number; low_stock: number; threshold: number; }
