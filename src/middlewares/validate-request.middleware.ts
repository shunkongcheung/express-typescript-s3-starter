import { validationResult } from "express-validator";
import { Request, Response } from "express";

const validateRequest = (req: Request, res: Response, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  return next();
};
export default validateRequest;
