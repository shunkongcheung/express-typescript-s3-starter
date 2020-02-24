import * as jwt from "jsonwebtoken";
import { Request, Response } from "express";

import { User } from "../entities";

const auth = async (req: Request, res: Response, next: any) => {
  const { JWT_SECRET = "" } = process.env;
  let token = req.header("Authorization") || "";

  token = token.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as User;
    if (!decoded) next("Unable to decode token");
    const { username } = decoded;
    const user = await User.findOne({ username });
    req.user = user as User;
    next();
  } catch (err) {
    next(err);
  }
};

export default auth;
