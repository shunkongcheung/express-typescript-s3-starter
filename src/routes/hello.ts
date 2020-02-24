import * as express from "express";
import { Request, Response, NextFunction } from "express";
import { query, matchedData } from "express-validator";

import { validateRequest } from "../middlewares";

const router = express.Router();

router.all("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "this is index page" });
  next();
});

router.get(
  "/test",
  [
    query("some-number").isNumeric(),
    query("some-string").isString(),
    query("errOut")
      .isIn(["throw", "next"])
      .optional()
  ],
  validateRequest,
  (req: Request, res: Response, next: NextFunction) => {
    const data = matchedData(req);
    if (data.errOut === "throw") throw "error format by throw error";
    if (data.errOut === "next") return next("error format by next error");
    res.json({ message: "nice you got it", data });
    next();
  }
);

export default router;
