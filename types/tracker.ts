import { Categories } from "./category";
export interface DailyNote {
  date: string; // Format: YYYY-MM-DD
  content: string;
  tags?: string[];
}

export interface MonthlyProgress {
  [year: number]: {
    [month: number]: {
      dailyNotes: {
        [date: string]: DailyNote;
      };
      expectedTasksNum: number; // Total Number of tasks expected to be completed in this month
      finishedTasksNum: number; // Total Number of tasks completed in this month
      completeAllStreak: number; // Streak of completing all tasks in a month
      tasksDoneEachDay: {
        [date: string]: number; // Number of tasks done each day
      };
    };
  };
}

export interface Tracker {
  categories: Categories;
}
