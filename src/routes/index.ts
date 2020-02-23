import express from "express";

import auth from "./auth";
import hello from "./hello.con";
import user from "./user.con";

const router = express.Router();

router.use("/auth", auth);
router.use("/user", user); // TODO: User is not a good example. Create a better one
router.use("/", hello);

export default router;
