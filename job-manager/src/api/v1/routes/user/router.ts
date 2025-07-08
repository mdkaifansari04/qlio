import { Router } from "express";
import * as User from "@src/api/v1/controller/user.controller";

const router = Router();

router.get("/", User.createUser);

export default router;
