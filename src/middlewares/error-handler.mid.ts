import { Request, Response, NextFunction } from "express";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err) {
    return res.status(500).json({ errors: [{ msg: err }] });
  }
  next();
};

export default errorHandler;
