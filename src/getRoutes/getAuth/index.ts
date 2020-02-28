import { Router } from "express";

import getLogin from "./login.con";
import getRegister from "./register.con";
import { BaseUser } from "../../entities";

function getAuth<User extends BaseUser, UserType extends typeof BaseUser>(
  userModel: UserType
) {
  const router = Router();

  router.use("/login", getLogin<User, UserType>(userModel));
  router.use("/register", getRegister<User, UserType>(userModel));

  return router;
}

export default getAuth;
