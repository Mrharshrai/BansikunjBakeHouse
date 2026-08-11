import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { OrderService } from '../../core/services/order.service';
import { ToastService } from '../../core/services/toast.service';
import { CheckoutPayload } from '../../core/models/order.model';
import { IconComponent } from '../../shared/components/icon/icon';

@Component({
  selector: 'app-checkout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, IconComponent],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class CheckoutComponent {
  private readonly fb = inject(FormBuilder);
  protected readonly cart = inject(CartService);
  protected readonly auth = inject(AuthService);
  private readonly orderService = inject(OrderService);
  private readonly toast = inject(ToastService);

  protected readonly submitting = signal(false);
  protected readonly placedOrderId = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
    line1: ['', Validators.required],
    line2: [''],
    city: ['', Validators.required],
    state: ['', Validators.required],
    pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    paymentMethod: ['cod' as 'cod' | 'online', Validators.required],
  });

  constructor() {
    const user = this.auth.user();
    if (user) {
      this.form.patchValue({
        name: user.name,
        email: user.email,
        phone: user.phone ?? '',
      });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const payload: CheckoutPayload = {
      name: value.name,
      email: value.email,
      phone: value.phone,
      address: {
        line1: value.line1,
        line2: value.line2,
        city: value.city,
        state: value.state,
        pincode: value.pincode,
      },
      paymentMethod: value.paymentMethod,
      items: this.cart.toApiItems(),
    };

    this.submitting.set(true);
    this.orderService.placeOrder(payload).subscribe({
      next: (order) => {
        this.placedOrderId.set(order.id);
        this.cart.clear();
        this.submitting.set(false);
        this.toast.show('Order placed successfully!', 'success', 3600);
      },
      error: () => {
        this.submitting.set(false);
        this.toast.show('Something went wrong. Please try again.', 'error');
      },
    });
  }
}
