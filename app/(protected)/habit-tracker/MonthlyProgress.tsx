"use client";
import { ProgressCalendar } from "@/components/HabitTracker/ProgressCalendar";
import React from "react";
import { CalendarDate } from "@internationalized/date";
import { Calendar, TrendingUp } from "lucide-react";

interface ProgressData {
  [year: number]: {
    [month: number]: {
      dailyNotes: {
        [date: string]: {
          date: string;
          content: string;
          tags: string[];
        };
      };
      expectedTasksNum: number;
      finishedTasksNum: number;
      completeAllStreak: number;
      tasksDoneEachDay: {
        [date: string]: number;
      };
    };
  };
}

interface Habit {
  id: string;
  title: string;
  description: string;
  category: string;
  color: string;
  completions: {
    id: string;
    date: Date;
    notes: string | null;
  }[];
  memos: {
    id: string;
    content: string;
    date: Date;
    tags: string[];
  }[];
}

interface MonthlyProgressProps {
  progress: ProgressData;
  selectedDate: CalendarDate;
  onDateChange: (date: CalendarDate) => void;
  onCompleteHabit: (
    habitId: string,
    date: Date,
    notes?: string,
  ) => Promise<void>;
  habits: Habit[];
}

export const MonthlyProgress: React.FC<MonthlyProgressProps> = ({
  progress,
  selectedDate,
  onDateChange,
  onCompleteHabit,
  habits,
}) => {
  const color = habits.length > 0 ? habits[0].color : "#1E90FF";

  // Calculate quick stats for this month
  const year = selectedDate.year;
  const month = selectedDate.month;
  const monthData = progress?.[year]?.[month];
  const activeDays = monthData
    ? Object.keys(monthData.tasksDoneEachDay).length
    : 0;
  const totalCompletions = monthData
    ? Object.values(monthData.tasksDoneEachDay).reduce(
        (sum, count) => sum + count,
        0,
      )
    : 0;

  return (
    <div className="space-y-6">
      {/* Header with Quick Stats */}
      <div className="bg-gradient-to-r from-gray-800/40 to-gray-700/40 backdrop-blur-sm rounded-xl p-4 border border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Calendar className="w-6 h-6 text-blue-400" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h3 className="font-semibold text-white">Monthly Progress</h3>
              <p className="text-sm text-gray-400">
                Track your daily habit completions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="flex items-center gap-1 text-blue-400 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-medium">Active Days</span>
              </div>
              <p className="text-xl font-bold text-white">{activeDays}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1 text-green-400 mb-1">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: color }}
                ></div>
                <span className="text-xs font-medium">Completions</span>
              </div>
              <p className="text-xl font-bold text-white">{totalCompletions}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="relative">
        <ProgressCalendar
          progress={progress}
          selectedDate={selectedDate}
          onDateChange={onDateChange}
          color={color}
        />

        {/* Floating indicator for current habits */}
        <div className="absolute top-4 right-4 bg-gray-900/80 backdrop-blur-sm rounded-lg p-3 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-300">
              Active Habits
            </span>
          </div>
          <div className="flex gap-1">
            {habits.slice(0, 3).map((habit, index) => (
              <div
                key={habit.id}
                className="w-3 h-3 rounded-full border border-white/20 shadow-sm"
                style={{ backgroundColor: habit.color }}
                title={habit.title}
              />
            ))}
            {habits.length > 3 && (
              <div className="w-3 h-3 rounded-full bg-gray-600 flex items-center justify-center">
                <span className="text-xs text-white font-bold">
                  +{habits.length - 3}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
