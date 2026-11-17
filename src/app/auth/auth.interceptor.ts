import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { AuthService } from './auth.service';

/*
  Runs for EVERY HttpClient request the app makes.
  If we hold a token and the call targets our API, attach the token.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).getAccessToken();

  if (!token || !req.url.includes('/api')) {
    return next(req); // pass the request through, untouched
  }

  // HttpRequest is immutable, so we clone with the extra header.
  const authenticatedRequest = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });

  return next(authenticatedRequest);
};
