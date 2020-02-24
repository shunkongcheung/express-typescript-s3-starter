import express from "express";

import auth from "./auth";
import hello from "./hello";
import todos from "./todos";

const router = express.Router();

router.use("/auth", auth);
router.use("/todos", todos);
router.use("/", hello);

export default router;
