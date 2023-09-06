import {db} from "../utils/db.server";

export type Logs = {
    id: number,
  event: string,
  type: string,
  user: string | null
}

export const listLogs = async (): Promise<Logs[]> => {
    return await db.logs.findMany({
        select: {
            id: true,
            event: true,
            type: true,
            user: true
        }
    })
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

