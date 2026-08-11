import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { ToastService } from '../../core/services/toast.service';
import { IconComponent } from '../../shared/components/icon/icon';
import { RatingComponent } from '../../shared/components/rating/rating';
import { QuantityStepperComponent } from '../../shared/components/quantity-stepper/quantity-stepper';
import { ProductCardComponent } from '../../shared/components/product-card/product-card';

@Component({
  selector: 'app-product-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IconComponent, RatingComponent, QuantityStepperComponent, ProductCardComponent],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly productService = inject(ProductService);
  private readonly cart = inject(CartService);
  private readonly wishlist = inject(WishlistService);
  private readonly toast = inject(ToastService);

  protected readonly id = signal<string>('');
  protected readonly quantity = signal(1);

  protected readonly product = computed(() => this.productService.getById(this.id()));
  protected readonly discountPercent = computed(() => {
    const product = this.product();
    return product?.mrp && product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;
  });
  protected readonly wishlisted = computed(() => this.wishlist.isWishlisted(this.id()));
  protected readonly related = computed(() =>
    this.productService
      .byCategory(this.product()?.category ?? 'all')
      .filter((p) => p.id !== this.id())
      .slice(0, 4),
  );

  constructor() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id') ?? '';
      this.id.set(id);
      this.quantity.set(1);
    });
  }

  addToCart(): void {
    const product = this.product();
    if (!product) {
      return;
    }
    this.cart.add(product, this.quantity());
    this.toast.show(`${product.name} added to cart`);
    this.cart.openDrawer();
  }

  toggleWishlist(): void {
    this.wishlist.toggle(this.id());
    this.toast.show(
      this.wishlist.isWishlisted(this.id()) ? 'Added to wishlist' : 'Removed from wishlist',
      'info',
    );
  }
}
