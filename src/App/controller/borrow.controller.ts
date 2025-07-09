import express, { Request, Response } from 'express';
import { Borrow } from '../models/borrow.model';
import { Book } from '../models/books.model';



export const borrowRoutes = express.Router()


borrowRoutes.post('/', async (req: Request, res: Response) => {

    try {
        const { book, quantity, dueDate } = req.body;

        if (!book) {
            throw new Error("Book not found!!")
        }

        await Book.AvailableCopies(book, quantity)

        const data = await Borrow.create({ book, quantity, dueDate });

        res.status(201).json({
            success: true,
            message: 'Book borrowed successfully',
            data
        })

    } catch (error) {
        res.status(404).json({
            success: false,
            message: (error as Error).message
        })
    }
})


borrowRoutes.get('/', async (req: Request, res: Response) => {

    try {
        const result = await Borrow.aggregate([
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
                    data: [],
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
        })



    } catch (error) {
        res.status(404).json({
            success: false,
            message: (error as Error).message
        })
    }
})