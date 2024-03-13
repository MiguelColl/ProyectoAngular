import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../interfaces/product';

@Pipe({
  name: 'productFilter',
  standalone: true,
})
export class ProductFilterPipe implements PipeTransform {
  transform(products: Product[], search?: string): Product[] {
    const searchLower = search?.toLocaleLowerCase();
    return searchLower
      ? products.filter(
          (p) =>
            p.title.toLocaleLowerCase().includes(searchLower) ||
            p.description.toLocaleLowerCase().includes(searchLower)
        )
      : products;
  }
}
