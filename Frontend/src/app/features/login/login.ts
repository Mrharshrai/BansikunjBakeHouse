import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { IconComponent } from '../../shared/components/icon/icon';

@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, IconComponent],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  protected readonly error = signal<string | null>(null);
  protected readonly loading = signal(false);
  protected readonly showPassword = signal(false);
  protected readonly form = this.fb.nonNullable.group({ email: ['', [Validators.required, Validators.email]], password: ['', [Validators.required, Validators.minLength(6)]] });

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.error.set(null); this.loading.set(true);
    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => { this.loading.set(false); this.toast.show('Welcome back!'); this.router.navigateByUrl('/account'); },
      error: (e) => { this.loading.set(false); this.error.set(e?.error?.message || e?.message || 'Login failed'); },
    });
  }
}
