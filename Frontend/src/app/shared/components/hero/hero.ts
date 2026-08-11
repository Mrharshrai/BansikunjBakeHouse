import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../icon/icon';

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IconComponent],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class HeroComponent {
  readonly title = input('Freshly Baked Cookies, Delivered Warm');
  readonly subtitle = input(
    'Soft & chewy cookies baked with real butter, Belgian chocolate and roasted nuts — the perfect bite, every single day.',
  );
  readonly image = input('assets/images/hero/hero.jpg');
  readonly imageAlt = input('Assorted Bansikunj cookies in a jar');
}
