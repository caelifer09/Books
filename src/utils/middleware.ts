import {Request, Response, NextFunction} from 'express';
import { getEmail } from '../utils/generarJWT'
import * as userServices from "../user/user.service";

export const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1] || ""
        const email = getEmail(token)
        const user = await userServices.getUser(email)
        if (user) {
            req.UserDB = user
            next();
        } else {
            return res.status(401).json({message: "Unauthorized"})
        }        
    } catch (error: any) {
        return res.status(500).json({message: error.message});
    }
}

