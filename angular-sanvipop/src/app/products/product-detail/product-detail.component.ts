import { Component, Input, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Product } from '../interfaces/product';
import { ProductCardComponent } from '../product-card/product-card.component';
import { PostsService } from '../services/posts.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InfoModalComponent } from '../../modals/info-modal/info-modal.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash, faHouse, faPlus } from '@fortawesome/free-solid-svg-icons';
import { ImageModalComponent } from '../../modals/image-modal/image-modal.component';
import { PhotoInsert } from '../interfaces/photo';
import { ConfirmModalComponent } from '../../modals/confirm-modal/confirm-modal.component';

@Component({
  selector: 'product-detail',
  standalone: true,
  imports: [ProductCardComponent, RouterLink, FontAwesomeModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent {
  @Input() product!: Product;
  #router = inject(Router);
  #postsService = inject(PostsService);
  #modalService = inject(NgbModal);

  ownerPhotoUrl = 'https://api.fullstackpro.es/sanvipop/';
  managePhotos = signal(false);
  deleteIcon = faTrash;
  mainIcon = faHouse;
  imageIcon = faPlus;
  imageBase64 = '';

  goBack() {
    if (this.managePhotos()) this.managePhotos.set(false);
    else this.#router.navigate(['/products']);
  }

  deleteProduct() {
    this.goBack();
  }

  buyProduct() {
    // const modalRef = this.#modalService.open(StripeModalComponent, {
    //   backdrop: 'static',
    //   keyboard: false,
    // });
    // modalRef.componentInstance.price = this.product.price;
    this.#postsService.buyProduct(this.product.id).subscribe({
      next: () => {
        this.infoModal(
          'success',
          'Producto comprado',
          '¡Gracias por comprar este producto!'
        );
        this.reloadProduct();
      },
      error: () => console.error('Error comprando producto'),
    });
  }

  favoriteChanged() {
    this.reloadProduct();
  }

  reloadProduct() {
    this.#postsService
      .getProduct(this.product.id)
      .subscribe((p) => (this.product = p));
  }

  showPhotos() {
    this.managePhotos.set(!this.managePhotos());
  }

  async changeMainPhoto(photoId: number) {
    const result = await this.confirmModal(
      'question',
      '¿Deseas establecer esta foto como principal?',
      'Será la foto que aparezca en portada'
    );
    if (result) {
      this.#postsService.updateMainPhoto(this.product!.id, photoId).subscribe({
        next: () => {
          this.infoModal(
            'success',
            'Foto principal actualizada',
            'La foto principal ha sido modificada'
          );
          this.reloadProduct();
        },
        error: () => console.error('Error cambiando foto'),
      });
    }
  }

  async deleteImage(photoId: number) {
    const result = await this.confirmModal(
      'warning',
      '¿Está seguro de borrar esta foto?',
      'La foto no se podrá recuperar'
    );
    if (result) {
      this.#postsService.deletePhoto(this.product!.id, photoId).subscribe({
        next: () => {
          this.infoModal(
            'success',
            'Foto eliminada',
            'La foto ha sido borrada'
          );
          this.reloadProduct();
        },
        error: () => console.error('Error borrando foto'),
      });
    }
  }

  changeImage(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (!fileInput.files || fileInput.files.length === 0) {
      this.imageBase64 = '';
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(fileInput.files[0]);
    reader.addEventListener('loadend', () => {
      this.imageBase64 = reader.result as string;
      this.updatePhoto();
    });
  }

  async updatePhoto() {
    const modalRef = this.#modalService.open(ImageModalComponent);
    modalRef.componentInstance.title =
      '¿Deseas elegir esta foto para el producto?';
    modalRef.componentInstance.image = this.imageBase64;
    if (await modalRef.result.catch(() => false)) {
      const photo: PhotoInsert = {
        photo: this.imageBase64,
      };

      this.#postsService.addPhoto(this.product!.id, photo).subscribe({
        next: () => {
          this.infoModal(
            'success',
            'Foto añadida',
            'La foto ha sido añadida al producto'
          );
          this.reloadProduct();
        },
        error: () =>
          this.infoModal(
            'error',
            'Error añadiendo la foto',
            'La foto seleccionada ocupa demasiado tamaño'
          ),
      });
    }
  }

  infoModal(type: string, title: string, body: string) {
    const modalRef = this.#modalService.open(InfoModalComponent);
    modalRef.componentInstance.type = type;
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.body = body;
  }

  async confirmModal(type: string, title: string, body: string) {
    const modalRef = this.#modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.type = type;
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.body = body;
    return await modalRef.result.catch(() => false);
  }
}
