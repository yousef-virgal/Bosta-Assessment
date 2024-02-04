import express from "express";

import { borrowerController } from "../controllers/borrowerController";

export const borrowerRouter = express.Router();

// The available routes for the borrower endpoint
borrowerRouter.route("/")
    .get(borrowerController.fetchBorrowers)
    .post(borrowerController.addBorrower);

borrowerRouter.route("/:id")
    .put(borrowerController.updateBorrower)
    .delete(borrowerController.deleteBorrower);
