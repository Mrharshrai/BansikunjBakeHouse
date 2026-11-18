import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { OrderService } from '../../core/services/order.service';
import { ToastService } from '../../core/services/toast.service';
import { IconComponent } from '../../shared/components/icon/icon';
import { displayName, asNumber } from '../../core/utils/format';

@Component({
  selector: 'app-account',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, IconComponent],
  templateUrl: './account.html',
  styleUrl: './account.scss',
})
export class AccountComponent {
  protected readonly auth = inject(AuthService);
  protected readonly orderService = inject(OrderService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);
  protected readonly displayName = displayName;
  protected readonly asNumber = asNumber;
  protected readonly saving = signal(false);
  protected readonly profileForm = this.fb.nonNullable.group({ full_name: [''], phone: [''] });

  constructor() {
    this.orderService.loadOrders();
    this.auth.me().subscribe({ next: (u)=> this.profileForm.patchValue({ full_name: u.full_name||'', phone: u.phone||'' }) });
  }

  saveProfile(){ this.saving.set(true); this.auth.updateProfile(this.profileForm.getRawValue()).subscribe({ next:()=>{this.saving.set(false); this.toast.show('Profile updated');}, error:(e)=>{this.saving.set(false); this.toast.show(e?.error?.message||'Update failed','error');} }); }
  logout(): void { this.auth.logout(); this.toast.show('Logged out', 'info'); this.router.navigateByUrl('/'); }
}
