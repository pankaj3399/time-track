"use client";
import React, { useState } from "react";
import { today, getLocalTimeZone, CalendarDate } from "@internationalized/date";
import { Button } from "@heroui/react";

interface ProgressCalendarProps {
  progress: any;
  selectedDate: CalendarDate;
  onDateChange: (date: CalendarDate) => void;
}

export const ProgressCalendar = ({ progress, selectedDate, onDateChange }: ProgressCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(selectedDate);

  const handlePreviousMonth = () => {
    const newDate = currentDate.subtract({ months: 1 });
    setCurrentDate(newDate);
    onDateChange(newDate);
  };

  const handleNextMonth = () => {
    const newDate = currentDate.add({ months: 1 });
    setCurrentDate(newDate);
    onDateChange(newDate);
  };

  const getTaskCompletionForDate = (date: CalendarDate) => {
    const year = date.year;
    const month = date.month;
    const day = date.day;
    const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    
    return progress?.[year]?.[month]?.tasksDoneEachDay?.[dateStr] || 0;
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month - 1, 1).getDay();
  };

  const renderCalendar = () => {
    const year = currentDate.year;
    const month = currentDate.month;
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new CalendarDate(year, month, day);
      const tasksDone = getTaskCompletionForDate(date);
      const intensity = Math.min(tasksDone / 5, 1);
      
      days.push(
        <div
          key={day}
          className={`h-10 flex items-center justify-center rounded cursor-pointer hover:bg-gray-100 ${
            tasksDone > 0 ? 'bg-green-200' : ''
          }`}
          style={{
            backgroundColor: tasksDone > 0 ? `rgba(34, 197, 94, ${intensity})` : 'transparent'
          }}
          onClick={() => onDateChange(date)}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Button onClick={handlePreviousMonth}>Previous Month</Button>
        <h2 className="text-xl font-semibold">
          {currentDate.toDate(getLocalTimeZone()).toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <Button onClick={handleNextMonth}>Next Month</Button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-semibold py-2">
            {day}
          </div>
        ))}
        {renderCalendar()}
      </div>
    </div>
  );
};
