import { Category } from "./category";
import { Product } from "./product";
import { Rating } from "./rating";

export interface ProductsResponse {
    products: Product[];
}

export interface SingleProductResponse {
    product: Product;
}

export interface CategoriesResponse {
    categories: Category[];
}

export interface PhotoResponse {
    photo: string;
}

export interface RatingsResponse {
    comments: Rating[];
}