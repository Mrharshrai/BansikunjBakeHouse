import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { OrderService } from '../../core/services/order.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { ToastService } from '../../core/services/toast.service';
import { IconComponent } from '../../shared/components/icon/icon';

@Component({
  selector: 'app-account',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, IconComponent],
  templateUrl: './account.html',
  styleUrl: './account.scss',
})
export class AccountComponent {
  protected readonly auth = inject(AuthService);
  protected readonly orderService = inject(OrderService);
  protected readonly wishlist = inject(WishlistService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  logout(): void {
    this.auth.logout();
    this.toast.show('You have been logged out.', 'info');
    this.router.navigateByUrl('/');
  }
}
