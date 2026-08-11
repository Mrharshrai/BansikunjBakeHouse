import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../../../core/models/product.model';
import { IconComponent } from '../../../../shared/components/icon/icon';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card';

@Component({
  selector: 'app-product-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IconComponent, ProductCardComponent],
  templateUrl: './product-section.html',
  styleUrl: './product-section.scss',
})
export class ProductSectionComponent {
  readonly eyebrow = input<string>();
  readonly title = input.required<string>();
  readonly subtitle = input<string>();
  readonly link = input<string>();
  readonly linkLabel = input<string>('View all');
  readonly products = input<Product[]>([]);
  readonly loading = input<boolean>(false);
  readonly cream = input<boolean>(false);

  protected readonly skeleton = [1, 2, 3, 4, 5, 6, 7, 8];
}
