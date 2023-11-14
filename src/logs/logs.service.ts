import {db} from "../utils/db.server";

export type Logs = {
    id: number,
  event: string,
  type: string,
  user: string | null
}

export const listLogs = async (): Promise<Logs[]> => {
    const pageSize: number = 100;
    let records: Logs[] = await db.logs.findMany({take:1, 
        select: {
            id: true,
            event: true,
            type: true,
            user: true
        }
    })
    let cursor: number = 1;
    while (true) {
        const pageRecords: Logs[] = await db.logs.findMany({
            skip:1,
            cursor: {
                id: cursor
            },
            take: pageSize,
            select: {
                id: true,
                event: true,
                type: true,
                user: true
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

export const pageLogs = async (skip: number, pagesize: number): Promise<Logs[]> => {
    return await db.logs.findMany({
        skip:skip,
        take:pagesize,
        select: {
            id: true,
            event: true,
            type: true,
            user: true
        }
    })
}

export const totalRecords = async (): Promise<number> => {
    return await db.logs.count({})
}

export const createLogs = async(event: string, type: string, user?: string): Promise<void> => {
    await db.logs.create({
        data: {
            event,
            type,
            user
        }
    })
}

