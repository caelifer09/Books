This is a [ApiRESTFul](https://www.mediawiki.org/wiki/API:REST_API/es) project

# ABOUT

- This proyect is made with [ExpressJS](https://expressjs.com/es/) and [Typescript](https://www.typescriptlang.org/es/).
- The DataBase is [SQLite](https://www.sqlite.org/index.html) Masked with the ORM [Prisma](https://www.prisma.io/).


# DETAILS

The ApiRESTFul have three route.

- /api/authors
    - GET Method
        - "/" Get all authors (For pagination: specify query params "page" and "pagesize" in the URL)
        - "/:id" find one authors by id
    - POST Method
        - "/" Create a author, expect (firstName, lastName as string), requires user authentication
    - PUT Method
        - "/:id" Update a author, expect (firstName, lastName as string), requires user authentication
    - DELETE Method
        - "/:id" Delete a author by id, requires user authentication
- /api/books
    - GET Method
        - "/" Get all books (For pagination: specify query params "page" and "pagesize" in the URL)
        - "/:id" find one book by id
    - POST Method
        - "/" Create a book, expect (title, datePublished as string, isFiction as boolean, authorId Number), requires user authentication
    - PUT Method
        - "/:id" Update a book, expect (title, datePublished as string, isFiction as boolean, authorId Number), requires user authentication
    - DELETE Method
        - "/:id" Delete a book by id, requires user authentication
- /api/users
    - GET Method
        - "/" Get all users (For pagination: specify query params "page" and "pagesize" in the URL), requires user authentication
        - "/:email" Get a user by email, requires user authentication
    - POST Method
        - "/" Create a user, expect (email, password, name? as string)
        - "/login" Authenticate a user, expect (email, password as string)
    - PUT Method
        - "/:email" Update a user by email, expect (email, password as string), requires user authentication
    - DELETE Method
        - "/:email" Delete a user by email, requires user authentication

Also has a hidden internal service for log everything, all transaction get recorded in this table.

- /api/log
    - GET Method
        - "/" Get all logs (For pagination: specify query params "page" and "pagesize" in the URL), requires user authentication


