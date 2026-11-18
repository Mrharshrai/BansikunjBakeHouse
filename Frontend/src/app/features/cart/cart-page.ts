import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { IconComponent } from '../../shared/components/icon/icon';
import { QuantityStepperComponent } from '../../shared/components/quantity-stepper/quantity-stepper';
import { asNumber } from '../../core/utils/format';

@Component({
  selector: 'app-cart-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IconComponent, QuantityStepperComponent],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.scss',
})
export class CartPageComponent {
  protected readonly cart = inject(CartService);
  protected readonly asNumber = asNumber;
  constructor(){ this.cart.load(); }
}
