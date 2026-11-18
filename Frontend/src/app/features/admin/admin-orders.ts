import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../core/services/order.service';
import { Order, OrderStatus } from '../../core/models/order.model';
import { IconComponent } from '../../shared/components/icon/icon';
import { LoaderComponent } from '../../shared/components/loader/loader';
import { asNumber } from '../../core/utils/format';
import { ToastService } from '../../core/services/toast.service';

const STATUS_BADGE: Record<OrderStatus, string> = { pending: 'badge--accent', confirmed: 'badge--primary', shipped: 'badge', delivered: 'badge--success', cancelled: 'badge--danger' };

@Component({
  selector: 'app-admin-orders',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IconComponent, LoaderComponent],
  templateUrl: './admin-orders.html',
  styleUrl: './admin-orders.scss',
})
export class AdminOrdersComponent {
  protected readonly orderService = inject(OrderService);
  private readonly toast = inject(ToastService);
  protected readonly orders = this.orderService.orders;
  protected readonly asNumber = asNumber;
  protected readonly statuses: OrderStatus[] = ['pending','confirmed','shipped','delivered','cancelled'];
  constructor() { this.orderService.loadAllOrders(); }
  protected badgeFor(status: OrderStatus): string { return STATUS_BADGE[status]; }
  setStatus(o: Order, status: string){ this.orderService.updateStatus(o.id, status as OrderStatus).subscribe({ next:()=>this.toast.show('Status updated'), error:(e)=>this.toast.show(e?.error?.message||'Update failed','error') }); }
}
