import express from "express";

import { regisetrControler } from "../controllers/registerController";

export const registerRouter = express.Router();

// The available routes for the register route
registerRouter.route("/").post(regisetrControler);