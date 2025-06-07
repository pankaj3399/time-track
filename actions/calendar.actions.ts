"use server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { CalendarEvent } from "@/types/calendar";

export const calendarCreateAction = async (eventData: {
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  color: string;
  category: string;
  description: string;
  location: string;
  urls: string;
  notifyBefore: number;
  frequency: string;
  interval: number;
  byWeekday: string[];
  byMonthday: number[];
  byMonth: string[];
  startRecur: string;
  endRecur: string;
}) => {
  console.log("Starting calendar create action");
  console.log("Event data:", eventData);

  try {
    const session = await auth();
    console.log("Session:", session);

    if (!session?.user?.id) {
      return { status: false, data: "Unauthorized" };
    }

    // Validate required fields
    if (!eventData.title || !eventData.start) {
      return { status: false, data: "Title and start date are required" };
    }

    console.log("Creating calendar event...");
    const result = await prisma.calendar.create({
      data: {
        title: eventData.title,
        start: new Date(eventData.start),
        end: new Date(eventData.end),
        allDay: eventData.allDay || false,
        color: eventData.color || "#3174ad",
        category: eventData.category || "",
        description: eventData.description || "",
        location: eventData.location || "",
        urls: eventData.urls || "",
        notifyBefore: eventData.notifyBefore || 0,
        frequency: eventData.frequency || "",
        interval: eventData.interval || 1,
        byWeekday: eventData.byWeekday || [],
        byMonthday: eventData.byMonthday || [],
        byMonth: eventData.byMonth || [],
        startRecur: eventData.startRecur ? new Date(eventData.startRecur) : null,
        endRecur: eventData.endRecur ? new Date(eventData.endRecur) : null,
        userId: session.user.id,
      },
    });
    console.log("Calendar event created:", result);

    revalidatePath("/calendar");
    return { status: true, data: result };
  } catch (error) {
    console.error("Error creating calendar event:", error);
    return { 
      status: false, 
      data: error instanceof Error ? error.message : "Failed to create event" 
    };
  }
};

export const calendarUpdateAction = async ({
  id,
  ...eventData
}: {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  color: string;
  category: string;
  description: string;
  location: string;
  urls: string;
  notifyBefore: number;
  frequency: string;
  interval: number;
  byWeekday: string[];
  byMonthday: number[];
  byMonth: string[];
  startRecur: string;
  endRecur: string;
}) => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { status: false, data: "Unauthorized" };
    }

    // Validate required fields
    if (!eventData.title || !eventData.start) {
      return { status: false, data: "Title and start date are required" };
    }

    console.log("Creating calendar event...");
    const result = await prisma.calendar.update({
      where: { 
        id,
        userId: session.user.id
      },
      data: {
        title: eventData.title,
        start: new Date(eventData.start),
        end: new Date(eventData.end),
        allDay: eventData.allDay || false,
        color: eventData.color || "#3174ad",
        category: eventData.category || "",
        description: eventData.description || "",
        location: eventData.location || "",
        urls: eventData.urls || "",
        notifyBefore: eventData.notifyBefore || 0,
        frequency: eventData.frequency || "",
        interval: eventData.interval || 1,
        byWeekday: eventData.byWeekday || [],
        byMonthday: eventData.byMonthday || [],
        byMonth: eventData.byMonth || [],
        startRecur: eventData.startRecur ? new Date(eventData.startRecur) : null,
        endRecur: eventData.endRecur ? new Date(eventData.endRecur) : null,
      },
    });

    revalidatePath("/calendar");
    return { status: true, data: result };
  } catch (error) {
    console.error("Error updating calendar event:", error);
    return { 
      status: false, 
      data: error instanceof Error ? error.message : "Failed to update event" 
    };
  }
};

export const calendarDeleteAction = async ({ 
  id, 
  deleteType = "current" 
}: { 
  id: string;
  deleteType?: "current" | "current-and-future" | "all";
}) => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { status: false, data: "Unauthorized" };
    }

    // Get the event to check if it's recurring
    const event = await prisma.calendar.findUnique({
      where: { 
        id,
        userId: session.user.id
      }
    });

    if (!event) {
      return { status: false, data: "Event not found" };
    }

    if (deleteType === "current") {
      // Delete only this specific event
      await prisma.calendar.delete({
        where: { 
          id,
          userId: session.user.id
        },
      });
    } else if (deleteType === "current-and-future" && event.frequency) {
      // For recurring events, update the endRecur date to the current event's date
      await prisma.calendar.update({
        where: { 
          id,
          userId: session.user.id
        },
        data: {
          endRecur: event.start
        }
      });
    } else if (deleteType === "all" && event.frequency) {
      // Delete all instances of the recurring event
      await prisma.calendar.deleteMany({
        where: {
          AND: [
            { userId: session.user.id },
            { frequency: event.frequency },
            { interval: event.interval },
            { byWeekday: { hasEvery: event.byWeekday } },
            { byMonthday: { hasEvery: event.byMonthday } },
            { byMonth: { hasEvery: event.byMonth } }
          ]
        }
      });
    }

    revalidatePath("/calendar");
    return { status: true, data: "Event(s) deleted successfully" };
  } catch (error) {
    console.error("Error deleting calendar event:", error);
    return { 
      status: false, 
      data: error instanceof Error ? error.message : "Failed to delete event" 
    };
  }
};

export const getTasks = async () => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { status: false, data: "Unauthorized" };
    }

    const tasks = await prisma.calendar.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        start: "asc",
      },
    });

    // Transform tasks to match calendar component format
    const transformedTasks = tasks.map(task => {
      const baseTask: CalendarEvent = {
        id: task.id,
        title: task.title,
        start: task.start.toISOString(),
        end: task.end.toISOString(),
        allDay: task.allDay,
        color: task.color || undefined,
        backgroundColor: task.color || undefined,
        extendedProps: {
          category: task.category || undefined,
          location: task.location || undefined,
          description: task.description || undefined,
          urls: task.urls || undefined,
          notifyBefore: task.notifyBefore || undefined,
        }
      };

      // Add recurring event properties if frequency exists
      if (task.frequency) {
        const frequencyMap: { [key: string]: "daily" | "weekly" | "monthly" | "yearly" } = {
          'day': 'daily',
          'week': 'weekly',
          'month': 'monthly',
          'year': 'yearly'
        };

        const rrule = {
          freq: frequencyMap[task.frequency.toLowerCase()] || 'weekly',
          interval: task.interval || undefined,
          byweekday: task.byWeekday?.map(day => day.toLowerCase().substring(0, 2)),
          dtstart: task.start ? task.start.toISOString() : undefined,
          until: task.end ? task.end.toISOString() : undefined,
        };

        return {
          ...baseTask,
          rrule,
          daysOfWeek: task.byWeekday?.map(day => {
            const dayMap: { [key: string]: number } = {
              'monday': 1, 'tuesday': 2, 'wednesday': 3,
              'thursday': 4, 'friday': 5, 'saturday': 6, 'sunday': 0
            };
            return dayMap[day.toLowerCase()] || 0;
          }),
        };
      }

      return baseTask;
    });
    

    console.log(tasks,transformedTasks)

    return { status: true, data: transformedTasks };
  } catch (error) {
    console.error("Error fetching calendar tasks:", error);
    return { 
      status: false, 
      data: error instanceof Error ? error.message : "Failed to fetch tasks" 
    };
  }
};