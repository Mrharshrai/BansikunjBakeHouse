import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { IconComponent } from '../../../../shared/components/icon/icon';

@Component({
  selector: 'app-newsletter-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, IconComponent],
  templateUrl: './newsletter-section.html',
  styleUrl: './newsletter-section.scss',
})
export class NewsletterSectionComponent {
  protected readonly email = new FormControl('', [Validators.required, Validators.email]);
  protected readonly subscribed = signal(false);
  protected readonly submitting = signal(false);

  subscribe(): void {
    if (this.email.invalid) {
      this.email.markAsTouched();
      return;
    }
    this.submitting.set(true);
    setTimeout(() => {
      this.subscribed.set(true);
      this.submitting.set(false);
    }, 700);
  }
}
