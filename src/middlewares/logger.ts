import { Request, Response, NextFunction } from "express";
import getContentDesc from "./getContentDesc";

const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(getContentDesc(req));
  next();
};

export default logger;
