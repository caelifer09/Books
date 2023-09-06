import {db} from "../utils/db.server";
import type { Author } from "../author/author.service";


export type BookBD = {
    id: number,
    title: string,
    isFiction: boolean,
    datePublished: Date,
    author: Author
};

export type Book = {
    title: string;
    datePublished: Date;
    authorId: number;
    isFiction: boolean;
};


export const listBook = async (): Promise<BookBD[]> => {
    const pageSize: number = 100;
    let records: BookBD[] = await db.book.findMany({take: 1,select: {
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
    } })
    let cursor: number = 1;
    while (true) {
        const pageRecords: BookBD[] = await db.book.findMany({
            skip: 1,
            cursor: {
                id: cursor
            },
            take: pageSize,
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
        records = records.concat(pageRecords)
        if (pageRecords.length < pageSize) {
          break
        }
        cursor = pageRecords[pageRecords.length - 1].id
    }
    return records
}

export const pageBooks = async(skip: number, pagesize: number): Promise<BookBD[]> => {
    return await db.book.findMany({
        skip: skip,
        take: pagesize,
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

export const totalRecords = async (): Promise<number> => {
    return await db.book.count({})
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

