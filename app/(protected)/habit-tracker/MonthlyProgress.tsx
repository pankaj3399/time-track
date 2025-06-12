import { ProgressCalendar } from "@/components/HabitTracker/ProgressCalendar";
import React from "react";
import { CalendarDate } from "@internationalized/date";

interface MonthlyProgressProps {
  progress: any;
  selectedDate: CalendarDate;
  onDateChange: (date: CalendarDate) => void;
}

export const MonthlyProgress = ({ progress, selectedDate, onDateChange }: MonthlyProgressProps) => {
  return (
    <ProgressCalendar 
      progress={progress} 
      selectedDate={selectedDate} 
      onDateChange={onDateChange}
    />
  );
};
