import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-loader',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="loader" role="status" aria-live="polite">
      <div class="loader__spinner"></div>
      <p class="loader__text">{{ text() }}</p>
    </div>
  `,
  styles: [
    `
      .loader {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 14px;
        padding: 48px 16px;
        color: var(--color-muted);
      }
      .loader__spinner {
        width: 42px;
        height: 42px;
        border-radius: 50%;
        border: 4px solid var(--color-cream-200);
        border-top-color: var(--color-accent);
        animation: spin 0.8s linear infinite;
      }
      .loader__text {
        font-weight: 700;
        font-size: 14px;
        letter-spacing: 0.3px;
      }
    `,
  ],
})
export class LoaderComponent {
  readonly text = input<string>('Loading…');
}
