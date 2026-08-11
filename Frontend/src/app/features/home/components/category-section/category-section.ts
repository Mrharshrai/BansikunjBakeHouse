import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../../core/services/product.service';
import { IconComponent } from '../../../../shared/components/icon/icon';

@Component({
  selector: 'app-category-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IconComponent],
  templateUrl: './category-section.html',
  styleUrl: './category-section.scss',
})
export class CategorySectionComponent {
  protected readonly productService = inject(ProductService);

  protected countFor(slug: string): number {
    return this.productService.byCategory(slug).length;
  }
}
