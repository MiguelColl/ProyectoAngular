import { Component, OnInit, inject } from '@angular/core';
import { Product } from '../interfaces/product';
import { ProductFormComponent } from '../product-form/product-form.component';
import { ProductCardComponent } from '../product-card/product-card.component';
import { ProductFilterPipe } from '../pipes/product-filter.pipe';
import { FormsModule } from '@angular/forms';
import { PostsService } from '../services/posts.service';

@Component({
  selector: 'products-page',
  standalone: true,
  imports: [
    FormsModule,
    ProductFormComponent,
    ProductCardComponent,
    ProductFilterPipe,
  ],
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.css',
})
export class ProductsPageComponent implements OnInit {
  #postsService = inject(PostsService);
  products: Product[] = [];
  search = '';

  ngOnInit(): void {
    this.#postsService
      .getProducts()
      .subscribe((products) => (this.products = products));
  }

  deleteProduct(product: Product) {
    this.products = this.products.filter((p) => p !== product);
  }
}
