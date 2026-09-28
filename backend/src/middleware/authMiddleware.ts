import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma.js";

export interface JwtPayload {
  userId: number;
  username: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    username: string;
    email: string | null;
    teamId: number | null;
    profilePictureUrl: string | null;
  };
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    if (!token) {
      res.status(401).json({ message: "Access token is required" });
      return;
    }

    const secret = process.env.JWT_SECRET || "project_management_super_secure_jwt_secret_key_2026";
    const decoded = jwt.verify(token, secret) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: { userId: decoded.userId },
      select: {
        userId: true,
        username: true,
        email: true,
        teamId: true,
        profilePictureUrl: true,
        isEmailVerified: true,
      },
    });

    if (!user) {
      res.status(401).json({ message: "User not found or token is invalid" });
      return;
    }

    req.user = user;
    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      res.status(401).json({ message: "Token has expired, please log in again" });
      return;
    }
    res.status(403).json({ message: "Invalid access token" });
  }
};
