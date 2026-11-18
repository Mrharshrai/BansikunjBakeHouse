import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { OrderService } from '../../core/services/order.service';
import { ToastService } from '../../core/services/toast.service';
import { PaymentService } from '../../core/services/payment.service';
import { IconComponent } from '../../shared/components/icon/icon';
import { asNumber } from '../../core/utils/format';

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
  private readonly orders = inject(OrderService);
  private readonly toast = inject(ToastService);
  private readonly payments = inject(PaymentService);
  private readonly router = inject(Router);
  protected readonly asNumber = asNumber;
  protected readonly submitting = signal(false);
  protected readonly placedOrderId = signal<string | null>(null);
  protected readonly error = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
    line1: ['', Validators.required], line2: [''], city: ['', Validators.required], state: ['', Validators.required], pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    payment_method: ['cod' as 'cod' | 'online', Validators.required],
  });

  constructor() {
    const u:any = this.auth.user();
    if (u) this.form.patchValue({ name: u.full_name || u.name || '', email: u.email || '', phone: u.phone || '' });
    this.cart.load();
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.getRawValue();
    this.submitting.set(true); this.error.set(null);
    this.orders.placeOrder({ name: v.name, email: v.email, phone: v.phone, address: { line1: v.line1, line2: v.line2||null, city: v.city, state: v.state, pincode: v.pincode, country: 'IN' }, payment_method: v.payment_method }).subscribe({
      next: (order) => {
        if (v.payment_method === 'online') { this.handleOnline(order.id); return; }
        this.placedOrderId.set(order.id); this.cart.load(); this.submitting.set(false); this.toast.show('Order placed!');
      },
      error: (e) => { this.submitting.set(false); this.error.set(e?.error?.message || e?.message || 'Checkout failed'); },
    });
  }

  private handleOnline(orderId: string) {
    this.payments.createRazorpay(orderId).subscribe({
      next: (rz: any) => {
        const opts: any = { key: rz.key_id, amount: rz.amount_paise, currency: rz.currency || 'INR', name: 'Bansikunj', order_id: rz.razorpay_order_id, handler: (resp: any) => {
          this.payments.verify(orderId, { razorpay_order_id: resp.razorpay_order_id, razorpay_payment_id: resp.razorpay_payment_id, razorpay_signature: resp.razorpay_signature }).subscribe({
            next: () => { this.placedOrderId.set(orderId); this.cart.load(); this.submitting.set(false); this.toast.show('Payment successful!'); },
            error: (e) => { this.submitting.set(false); this.error.set(e?.error?.message || 'Payment verification failed'); }
          });
        }, modal: { ondismiss: () => { this.submitting.set(false); this.router.navigate(['/orders']); } } };
        const Rzp = (window as any).Razorpay;
        if (Rzp) { new Rzp(opts).open(); } else { this.submitting.set(false); this.error.set('Razorpay checkout unavailable in browser. Order created as pending payment.'); this.router.navigate(['/orders']); }
      },
      error: (e) => { this.submitting.set(false); this.error.set(e?.error?.message || 'Could not start online payment'); }
    });
  }
}
