import { NextFunction, Request, Response } from "express";
import prisma from "@src/config/db";
import jwt, { JwtPayload } from "jsonwebtoken";
import { CustomRequest } from "@src/types";

const verifyUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.startsWith("Bearer")
    ? req.headers.authorization.split(" ")[1]
    : null;
  if (!token) {
    return res.status(401).json({ message: "Token not found" });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  req.userId = user.id;
  next();
};

export default verifyUser;
