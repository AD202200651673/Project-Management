import type { Request, Response } from "express";
import { UserService } from "../services/userService.js";
import { asyncHandler } from "../middleware/errorMiddleware.js";

export const getUsers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const users = await UserService.getUsers();
  res.json(users);
});

export const getUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  const user = await UserService.getUserById(Number(userId));
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  res.json(user);
});

export const postUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { username, profilePictureUrl, teamId } = req.body ?? {};
  const newUser = await UserService.createUser({
    username,
    profilePictureUrl,
    teamId,
  });
  res.status(201).json({ message: "User Created Successfully", newUser });
});