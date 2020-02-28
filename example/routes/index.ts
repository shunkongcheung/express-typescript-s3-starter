import express from "express";

import hello from "./hello";
import todos from "./todos";

const router = express.Router();

router.use("/todos", todos);
router.use("/", hello);

export default router;
