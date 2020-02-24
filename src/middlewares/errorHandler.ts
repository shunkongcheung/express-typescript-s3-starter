import { Request, Response, NextFunction } from "express";
import getContentDesc from "./getContentDesc";

const getErrorMessage = (error: Error) => {
  if (!error) return "";
  if (typeof error === "string") return error;
  return JSON.stringify(error, null, 4);
};

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err) {
    console.error(getContentDesc(req, getErrorMessage(err)));
    return res.status(500).json({ errors: [{ msg: err }] });
  }
  next();
};

export default errorHandler;
