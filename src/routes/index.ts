import express from "express";

import auth from "./auth";
import hello from "./hello.con";
import todo from "./todo.con";

const router = express.Router();

router.use("/auth", auth);
router.use("/todo", todo);
router.use("/", hello);

export default router;
