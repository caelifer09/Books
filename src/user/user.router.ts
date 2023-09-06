import Express from "express";
import type { Request, Response } from "express";
import {body, validationResult} from "express-validator";
import type {Pagination} from "../utils/utils"
import {pageCalc} from "../utils/utils"
import {getToken} from "../utils/generarJWT";
import {decode, encode} from "../utils/encrypt";

import * as userServices from "./user.service";

import {checkAuth} from "../utils/middleware";

import * as logsService from "../logs/logs.service";

export const userRoute = Express.Router();

// POST: Login user
userRoute.post("/login", body("email").isString(),
                        body("password").isString(), 
    async (request:Request, response: Response ) => {
        const errors = validationResult(request);
        if(!errors.isEmpty()) {
            return response.status(400).json({errors: errors.array()})
        }
        const {email, password} = request.body
        const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        const result: boolean = expression.test(email);
        if (!result) {
            return response.status(401).json({message: "email is not valid"})
        }
        try {
            const userPass = await userServices.getPassword(email)
            if (!userPass) {
                return response.status(404).json({message: "user does not exist"})
            }
            if (await decode(password, userPass.password)) {
                const jwt = getToken(email)
                await logsService.createLogs(`${email} logged successfully`, "update", email)
                return response.status(200).json({token: `${jwt}`})
            }
            return response.status(403).json({message: "invalid password"})
        } catch (error: any) {
            return response.status(500).json({message: error.message});
        }
})

// POST: create a user
userRoute.post("/",body("email").isString(),
                        body("password").isString(),
    async (request:Request, response: Response ) => {
        const errors = validationResult(request);
        if(!errors.isEmpty()) {
            return response.status(400).json({errors: errors.array()})
        }
        const {email, password, name } = request.body;
        const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        const result: boolean = expression.test(email);
        if (!result) {
            return response.status(401).json({message: "email is not valid"})
        }
        const userDB = await userServices.getUser(email);
        if(userDB) {
            return response.status(401).json({message: "user already registered, try login"})
        }
        if(password.length < 6) {
            return response.status(401).json({message: "The password must be at least 6 characters"})
        }
        const hashedPassword = await encode(password)
        const user = {
            email: email,
            name: name ? name : "usuario no especificado",
            password: hashedPassword
        }
        try {
            const userBD = await userServices.createUser(user);
            await logsService.createLogs(`${userBD.email} created successfully`, "insert")
            return response.status(200).json({message: "user created successfully, now you can login"})
        } catch (error: any) {
            return response.status(500).json({message: error.message});
        }  
})

// GET: list of all user
userRoute.get("/", checkAuth, async (request:Request, response: Response ) => {
    const {page, pagesize} = request.query
    try {
        if (!page || !pagesize) {
            const users = await userServices.listUser()
            return response.status(200).json(users);
        }
        const totalRecords: number = await userServices.totalRecords();
        const pagination: Pagination = pageCalc(totalRecords, page as string, pagesize as string)
        const skip = parseInt(page as string) * parseInt(pagesize as string) - parseInt(pagesize as string)
        const users = await userServices.pageUser(skip, parseInt(pagesize as string))
        const data = {
            users,
            pagination
        }
        return response.status(200).json(data)
    } catch (error: any) {
        return response.status(500).json({message: error.message});
    }
})

// GET: get user by email
userRoute.get("/:email", checkAuth, async (request:Request, response: Response ) => {
    const email: string = request.params.email;
    const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const result: boolean = expression.test(email);
        if (!result) {
            return response.status(401).json({message: "email is not valid"})
        }
    try {
        const userDB = await userServices.getUser(email);
        if(!userDB) {
            return response.status(401).json({message: "user not found"})
        }
        return response.status(200).json(userDB)
    } catch (error: any) {
        return response.status(500).json({message: error.message});
    }
})

// PUT: update a user and can change password as well
userRoute.put("/:email", checkAuth, async (request: Request, response: Response ) => {
        const email: string = request.params.email;
        const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        const result: boolean = expression.test(email);
        if (!result) {
            return response.status(401).json({message: "email is not valid"})
        }
    try {
        const {name, password} = request.body
        const userPass = await userServices.getPassword(email)
        if (!userPass) {
            return response.status(404).json({message: "user not found"})
        }
        if(password?.length < 6) {
            return response.status(401).json({message: "The password must be at least 6 characters"})
        }
        const hashedPassword = password ? await encode(password) : userPass.password
        const updateUser = await userServices.updateUser(email, name, hashedPassword)
        const {UserDB} = request
        await logsService.createLogs(`update user name: ${updateUser.name} with id: ${updateUser.id}`, "update", UserDB.email)
        return response.status(200).json(updateUser)
    } catch (error: any) {
        return response.status(500).json({message: error.message});
    }
})

// DELETE: delete a user 
userRoute.delete("/:email", checkAuth ,async (request: Request, response: Response ) =>{
    const email: string = request.params.email;
    const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const result: boolean = expression.test(email);
    if (!result) {
        return response.status(401).json({message: "email is not valid"})
    }
    try {
        const userDelete = await userServices.getUser(email)
        if (!userDelete) {
            return response.status(404).json({message: "user not found"})
        }
        await userServices.deleteUser(email)
        const {UserDB} = request
        await logsService.createLogs(`delete user email: ${userDelete.email} with id: ${userDelete.id}`, "delete", UserDB.email)
        return response.status(200).json({message: "user deleted successfully"});
    } catch (error: any) {
        return response.status(500).json({message: error.message});
    }
})