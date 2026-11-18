import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon';

@Component({
  selector: 'app-admin-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, IconComponent],
  template: `
  <section class="admin section"><div class="container">
    <div class="section-head section-head--left"><p class="eyebrow">Bansikunj Admin</p><h1 class="section-head__title">Store dashboard</h1></div>
    <nav class="admin__tabs" style="flex-wrap:wrap">
      <a class="admin__tab" routerLink="products" routerLinkActive="admin__tab--active"><app-icon name="bag" [size]="18" /> Products</a>
      <a class="admin__tab" routerLink="orders" routerLinkActive="admin__tab--active"><app-icon name="box" [size]="18" /> Orders</a>
      <a class="admin__tab" routerLink="categories" routerLinkActive="admin__tab--active"><app-icon name="tag" [size]="18" /> Categories</a>
      <a class="admin__tab" routerLink="inventory" routerLinkActive="admin__tab--active"><app-icon name="box" [size]="18" /> Inventory</a>
      <a class="admin__tab" routerLink="banners" routerLinkActive="admin__tab--active"><app-icon name="star" [size]="18" /> Banners</a>
    </nav>
    <div class="admin__content fade-in"><router-outlet /></div>
  </div></section>
  `,
  styleUrl: './admin-layout.scss',
})
export class AdminLayoutComponent {}
