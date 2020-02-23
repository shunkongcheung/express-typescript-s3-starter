import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import router from "./routes";
import { bodyFormatter, errorHandler, logger } from "./middlewares";

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(bodyFormatter);
app.use(logger);

app.use("/", router); // path must route to lambda
app.use("/.netlify/functions/server", router); // path must route to lambda

app.use(errorHandler); // error handling. after all route

module.exports = app;
