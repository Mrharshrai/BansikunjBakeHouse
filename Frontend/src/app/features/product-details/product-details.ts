import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { ToastService } from '../../core/services/toast.service';
import { IconComponent } from '../../shared/components/icon/icon';
import { RatingComponent } from '../../shared/components/rating/rating';
import { QuantityStepperComponent } from '../../shared/components/quantity-stepper/quantity-stepper';
import { ProductCardComponent } from '../../shared/components/product-card/product-card';
import { Product } from '../../core/models/product.model';
import { asNumber } from '../../core/utils/format';

@Component({
  selector: 'app-product-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IconComponent, RatingComponent, QuantityStepperComponent, ProductCardComponent],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly productService = inject(ProductService);
  private readonly cart = inject(CartService);
  private readonly wishlist = inject(WishlistService);
  private readonly toast = inject(ToastService);
  protected readonly asNumber = asNumber;
  protected readonly quantity = signal(1);
  protected readonly loading = signal(true);
  protected readonly product = signal<Product | null>(null);

  protected readonly discountPercent = computed(() => { const p = this.product(); if (!p) return 0; const mrp=asNumber(p.mrp), price=asNumber(p.price); return mrp>price?Math.round(((mrp-price)/mrp)*100):0; });
  protected readonly wishlisted = computed(() => this.product() ? this.wishlist.isWishlisted(this.product()!.id) : false);
  protected readonly related = computed(() => { const p=this.product(); if(!p) return []; return this.productService.byCategory(p.category||p.category_slug||'all').filter(x=>x.id!==p.id).slice(0,4); });

  constructor() {
    this.route.paramMap.subscribe(pm => {
      const ref = pm.get('id') || ''; this.loading.set(true); this.quantity.set(1);
      this.productService.getProduct(ref).subscribe({ next: (p)=>{ this.product.set(p); this.loading.set(false); }, error: ()=>{ this.product.set(this.productService.getById(ref)||null); this.loading.set(false);} });
    });
  }

  addToCart(): void { const p=this.product(); if(!p) return; this.cart.add(p.id,this.quantity()); this.toast.show(`${p.name} added to cart`); this.cart.openDrawer(); }
  toggleWishlist(): void { const p=this.product(); if(!p) return; this.wishlist.toggle(p.id); this.toast.show(this.wishlist.isWishlisted(p.id)?'Added to wishlist':'Removed from wishlist','info'); }
}
