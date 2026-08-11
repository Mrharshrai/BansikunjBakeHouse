import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

/** Tiny global toast notifications used for cart/wishlist feedback. */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly toastsSignal = signal<Toast[]>([]);
  private counter = 0;

  readonly toasts = this.toastsSignal.asReadonly();

  show(message: string, type: ToastType = 'success', duration = 2600): void {
    const id = ++this.counter;
    this.toastsSignal.update((toasts) => [...toasts, { id, type, message }]);
    setTimeout(() => this.dismiss(id), duration);
  }

  dismiss(id: number): void {
    this.toastsSignal.update((toasts) => toasts.filter((t) => t.id !== id));
  }
}
