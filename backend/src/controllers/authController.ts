import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma.js";
import type { AuthRequest } from "../middleware/authMiddleware.js";

const JWT_SECRET = process.env.JWT_SECRET || "project_management_super_secure_jwt_secret_key_2026";
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"]) || "7d";

// 1. REGISTER
export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password, teamId } = req.body;

  if (!username || !email || !password) {
    res.status(400).json({ message: "Username, email, and password are required" });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Please provide a valid email address" });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ message: "Password must be at least 6 characters long" });
    return;
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      if (existingUser.username.toLowerCase() === username.toLowerCase()) {
        res.status(400).json({ message: "Username is already taken" });
        return;
      }
      if (existingUser.email?.toLowerCase() === email.toLowerCase()) {
        res.status(400).json({ message: "Email is already registered" });
        return;
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        teamId: teamId ? Number(teamId) : null,
        isEmailVerified: true,
        profilePictureUrl: "p1.jpeg",
      },
      select: {
        userId: true,
        username: true,
        email: true,
        isEmailVerified: true,
        teamId: true,
        profilePictureUrl: true,
      },
    });

    const token = jwt.sign(
      {
        userId: newUser.userId,
        username: newUser.username,
        email: newUser.email,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: "Registration successful!",
      token,
      user: newUser,
    });
  } catch (error: any) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: `Error registering user: ${error.message}` });
  }
};

// 2. LOGIN
export const login = async (req: Request, res: Response): Promise<void> => {
  const { usernameOrEmail, password } = req.body;

  if (!usernameOrEmail || !password) {
    res.status(400).json({ message: "Username/email and password are required" });
    return;
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: usernameOrEmail, mode: "insensitive" } },
          { username: { equals: usernameOrEmail, mode: "insensitive" } },
        ],
      },
    });

    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // If user has a password set, compare with bcrypt. If seeded without password, accept demo password "password123"
    let isPasswordValid = false;
    if (user.password) {
      isPasswordValid = await bcrypt.compare(password, user.password);
    } else if (password === "password123") {
      isPasswordValid = true;
    }

    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      {
        userId: user.userId,
        username: user.username,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        userId: user.userId,
        username: user.username,
        email: user.email,
        teamId: user.teamId,
        profilePictureUrl: user.profilePictureUrl,
        isEmailVerified: true,
      },
    });
  } catch (error: any) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: `Error logging in: ${error.message}` });
  }
};

// 3. GET CURRENT USER (ME)
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    res.status(200).json({ user: req.user });
  } catch (error: any) {
    console.error("Error fetching current user:", error);
    res.status(500).json({ message: `Error fetching user profile: ${error.message}` });
  }
};
