import ErrorResponse from "@src/middleware/error-response";
import { CustomRequest } from "@src/types";
import { NextFunction, Response } from "express";
import { Schema } from "joi";

export const validateSchema = ({
  schema,
  req,
  next,
}: {
  schema: Schema;
  req: CustomRequest;
  next: NextFunction;
}) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    console.error("Validation error ->", error.details);
    return next(
      new ErrorResponse(
        error.details.map((detail) => detail.message).join(", "),
        400,
      ),
    );
  }
  req.value = value;
  next();
};
