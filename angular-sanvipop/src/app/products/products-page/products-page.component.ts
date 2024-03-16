import {
  Component,
  OnInit,
  WritableSignal,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Product } from '../interfaces/product';
import { ProductFormComponent } from '../product-form/product-form.component';
import { ProductCardComponent } from '../product-card/product-card.component';
import { FormsModule } from '@angular/forms';
import { PostsService } from '../services/posts.service';

@Component({
  selector: 'products-page',
  standalone: true,
  imports: [FormsModule, ProductFormComponent, ProductCardComponent],
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.css',
})
export class ProductsPageComponent implements OnInit {
  #postsService = inject(PostsService);
  products: WritableSignal<Product[]> = signal([]);
  search = signal('');

  filteredProducts = computed(() =>
    this.products().filter(
      (p) =>
        p.title.toLocaleLowerCase().includes(this.search().toLowerCase()) ||
        p.description.toLocaleLowerCase().includes(this.search().toLowerCase())
    )
  );

  ngOnInit(): void {
    this.getProducts();
  }

  deleteProduct(product: Product) {
    this.products.update((products) => products.filter((p) => p !== product));
  }

  getProducts() {
    this.#postsService
      .getProducts()
      .subscribe((products) => this.products.set(products));
  }
}
