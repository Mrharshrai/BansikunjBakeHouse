import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../../../core/models/product.model';
import { IconComponent } from '../../../../shared/components/icon/icon';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card';

@Component({
  selector: 'app-dessert-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IconComponent, ProductCardComponent],
  templateUrl: './dessert-section.html',
  styleUrl: './dessert-section.scss',
})
export class DessertSectionComponent {
  readonly products = input<Product[]>([]);
  readonly loading = input<boolean>(false);

  protected readonly skeleton = [1, 2, 3, 4, 5, 6];
}
