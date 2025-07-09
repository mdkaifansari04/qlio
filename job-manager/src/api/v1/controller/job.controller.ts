import { CustomRequest } from "@src/types";
import client from "@src/config/db";
import { NextFunction, Response } from "express";
import ErrorResponse from "@src/middleware/error-response";

export const createJob = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { command, timeout, priority, params } = req.value;
    const job = await client.jobs.create({
      data: {
        command: command as string,
        userId: req.userId,
        timeout,
        priority,
        params,
      },
    });

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: job,
    });
  } catch (error) {
    next(new ErrorResponse(`Internal server error : ${error}`, 500));
  }
};
