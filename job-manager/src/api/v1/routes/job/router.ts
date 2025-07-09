import { Router } from "express";
import * as Jobs from "@src/api/v1/controller/job.controller";
import { createJobValidation } from "@src/validation/job-valiation";

const router = Router();

router.post("/", createJobValidation, Jobs.createJob);

export default router;
