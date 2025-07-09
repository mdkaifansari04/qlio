import Joi from "joi";
import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "@src/types";
import { validateSchema } from "./schema-validation";

export const createJobValidation = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const schema = Joi.object({
    command: Joi.string().required(),
  });

  validateSchema({ schema, req, next });
};
