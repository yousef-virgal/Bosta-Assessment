import dotenv from "dotenv";

import app from "./app";

dotenv.config({path: "../"});

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server startig, Listening at port ${port}`);
})