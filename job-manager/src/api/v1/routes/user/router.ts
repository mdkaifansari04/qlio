import { Router } from "express";
import * as User from "@src/api/v1/controller/user.controller";
import { userValidation } from "@src/validation/user-validation";

const router = Router();

router.post("/", userValidation, User.createUser);

export default router;
