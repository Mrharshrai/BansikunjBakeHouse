import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { CartService } from '../../../core/services/cart.service';
import { ToastService } from '../../../core/services/toast.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { IconComponent } from '../icon/icon';
import { QuantityStepperComponent } from '../quantity-stepper/quantity-stepper';
import { RatingComponent } from '../rating/rating';

@Component({
  selector: 'app-product-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IconComponent, RatingComponent, QuantityStepperComponent],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCardComponent {
  readonly product = input.required<Product>();

  private readonly cart = inject(CartService);
  private readonly wishlist = inject(WishlistService);
  private readonly toast = inject(ToastService);

  protected readonly cartItem = computed(() =>
    this.cart.items().find((item) => item.product.id === this.product().id),
  );

  protected readonly quantity = computed(() => this.cartItem()?.quantity ?? 1);
  protected readonly wishlisted = computed(() => this.wishlist.isWishlisted(this.product().id));
  protected readonly discountPercent = computed(() => {
    const { mrp, price } = this.product();
    return mrp && mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
  });

  addToCart(): void {
    this.cart.add(this.product(), this.quantity());
    this.toast.show(`${this.product().name} added to cart`);
    this.cart.openDrawer();
  }

  changeQuantity(quantity: number): void {
    this.cart.setQuantity(this.product().id, quantity);
  }

  toggleWishlist(): void {
    this.wishlist.toggle(this.product().id);
    this.toast.show(
      this.wishlist.isWishlisted(this.product().id) ? 'Added to wishlist' : 'Removed from wishlist',
      'info',
    );
  }
}
