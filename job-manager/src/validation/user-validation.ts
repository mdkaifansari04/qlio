import { CustomRequest } from "@src/types";
import Joi from "joi";
import { validateSchema } from "./schema-validation";
import { NextFunction, Response } from "express";

export const userValidation = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
  });

  validateSchema({ schema, req, next });
};
