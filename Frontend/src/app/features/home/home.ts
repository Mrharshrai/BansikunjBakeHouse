import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ProductService } from '../../core/services/product.service';
import { HeroComponent } from '../../shared/components/hero/hero';
import { CategorySectionComponent } from './components/category-section/category-section';
import { ProductSectionComponent } from './components/product-section/product-section';
import { DessertSectionComponent } from './components/dessert-section/dessert-section';
import { GiftSectionComponent } from './components/gift-section/gift-section';
import { MakeOwnSectionComponent } from './components/make-own-section/make-own-section';
import { TestimonialsSectionComponent } from './components/testimonials-section/testimonials-section';
import { NewsletterSectionComponent } from './components/newsletter-section/newsletter-section';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HeroComponent,
    CategorySectionComponent,
    ProductSectionComponent,
    DessertSectionComponent,
    GiftSectionComponent,
    MakeOwnSectionComponent,
    TestimonialsSectionComponent,
    NewsletterSectionComponent,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent {
  protected readonly productService = inject(ProductService);

  protected readonly bestsellers = computed(() => this.productService.bestSellers().slice(0, 8));
  protected readonly softChewy = computed(() => this.productService.byCategory('soft-chewy').slice(0, 8));
  protected readonly premium = computed(() => this.productService.byCategory('premium').slice(0, 8));
  protected readonly desserts = computed(() => this.productService.byCategory('desserts').slice(0, 6));
}
