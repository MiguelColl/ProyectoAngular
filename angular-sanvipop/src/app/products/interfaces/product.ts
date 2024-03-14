import { User } from "../../auth/interfaces/user";
import { Category } from "./category";
import { Photo } from "./photo";

type Status = 1 | 2 | 3;

export interface ProductInsert {
    title: string;
    description: string;
    category: number;
    price: number;
    mainPhoto: string;
}

export interface Product extends Omit<ProductInsert, "category"> {
    id: number;
    category: Category;
}

export interface Product2 extends Omit<ProductInsert, "category"> { // Cambiar a Product (hay que modificar cosas de la card etc)
    id: number;
    category: Category;
    datePublished: string;
    status: Status;
    numVisits: number;
    owner: User;
    soldTo?: User;
    rating: number;
    photos?: Photo[];
    distance: number; 
    mine: boolean;
}
