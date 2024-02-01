import express from "express";

import { loginControler } from "../controllers/loginController";

export const loginRouter = express.Router();

loginRouter.route("/").post(loginControler);