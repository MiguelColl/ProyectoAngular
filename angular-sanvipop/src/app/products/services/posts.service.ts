import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Product, ProductInsert, ProductUpdate } from '../interfaces/product';
import { Observable, map } from 'rxjs';
import {
  ProductsResponse,
  SingleProductResponse,
} from '../interfaces/responses';
import { PhotoInsert } from '../interfaces/photo';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  #productsUrl = 'products';
  #http = inject(HttpClient);

  getProducts(): Observable<Product[]> {
    return this.#http
      .get<ProductsResponse>(this.#productsUrl)
      .pipe(map((resp) => resp.products));
  }

  getProduct(id: number): Observable<Product> {
    return this.#http
      .get<SingleProductResponse>(`${this.#productsUrl}/${id}`)
      .pipe(map((resp) => resp.product));
  }

  getProductsSelling(idUser: number): Observable<Product[]> {
    return this.#http
      .get<ProductsResponse>(`${this.#productsUrl}/user/${idUser}`)
      .pipe(map((resp) => resp.products));
  }

  getProductsSold(idUser: number): Observable<Product[]> {
    return this.#http
      .get<ProductsResponse>(`${this.#productsUrl}/user/${idUser}/sold`)
      .pipe(map((resp) => resp.products));
  }

  getProductsBought(idUser: number): Observable<Product[]> {
    return this.#http
      .get<ProductsResponse>(`${this.#productsUrl}/user/${idUser}/bought`)
      .pipe(map((resp) => resp.products));
  }

  getProductsFavorites(): Observable<Product[]> {
    return this.#http
      .get<ProductsResponse>(`${this.#productsUrl}/bookmarks`)
      .pipe(map((resp) => resp.products));
  }

  addProduct(product: ProductInsert): Observable<Product> {
    return this.#http
      .post<SingleProductResponse>(this.#productsUrl, product)
      .pipe(map((resp) => resp.product));
  }

  deleteProduct(id: number): Observable<void> {
    return this.#http.delete<void>(`${this.#productsUrl}/${id}`);
  }

  addFavorite(productId: number): Observable<void> {
    return this.#http.post<void>(
      `${this.#productsUrl}/${productId}/bookmarks`,
      {}
    );
  }

  deleteFavorite(productId: number): Observable<void> {
    return this.#http.delete<void>(
      `${this.#productsUrl}/${productId}/bookmarks`
    );
  }

  buyProduct(productId: number): Observable<void> {
    return this.#http.put<void>(`${this.#productsUrl}/${productId}/buy`, {});
  }

  updateMainPhoto(productId: number, photoId: number): Observable<void> {
    return this.#http.put<void>(`${this.#productsUrl}/${productId}`, {
      mainPhoto: photoId,
    });
  }

  addPhoto(productId: number, photo: PhotoInsert): Observable<void> {
    return this.#http.post<void>(
      `${this.#productsUrl}/${productId}/photos`,
      photo
    );
  }

  deletePhoto(productId: number, photoId: number): Observable<void> {
    return this.#http.delete<void>(
      `${this.#productsUrl}/${productId}/photos/${photoId}`
    );
  }

  updateProduct(productId: number, product: ProductUpdate): Observable<void> {
    return this.#http.put<void>(`${this.#productsUrl}/${productId}`, product);
  }
}
