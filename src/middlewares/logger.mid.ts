import { Request, Response, NextFunction } from "express";
import moment from "moment";

const getContent = (req: Request) => {
  if (req.method.toLowerCase() === "put") {
    return req.body;
  }
  if (req.method.toLowerCase() === "post") {
    return req.body;
  }
  return req.query;
};

const logger = (req: Request, res: Response, next: NextFunction) => {
  const time = moment().format("YYYY/MM/DD HH:mm");
  const method = req.method.toUpperCase();
  const url = req.originalUrl || "/";
  const content = JSON.stringify(getContent(req), null, 4);
  console.log(`${time} [${method}] (${url}):\n${content}`);
  next();
};

export default logger;
