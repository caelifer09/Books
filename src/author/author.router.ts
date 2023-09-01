import Express from "express";
import type { Request, Response } from "express";
import {body, validationResult} from "express-validator";
import * as AuthorService from "./author.service";

export const authorRouter = Express.Router();

// GET: List of all authors
authorRouter.get("/",async (request:Request, response: Response ) => {
    try{
        const authors = await AuthorService.listAuthors()
        return response.status(200).json(authors);
    } catch (error: any) {
        return response.status(500). json(error.message);
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
        return response.status(500). json(error.message);
    }
})

// POST: Create Author
authorRouter.post("/",
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
            return response.status(200).json(newAuthor);
        } catch (error: any) {
            return response.status(500). json(error.message);
        }
})

// POST: update author
authorRouter.put("/:id",body("firstName").isString(),body("lastName").isString(), async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if(!errors.isEmpty()) {
        return response.status(400).json({errors: errors.array()})
    }
    try {
        const id: number = parseInt(request.params.id, 10);
        const author = request.body
        const newAuthor = await AuthorService.updateAuthor(author, id)
        return response.status(200).json(newAuthor);
    } catch (error: any) {
        return response.status(500). json(error.message);
    }
})

// DELETE: delete author
authorRouter.delete("/:id", async (request:Request, response: Response) => {
    const id: number = parseInt(request.params.id, 10);
    try {
        const author = await AuthorService.getAuthor(id)
        if (!author) {
            return response.status(400).json({message: "author not found"});
        }
        AuthorService.deleteAuthor(id)
        return response.status(200).json({message: "author deleted successfully"});
    } catch (error: any) {
        return response.status(500). json(error.message);
    }
})
