import express, { NextFunction } from "express";
import bodyParser from "body-parser";
import serverless from "serverless-http";
import cors from "cors";
import dotenv from "dotenv";

import initDb from "./initDb";
import router from "./routes";
import { bodyFormatter, errorHandler, logger } from "./middlewares";

// configuration initializiation
dotenv.config();

// database initializiation
async function dbMiddleware(_: any, __: any, next: NextFunction) {
  try {
    await initDb();
  } catch (err) {
    next(err.message);
  }
  next();
}

// express app initializiation
const app = express();

app.use(dbMiddleware);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(bodyFormatter);

// create routes
app.use("/", router); // path must route to lambda
app.use("/.netlify/functions/server", router); // path must route to lambda

app.use(logger);
app.use(errorHandler); // error handling. after all route

// finish and export
export const handler = serverless(app);
export default app;
