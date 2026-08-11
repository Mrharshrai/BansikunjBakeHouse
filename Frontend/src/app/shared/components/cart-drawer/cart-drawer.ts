import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { FREE_DELIVERY_THRESHOLD } from '../../../core/models/cart.model';
import { IconComponent } from '../icon/icon';
import { QuantityStepperComponent } from '../quantity-stepper/quantity-stepper';

@Component({
  selector: 'app-cart-drawer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IconComponent, QuantityStepperComponent],
  templateUrl: './cart-drawer.html',
  styleUrl: './cart-drawer.scss',
})
export class CartDrawerComponent {
  protected readonly cart = inject(CartService);

  protected readonly freeDeliveryThreshold = FREE_DELIVERY_THRESHOLD;

  protected readonly remainingForFree = computed(() =>
    Math.max(0, this.freeDeliveryThreshold - this.cart.subtotal()),
  );

  protected readonly freeDeliveryProgress = computed(() =>
    Math.min(100, (this.cart.subtotal() / this.freeDeliveryThreshold) * 100),
  );
}
