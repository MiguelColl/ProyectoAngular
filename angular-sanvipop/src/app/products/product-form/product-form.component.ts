import { Component, Input, OnInit, inject } from '@angular/core';
import { Product, ProductInsert, ProductUpdate } from '../interfaces/product';
import { NgClass } from '@angular/common';
import { Category } from '../interfaces/category';
import { CategoriesService } from '../services/categories.service';
import { PostsService } from '../services/posts.service';
import { Router } from '@angular/router';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CanComponentDeactivate } from '../../interfaces/can-component-deactivate';
import { positiveValueValidator } from '../../validators/positive-value';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InfoModalComponent } from '../../modals/info-modal/info-modal.component';
import { ConfirmModalComponent } from '../../modals/confirm-modal/confirm-modal.component';
import { PhotoInsert } from '../interfaces/photo';

@Component({
  selector: 'product-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css',
})
export class ProductFormComponent implements OnInit, CanComponentDeactivate {
  @Input() product?: Product;
  #categoriesService = inject(CategoriesService);
  #postsService = inject(PostsService);
  #router = inject(Router);
  #modalService = inject(NgbModal);
  #fb = inject(NonNullableFormBuilder);

  productForm = this.#fb.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    description: ['', [Validators.required]],
    category: [0, [Validators.required, positiveValueValidator()]],
    price: [0, [Validators.required, positiveValueValidator()]],
    mainPhoto: ['', [Validators.required]],
  });

  imageBase64 = '';
  #actualImage = '';
  nameButton = 'Crear';
  saved = false;
  categories: Category[] = [];

  canDeactivate() {
    return this.saved || this.productForm.pristine || this.askUser();
  }

  ngOnInit(): void {
    this.#categoriesService
      .getCategories()
      .subscribe((categories) => (this.categories = categories));
    if (this.product) {
      this.productForm.controls.title.setValue(this.product.title);
      this.productForm.controls.description.setValue(this.product.description);
      this.productForm.controls.category.setValue(this.product.category.id);
      this.productForm.controls.price.setValue(this.product.price);
      this.productForm.controls.mainPhoto.setValue(this.product.mainPhoto); // DOMException, pero necesario para no obligar a asignar una foto para poder pulsar el submit
      this.imageBase64 = this.product.mainPhoto;
      this.#actualImage = this.product.mainPhoto;
      this.nameButton = 'Actualizar producto';
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
    });
  }

  async askUser() {
    const modalRef = this.#modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.type = 'question';
    modalRef.componentInstance.title = '¿Estás seguro de abandonar la página?';
    modalRef.componentInstance.body = 'Los cambios no se guardarán';
    return await modalRef.result.catch(() => false);
  }

  addPost() {
    const product: ProductInsert = {
      ...this.productForm.getRawValue(),
      category: +this.productForm.value.category!,
      mainPhoto: this.imageBase64,
    };

    this.#postsService.addProduct(product).subscribe({
      next: () => {
        this.saved = true;
        this.#router.navigate(['/products']);
      },
      error: (e) => {
        const modalRef = this.#modalService.open(InfoModalComponent);
        modalRef.componentInstance.type = 'error';
        modalRef.componentInstance.title = 'Error añadiendo producto';
        modalRef.componentInstance.body =
          e.status == 0
            ? 'La foto añadida ocupa demasiado tamaño'
            : e.error.message.join(', ');
      },
    });
  }

  updatePost() {
    if (this.#actualImage != this.imageBase64) {
      const photoId = this.product!.photos![0].id;
      const photo: PhotoInsert = {
        photo: this.imageBase64,
        setMain: true,
      };

      this.#postsService.updateMainPhoto(this.product!.id, photo).subscribe({
        next: () =>
          this.#postsService.deletePhoto(this.product!.id, photoId).subscribe({
            next: () => this.updateInfo(),
          }),
        error: () => {
          const modalRef = this.#modalService.open(InfoModalComponent);
          modalRef.componentInstance.type = 'error';
          modalRef.componentInstance.title = 'Error cambiando la foto';
          modalRef.componentInstance.body =
            'La foto añadida ocupa demasiado tamaño';
        },
      });
    } else this.updateInfo();
  }

  updateInfo() {
    const product: ProductUpdate = {
      title: this.productForm.value.title!,
      description: this.productForm.value.description!,
      category: +this.productForm.value.category!,
      price: this.productForm.value.price!,
    };

    this.#postsService.updateProduct(this.product!.id, product).subscribe({
      next: () => {
        this.saved = true;
        this.#router.navigate([`/products/${this.product!.id}`]);
      },
      error: (e) => {
        const modalRef = this.#modalService.open(InfoModalComponent);
        modalRef.componentInstance.type = 'error';
        modalRef.componentInstance.title = 'Error actualizando producto';
        modalRef.componentInstance.body = e.error.message.join(', ');
      },
    });
  }

  validClasses(
    formControl: FormControl,
    validClass: string,
    errorClass: string
  ) {
    return {
      [validClass]: formControl.touched && formControl.valid,
      [errorClass]: formControl.touched && formControl.invalid,
    };
  }
}
