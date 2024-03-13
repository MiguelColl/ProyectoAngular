import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../interfaces/product';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'product-detail',
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {
  @Input() product!: Product;
  #router = inject(Router);

  goBack() {
    this.#router.navigate(['/products']);
  }

  deleteProduct() {
    this.goBack();
  }
}
