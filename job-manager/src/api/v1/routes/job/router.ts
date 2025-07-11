import { Router } from "express";
import * as Jobs from "@src/api/v1/controller/job.controller";
import { createJobValidation } from "@src/validation/job-valiation";
import verifyUser from "@src/middleware/verify-user";

const router = Router();

router.post("/", verifyUser, createJobValidation, Jobs.createJob);
router.get("/", verifyUser, Jobs.getJobs);
router.get("/:id", verifyUser, Jobs.getJobById);
export default router;
