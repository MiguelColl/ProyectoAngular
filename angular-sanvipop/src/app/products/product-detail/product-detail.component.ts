import { Component, Input, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Product } from '../interfaces/product';
import { ProductCardComponent } from '../product-card/product-card.component';
import { PostsService } from '../services/posts.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InfoModalComponent } from '../../modals/info-modal/info-modal.component';

@Component({
  selector: 'product-detail',
  standalone: true,
  imports: [ProductCardComponent, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent {
  @Input() product!: Product;
  #router = inject(Router);
  #postsService = inject(PostsService);
  #modalService = inject(NgbModal);
  ownerPhotoUrl = 'https://api.fullstackpro.es/sanvipop/';

  goBack() {
    this.#router.navigate(['/products']);
  }

  deleteProduct() {
    this.goBack();
  }

  buyProduct() {
    this.#postsService.buyProduct(this.product.id).subscribe({
      next: async () => {
        const modalRef = this.#modalService.open(InfoModalComponent);
        modalRef.componentInstance.type = 'success';
        modalRef.componentInstance.title = 'Producto comprado';
        modalRef.componentInstance.body = '¡Gracias por comprar este producto!';
        modalRef.result.catch(() => false);
        this.#postsService
          .getProduct(this.product.id)
          .subscribe((p) => (this.product = p));
      },
      error: () => console.error('Error comprando producto'),
    });
  }
}
