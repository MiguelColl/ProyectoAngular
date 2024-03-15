import { Routes } from '@angular/router';
import { leavePageGuard } from '../guards/leave-page.guard';
import { numericIdGuard } from '../guards/numeric-id.guard';
import { productResolver } from './resolvers/product.resolver';

export const productsRoutes: Routes = [
  {
    path: '',
    title: 'Home | Sanvipop',
    loadComponent: () =>
      import('./products-page/products-page.component').then(
        (m) => m.ProductsPageComponent
      ),
  },
  {
    path: 'add',
    title: 'Subir producto | Sanvipop',
    canDeactivate: [leavePageGuard],
    loadComponent: () =>
      import('./product-form/product-form.component').then(
        (m) => m.ProductFormComponent
      ),
  },
  {
    path: ':id',
    title: 'Detalle de producto | Sanvipop',
    canActivate: [numericIdGuard],
    resolve: {
      product: productResolver,
    },
    loadComponent: () =>
      import('./product-detail/product-detail.component').then(
        (m) => m.ProductDetailComponent
      ),
  },
];
