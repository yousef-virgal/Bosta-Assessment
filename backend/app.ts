import express from "express";
import cors from "cors"

import { ROUTES } from "./constants";
import { registerRouter } from "./routes/register";
import { loginRouter } from "./routes/login";

const app = express();

app.use(cors());

app.use(ROUTES.REGISETR, registerRouter);
app.use(ROUTES.LOGIN, loginRouter);


export default app;