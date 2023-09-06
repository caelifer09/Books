import Express from "express";
import type { Request, Response } from "express";
import {body, validationResult} from "express-validator";
import type {Pagination} from "../utils/utils"
import {pageCalc} from "../utils/utils"
import {checkAuth} from "../utils/middleware"
import * as AuthorService from "./author.service";

import * as logsService from "../logs/logs.service";

export const authorRouter = Express.Router();

// GET: List of all authors
authorRouter.get("/",async (request:Request, response: Response ) => {
    const {page, pagesize} = request.query
    try {
        if (!page || !pagesize) {
            const Authors = await AuthorService.listAuthors()
            return response.status(200).json(Authors);
        }
        const totalRecords: number = await AuthorService.totalRecords();
        const pagination: Pagination = pageCalc(totalRecords, page as string, pagesize as string)
        const skip = parseInt(page as string) * parseInt(pagesize as string) - parseInt(pagesize as string)
        const Authors = await AuthorService.pageAuthor(skip, parseInt(pagesize as string))
        const data = {
            Authors,
            pagination
        }
        return response.status(200).json(data)       
    } catch (error: any) {
        return response.status(500).json({message: error.message});
    }
});

// GET: Author by id
authorRouter.get("/:id", async (request: Request, response: Response) => {
    const id: number = parseInt(request.params.id, 10);
    try{
        const author = await AuthorService.getAuthor(id)
        if (author) {
            return response.status(200).json(author)
        }
        return response.status(404).json({message: "author not found"})
    } catch (error: any) {
        return response.status(500).json({message: error.message});
    }
})

// POST: Create an Author
authorRouter.post("/", checkAuth,
                    body("firstName").isString(),
                    body("lastName").isString(), 
    async (request: Request, response: Response) => {
        const errors = validationResult(request);
        if(!errors.isEmpty()) {
            return response.status(400).json({errors: errors.array()})
        }
        try {
            const author = request.body
            const newAuthor = await AuthorService.createAuthor(author)
            const {UserDB} = request
            await logsService.createLogs(`create author named: ${newAuthor.firstName} ${newAuthor.lastName} with id: ${newAuthor.id}`, "insert", UserDB.email)
            return response.status(200).json(newAuthor);
        } catch (error: any) {
            return response.status(500).json({message: error.message});
        }
})

// PUT: update an author
authorRouter.put("/:id",checkAuth,body("firstName").isString(),body("lastName").isString(), async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if(!errors.isEmpty()) {
        return response.status(400).json({errors: errors.array()})
    }
    try {
        const id: number = parseInt(request.params.id, 10);
        const author = request.body
        const newAuthor = await AuthorService.updateAuthor(author, id)
        const {UserDB} = request
        await logsService.createLogs(`update author named: ${newAuthor.firstName} ${newAuthor.lastName} with id: ${newAuthor.id}`, "update", UserDB.email)
        return response.status(200).json(newAuthor);
    } catch (error: any) {
        return response.status(500).json({message: error.message});
    }
})

// DELETE: delete an author
authorRouter.delete("/:id",checkAuth, async (request:Request, response: Response) => {
    const id: number = parseInt(request.params.id, 10);
    try {
        const author = await AuthorService.getAuthor(id)
        if (!author) {
            return response.status(400).json({message: "author not found"});
        }
        await AuthorService.deleteAuthor(id)
        const {UserDB} = request
        await logsService.createLogs(`delete author named: ${author.firstName} ${author.lastName} with id: ${author.id}`, "delete", UserDB.email)
        return response.status(200).json({message: "author deleted successfully"});
    } catch (error: any) {
        return response.status(500).json({message: error.message});
    }
})
