import * as dotenv from "dotenv";
import Express from "express";
import cors from "cors";

import {authorRouter} from "./author/author.router"
import {bookRouter} from "./book/book.router"
import {userRoute} from "./user/user.router"
import {logsRouter} from "./logs/logs.router"

import type {UserDB} from "./user/user.service"

dotenv.config();

if (!process.env.PORT) {
    process.exit(1);
}

declare global {
    namespace Express {
      interface Request {
        UserDB: UserDB
      }
    }
}

const PORT: number = parseInt(process.env.PORT as string, 10);
const app = Express();
app.use(cors());
app.use(Express.json());

app.use("/api/authors", authorRouter);
app.use("/api/books", bookRouter);
app.use("/api/users", userRoute);
app.use("/api/log", logsRouter);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})

