import { ResolveFn, Router } from '@angular/router';
import { Product } from '../interfaces/product';
import { inject } from '@angular/core';
import { PostsService } from '../services/posts.service';
import { EMPTY, catchError } from 'rxjs';

export const productResolver: ResolveFn<Product> = (route) => {
  const router = inject(Router);
  return inject(PostsService)
    .getProduct(+route.paramMap.get('id')!)
    .pipe(
      catchError(() => {
        router.navigate(['/products']);
        return EMPTY;
      })
    );
};
