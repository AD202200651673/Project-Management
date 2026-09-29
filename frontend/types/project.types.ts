import { Task } from "./task.types";

export interface Project {
  id: number;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  tasks?: Task[];
}
