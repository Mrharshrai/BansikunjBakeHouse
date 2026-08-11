import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { IconComponent } from '../../shared/components/icon/icon';
import { ProductCardComponent } from '../../shared/components/product-card/product-card';
import { SortOption } from '../../core/models/product.model';

@Component({
  selector: 'app-product-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IconComponent, ProductCardComponent],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductListComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly productService = inject(ProductService);

  private readonly slug = signal<string>('all');
  protected readonly sort = signal<SortOption>('popular');

  protected readonly sortOptions: { value: SortOption; label: string }[] = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'rating', label: 'Top Rated' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
  ];

  protected readonly categoryName = computed(() => {
    const slug = this.slug();
    if (!slug || slug === 'all') {
      return 'All Cookies';
    }
    return this.productService.categoryBySlug(slug)?.name ?? 'Cookies';
  });

  protected readonly categoryDescription = computed(() => {
    const slug = this.slug();
    if (!slug || slug === 'all') {
      return 'Every baked good we make, fresh to order and packed with love.';
    }
    return this.productService.categoryBySlug(slug)?.description ?? 'Freshly baked, just for you.';
  });

  protected readonly products = computed(() =>
    this.productService.queryProducts({ category: this.slug(), sort: this.sort() }),
  );

  protected readonly skeleton = [1, 2, 3, 4, 5, 6, 7, 8];

  constructor() {
    this.route.paramMap.subscribe((params) => {
      this.slug.set(params.get('slug') ?? 'all');
      this.sort.set('popular');
    });
  }
}
