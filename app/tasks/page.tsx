"use client";
import React, { useState } from "react";
import { TaskList } from "@/components/Tasks/TaskList";
import { Task } from "@/types/task";
import { Category } from "@/types/category";
import { Button } from "@heroui/react";

// Sample data - replace with your actual data fetching logic
const sampleCategories: Category[] = [
  { id: "1", category: "Work", color: "#FF5733" },
  { id: "2", category: "Personal", color: "#33FF57" },
  { id: "3", category: "Health", color: "#3357FF" },
];

const sampleTasks: Task[] = [
  {
    id: "1",
    title: "Complete project proposal",
    description: "Write and submit the project proposal",
    dueDate: new Date("2024-03-20"),
    category: sampleCategories[0],
    isCompleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    title: "Morning workout",
    description: "30 minutes cardio",
    dueDate: new Date("2024-03-19"),
    category: sampleCategories[2],
    isCompleted: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  };

  const handleTaskDelete = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <Button color="primary">Add New Task</Button>
      </div>
      <TaskList
        tasks={tasks}
        categories={sampleCategories}
        onTaskUpdate={handleTaskUpdate}
        onTaskDelete={handleTaskDelete}
      />
    </div>
  );
} 