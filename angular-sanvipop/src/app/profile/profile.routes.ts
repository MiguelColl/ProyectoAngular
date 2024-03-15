import { Routes } from '@angular/router';
import { numericIdGuard } from '../guards/numeric-id.guard';
import { profileResolver } from './resolvers/profile.resolver';

export const profileRoutes: Routes = [
  {
    path: '',
    title: 'Mi perfil | Sanvipop',
    resolve: {
      user: profileResolver,
    },
    loadComponent: () =>
      import('./profile-page/profile-page.component').then(
        (m) => m.ProfilePageComponent
      ),
  },
  {
    path: ':id',
    title: 'Perfil | Sanvipop',
    canActivate: [numericIdGuard],
    resolve: {
      user: profileResolver,
    },
    loadComponent: () =>
      import('./profile-page/profile-page.component').then(
        (m) => m.ProfilePageComponent
      ),
  },
];
