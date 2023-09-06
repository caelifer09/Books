import {db} from "../src/utils/db.server";
import { faker } from '@faker-js/faker'
import _ from 'lodash';

type Author = {
    firstName: string;
    lastName: string;
}
type Book = {
    title: string;
    isFiction: boolean;
    datePublished: Date;
}

const AMMOUNT = {
    USERS: 10000
}

function getAuthors(): Array<Author> {
    return _.times(AMMOUNT.USERS, n => ({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName()
    }))
}

function getBooks(): Array<Book> {
    return [
        {
            title: "cinema",
            isFiction: false,
            datePublished: new Date()
        },
        {
            title: "one piece",
            isFiction: true,
            datePublished: new Date()
        },
        {
            title: "asdqwerty",
            isFiction: false,
            datePublished: new Date()
        }
    ]
}

async function seed() {
    await Promise.all(
        getAuthors().map(author => {
            return db.author.create({
                data:{
                    firstName: author.firstName,
                    lastName: author.lastName
                }
            })
        })
    )    
    const author = await db.author.findFirst({
        where: {
            firstName: "claudio"
        }
    })
    await Promise.all(
        getBooks().map(book => {
            return db.book.create({
                data: {
                    title: book.title,
                    isFiction: book.isFiction,
                    datePublished: book.datePublished,
                    authorId: author.id
                }
            })
        })
    )
}

seed()

