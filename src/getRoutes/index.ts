import express from "express";

import getAuth from "./getAuth";
import getFiles from "./getFiles";
import { BaseUser } from "../entities";

function getRoutes<User extends BaseUser, UserType extends typeof BaseUser>(
  userModel: UserType
) {
  const router = express.Router();

  router.use("/auth", getAuth<User, UserType>(userModel));
  router.use("/files", getFiles(userModel));

  return router;
}

export default getRoutes;
