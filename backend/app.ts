import express from "express";
import cors from "cors"

import { ROUTES } from "./constants";
import { registerRouter } from "./routes/register";
import { loginRouter } from "./routes/login";
import { bookRouter } from "./routes/book";
import { borrowerRouter } from "./routes/borrower";
import { verifyJWT } from "./middlewares/verifyJwt";
import { borrowRouter } from "./routes/borrow";
import { rateLimiter } from "./middlewares/rateLimiter";

const app = express();

app.use(cors());
app.use(express.json());

app.use(ROUTES.REGISETR, registerRouter);
app.use(ROUTES.LOGIN, loginRouter);
app.use(ROUTES.BORROW, borrowRouter);

app.use(verifyJWT);
app.use(rateLimiter);
app.use(ROUTES.BOOKS, bookRouter);
app.use(ROUTES.BORROWER, borrowerRouter);


export default app;