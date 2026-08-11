import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import { OrderStatus } from '../../core/models/order.model';
import { IconComponent } from '../../shared/components/icon/icon';
import { LoaderComponent } from '../../shared/components/loader/loader';

const STATUS_BADGE: Record<OrderStatus, string> = {
  pending: 'badge--accent',
  confirmed: 'badge--primary',
  shipped: 'badge',
  delivered: 'badge--success',
  cancelled: 'badge--danger',
};

@Component({
  selector: 'app-order-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, IconComponent, LoaderComponent],
  templateUrl: './order-list.html',
  styleUrl: './order-list.scss',
})
export class OrderListComponent {
  protected readonly orderService = inject(OrderService);

  protected readonly orders = this.orderService.orders;

  constructor() {
    this.orderService.loadOrders();
  }

  protected badgeFor(status: OrderStatus): string {
    return STATUS_BADGE[status];
  }
}
