export * from "./task.types";
export * from "./project.types";
export * from "./user.types";
export * from "./team.types";

import { Task } from "./task.types";
import { Project } from "./project.types";
import { User } from "./user.types";

export interface SearchResults {
  tasks?: Task[];
  projects?: Project[];
  users?: User[];
}
