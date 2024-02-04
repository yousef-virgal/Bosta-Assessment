import express from "express";

import { loginControler } from "../controllers/loginController";

export const loginRouter = express.Router();

// The available routes for the login route
loginRouter.route("/").post(loginControler);