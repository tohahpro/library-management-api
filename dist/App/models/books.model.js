"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
const mongoose_1 = require("mongoose");
const borrow_model_1 = require("./borrow.model");
const bookSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    genre: {
        type: String,
        enum: ['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'FANTASY'],
        required: true
    },
    isbn: { type: String, required: true },
    description: { type: String, default: '' },
    copies: { type: Number, required: true, min: [0, 'Book copies number provide must be a positive'] },
    available: {
        type: Boolean,
        default: true
    },
}, {
    versionKey: false,
    timestamps: true
});
bookSchema.statics.AvailableCopies = function (bookId, quantity) {
    return __awaiter(this, void 0, void 0, function* () {
        const book = yield this.findById(bookId);
        if (!book) {
            throw new Error("Book is not Found");
        }
        if (book.copies < quantity) {
            throw new Error("Enough copies are not available");
        }
        book.copies -= quantity;
        if (book.copies == 0) {
            book.available = false;
        }
        yield book.save();
        return book;
    });
};
bookSchema.pre('findOneAndDelete', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('The Borrow book remove');
        next();
    });
});
bookSchema.post('findOneAndUpdate', function (doc, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (doc) {
            yield borrow_model_1.Borrow.deleteMany({ book: doc._id });
        }
        next();
    });
});
exports.Book = (0, mongoose_1.model)("Book", bookSchema);
