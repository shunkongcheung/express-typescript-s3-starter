import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

import initDb from "./init-db";
import router from "./routes";
import { bodyFormatter, errorHandler, logger } from "./middlewares";

// configuration initializiation
dotenv.config();

// express app initializiation
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(bodyFormatter);
app.use(logger);

// create routes
app.use("/", router); // path must route to lambda
app.use("/.netlify/functions/server", router); // path must route to lambda

app.use(errorHandler); // error handling. after all route

// database initializiation
initDb({
  host: "localhost",
  port: 5432,
  database: "express_starter",
  username: "express_starter_user",
  password: process.env.DB_PASSWORD || ""
});

// finish and export
export default app;
