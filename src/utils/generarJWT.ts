import * as jwt from 'jsonwebtoken'

declare module 'jsonwebtoken' {
    export interface UserIDJwtPayload extends jwt.JwtPayload {
        email: string
    }
}

export const getToken = (email: string): string => {
    const secret = process.env.JWT_SECRET || "nosecret"
    return jwt.sign({email},secret , {expiresIn: '30d'})
}

export const getEmail = (token: string): string => {
    const secret = process.env.JWT_SECRET || "nosecret"
    const { email } = <jwt.UserIDJwtPayload>jwt.verify(token, secret)
    return email
}

