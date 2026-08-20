import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { DateAccessService } from '../services/date-access.service';

export const dateMatchGuard: CanActivateFn = () => {
  const dateAccessService = inject(DateAccessService);
  const router = inject(Router);

  if (dateAccessService.isDateMatched()) {
    return true;
  }

  return router.createUrlTree(['/']);
};