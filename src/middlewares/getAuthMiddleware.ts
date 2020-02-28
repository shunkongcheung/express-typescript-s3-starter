import * as jwt from "jsonwebtoken";
import { Request, Response } from "express";

import { BaseUser } from "../entities";

function getAuthMiddleware<
  User extends BaseUser,
  UserType extends typeof BaseUser
>(userModel: UserType) {
  return async (req: Request, res: Response, next: any) => {
    const { JWT_SECRET = "" } = process.env;
    let token = req.header("Authorization") || "";

    token = token.replace("Bearer ", "");

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as User;
      if (!decoded) next("Unable to decode token");
      const { username } = decoded;
      const user = await userModel.findOne({ username });
      (req as any).user = user as User;
      next();
    } catch (err) {
      next(err);
    }
  };
}

export default getAuthMiddleware;
