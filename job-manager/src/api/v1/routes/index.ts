import { Router } from "express";
import userRouter from "./user/router";
import jobRouter from "./job/router";
import verifyUser from "@src/middleware/verify-user";
const router = Router();

router.use("/users", userRouter);
router.use("/jobs", verifyUser, jobRouter);

export default router;
