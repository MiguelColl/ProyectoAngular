import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Product } from '../interfaces/product';
import { RouterLink } from '@angular/router';
import { PostsService } from '../services/posts.service';

@Component({
  selector: 'product-card',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  @Input({required: true}) product!: Product;
  @Output() deleted = new EventEmitter<void>();

  #postsService = inject(PostsService);

  deleteProduct() {
    this.#postsService.deleteProduct(this.product.id).subscribe({
      next: () => (this.deleted.emit()),
      error: () => console.error('Error borrando el producto'),
    });
  }
}
