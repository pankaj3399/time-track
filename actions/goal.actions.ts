"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface CreateGoalData {
  title: string;
  description: string;
  startDate: string;
  dueDate: string;
  category: string;
  resources: { label: string; url: string }[];
  subtasks: { title: string; status: string }[];
}

export interface UpdateGoalData extends Partial<CreateGoalData> {
  id: string;
}

export async function createGoal(data: CreateGoalData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const goal = await prisma.goal.create({
      data: {
        title: data.title,
        description: data.description,
        startDate: new Date(data.startDate),
        dueDate: new Date(data.dueDate),
        category: data.category,
        userId: session.user.id,
        resources: {
          create: data.resources.map(resource => ({
            label: resource.label,
            url: resource.url,
          })),
        },
        subtasks: {
          create: data.subtasks.map(subtask => ({
            title: subtask.title,
            status: subtask.status,
          })),
        },
      },
      include: {
        resources: true,
        subtasks: true,
      },
    });

    revalidatePath("/goals");
    return { success: true, data: goal };
  } catch (error) {
    console.error("Error creating goal:", error);
    return { success: false, error: "Failed to create goal" };
  }
}

export async function updateGoal(data: UpdateGoalData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    // First, verify the goal belongs to the user
    const existingGoal = await prisma.goal.findFirst({
      where: {
        id: data.id,
        userId: session.user.id,
      },
    });

    if (!existingGoal) {
      throw new Error("Goal not found");
    }

    // Update the goal
    const goal = await prisma.goal.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        category: data.category,
      },
      include: {
        resources: true,
        subtasks: true,
      },
    });

    // Update resources if provided
    if (data.resources) {
      // Delete existing resources
      await prisma.resource.deleteMany({
        where: { goalId: data.id },
      });

      // Create new resources
      await prisma.resource.createMany({
        data: data.resources.map(resource => ({
          label: resource.label,
          url: resource.url,
          goalId: data.id,
        })),
      });
    }

    // Update subtasks if provided
    if (data.subtasks) {
      // Delete existing subtasks
      await prisma.subtask.deleteMany({
        where: { goalId: data.id },
      });

      // Create new subtasks
      await prisma.subtask.createMany({
        data: data.subtasks.map(subtask => ({
          title: subtask.title,
          status: subtask.status,
          goalId: data.id,
        })),
      });
    }

    revalidatePath("/goals");
    return { success: true, data: goal };
  } catch (error) {
    console.error("Error updating goal:", error);
    return { success: false, error: "Failed to update goal" };
  }
}

export async function deleteGoal(goalId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    // First, verify the goal belongs to the user
    const existingGoal = await prisma.goal.findFirst({
      where: {
        id: goalId,
        userId: session.user.id,
      },
    });

    if (!existingGoal) {
      throw new Error("Goal not found");
    }

    // Delete the goal (this will cascade delete resources and subtasks)
    await prisma.goal.delete({
      where: { id: goalId },
    });

    revalidatePath("/goals");
    return { success: true };
  } catch (error) {
    console.error("Error deleting goal:", error);
    return { success: false, error: "Failed to delete goal" };
  }
}

export async function getGoals() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const goals = await prisma.goal.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        resources: true,
        subtasks: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, data: goals };
  } catch (error) {
    console.error("Error fetching goals:", error);
    return { success: false, error: "Failed to fetch goals" };
  }
}

export async function getGoalById(goalId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const goal = await prisma.goal.findFirst({
      where: {
        id: goalId,
        userId: session.user.id,
      },
      include: {
        resources: true,
        subtasks: true,
      },
    });

    if (!goal) {
      throw new Error("Goal not found");
    }

    return { success: true, data: goal };
  } catch (error) {
    console.error("Error fetching goal:", error);
    return { success: false, error: "Failed to fetch goal" };
  }
}

export async function updateSubtaskStatus(goalId: string, subtaskId: string, status: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    // First, verify the goal belongs to the user
    const existingGoal = await prisma.goal.findFirst({
      where: {
        id: goalId,
        userId: session.user.id,
      },
    });

    if (!existingGoal) {
      throw new Error("Goal not found");
    }

    // Update the subtask status
    const subtask = await prisma.subtask.update({
      where: { id: subtaskId },
      data: { status },
    });

    revalidatePath("/goals");
    return { success: true, data: subtask };
  } catch (error) {
    console.error("Error updating subtask status:", error);
    return { success: false, error: "Failed to update subtask status" };
  }
}
