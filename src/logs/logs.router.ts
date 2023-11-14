import Express from "express";
import type { Request, Response } from "express";
import type {Pagination} from "../utils/utils"
import {pageCalc} from "../utils/utils"
import {checkAuth} from "../utils/middleware"

import * as logsService from "../logs/logs.service"

export const logsRouter = Express.Router();

logsRouter.get("/", checkAuth,  async (request: Request, response: Response) => {
    const {page, pagesize} = request.query;
    try {
        if (!page || !pagesize) {
            const logs = await logsService.listLogs();
            return response.status(200).json(logs);
        }
        const totalRecords:number = await logsService.totalRecords();
        const pagination: Pagination = pageCalc(totalRecords, page as string, pagesize as string);
        const skip = parseInt(page as string) * parseInt(pagesize as string) - parseInt(pagesize as string)
        const logs = await logsService.pageLogs(skip, parseInt(pagesize as string))
        const data = {
            logs,
            pagination
        }
        return response.status(200).json(data)
    } catch (error:any) {
        return response.status(500).json({message: error.message});
    }
})