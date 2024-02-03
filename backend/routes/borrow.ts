import express from "express";

import { borrowController } from "../controllers/borrowController";

export const borrowRouter = express.Router();

borrowRouter.route("/")
    .post(borrowController.borrowBook);

borrowRouter.route("/return")
    .post(borrowController.returnBook);

borrowRouter.route("/:id")
    .get(borrowController.getBorrowedBooks);
