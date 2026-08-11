import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../../shared/components/icon/icon';

@Component({
  selector: 'app-gift-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IconComponent],
  templateUrl: './gift-section.html',
  styleUrl: './gift-section.scss',
})
export class GiftSectionComponent {}
