import { Request, Response, NextFunction } from "express";
import moment from "moment";

const getContent = (req: Request) => {
  if (req.method.toLowerCase() === "get") {
    return req.query;
  }
  return req.body;
};

const logger = (req: Request, res: Response, next: NextFunction) => {
  const time = moment().format("YYYY/MM/DD HH:mm");
  const method = req.method.toUpperCase();
  const url = req.originalUrl || "/";
  const content = JSON.stringify(getContent(req), null, 4);
  console.log(req);
  console.log(`${time} [${method}] (${url}):\n${content}`);
  next();
};

export default logger;
