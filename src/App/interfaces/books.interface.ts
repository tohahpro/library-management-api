import { Model } from "mongoose";

export interface IBooks{
    title: string,
    author: string,
    genre: 'FICTION' | 'NON_FICTION' | 'SCIENCE' | 'HISTORY' | 'BIOGRAPHY' | 'FANTASY',
    isbn: string,
    description : string,
    copies : Number,
    imageURL : string,
    available  : Boolean
}

export interface IBooksModel extends Model<IBooks> {
    AvailableCopies(bookId: string, quantity: number, dueDate: Date) : Promise<IBooks>;
}
