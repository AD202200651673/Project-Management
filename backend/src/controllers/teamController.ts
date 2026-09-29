import type { Request, Response } from "express";
import { prisma } from "../prisma.js";

export const getTeams = async (req: Request, res: Response): Promise<void> => {
  try {
    const teams = await prisma.team.findMany({
      include: {
        user: {
          select: {
            userId: true,
            username: true,
            email: true,
            profilePictureUrl: true,
          },
        },
      },
      orderBy: { id: "asc" },
    });

    const teamsWithUsernames = await Promise.all(
      teams.map(async (team: any) => {
        let productOwner = null;
        let projectManager = null;

        if (team.productOwnerUserId) {
          productOwner = await prisma.user.findUnique({
            where: { userId: team.productOwnerUserId },
            select: { username: true },
          });
        }

        if (team.projectManagerUserId) {
          projectManager = await prisma.user.findUnique({
            where: { userId: team.projectManagerUserId },
            select: { username: true },
          });
        }

        return {
          ...team,
          productOwnerUsername: productOwner?.username,
          projectManagerUsername: projectManager?.username,
        };
      })
    );

    res.json(teamsWithUsernames);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving teams: ${error.message}` });
  }
};

export const createTeam = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { teamName, productOwnerUserId, projectManagerUserId } = req.body ?? {};

  if (!teamName) {
    res.status(400).json({ message: "Team name is required" });
    return;
  }

  try {
    const newTeam = await prisma.team.create({
      data: {
        teamName,
        productOwnerUserId: productOwnerUserId ? Number(productOwnerUserId) : null,
        projectManagerUserId: projectManagerUserId
          ? Number(projectManagerUserId)
          : null,
      },
    });

    res.status(201).json(newTeam);
  } catch (error: any) {
    res.status(500).json({ message: `Error creating team: ${error.message}` });
  }
};

export const assignUserToTeam = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { teamId } = req.params;
  const { userId } = req.body;

  if (!userId) {
    res.status(400).json({ message: "User ID is required" });
    return;
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { userId: Number(userId) },
      data: {
        teamId: teamId ? Number(teamId) : null,
      },
    });

    res.json(updatedUser);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error assigning user to team: ${error.message}` });
  }
};