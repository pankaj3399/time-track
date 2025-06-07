"use client";
import React, { useState } from "react";
import { Task, Tasks } from "@/types/task";
import { Category, Categories } from "@/types/category";
import {
  Card,
  CardBody,
  Button,
  Select,
  SelectItem,
  DatePicker,
} from "@heroui/react";
import { TaskModal } from "./TaskModal";
import { CalendarDate } from "@internationalized/date";

interface TaskListProps {
  tasks: Tasks;
  categories: Categories;
  onTaskUpdate: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  categories,
  onTaskUpdate,
  onTaskDelete,
}) => {
  const [selectedDate, setSelectedDate] = useState<CalendarDate | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredTasks = tasks.filter((task) => {
    const matchesDate =
      !selectedDate ||
      (task.dueDate.getFullYear() === selectedDate.year &&
       task.dueDate.getMonth() === selectedDate.month - 1 &&
       task.dueDate.getDate() === selectedDate.day);
    const matchesCategory =
      selectedCategory === "all" || task.category.id === selectedCategory;
    return matchesDate && matchesCategory;
  });

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleTaskComplete = (task: Task) => {
    onTaskUpdate({ ...task, isCompleted: !task.isCompleted });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 mb-6">
        <DatePicker
          label="Filter by Date"
          value={selectedDate}
          onChange={setSelectedDate}
          className="w-48"
        />
        <Select
          label="Filter by Category"
          selectedKeys={[selectedCategory]}
          onSelectionChange={(keys) => setSelectedCategory(Array.from(keys)[0] as string)}
          className="w-48"
        >
          <SelectItem key="all">
            All Categories
          </SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id}>
              {category.category}
            </SelectItem>
          )) as any}
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.map((task) => (
          <Card
            key={task.id}
            className={`cursor-pointer transition-all duration-200 ${
              task.isCompleted
                ? "bg-gradient-to-tr from-green-500 to-green-600"
                : "bg-gradient-to-tr from-blue-500 to-blue-600"
            }`}
          >
            <CardBody>
              <div
                className="text-white"
                onClick={() => handleTaskClick(task)}
              >
                <h3 className="text-lg font-semibold">{task.title}</h3>
                <p className="text-sm opacity-80">
                  Due: {task.dueDate.toLocaleDateString()}
                </p>
                <div
                  className="mt-2 inline-block px-2 py-1 rounded-full text-xs"
                  style={{ backgroundColor: task.category.color }}
                >
                  {task.category.category}
                </div>
              </div>
              <Button
                size="sm"
                color={task.isCompleted ? "success" : "primary"}
                className="mt-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTaskComplete(task);
                }}
              >
                {task.isCompleted ? "Completed" : "Mark Complete"}
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onUpdate={onTaskUpdate}
          onDelete={onTaskDelete}
        />
      )}
    </div>
  );
}; 