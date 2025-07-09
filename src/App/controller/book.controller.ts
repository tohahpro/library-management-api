import  express, { Request, Response }  from 'express';
import { Book } from '../models/books.model';


export const bookRoutes = express.Router()


bookRoutes.post('/', async (req: Request, res: Response)=>{

    try {
        const body = req.body;
        const data = await Book.create(body)

        res.status(201).json({
            success : true,
            message : "Book created successfully",
            data
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to create book',
            error: (error as Error).message,
        })
    }

})

bookRoutes.get('/', async (req: Request, res: Response)=>{
    
    try {
        const { filter, sortBy = 'createdAt', sort = 'desc', limit = 10 } = req.query;

        const query: any = {};

        if(filter) {
            query.genre = filter;
        }
        
        const sortOrder = sort === 'asc' ? 1 : -1;

        const data = await Book.find(query)
            .sort({ [sortBy as string]: sortOrder })
            .limit(parseInt(limit as string));


        res.status(200).json({
            success : true,
            message : "Books retrieved successfully",
            data
        })


    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve books",
            error: (error as Error).message,
        })
    }
})

// get single book by id 
bookRoutes.get('/:bookId', async (req: Request, res: Response)=>{
  
    try {
        const bookId = req.params.bookId
        const data = await Book.findById(bookId)

        res.status(200).json({
            success : true,
            message : "Book retrieved successfully",
            data
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'You Provide Invalid Book Id',
            error: (error as Error).message,
        })
    }

})

// update single book by id 
bookRoutes.patch('/:bookId', async (req: Request, res: Response)=>{
    

    try {
        const bookId = req.params.bookId
        const updateBody = req.body
        const data = await Book.findOneAndUpdate({_id: bookId}, updateBody, {new: true})

        res.status(200).json({
            success : true,
            message : "Book updated successfully",
            data
        })

    } catch (error) {
         res.status(400).json({
            success: false,
            message: 'Book Update Failed',
            error: (error as Error).message,
        });
    }
})

// delete book
bookRoutes.delete('/:bookId', async (req: Request, res: Response)=>{
    

    try {

        const bookId = req.params.bookId
        const data = await Book.findOneAndDelete({_id: bookId})

        res.status(200).json({
            success : true,
            message : "Book deleted successfully",
            data
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Book Deleted Failed',
            error: (error as Error).message,
        })
    }
})