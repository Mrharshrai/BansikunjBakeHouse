import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { IconComponent } from '../icon/icon';
import { QuantityStepperComponent } from '../quantity-stepper/quantity-stepper';
import { asNumber } from '../../../core/utils/format';

@Component({
  selector: 'app-cart-drawer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IconComponent, QuantityStepperComponent],
  templateUrl: './cart-drawer.html',
  styleUrl: './cart-drawer.scss',
})
export class CartDrawerComponent {
  protected readonly cart = inject(CartService);
  protected readonly asNumber = asNumber;
}
