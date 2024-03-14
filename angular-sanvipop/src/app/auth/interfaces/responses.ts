import { User } from "./user";

export interface TokenResponse {
    expiresIn: number;
    accessToken: string;
}

export interface UserResponse {
    user: User;
}

export interface UsersResponse {
    users: User[];
}