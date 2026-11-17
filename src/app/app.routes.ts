import { Routes } from '@angular/router';

import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'login',
    title: 'Sign in',
    loadComponent: () => import('./login/login').then((m) => m.Login),
  },
  {
    path: 'dashboard',
    title: 'Dashboard',
    canActivate: [authGuard], // <-- this route is now protected
    loadComponent: () =>
      import('./dashboard/dashboard').then((m) => m.Dashboard),
  },
  { path: '**', redirectTo: 'dashboard' },
];
