import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../../shared/components/icon/icon';

@Component({
  selector: 'app-make-own-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IconComponent],
  templateUrl: './make-own-section.html',
  styleUrl: './make-own-section.scss',
})
export class MakeOwnSectionComponent {}
