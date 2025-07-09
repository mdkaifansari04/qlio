import { CustomRequest } from "@src/types";
import Joi from "joi";
import { validateSchema } from "./schema-validation";
import { NextFunction, Response } from "express";
const basicUserSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

export const userValidation = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const schema = Joi.object({
    name: Joi.string().required(),
  }).concat(basicUserSchema);

  validateSchema({ schema, req, next });
};

export const userLoginValidation = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const schema = Joi.object({}).concat(basicUserSchema);
  validateSchema({ schema, req, next });
};
