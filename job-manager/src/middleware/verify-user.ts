import { NextFunction, Request, Response } from "express";
import prisma from "@src/config/db";
import jwt, { JwtPayload } from "jsonwebtoken";
import { CustomRequest } from "@src/types";
import ErrorResponse from "./error-response";

const verifyUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return next(new ErrorResponse("Token not found", 401));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return next(new ErrorResponse("Unauthorized", 401));
    }

    req.userId = user.id;
    next();
  } catch (error) {
    return next(new ErrorResponse("Unauthorized Invalid token", 401));
  }
};

export default verifyUser;
