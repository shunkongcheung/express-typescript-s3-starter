import express, { Router } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import serverless from "serverless-http";
import { BaseEntity } from "typeorm";

import { BaseUser } from "./entities";
import getRoutes from "./getRoutes";
import {
  bodyFormatter,
  dbMiddleware,
  errorHandler,
  logger
} from "./middlewares";

interface Params<
  UserType extends typeof BaseUser,
  FileType extends typeof BaseEntity
> {
  router: ReturnType<Router>;
  userModel: UserType;
  fileModel?: FileType;
}

// database initializiation
function getExpressApp<
  User extends BaseUser,
  UserType extends typeof BaseUser,
  FileType extends typeof BaseEntity = typeof BaseEntity
>(params: Params<UserType, FileType>) {
  const { router, userModel, fileModel } = params;

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
  app.use("/", getRoutes<User, UserType, FileType>(userModel, fileModel));
  app.use("/", router);

  app.use(logger);
  app.use(errorHandler); // error handling. after all route

  const serverlessHandler = serverless(app);

  return { app, serverlessHandler };
}

export default getExpressApp;
