export type CalendarEvent = {
  // Basic identifiers
  id?: string;
  groupId?: string; // To group recurring/related events
  title: string;

  // Timing
  start?: string | Date;
  end?: string | Date;
  allDay?: boolean;
  duration?: string; // "02:00", "01:30:00", etc.

  // Recurrence
  daysOfWeek?: number[]; // [0 (Sun) - 6 (Sat)]
  startRecur?: string; // For recurring events
  endRecur?: string;
  rrule?: {
    freq: "daily" | "weekly" | "monthly" | "yearly";
    interval?: number;
    byweekday?: string[] | number[];
    dtstart?: string;
    until?: string;
    count?: number;
    bymonth?: number[];
    bymonthday?: number[];
    byhour?: number[];
    byminute?: number[];
    bysecond?: number[];
    tzid?: string;
  };
  exdate?: (string | Date)[]; // Excluded dates

  // Appearance
  className?: string | string[];
  color?: string; // Main color shorthand
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  display?:
    | "auto"
    | "block"
    | "list-item"
    | "background"
    | "inverse-background"
    | "none";

  // Editing
  editable?: boolean;
  startEditable?: boolean;
  durationEditable?: boolean;
  resourceEditable?: boolean;

  // Interactions
  overlap?: boolean;
  constraint?: string | object;

  // URLs & links
  url?: string;

  // Resource associations (optional)
  resourceId?: string;
  resourceIds?: string[];

  // Custom user-defined fields
  extendedProps?: {
    [key: string]: any;
    description?: string;
    location?: string;
    category?: string;
    priority?: string;
    status?: string;
  };
};
