import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon';

@Component({
  selector: 'app-rating',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="rating" [class.rating--small]="small()">
      @for (star of stars(); track $index) {
        <app-icon [name]="star === 'full' ? 'star' : 'star-outline'" [size]="small() ? 13 : 15" />
      }
      @if (showValue()) {
        <span class="rating__value">{{ value() | number: '1.1-1' }}</span>
      }
      @if (count()) {
        <span class="rating__count">({{ count() }})</span>
      }
    </div>
  `,
  styles: [
    `
      .rating {
        display: inline-flex;
        align-items: center;
        gap: 2px;
        color: var(--color-rating);
      }
      .rating__value {
        margin-left: 5px;
        font-weight: 800;
        font-size: 13px;
        color: var(--color-primary);
      }
      .rating__count {
        margin-left: 3px;
        font-size: 12.5px;
        color: var(--color-muted);
      }
      .rating--small .rating__count {
        font-size: 11.5px;
      }
    `,
  ],
})
export class RatingComponent {
  readonly value = input.required<number>();
  readonly count = input<number>();
  readonly showValue = input<boolean>(true);
  readonly small = input<boolean>(false);

  protected readonly stars = computed<('full' | 'outline')[]>(() =>
    Array.from({ length: 5 }, (_, i) => (i < Math.round(this.value()) ? 'full' : 'outline') as 'full' | 'outline'),
  );
}
