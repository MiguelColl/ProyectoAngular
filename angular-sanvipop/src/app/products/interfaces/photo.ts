export interface Photo {
    id: number;
    url: string;
}

export interface PhotoInsert {
    photo: string;
    setMain: boolean;
}