"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Habit Actions
export const createHabit = async ({
  title,
  description,
  color,
  category,
  frequency,
  targetCount,
}: {
  title: string;
  description?: string;
  color?: string;
  category: string;
  frequency?: string;
  targetCount?: number;
}) => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { status: false, data: "Unauthorized" };
    }

    const habit = await prisma.habit.create({
      data: {
        title,
        description,
        color: color || "#1E90FF",
        category,
        frequency: frequency || "daily",
        targetCount: targetCount || 1,
        userId: session.user.id,
      },
    });

    revalidatePath("/habit-tracker");
    return { status: true, data: habit };
  } catch (error) {
    console.error("Error creating habit:", error);
    return { status: false, data: "Failed to create habit" };
  }
};

export const updateHabit = async ({
  id,
  title,
  description,
  color,
  category,
  frequency,
  targetCount,
}: {
  id: string;
  title?: string;
  description?: string;
  color?: string;
  category?: string;
  frequency?: string;
  targetCount?: number;
}) => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { status: false, data: "Unauthorized" };
    }

    const habit = await prisma.habit.update({
      where: {
        id,
        userId: session.user.id,
      },
      data: {
        title,
        description,
        color,
        category,
        frequency,
        targetCount,
      },
    });

    revalidatePath("/habit-tracker");
    return { status: true, data: habit };
  } catch (error) {
    console.error("Error updating habit:", error);
    return { status: false, data: "Failed to update habit" };
  }
};

export const deleteHabit = async (id: string) => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { status: false, data: "Unauthorized" };
    }

    await prisma.habit.delete({
      where: {
        id,
        userId: session.user.id,
      },
    });

    revalidatePath("/habit-tracker");
    return { status: true, data: "Habit deleted successfully" };
  } catch (error) {
    console.error("Error deleting habit:", error);
    return { status: false, data: "Failed to delete habit" };
  }
};

export const getHabits = async () => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { status: false, data: "Unauthorized" };
    }

    const habits = await prisma.habit.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        completions: true,
        memos: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { status: true, data: habits };
  } catch (error) {
    console.error("Error fetching habits:", error);
    return { status: false, data: "Failed to fetch habits" };
  }
};

// Habit Completion Actions
export const completeHabit = async ({
  habitId,
  date,
  count,
  notes,
}: {
  habitId: string;
  date: Date;
  count?: number;
  notes?: string;
}) => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { status: false, data: "Unauthorized" };
    }

    // Verify habit belongs to user
    const habit = await prisma.habit.findFirst({
      where: {
        id: habitId,
        userId: session.user.id,
      },
    });

    if (!habit) {
      return { status: false, data: "Habit not found" };
    }

    const completion = await prisma.habitCompletion.create({
      data: {
        habitId,
        date,
        count: count || 1,
        notes,
      },
    });

    revalidatePath("/habit-tracker");
    return { status: true, data: completion };
  } catch (error) {
    console.error("Error completing habit:", error);
    return { status: false, data: "Failed to complete habit" };
  }
};

export const getHabitCompletions = async (habitId: string, startDate: Date, endDate: Date) => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { status: false, data: "Unauthorized" };
    }

    const completions = await prisma.habitCompletion.findMany({
      where: {
        habitId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    return { status: true, data: completions };
  } catch (error) {
    console.error("Error fetching habit completions:", error);
    return { status: false, data: "Failed to fetch habit completions" };
  }
};

// Habit Memo Actions
export const createHabitMemo = async ({
  habitId,
  content,
  date,
  tags,
}: {
  habitId: string;
  content: string;
  date: Date;
  tags?: string[];
}) => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { status: false, data: "Unauthorized" };
    }

    // Verify habit belongs to user
    const habit = await prisma.habit.findFirst({
      where: {
        id: habitId,
        userId: session.user.id,
      },
    });

    if (!habit) {
      return { status: false, data: "Habit not found" };
    }

    const memo = await prisma.habitMemo.create({
      data: {
        habitId,
        content,
        date,
        tags: tags || [],
      },
    });

    revalidatePath("/habit-tracker");
    return { status: true, data: memo };
  } catch (error) {
    console.error("Error creating habit memo:", error);
    return { status: false, data: "Failed to create habit memo" };
  }
};

export const getHabitMemos = async (habitId: string) => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { status: false, data: "Unauthorized" };
    }

    const memos = await prisma.habitMemo.findMany({
      where: {
        habitId,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return { status: true, data: memos };
  } catch (error) {
    console.error("Error fetching habit memos:", error);
    return { status: false, data: "Failed to fetch habit memos" };
  }
};

export const updateHabitMemo = async ({
  id,
  content,
  tags,
}: {
  id: string;
  content?: string;
  tags?: string[];
}) => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { status: false, data: "Unauthorized" };
    }

    // Verify memo belongs to user's habit
    const memo = await prisma.habitMemo.findFirst({
      where: {
        id,
        habit: {
          userId: session.user.id,
        },
      },
    });

    if (!memo) {
      return { status: false, data: "Memo not found" };
    }

    const updatedMemo = await prisma.habitMemo.update({
      where: {
        id,
      },
      data: {
        content,
        tags,
      },
    });

    revalidatePath("/habit-tracker");
    return { status: true, data: updatedMemo };
  } catch (error) {
    console.error("Error updating habit memo:", error);
    return { status: false, data: "Failed to update habit memo" };
  }
};

export const deleteHabitMemo = async (id: string) => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { status: false, data: "Unauthorized" };
    }

    // Verify memo belongs to user's habit
    const memo = await prisma.habitMemo.findFirst({
      where: {
        id,
        habit: {
          userId: session.user.id,
        },
      },
    });

    if (!memo) {
      return { status: false, data: "Memo not found" };
    }

    await prisma.habitMemo.delete({
      where: {
        id,
      },
    });

    revalidatePath("/habit-tracker");
    return { status: true, data: "Memo deleted successfully" };
  } catch (error) {
    console.error("Error deleting habit memo:", error);
    return { status: false, data: "Failed to delete habit memo" };
  }
};
