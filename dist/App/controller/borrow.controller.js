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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrowRoutes = void 0;
const express_1 = __importDefault(require("express"));
const borrow_model_1 = require("../models/borrow.model");
const books_model_1 = require("../models/books.model");
exports.borrowRoutes = express_1.default.Router();
exports.borrowRoutes.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { book, quantity, dueDate } = req.body;
        if (!book) {
            throw new Error("Book not found!!");
        }
        yield books_model_1.Book.AvailableCopies(book, quantity, dueDate);
        const data = yield borrow_model_1.Borrow.create({ book, quantity, dueDate });
        res.status(201).json({
            success: true,
            message: 'Book borrowed successfully',
            data
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
}));
exports.borrowRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield borrow_model_1.Borrow.aggregate([
            {
                $group: {
                    _id: '$book',
                    totalQuantity: { $sum: '$quantity' }
                }
            },
            {
                $lookup: {
                    from: 'books',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'book'
                }
            },
            {
                $unwind: '$book'
            },
            {
                $project: {
                    _id: 0,
                    totalQuantity: 1,
                    book: {
                        title: '$book.title',
                        isbn: '$book.isbn'
                    }
                }
            },
            {
                $facet: {
                    data: [{
                            $project: {
                                totalQuantity: 1,
                                book: 1
                            }
                        }],
                    totalCount: [
                        { $count: 'count' }
                    ]
                }
            }
        ]);
        const data = result[0].data;
        res.status(200).json({
            success: true,
            message: 'Borrowed books summary retrieved successfully',
            data
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
}));
