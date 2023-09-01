import Express, { request } from "express";
import type { Request, Response } from "express";
import {body, validationResult} from "express-validator";
import * as BookService from "./book.service";

export const bookRouter = Express.Router();

// GET: get all books
bookRouter.get("/", async (request: Request, response: Response) => {
    try {
        const books = await BookService.listBook();
        return response.status(200).json(books);
    } catch (error: any) {
        return response.status(500). json(error.message);
    }
})

// GET: book by id
bookRouter.get("/:id", async (request: Request, response: Response) => {
    const id: number = parseInt(request.params.id, 10);
    try {
        const book = await BookService.getBook(id);
        if(book) {
            return response.status(200).json(book)
        }
        return response.status(404).json({message: "Book not found"})
    } catch (error: any) {
        return response.status(500). json(error.message);
    }
})

// POST: Create Book
bookRouter.post("/",
                body("title").isString(),
                body("isFiction").isBoolean(),
                body("datePublished").isString(),
                body("authorId").isNumeric(),
    async (request: Request, response: Response) =>{
        const errors = validationResult(request);
        if(!errors.isEmpty()) {
            return response.status(400).json({errors: errors.array()})
        }
        try {
            const book = request.body
            const newBook = await BookService.createBook(book)
            return response.status(200).json(newBook);
        } catch (error: any) {
            return response.status(500). json(error.message);
        }
})

// PUT: update Book
bookRouter.put("/:id",
                    body("title").isString(),
                    body("isFiction").isBoolean(),
                    body("datePublished").isString(),
                    body("authorId").isNumeric(),
async (request: Request, response: Response) =>{
    const errors = validationResult(request);
    if(!errors.isEmpty()) {
        return response.status(400).json({errors: errors.array()})
    }
    try {
        const id: number = parseInt(request.params.id, 10);
        const book = request.body;
        const newBook = await BookService.updateBook(book, id);
        return response.status(200).json(newBook);
    } catch (error: any) {
        return response.status(500). json(error.message);
    }
})

// DELETE: delete book
bookRouter.delete("/:id", async (request:Request, response: Response) => {
    const id: number = parseInt(request.params.id, 10);
    try {
        const book = await BookService.getBook(id)
        if (!book) {
            return response.status(400).json({message: "Book not found"});
        }
        BookService.deleteBook(id)
        return response.status(200).json({message: "book deleted successfully"});
    } catch (error: any) {
        return response.status(500). json(error.message);
    }
})

