import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { IconComponent } from '../icon/icon';

interface NavChild {
  label: string;
  route: string;
  query?: Record<string, string>;
}

interface NavItem {
  label: string;
  route?: string;
  query?: Record<string, string>;
  children?: NavChild[];
  highlight?: boolean;
  cta?: boolean;
}

@Component({
  selector: 'app-navbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IconComponent],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class NavbarComponent {
  readonly open = input(false);
  readonly openChange = output<boolean>();

  private readonly router = inject(Router);

  protected readonly activeDropdown = signal<string | null>(null);
  protected readonly currentUrl = signal(this.router.url);

  protected readonly items: NavItem[] = [
    { label: 'Home', route: '/' },
    {
      label: 'Buy Cookies',
      route: '/products',
      children: [
        { label: 'All Cookies', route: '/products' },
        { label: 'Soft & Chewy', route: '/category/soft-chewy' },
        { label: 'Premium Cookies', route: '/category/premium' },
        { label: 'Bestsellers', route: '/category/bestsellers' },
        { label: 'Chocolate Chip', route: '/products', query: { tag: 'chocolate' } },
        { label: 'Dark Chocolate', route: '/products', query: { tag: 'dark' } },
      ],
    },
    {
      label: 'Desserts',
      route: '/category/desserts',
      children: [
        { label: 'All Desserts', route: '/category/desserts' },
        { label: 'Lava Cakes', route: '/products', query: { tag: 'lava' } },
        { label: 'Brownies', route: '/products', query: { tag: 'brownie' } },
        { label: 'Macarons', route: '/products', query: { tag: 'macaron' } },
        { label: 'Tiramisu', route: '/products', query: { tag: 'tiramisu' } },
      ],
    },
    {
      label: 'Gifting',
      route: '/category/gifts',
      children: [
        { label: 'Gift Boxes', route: '/category/gifts' },
        { label: 'Cookie Tubs', route: '/category/tubs' },
        { label: 'Make Your Own', route: '/category/tubs', query: { tag: 'custom' } },
        { label: 'Festive Bulk Gifting', route: '/products', query: { tag: 'festive' } },
      ],
    },
    { label: 'Make Your Own Tub', route: '/category/tubs', query: { tag: 'custom' }, highlight: true },
    {
      label: 'Partner with us',
      children: [
        { label: 'Corporate Gifting', route: '/products', query: { tag: 'gift' } },
        { label: 'Bulk Orders', route: '/products', query: { tag: 'festive' } },
        { label: 'Festive Bulk Gifting', route: '/products', query: { tag: 'festive' } },
      ],
    },
    { label: 'Festive Bulk Gifting', route: '/products', query: { tag: 'festive' }, cta: true },
  ];

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => this.currentUrl.set(this.router.url));
  }

  isActive(item: NavItem): boolean {
    if (!item.route) {
      return false;
    }
    if (item.route === '/') {
      return this.currentUrl() === '/';
    }
    return this.currentUrl().startsWith(item.route);
  }

  openDropdown(label: string): void {
    this.activeDropdown.set(label);
  }

  toggleDropdown(label: string): void {
    this.activeDropdown.update((current) => (current === label ? null : label));
  }

  close(): void {
    this.activeDropdown.set(null);
    this.openChange.emit(false);
  }
}
