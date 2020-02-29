import express from "express";
import { BaseEntity } from "typeorm";

import getAuth from "./getAuth";
import getFiles from "./getFiles";
import { BaseUser } from "../entities";

function getRoutes<
  U extends BaseUser,
  UT extends typeof BaseUser,
  F extends typeof BaseEntity
>(userModel: UT, fileModel?: F) {
  const router = express.Router();

  router.use("/auth", getAuth<U, UT>(userModel));
  if (fileModel) router.use("/files", getFiles(userModel, fileModel));

  return router;
}

export default getRoutes;
