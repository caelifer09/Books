import {db} from "../utils/db.server";

export type User = {
    email: string,
    name: string,
    password: string
}

export type UserDB = {
    id: number,
    createdAt: Date,
    email: string,
    name: string | null,
    role: string
}

export type UserPass = {
    password: string
}

export const listUser = async (): Promise<UserDB[]> => {
    const pageSize: number = 100;
    let records: UserDB[] = await db.user.findMany({take: 1,select: {
        id: true,
        createdAt: true,
        email: true,
        name: true,
        role: true
    } })
    let cursor: number = 1;
    while (true) {
        const pageRecords: UserDB[] = await db.user.findMany({
            skip: 1,
            cursor: {
                id: cursor
            },
            take: pageSize,
            select: {
                id: true,
                createdAt: true,
                email: true,
                name: true,
                role: true
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

export const pageUser = async(skip: number, pagesize: number): Promise<UserDB[]> => {
    return await db.user.findMany({
        skip: skip,
        take: pagesize,
        select: {
            id: true,
            createdAt: true,
            email: true,
            name: true,
            role: true
        } 
    })
}

export const totalRecords = async (): Promise<number> => {
    return await db.user.count({})
}

export const getUser = async (email: string): Promise<UserDB | null> => {
    return await db.user.findUnique({
        where: {
            email
        },
        select: {
            id: true,
            createdAt: true,
            email: true,
            name: true,
            role: true
        }
    })
}

export const createUser = async (user: User): Promise<UserDB> => {
    return await db.user.create({
        data: {
            email: user.email,
            name: user.name,
            password: user.password
        },
        select: {
            id: true,
            createdAt: true,
            email: true,
            name: true,
            role: true
        }
    })
}

export const updateUser = async (email: string, name?: string, password?: string): Promise<UserDB> => {
    return await db.user.update({
        where: {
            email: email
        },
        data: {
            name: name,
            password: password
        },
        select: {
            id: true,
            createdAt: true,
            email: true,
            name: true,
            role: true
        }
    })
}

export const deleteUser = async (email: string): Promise<void> => {
    await db.user.delete({
        where: {
            email
        }
    })
}

export const getPassword = async (email: string): Promise<UserPass | null> => {
    const userpass =  await db.user.findUnique({
        where: {
            email
        },
        select: {
            password: true
        }
    })
    return userpass
}
