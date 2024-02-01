import express from "express";

import { regisetrControler } from "../controllers/registerController";

export const registerRouter = express.Router();

registerRouter.route("/").post(regisetrControler);