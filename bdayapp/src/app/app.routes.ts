import { Routes } from '@angular/router';

import { Landing } from './landing/landing';
import { Wish } from './wish/wish';
import { Ourstory } from './ourstory/ourstory';
import { dateMatchGuard } from './guards/date-match.guard';

export const routes: Routes = [
  {
    path: '',
    component: Landing
  },
  {
    path: 'wish',
    component: Wish,
    canActivate: [dateMatchGuard]
  },
  {
    path: 'ourstory',
    component: Ourstory,
    canActivate: [dateMatchGuard]
  }
];