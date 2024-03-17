import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Product } from '../interfaces/product';
import { RouterLink } from '@angular/router';
import { PostsService } from '../services/posts.service';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { faEye, faHeart } from '@fortawesome/free-regular-svg-icons';
import {
  faTrash,
  faPenToSquare,
  faHeart as faHeartSolid,
} from '@fortawesome/free-solid-svg-icons';
import { NgbCarouselModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../../modals/confirm-modal/confirm-modal.component';
import { InfoModalComponent } from '../../modals/info-modal/info-modal.component';

@Component({
  selector: 'product-card',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, RouterLink, FontAwesomeModule, NgbCarouselModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Output() deleted = new EventEmitter<void>();
  @Output() favChanged = new EventEmitter<void>();

  #postsService = inject(PostsService);
  #faIconLibrary = inject(FaIconLibrary);
  #modalService = inject(NgbModal);

  constructor() {
    this.#faIconLibrary.addIcons(
      faEye,
      faTrash,
      faPenToSquare,
      faHeart,
      faHeartSolid
    );
  }

  async deleteProduct() {
    const modalRef = this.#modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.type = 'warning';
    modalRef.componentInstance.title = '¿Estás seguro de borrar este producto?';
    modalRef.componentInstance.body = 'Esta acción no se puede deshacer';

    if (await modalRef.result.catch(() => false)) {
      this.#postsService.deleteProduct(this.product.id).subscribe({
        next: () => this.deleted.emit(),
        error: () => console.error('Error borrando el producto'),
      });
    }
  }

  changeFavorite() {
    if (this.product.bookmarked) {
      this.#postsService.deleteFavorite(this.product.id).subscribe({
        next: () => {
          this.favChanged.emit();
          const modalRef = this.#modalService.open(InfoModalComponent);
          modalRef.componentInstance.type = 'error';
          modalRef.componentInstance.title = 'Favorito eliminado';
          modalRef.componentInstance.body =
            'El producto se ha eliminado de favoritos';
        },
        error: () => console.error('Error quitando favorito'),
      });
    } else {
      this.#postsService.addFavorite(this.product.id).subscribe({
        next: () => {
          this.favChanged.emit();
          const modalRef = this.#modalService.open(InfoModalComponent);
          modalRef.componentInstance.type = 'success';
          modalRef.componentInstance.title = 'Favorito añadido';
          modalRef.componentInstance.body =
            'El producto se ha añadido a favoritos';
        },
        error: () => console.error('Error añadiendo favorito'),
      });
    }
  }
}
