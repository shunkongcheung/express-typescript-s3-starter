import express from "express";

import auth from "./auth";
import hello from "./hello.con";

const router = express.Router();

router.use("/auth", auth);
router.use("/", hello);

export default router;
