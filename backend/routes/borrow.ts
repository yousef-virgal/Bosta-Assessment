import express from "express";

import { borrowController } from "../controllers/borrowController";

export const borrowRouter = express.Router();

// The Available routes for the borrow endpoint
borrowRouter.route("/")
    .post(borrowController.borrowBook);

borrowRouter.route("/return")
    .post(borrowController.returnBook);
    
borrowRouter.route("/overdue")
    .get(borrowController.getOverDueBooks);

borrowRouter.route("/:id")
    .get(borrowController.getBorrowedBooks);
