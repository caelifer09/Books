import {db} from "../utils/db.server";
import type { Author } from "../author/author.service";


type BookBD = {
    id: number,
    title: string,
    isFiction: boolean,
    datePublished: Date,
    author: Author
}

type Book = {
    title: string;
    datePublished: Date;
    authorId: number;
    isFiction: boolean;
};


export const listBook = async (): Promise<BookBD[]> => {
    return await db.book.findMany({
        select: {
            id: true,
            title: true,
            isFiction: true,
            datePublished: true,
            author: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                }
            }
        }
    })
}

export const getBook = async (id: number): Promise<BookBD | null> => {
    return await db.book.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            title: true,
            isFiction: true,
            datePublished: true,
            author: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                }
            }
        }
    })
}

export const createBook = async (book:Book): Promise<BookBD> => {
    const {title, isFiction, datePublished, authorId} = book
    const parsedDate: Date = new Date(datePublished);
    return await db.book.create({
        data: {
            title,
            isFiction,
            datePublished: parsedDate,
            authorId
        },
        select: {
            id: true,
            title: true,
            isFiction: true,
            datePublished: true,
            author: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                }
            }
        }
    })
}

export const updateBook = async (book: Book, id:number): Promise<BookBD> => {
    const {title, isFiction, datePublished, authorId} = book
    const parsedDate: Date = new Date(datePublished);
    return await db.book.update({
        where: {
            id
        },
        data: {
            title,
            isFiction,
            datePublished: parsedDate,
            authorId
        },
        select: {
            id: true,
            title: true,
            isFiction: true,
            datePublished: true,
            author: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                }
            }
        }
    })
}

export const deleteBook = async (id: number): Promise<void> => {
    await db.book.delete({
        where: {
            id
        }
    })
}

