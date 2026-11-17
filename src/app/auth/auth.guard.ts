import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from './auth.service';

/**
 * Decides whether a route may activate.
 * Returns true to allow, or a UrlTree to redirect instead.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) {
    return true;
  }

  // Not signed in: redirect to /login and remember where we wanted to go.
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url },
  });
};
