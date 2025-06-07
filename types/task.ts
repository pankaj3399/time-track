import { Category } from "./category";

export type Task = {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  category: Category;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Tasks = Task[]; 