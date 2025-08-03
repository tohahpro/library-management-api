import express, { Application, Request, Response } from "express";
import { bookRoutes } from "./App/controller/book.controller";
import { borrowRoutes } from "./App/controller/borrow.controller";
import cors from 'cors'

const app : Application = express();

app.use(express.json())
app.use(cors({origin: "http://localhost:5173"}));

app.use("/api/books", bookRoutes)
app.use("/api/borrow", borrowRoutes)


app.get('/', (req: Request, res: Response)=>{
    res.send('Welcome to Library Management API');
})


// 404 error handler
app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
})

export default app;