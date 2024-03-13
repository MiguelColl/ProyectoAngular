import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: 'products',
    loadChildren: () =>
      import('./products/products.routes').then((m) => m.productsRoutes),
  },
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/auth/login' },
];
