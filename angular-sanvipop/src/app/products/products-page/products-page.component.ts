import {
  Component,
  WritableSignal,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { Product } from '../interfaces/product';
import { ProductFormComponent } from '../product-form/product-form.component';
import { ProductCardComponent } from '../product-card/product-card.component';
import { FormsModule } from '@angular/forms';
import { PostsService } from '../services/posts.service';
import { Router, RouterLink } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../../profile/interfaces/user';
import { ProfilesService } from '../../profile/services/profiles.service';
import { InfoModalComponent } from '../../modals/info-modal/info-modal.component';
import { Titles } from '../interfaces/titles';

@Component({
  selector: 'products-page',
  standalone: true,
  imports: [
    FormsModule,
    ProductFormComponent,
    ProductCardComponent,
    RouterLink,
    NgbModule,
  ],
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.css',
})
export class ProductsPageComponent {
  #postsService = inject(PostsService);
  #profilesService = inject(ProfilesService);
  #modalService = inject(NgbModal);
  #router = inject(Router);
  products: WritableSignal<Product[]> = signal([]);
  search = signal('');
  user = input<string>();
  show = input<string>();
  favChange = signal(false);
  profile?: User;

  filteredProducts = computed(() =>
    this.products().filter(
      (p) =>
        p.title.toLocaleLowerCase().includes(this.search().toLowerCase()) ||
        p.description.toLocaleLowerCase().includes(this.search().toLowerCase())
    )
  );

  titles: Titles = {
    me: {
      selling: 'Mis productos en venta',
      sold: 'Mis productos vendidos',
      bought: 'Mis productos comprados',
      favorites: 'Mis productos favoritos',
    },
    user: {
      selling: 'Productos a la venta de ',
      sold: 'Productos vendidos por ',
      bought: 'Productos comprados por ',
    },
  };

  constructor() {
    effect(() => {
      if (this.favChange() || !this.favChange()) { // Uso de la señal para que se reevalue el effect si cambia un favorito
        if (this.user() && this.show()) {
          const id = +this.user()!;
          if (id) {
            switch (this.show()) {
              case 'selling':
                this.#postsService
                  .getProductsSelling(id)
                  .subscribe((products) => this.products.set(products));
                break;
              case 'sold':
                this.#postsService
                  .getProductsSold(id)
                  .subscribe((products) => this.products.set(products));
                break;
              case 'bought':
                this.#postsService
                  .getProductsBought(id)
                  .subscribe((products) => this.products.set(products));
                break;
              case 'favorites':
                this.#postsService
                  .getProductsFavorites()
                  .subscribe((products) => this.products.set(products));
                break;
              default:
                this.#router.navigate(['/products']);
            }
            this.#profilesService.getProfile(id).subscribe({
              next: (user) => {
                this.profile = user;
                if (!this.profile.me && this.show() == 'favorites')
                  this.errorModal(
                    'No puedes visualizar los favoritos de otros usuarios'
                  );
              },
              error: () => this.errorModal(),
            });
          } else this.errorModal();
        } else this.getProducts();
      }
    });
  }

  async errorModal(title: string = 'Ese usuario no existe') {
    const modalRef = this.#modalService.open(InfoModalComponent);
    modalRef.componentInstance.type = 'error';
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.body = 'Se redirigirá a Home';
    await modalRef.result.catch(() => false);
    this.#router.navigate(['/products']);
  }

  deleteProduct(product: Product) {
    this.products.update((products) => products.filter((p) => p !== product));
  }

  getProducts() {
    this.#postsService
      .getProducts()
      .subscribe((products) => this.products.set(products));
    this.profile = undefined;
  }

  favoriteChanged() {
    // Reactivar el effect
    this.favChange.set(!this.favChange());
  }
}
