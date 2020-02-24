import { validationResult } from "express-validator";
import { Request, Response } from "express";
import getContentDesc from "./getContentDesc";

const validateRequest = (req: Request, res: Response, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Note: do not call next(). the action will fail if data is not correct
    console.error(getContentDesc(req, JSON.stringify(errors.array(), null, 4)));
    return res.status(400).json({ errors: errors.array() });
  }

  return next();
};
export default validateRequest;
