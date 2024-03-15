import { Component, Input, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Product } from '../interfaces/product';
import { ProductCardComponent } from '../product-card/product-card.component';
import { PostsService } from '../services/posts.service';

@Component({
  selector: 'product-detail',
  standalone: true,
  imports: [ProductCardComponent, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {
  @Input() product!: Product;
  #router = inject(Router);
  #postsService = inject(PostsService);
  ownerPhotoUrl = 'https://api.fullstackpro.es/sanvipop/';

  goBack() {
    this.#router.navigate(['/products']);
  }

  deleteProduct() {
    this.goBack();
  }

  buyProduct() {
    this.#postsService.buyProduct(this.product.id).subscribe({
      next: () => console.error('Producto comprado'),
      error: () => console.error('Error comprando producto'),
    });
  }
}
