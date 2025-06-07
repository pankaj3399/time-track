"use client";
import React from "react";
import { Calendar } from "@heroui/react";
import { today, getLocalTimeZone } from "@internationalized/date";

export const ProgressCalendar = (props: any) => {
  return (
    <>
      <Calendar
        showMonthAndYearPickers
        isReadOnly
        aria-label="Date (Read Only)"
        focusedValue={today(getLocalTimeZone())}
        calendarWidth={1000}
      />
    </>
  );
};
