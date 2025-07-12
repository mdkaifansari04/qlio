import { CustomRequest } from "@src/types";
import client from "@src/config/db";
import { NextFunction, Response } from "express";
import ErrorResponse from "@src/middleware/error-response";
import axios from "axios";

export const createJob = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { command, timeout, priority, params } = req.value;
    const job = await client.job.create({
      data: {
        command: command as string,
        userId: req.userId,
        timeout,
        priority,
        params,
      },
    });

    axios
      .get(`${process.env.JOB_WORKER_URL}/wake-up`)
      .then((res) => {
        console.log("wake-up", res.data);
      })
      .catch((err) => {
        console.log("error", err);
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

export const getJobs = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const jobs = await client.job.findMany({
      where: {
        userId: req.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      message: "Jobs fetched successfully",
      data: jobs,
    });
  } catch (error) {
    next(new ErrorResponse(`Internal server error : ${error}`, 500));
  }
};

export const getJobById = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const job = await client.job.findUnique({
      where: {
        id,
        userId: req.userId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Job fetched successfully",
      data: job,
    });
  } catch (error) {
    next(new ErrorResponse(`Internal server error : ${error}`, 500));
  }
};
