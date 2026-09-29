import { prisma } from "../prisma.js";

export class TeamService {
  static async getTeams() {
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

    return Promise.all(
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
  }

  static async createTeam(data: {
    teamName: string;
    productOwnerUserId?: number | null;
    projectManagerUserId?: number | null;
  }) {
    return prisma.team.create({
      data: {
        teamName: data.teamName,
        productOwnerUserId: data.productOwnerUserId
          ? Number(data.productOwnerUserId)
          : null,
        projectManagerUserId: data.projectManagerUserId
          ? Number(data.projectManagerUserId)
          : null,
      },
    });
  }

  static async assignUserToTeam(teamId: number, userId: number) {
    return prisma.user.update({
      where: { userId },
      data: {
        teamId: teamId ? Number(teamId) : null,
      },
    });
  }
}
