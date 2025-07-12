import prisma from "@src/config/db";
import { NextFunction, Response } from "express";
import { CustomRequest } from "@src/types";
import ErrorResponse from "@src/middleware/error-response";
import bcrypt from "bcrypt";
import { constants as C } from "@src/utils/constants";
import jwt from "jsonwebtoken";
export const createUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, password } = req.value;
    const hashedPassword = await bcrypt.hash(password, C.SALT);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
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

export const userLogin = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.value;
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(new ErrorResponse("Invalid password", 401));
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "30d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: token,
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
