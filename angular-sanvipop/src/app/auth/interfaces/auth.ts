export interface UserLogin {
    email: string;
    password: string;
    lat?: number;
    lng?: number;
}

export interface UserRegister {
    name: string;
    email: string;
    password: string;
    photo: string;
    lat: number;
    lng: number;
}