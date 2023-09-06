import Express, { request } from "express";
import type { Request, Response } from "express";
import {body, validationResult} from "express-validator";
import type {Pagination} from "../utils/utils"
import {pageCalc} from "../utils/utils"
import {checkAuth} from "../utils/middleware"
import * as BookService from "./book.service";

import * as logsService from "../logs/logs.service"

export const bookRouter = Express.Router();

// GET: get all books
bookRouter.get("/", async (request: Request, response: Response) => {
    const {page, pagesize} = request.query
    try {
        if (!page || !pagesize) {
            const books = await BookService.listBook();
            return response.status(200).json(books);
        }
        const totalRecords: number = await BookService.totalRecords();
        const pagination: Pagination = pageCalc(totalRecords, page as string, pagesize as string)
        const skip = parseInt(page as string) * parseInt(pagesize as string) - parseInt(pagesize as string)
        const books = await BookService.pageBooks(skip, parseInt(pagesize as string))
        const data = {
            books,
            pagination
        }
        return response.status(200).json(data)
    } catch (error: any) {
        return response.status(500).json({message: error.message});
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
        return response.status(500).json({message: error.message});
    }
})

// POST: Create a Book
bookRouter.post("/", checkAuth,
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
            const {UserDB} = request
            await logsService.createLogs(`create book titled: ${newBook.title} with id: ${newBook.id}`, "insert", UserDB.email)
            return response.status(200).json(newBook);
        } catch (error: any) {
            return response.status(500).json({message: error.message});
        }
})

// PUT: update a Book
bookRouter.put("/:id", checkAuth,
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
        const {UserDB} = request
        await logsService.createLogs(`update book titled: ${newBook.title} with id: ${newBook.id}`, "update", UserDB.email)
        return response.status(200).json(newBook);
    } catch (error: any) {
        return response.status(500).json({message: error.message});
    }
})

// DELETE: delete a book
bookRouter.delete("/:id",checkAuth, async (request:Request, response: Response) => {
    const id: number = parseInt(request.params.id, 10);
    try {
        const book = await BookService.getBook(id)
        if (!book) {
            return response.status(400).json({message: "Book not found"});
        }
        await BookService.deleteBook(id)
        const {UserDB} = request
        await logsService.createLogs(`delete book titled: ${book.title} with id: ${book.id}`, "delete", UserDB.email)
        return response.status(200).json({message: "book deleted successfully"});
    } catch (error: any) {
        return response.status(500).json({message: error.message});
    }
})

