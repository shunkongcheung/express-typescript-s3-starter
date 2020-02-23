import * as express from "express";
import { Request, Response, NextFunction } from "express";

const router = express.Router();

router.all("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "this is index page" });
  next();
});

router.get("/throw-error", () => {
  throw "error format by throw error";
});
router.get("/next-error", (req: Request, res: Response, next: NextFunction) => {
  next("error format by next");
});

export default router;
