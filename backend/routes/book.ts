import express from "express";

import { bookController } from "../controllers/bookController";

export const bookRouter = express.Router();

bookRouter.route("/")
    .get(bookController.fetchBooks)
    .post(bookController.addBook);

bookRouter.route("/:id")
    .put(bookController.updateBook)
    .delete(bookController.deleteBook);
