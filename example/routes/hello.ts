import * as express from "express";
import { Request, Response, NextFunction } from "express";

const router = express.Router();

router.all("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "this is an example of index page" });
  next();
});

export default router;
