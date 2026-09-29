import type { Request, Response } from "express";
import { TeamService } from "../services/teamService.js";
import { asyncHandler } from "../middleware/errorMiddleware.js";

export const getTeams = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const teamsWithUsernames = await TeamService.getTeams();
  res.json(teamsWithUsernames);
});

export const createTeam = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { teamName, productOwnerUserId, projectManagerUserId } = req.body ?? {};

  if (!teamName) {
    res.status(400).json({ message: "Team name is required" });
    return;
  }

  const newTeam = await TeamService.createTeam({
    teamName,
    productOwnerUserId,
    projectManagerUserId,
  });

  res.status(201).json(newTeam);
});

export const assignUserToTeam = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { teamId } = req.params;
  const { userId } = req.body ?? {};

  if (!userId) {
    res.status(400).json({ message: "User ID is required" });
    return;
  }

  const updatedUser = await TeamService.assignUserToTeam(
    Number(teamId),
    Number(userId)
  );

  res.json(updatedUser);
});