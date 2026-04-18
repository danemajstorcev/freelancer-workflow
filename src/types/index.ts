export type ClientStatus = "Lead" | "Contacted" | "Negotiation" | "Closed";
export type ProjectStatus =
  | "Not Started"
  | "In Progress"
  | "Review"
  | "Completed"
  | "On Hold";
export type TaskStatus = "Todo" | "In Progress" | "Done";
export type Priority = "Low" | "Medium" | "High";

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: ClientStatus;
  tags: string[];
  value: number;
  notes: string;
  createdAt: string;
  avatarColor: string;
}

export interface Project {
  id: string;
  clientId: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: Priority;
  budget: number;
  deadline: string;
  createdAt: string;
  tags: string[];
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  notes: string;
  status: TaskStatus;
  priority: Priority;
  dueDate: string;
  createdAt: string;
}

export interface AppState {
  clients: Client[];
  projects: Project[];
  tasks: Task[];
}

export type AppAction =
  | { type: "ADD_CLIENT"; payload: Client }
  | { type: "UPDATE_CLIENT"; payload: Client }
  | { type: "DELETE_CLIENT"; payload: string }
  | { type: "MOVE_CLIENT"; payload: { id: string; status: ClientStatus } }
  | { type: "ADD_PROJECT"; payload: Project }
  | { type: "UPDATE_PROJECT"; payload: Project }
  | { type: "DELETE_PROJECT"; payload: string }
  | { type: "ADD_TASK"; payload: Task }
  | { type: "UPDATE_TASK"; payload: Task }
  | { type: "DELETE_TASK"; payload: string }
  | { type: "MOVE_TASK"; payload: { id: string; status: TaskStatus } };
