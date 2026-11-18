import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { Product } from '../../../core/models/product.model';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { ProductService } from '../../../core/services/product.service';
import { ThemeService } from '../../../core/services/theme.service';
import { ToastService } from '../../../core/services/toast.service';
import { IconComponent } from '../icon/icon';
import { NavbarComponent } from '../navbar/navbar';
import { displayName, asNumber } from '../../../core/utils/format';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ReactiveFormsModule, IconComponent, NavbarComponent],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent {
  protected readonly cart = inject(CartService);
  protected readonly auth = inject(AuthService);
  protected readonly productService = inject(ProductService);
  protected readonly theme = inject(ThemeService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  protected readonly displayName = displayName;
  protected readonly asNumber = asNumber;
  protected readonly mobileOpen = signal(false);
  protected readonly searchOpen = signal(false);
  protected readonly searchControl = new FormControl('');
  protected readonly suggestions = signal<Product[]>([]);
  protected readonly showSuggestions = signal(false);

  constructor() {
    if (this.auth.isAuthenticated()) this.cart.load();
    this.searchControl.valueChanges.pipe(debounceTime(250), distinctUntilChanged(), map(v => (v ?? '').trim())).subscribe(q => {
      this.suggestions.set(q.length >= 2 ? this.productService.queryProducts({ q, limit: 5 }) : []);
      this.showSuggestions.set(true);
    });
  }

  submitSearch(): void {
    const q = (this.searchControl.value ?? '').trim();
    this.showSuggestions.set(false); this.searchOpen.set(false);
    this.router.navigate(['/products'], { queryParams: q ? { q } : {} });
  }
  goToSuggestion(p: Product): void { this.showSuggestions.set(false); this.searchControl.setValue(''); this.router.navigate(['/products', p.slug || p.id]); }
  hideSuggestionsSoon(): void { setTimeout(() => this.showSuggestions.set(false), 160); }
  logout(): void { this.auth.logout(); this.toast.show('Signed out', 'info'); this.router.navigate(['/']); }
}
