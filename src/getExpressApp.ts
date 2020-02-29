import express, { NextFunction, Router } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import serverless from "serverless-http";

import { BaseUser } from "./entities";
import getRoutes from "./getRoutes";
import initDb from "./initDb";
import { bodyFormatter, errorHandler, logger } from "./middlewares";

interface Params<UserType extends typeof BaseUser> {
  router: ReturnType<Router>;
  userModel: UserType;
}

// database initializiation
async function dbMiddleware(_: any, __: any, next: NextFunction) {
  try {
    await initDb();
  } catch (err) {
    next(err.message);
  }
  next();
}

function getExpressApp<User extends BaseUser, UserType extends typeof BaseUser>(
  params: Params<UserType>
) {
  const { router, userModel } = params;

  // configuration initializiation
  dotenv.config();

  // express app initializiation
  const app = express();

  app.use(dbMiddleware);
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  const corsOptions = {
    origin: "*",
    methods: "GET,HEAD,PUT,POST,DELETE,OPTIONS",
    preflightContinue: true
  };
  app.use(cors(corsOptions));

  app.use(bodyFormatter);

  // create routes
  app.use("/", getRoutes<User, UserType>(userModel));
  app.use("/", router);

  app.use(logger);
  app.use(errorHandler); // error handling. after all route

  const serverlessHandler = serverless(app);
  return { app, serverlessHandler };
}

export default getExpressApp;
