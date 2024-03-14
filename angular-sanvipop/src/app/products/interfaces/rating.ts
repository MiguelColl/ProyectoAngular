import { User } from "../../auth/interfaces/user";
import { Product } from "./product";

export interface RatingInsert {
    rating: number;
    comment: string;
    product: number;
}

export interface Rating extends Omit<RatingInsert, "product"> {
    product: Product;
    user: User; 
}