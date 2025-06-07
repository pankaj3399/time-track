import { MonthlyProgress } from "./tracker";

export type Category = {
  category: string;
  color: string;
  id?: string;
  monthlyProgress?: MonthlyProgress; // Monthly progress data for the category
};

export type Categories = Category[];
