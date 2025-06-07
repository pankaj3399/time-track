"use server";
import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const categoryUpdateAction = async ({
  id,
  category,
  color,
}: {
  id: string;
  category: string;
  color: string;
}) => {
  console.log({
    id,
    category,
    color,
  });
  const result = await prisma.category.update({
    where: { id },
    data: { category, color },
  });

  revalidatePath("/profile");
};

export const categoryDeleteAction = async ({ id }: { id: string }) => {
  const result = await prisma.category.delete({ where: { id } });

  revalidatePath("/profile");
};

export const categoryCreateAction = async ({
  color,
  category,
}: {
  color: string;
  category: string;
}) => {
  const session = await auth();

  if (session?.user?.id) {
    const result = await prisma.category.create({
      data: { color, category, userId: session.user.id },
    });
  }

  revalidatePath("/profile");
};

export const getCategoriesAction = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    return { status: false, data: "Unauthorized" };
  }

  try {
    const categories = await prisma.category.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        category: true,
        color: true,
      },
    });

    return { status: true, data: categories };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { 
      status: false, 
      data: error instanceof Error ? error.message : "Failed to fetch categories" 
    };
  }
};
