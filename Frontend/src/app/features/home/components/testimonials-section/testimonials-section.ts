import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MOCK_TESTIMONIALS } from '../../../../core/mock/data.mock';
import { RatingComponent } from '../../../../shared/components/rating/rating';
import { IconComponent } from '../../../../shared/components/icon/icon';

@Component({
  selector: 'app-testimonials-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RatingComponent, IconComponent],
  templateUrl: './testimonials-section.html',
  styleUrl: './testimonials-section.scss',
})
export class TestimonialsSectionComponent {
  protected readonly testimonials = MOCK_TESTIMONIALS;
}
