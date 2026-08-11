import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { FREE_DELIVERY_THRESHOLD } from '../../core/models/cart.model';
import { IconComponent } from '../../shared/components/icon/icon';
import { QuantityStepperComponent } from '../../shared/components/quantity-stepper/quantity-stepper';

@Component({
  selector: 'app-cart-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IconComponent, QuantityStepperComponent],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.scss',
})
export class CartPageComponent {
  protected readonly cart = inject(CartService);

  protected readonly threshold = FREE_DELIVERY_THRESHOLD;

  protected readonly freeDeliveryProgress = computed(() => {
    const subtotal = this.cart.subtotal();
    return Math.min(100, (subtotal / this.threshold) * 100);
  });

  protected readonly amountToFreeDelivery = computed(() => Math.max(0, this.threshold - this.cart.subtotal()));

  setQuantity(productId: string, quantity: number): void {
    this.cart.setQuantity(productId, quantity);
  }

  remove(productId: string): void {
    this.cart.remove(productId);
  }
}
