import { Routes } from '@angular/router';

import { Landing } from './landing/landing';
import { Ourstory } from './ourstory/ourstory';
import { dateMatchGuard } from './guards/date-match.guard';
import { Wish2026 } from './wish2026/wish2026';
import { WishShell } from './wish-shell/wish-shell';

export const routes: Routes = [
  {
    path: '',
    component: Landing
  },
  {
    path: 'wish-2026',
    component: Wish2026,
    canActivate: [dateMatchGuard]
  },
  {
    path: 'ourstory',
    component: Ourstory,
    canActivate: [dateMatchGuard]
  },
    {
    path: 'wish-shell',
    component: WishShell,
    canActivate: [dateMatchGuard]
  },
];