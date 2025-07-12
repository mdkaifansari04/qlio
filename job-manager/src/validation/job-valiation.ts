import { CustomRequest } from "@src/types";
import { NextFunction, Response } from "express";
import Joi from "joi";
import { validateSchema } from "./schema-validation";

export const createJobValidation = (
  req: CustomRequest,
  _res: Response,
  next: NextFunction,
) => {
  const schema = Joi.object({
    command: Joi.string().required(),
    timeout: Joi.number().required(),
    priority: Joi.number().required(),
    params: Joi.array().items(Joi.string().optional().allow("")).optional(),
  });

  validateSchema({ schema, req, next });
};
