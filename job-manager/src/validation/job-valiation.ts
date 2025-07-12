import Joi, { string } from "joi";
import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "@src/types";
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
