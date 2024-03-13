import { Component, OnInit, inject } from '@angular/core';
import { ProductInsert } from '../interfaces/product';
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

@Component({
  selector: 'product-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css',
})
export class ProductFormComponent implements OnInit, CanComponentDeactivate {
  #categoriesService = inject(CategoriesService);
  #postsService = inject(PostsService);
  #router = inject(Router);

  #fb = inject(NonNullableFormBuilder);
  productForm = this.#fb.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    description: ['', [Validators.required]],
    category: [0, [Validators.required, positiveValueValidator()]],
    price: [0, [Validators.required, positiveValueValidator()]],
    mainPhoto: ['', [Validators.required]],
  });

  imageBase64 = '';
  saved = false;
  categories: Category[] = [];

  canDeactivate() {
    return (
      this.saved ||
      this.productForm.pristine ||
      confirm('¿Estás seguro de abandonar la página sin guardar los cambios?')
    );
  }

  ngOnInit(): void {
    this.#categoriesService
      .getCategories()
      .subscribe((categories) => (this.categories = categories));
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
      error: () => console.error('Error añadiendo el producto'),
    });
  }

  validClasses(formControl: FormControl, validClass: string, errorClass: string) {
    return {
      [validClass]: formControl.touched && formControl.valid,
      [errorClass]: formControl.touched && formControl.invalid,
    };
  }
}
