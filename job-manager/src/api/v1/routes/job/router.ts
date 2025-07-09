import { Router } from "express";
import * as Jobs from "@src/api/v1/controller/job.controller";
import { createJobValidation } from "@src/validation/job-valiation";
import verifyUser from "@src/middleware/verify-user";

const router = Router();

router.post("/", verifyUser, createJobValidation, Jobs.createJob);

export default router;
