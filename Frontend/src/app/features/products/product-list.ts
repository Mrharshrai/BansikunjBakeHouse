import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { IconComponent } from '../../shared/components/icon/icon';
import { ProductCardComponent } from '../../shared/components/product-card/product-card';
import { SortOption } from '../../core/models/product.model';

@Component({
  selector: 'app-product-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, FormsModule, IconComponent, ProductCardComponent],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductListComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly productService = inject(ProductService);
  private readonly slug = signal('all');
  protected readonly q = signal('');
  protected readonly sort = signal<SortOption>('popular');
  protected readonly page = signal(1);
  protected readonly skeleton = [1,2,3,4,5,6,7,8];
  protected readonly sortOptions: { value: SortOption; label: string }[] = [
    { value: 'popular', label: 'Popular' }, { value: 'rating', label: 'Top Rated' }, { value: 'price-asc', label: 'Price: Low to High' }, { value: 'price-desc', label: 'Price: High to Low' }, { value: 'newest', label: 'Newest' }
  ];
  protected readonly categoryName = computed(() => { const s=this.slug(); if(!s||s==='all') return 'All Products'; return this.productService.categoryBySlug(s)?.name ?? s; });
  protected readonly categoryDescription = computed(() => { const s=this.slug(); if(!s||s==='all') return 'Browse our full catalogue.'; return this.productService.categoryBySlug(s)?.description ?? ''; });
  protected readonly pageInfo = computed(() => this.productService.page());

  constructor() {
    this.route.paramMap.subscribe(pm => { this.slug.set(pm.get('slug') ?? 'all'); this.page.set(1); this.load(); });
    this.route.queryParamMap.subscribe(qm => { this.q.set(qm.get('q') || ''); this.load(); });
  }
  load(): void { const s=this.slug(); this.productService.fetchProducts({ q: this.q()||undefined, category: s && s!=='all' && s!=='bestsellers'? s: undefined, is_best_seller: s==='bestsellers'? true: undefined, sort: this.sort(), page: this.page(), limit: 20 }); }
  setSort(v: SortOption){ this.sort.set(v); this.page.set(1); this.load(); }
  search(){ this.router.navigate([], { relativeTo: this.route, queryParams: { q: this.q() || null }, queryParamsHandling: 'merge' }); }
  next(){ const p=this.pageInfo(); if(p && this.page()<p.pages){ this.page.update(v=>v+1); this.load(); } }
  prev(){ if(this.page()>1){ this.page.update(v=>v-1); this.load(); } }
}
