export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description?: string;
  productCount?: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  /** Original price before discount */
  mrp?: number;
  /** Category slug e.g. 'soft-chewy' */
  category: string;
  categoryName?: string;
  image: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  isBestSeller: boolean;
  inStock: boolean;
  /** e.g. '12 cookies • 480g' */
  weight?: string;
}

export type SortOption = 'popular' | 'price-asc' | 'price-desc' | 'rating';

export interface ProductQuery {
  q?: string;
  category?: string;
  tag?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: SortOption;
  limit?: number;
}
