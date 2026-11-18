import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import { Order, OrderStatus } from '../../core/models/order.model';
import { IconComponent } from '../../shared/components/icon/icon';
import { LoaderComponent } from '../../shared/components/loader/loader';
import { asNumber } from '../../core/utils/format';
import { ToastService } from '../../core/services/toast.service';

const STATUS_BADGE: Record<OrderStatus, string> = { pending: 'badge--accent', confirmed: 'badge--primary', shipped: 'badge', delivered: 'badge--success', cancelled: 'badge--danger' };

@Component({
  selector: 'app-order-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, IconComponent, LoaderComponent],
  templateUrl: './order-list.html',
  styleUrl: './order-list.scss',
})
export class OrderListComponent {
  protected readonly orderService = inject(OrderService);
  private readonly toast = inject(ToastService);
  protected readonly orders = this.orderService.orders;
  protected readonly asNumber = asNumber;
  constructor() { this.orderService.loadOrders(); }
  protected badgeFor(status: OrderStatus): string { return STATUS_BADGE[status]; }
  cancel(o: Order){ if(!o.is_cancellable) return; if(!confirm('Cancel this order?')) return; this.orderService.cancelOrder(o.id).subscribe({ next:()=>this.toast.show('Order cancelled','info'), error:(e)=>this.toast.show(e?.error?.message||'Could not cancel','error')}); }
}
