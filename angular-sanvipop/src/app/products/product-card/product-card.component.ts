import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Product } from '../interfaces/product';
import { RouterLink } from '@angular/router';
import { PostsService } from '../services/posts.service';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'product-card',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, RouterLink, FontAwesomeModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  @Input({required: true}) product!: Product;
  @Output() deleted = new EventEmitter<void>();

  #postsService = inject(PostsService);
  #faIconLibrary = inject(FaIconLibrary);

  constructor() {
    this.#faIconLibrary.addIcons(faEye, faTrash);
  }

  deleteProduct() {
    this.#postsService.deleteProduct(this.product.id).subscribe({
      next: () => (this.deleted.emit()),
      error: () => console.error('Error borrando el producto'),
    });
  }
}
