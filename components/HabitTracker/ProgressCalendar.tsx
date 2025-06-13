"use client";
import React, { useState } from "react";
import { today, getLocalTimeZone, CalendarDate } from "@internationalized/date";
import { Button } from "@heroui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProgressCalendarProps {
  progress: any;
  selectedDate: CalendarDate;
  onDateChange: (date: CalendarDate) => void;
  color: string;
}

export const ProgressCalendar = ({
  progress,
  selectedDate,
  onDateChange,
  color,
}: ProgressCalendarProps) => {
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
    const dateStr = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

    return progress?.[year]?.[month]?.tasksDoneEachDay?.[dateStr] || 0;
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month - 1, 1).getDay();
  };

  const isToday = (date: CalendarDate) => {
    const todayDate = today(getLocalTimeZone());
    return (
      date.year === todayDate.year &&
      date.month === todayDate.month &&
      date.day === todayDate.day
    );
  };

  const isSelected = (date: CalendarDate) => {
    return (
      date.year === selectedDate.year &&
      date.month === selectedDate.month &&
      date.day === selectedDate.day
    );
  };

  const renderCalendar = () => {
    const year = currentDate.year;
    const month = currentDate.month;
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-12 w-12"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new CalendarDate(year, month, day);
      const tasksDone = getTaskCompletionForDate(date);
      const intensity = Math.min(tasksDone / 5, 1);
      const today = isToday(date);
      const selected = isSelected(date);

      days.push(
        <div
          key={day}
          className={`
            h-12 w-12 flex items-center justify-center rounded-lg cursor-pointer
            transition-all duration-200 hover:scale-105 hover:shadow-md
            relative group font-medium text-sm
            ${
              selected
                ? "ring-2 ring-blue-400 ring-offset-2 ring-offset-black/5"
                : ""
            }
            ${
              today ? "border-2 border-yellow-400" : "border border-gray-200/20"
            }
            ${
              tasksDone > 0
                ? "shadow-lg transform hover:scale-110"
                : "hover:bg-gray-100/10"
            }
          `}
          style={{
            backgroundColor:
              tasksDone > 0
                ? `${hexToRgba(color, Math.max(intensity, 0.3))}`
                : "rgba(255, 255, 255, 0.02)",
            color: tasksDone > 0 ? getContrastColor(color) : "inherit",
          }}
          onClick={() => onDateChange(date)}
        >
          <span className="relative z-10">{day}</span>
          {tasksDone > 0 && (
            <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold shadow-md">
              {tasksDone > 9 ? "9+" : tasksDone}
            </div>
          )}
          {today && (
            <div className="absolute inset-0 border-2 border-yellow-400 rounded-lg animate-pulse"></div>
          )}

          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20">
            {tasksDone > 0
              ? `${tasksDone} task${tasksDone > 1 ? "s" : ""} completed`
              : "No tasks completed"}
          </div>
        </div>,
      );
    }

    return days;
  };

  // Helper to convert hex color to rgba
  function hexToRgba(hex: string, alpha: number) {
    let c: any;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split("");
      if (c.length == 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c = "0x" + c.join("");
      return (
        "rgba(" +
        [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",") +
        "," +
        alpha +
        ")"
      );
    }
    return hex;
  }

  // Helper to get contrasting text color
  function getContrastColor(hex: string) {
    if (!/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) return "#000000";

    const c = hex.substring(1).split("");
    const fullHex =
      c.length === 3
        ? [c[0], c[0], c[1], c[1], c[2], c[2]].join("")
        : c.join("");
    const r = parseInt(fullHex.substr(0, 2), 16);
    const g = parseInt(fullHex.substr(2, 2), 16);
    const b = parseInt(fullHex.substr(4, 2), 16);

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? "#000000" : "#ffffff";
  }

  const monthName = currentDate
    .toDate(getLocalTimeZone())
    .toLocaleString("default", { month: "long", year: "numeric" });

  return (
    <div className="bg-gradient-to-br from-gray-50/5 to-gray-100/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePreviousMonth}
          className="flex items-center gap-2 hover:bg-white/10 transition-all duration-200"
        >
          <ChevronLeft size={16} />
          Previous
        </Button>

        <div className="text-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {monthName}
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mx-auto mt-2"></div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleNextMonth}
          className="flex items-center gap-2 hover:bg-white/10 transition-all duration-200"
        >
          Next
          <ChevronRight size={16} />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="space-y-4">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center font-semibold py-3 text-gray-400 text-sm tracking-wider"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">{renderCalendar()}</div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t border-white/10">
        <span className="text-sm text-gray-400">Less</span>
        <div className="flex gap-1">
          {[0, 0.25, 0.5, 0.75, 1].map((intensity, index) => (
            <div
              key={index}
              className="w-3 h-3 rounded-sm border border-white/20"
              style={{
                backgroundColor:
                  intensity === 0
                    ? "rgba(255, 255, 255, 0.1)"
                    : hexToRgba(color, intensity),
              }}
            />
          ))}
        </div>
        <span className="text-sm text-gray-400">More</span>
      </div>
    </div>
  );
};
