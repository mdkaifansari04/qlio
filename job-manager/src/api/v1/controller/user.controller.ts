import prisma from "@src/config/db";
import { NextFunction, Response } from "express";
import { CustomRequest } from "@src/types";
import ErrorResponse from "@src/middleware/error-response";

export const createUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, password } = req.value;
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    next(new ErrorResponse(`Internal server error : ${error}`, 500));
  }
};

export const getUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await prisma.user.findMany();
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: user,
    });
  } catch (error) {
    next(new ErrorResponse(`Internal server error : ${error}`, 500));
  }
};
