import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { IconComponent } from '../../shared/components/icon/icon';

@Component({
  selector: 'app-register',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, IconComponent],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  protected readonly error = signal<string | null>(null);
  protected readonly loading = signal(false);
  protected readonly showPassword = signal(false);
  protected readonly form = this.fb.nonNullable.group({ full_name: ['', [Validators.required, Validators.minLength(2)]], email: ['', [Validators.required, Validators.email]], phone: [''], password: ['', [Validators.required, Validators.minLength(8)]] });

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.error.set(null); this.loading.set(true);
    const v = this.form.getRawValue();
    this.auth.register({ full_name: v.full_name, email: v.email, password: v.password, phone: v.phone || null }).subscribe({
      next: () => { this.loading.set(false); this.toast.show('Account created!'); this.router.navigateByUrl('/account'); },
      error: (e) => { this.loading.set(false); this.error.set(e?.error?.message || e?.message || 'Registration failed'); },
    });
  }
}
