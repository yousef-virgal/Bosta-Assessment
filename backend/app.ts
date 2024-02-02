import express from "express";
import cors from "cors"

import { ROUTES } from "./constants";
import { registerRouter } from "./routes/register";
import { loginRouter } from "./routes/login";
import { bookRouter } from "./routes/book";

const app = express();

app.use(cors());
app.use(express.json());

app.use(ROUTES.REGISETR, registerRouter);
app.use(ROUTES.LOGIN, loginRouter);

app.use(ROUTES.BOOKS, bookRouter);


export default app;