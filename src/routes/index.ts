import express from "express";

import hello from "./hello.controller";

const router = express.Router();

router.use("/", hello);

export default router;
