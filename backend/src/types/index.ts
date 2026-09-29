import type { Request } from "express";

export interface AuthenticatedUserPayload {
  userId: number;
  username: string;
  email: string | null;
  teamId?: number | null;
  profilePictureUrl?: string | null;
  isEmailVerified?: boolean;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUserPayload;
}

export interface CreateTaskDTO {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  tags?: string;
  startDate?: string | Date | null;
  dueDate?: string | Date | null;
  points?: number | null;
  projectId: number;
  authorUserId: number;
  assignedUserId?: number | null;
}

export interface CreateProjectDTO {
  name: string;
  description?: string;
  startDate?: string | Date | null;
  endDate?: string | Date | null;
}

export interface CreateTeamDTO {
  teamName: string;
  productOwnerUserId?: number | null;
  projectManagerUserId?: number | null;
}
