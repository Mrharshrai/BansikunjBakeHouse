import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IconComponent } from '../icon/icon';

@Component({
  selector: 'app-quantity-stepper',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  template: `
    <div class="stepper" [class.stepper--small]="small()">
      <button type="button" class="stepper__btn" (click)="decrement()" [disabled]="value() <= min() || disabled()" aria-label="Decrease quantity">
        <app-icon name="minus" [size]="small() ? 13 : 16" />
      </button>
      <span class="stepper__value">{{ value() }}</span>
      <button type="button" class="stepper__btn" (click)="increment()" [disabled]="value() >= max() || disabled()" aria-label="Increase quantity">
        <app-icon name="plus" [size]="small() ? 13 : 16" />
      </button>
    </div>
  `,
  styles: [
    `
      .stepper {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        background: var(--color-cream-200);
        border: 2px solid var(--color-border);
        border-radius: var(--radius-full);
        padding: 4px;
      }
      .stepper__btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: var(--color-white);
        color: var(--color-primary);
        box-shadow: var(--shadow-xs);
        transition: all 0.2s var(--ease);

        &:hover:not(:disabled) {
          background: var(--color-primary);
          color: var(--color-white);
        }
        &:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
      }
      .stepper__value {
        min-width: 28px;
        text-align: center;
        font-weight: 800;
        font-size: 15px;
        color: var(--color-primary);
      }
      .stepper--small {
        padding: 3px;
        gap: 2px;

        .stepper__btn {
          width: 24px;
          height: 24px;
        }
        .stepper__value {
          min-width: 22px;
          font-size: 13.5px;
        }
      }
    `,
  ],
})
export class QuantityStepperComponent {
  readonly value = input.required<number>();
  readonly min = input<number>(1);
  readonly max = input<number>(99);
  readonly small = input<boolean>(false);
  readonly disabled = input<boolean>(false);

  readonly valueChange = output<number>();

  decrement(): void {
    if (this.value() > this.min()) {
      this.valueChange.emit(this.value() - 1);
    }
  }

  increment(): void {
    if (this.value() < this.max()) {
      this.valueChange.emit(this.value() + 1);
    }
  }
}
