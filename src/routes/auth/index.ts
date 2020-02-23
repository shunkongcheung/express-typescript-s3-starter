import { Router } from "express";

import login from "./login.con";
import register from "./register.con";

const router = Router();

router.use("/login", login);
router.use("/register", register);

export default router;
