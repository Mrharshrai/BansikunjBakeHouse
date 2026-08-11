import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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

const STATUS_ORDER: OrderStatus[] = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

@Component({
  selector: 'app-admin-orders',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IconComponent, LoaderComponent],
  templateUrl: './admin-orders.html',
  styleUrl: './admin-orders.scss',
})
export class AdminOrdersComponent {
  protected readonly orderService = inject(OrderService);

  protected readonly orders = this.orderService.orders;
  protected readonly statuses = STATUS_ORDER;

  constructor() {
    this.orderService.loadOrders();
  }

  protected badgeFor(status: OrderStatus): string {
    return STATUS_BADGE[status];
  }
}
