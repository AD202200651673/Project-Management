import type { Request, Response } from "express";
import { prisma } from "../prisma.js";

export const search = async (req: Request, res: Response): Promise<void> => {
  const { query } = req.query;
  try {
    const searchString = (query as string) || "";
    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { title: { contains: searchString, mode: "insensitive" } },
          { description: { contains: searchString, mode: "insensitive" } },
        ],
      },
    });

    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { name: { contains: searchString, mode: "insensitive" } },
          { description: { contains: searchString, mode: "insensitive" } },
        ],
      },
    });

    const users = await prisma.user.findMany({
      where: {
        OR: [{ username: { contains: searchString, mode: "insensitive" } }],
      },
    });
    res.json({ tasks, projects, users });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error performing search: ${error.message}` });
  }
};