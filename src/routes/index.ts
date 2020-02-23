import express from "express";

import hello from "./hello.con";

const router = express.Router();

router.use("/", hello);

export default router;
