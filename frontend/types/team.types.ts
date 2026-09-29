import { User } from "./user.types";

export interface Team {
  id: number;
  teamName: string;
  productOwnerUserId?: number;
  projectManagerUserId?: number;
  productOwnerUsername?: string;
  projectManagerUsername?: string;
  user?: User[];
}
