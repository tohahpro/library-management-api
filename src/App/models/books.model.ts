import { model, Query, Schema, UpdateQuery } from "mongoose";
import { IBooksModel, IBooks } from "../interfaces/books.interface";
import { Borrow } from "./borrow.model";

const bookSchema = new Schema<IBooks>({
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    genre: {
        type: String,
        enum: ['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'FANTASY'],
        required: true
    },
    isbn: { type: String, required: true },
    description: { type: String, default: '' },
    imageURL: { type: String, required: true },
    copies: { type: Number, required: true, min: [0, 'Book copies number provide must be a positive'] },
    available: {
        type: Boolean,
        default: true
    },
},
    {
        versionKey: false,
        timestamps: true
    });


bookSchema.statics.AvailableCopies = async function (bookId: string, quantity: number, dueDate: Date): Promise<IBooks> {
    const book = await this.findById(bookId)
    if (!book) {
        throw new Error("Book is not Found")
    }
    if (!dueDate) {
        throw new Error("Due date cannot be assigned");
    }

    if (book.copies < quantity) {
        throw new Error("Enough copies are not available")
    }

    book.copies -= quantity;
    if (book.copies == 0) {
        book.available = false
    }

    await book.save();
    return book;

}


bookSchema.pre('findOneAndDelete', async function (next) {
    console.log('The Borrow book remove');
    next()

});

bookSchema.post('findOneAndDelete', async function (doc, next) {
    if (doc) {
        await Borrow.deleteMany({ book: doc._id })
    }
    next()
})


export const Book = model<IBooks, IBooksModel>("Book", bookSchema);