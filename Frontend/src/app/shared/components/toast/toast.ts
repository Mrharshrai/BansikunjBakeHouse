import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IconName } from '../icon/icon';
import { IconComponent } from '../icon/icon';
import { ToastService, ToastType } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  template: `
    <div class="toast-region">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast" [class]="'toast--' + toast.type">
          <app-icon [name]="iconFor(toast.type)" [size]="18" />
          <span class="toast__message">{{ toast.message }}</span>
          <button class="toast__close" (click)="toastService.dismiss(toast.id)" aria-label="Dismiss">
            <app-icon name="close" [size]="15" />
          </button>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .toast-region {
        position: fixed;
        z-index: 200;
        bottom: 22px;
        right: 22px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-width: min(360px, calc(100vw - 32px));
      }
      .toast {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 13px 14px;
        border-radius: var(--radius-md);
        background: var(--color-white);
        color: var(--color-text);
        box-shadow: var(--shadow-md);
        border: 2px solid var(--color-border);
        animation: toastIn 0.3s var(--ease);
        font-weight: 700;
        font-size: 14px;
      }
      .toast--success {
        border-color: #cde9d2;

        .icon {
          color: var(--color-success);
        }
      }
      .toast--error {
        border-color: #f3c3c3;

        .icon {
          color: var(--color-danger);
        }
      }
      .toast--info {
        border-color: #f0d9a8;

        .icon {
          color: var(--color-accent-600);
        }
      }
      .toast__message {
        flex: 1;
      }
      .toast__close {
        display: inline-flex;
        color: var(--color-muted);
        padding: 2px;

        &:hover {
          color: var(--color-text);
        }
      }

      @keyframes toastIn {
        from {
          opacity: 0;
          transform: translateX(24px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
    `,
  ],
})
export class ToastComponent {
  readonly toastService = inject(ToastService);

  iconFor(type: ToastType): IconName {
    switch (type) {
      case 'error':
        return 'alert';
      case 'info':
        return 'info';
      default:
        return 'check-circle';
    }
  }
}
