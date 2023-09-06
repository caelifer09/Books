import {db} from "../utils/db.server";

export type Author = {
    id: number,
    firstName: string,
    lastName: string,
}

export const listAuthors = async (): Promise<Author[]> => {
    const pageSize: number = 100;
    let records: Author[] = await db.author.findMany({take: 1,select: {
        id: true,
        firstName: true,
        lastName: true
    } })
    let cursor: number = 1;
    while (true) {
        const pageRecords: Author[] = await db.author.findMany({
            skip: 1,
            cursor: {
                id: cursor
            },
            take: pageSize,
            select: {
                id: true,
                firstName: true,
                lastName: true
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

export const pageAuthor = async(skip: number, pagesize: number): Promise<Author[]> => {
    return await db.author.findMany({
        skip: skip,
        take: pagesize,
        select: {
            id: true,
            firstName: true,
            lastName: true
        }
    })
}

export const totalRecords = async (): Promise<number> => {
    return await db.author.count({})
}

export const getAuthor = async (id: number): Promise<Author | null> => {
    return await db.author.findUnique({
        where: {
            id
        }
    })
}

export const createAuthor = async (author: Omit<Author, "id">): Promise<Author> => {
    const {firstName, lastName} = author
    return await db.author.create({
        data:{
            firstName,
            lastName
        },
        select: {
            id: true,
            firstName: true,
            lastName: true
        }
    })
}

export const updateAuthor = async (author: Omit<Author, "id">, id:number): Promise<Author> => {
    const {firstName, lastName} = author
    return await db.author.update({
        where: {
            id
        },
        data: {
            firstName,
            lastName
        },
        select: {
            id: true,
            firstName: true,
            lastName: true
        }
    })
}

export const deleteAuthor = async (id: number): Promise<void> => {
    await db.author.delete({
        where: {
            id
        }
    })
}
