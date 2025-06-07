"use client";
import React from "react";
import { Task } from "@/types/task";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
} from "@heroui/react";

interface TaskModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  task,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
}) => {
  const [editedTask, setEditedTask] = React.useState<Task>(task);

  const handleSave = () => {
    onUpdate(editedTask);
    onClose();
  };

  const handleDelete = () => {
    onDelete(task.id);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <ModalHeader>
          <Input
            value={editedTask.title}
            onChange={(e) =>
              setEditedTask({ ...editedTask, title: e.target.value })
            }
            className="text-xl font-bold"
          />
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <Textarea
                value={editedTask.description || ""}
                onChange={(e) =>
                  setEditedTask({ ...editedTask, description: e.target.value })
                }
                placeholder="Add a description..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Due Date</label>
              <Input
                type="date"
                value={editedTask.dueDate.toISOString().split("T")[0]}
                onChange={(e) =>
                  setEditedTask({
                    ...editedTask,
                    dueDate: new Date(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <div
                className="inline-block px-3 py-1 rounded-full text-sm"
                style={{ backgroundColor: editedTask.category.color }}
              >
                {editedTask.category.category}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editedTask.isCompleted}
                  onChange={(e) =>
                    setEditedTask({
                      ...editedTask,
                      isCompleted: e.target.checked,
                    })
                  }
                  className="w-4 h-4"
                />
                <span>{editedTask.isCompleted ? "Completed" : "Pending"}</span>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={handleDelete}>
            Delete
          </Button>
          <Button color="primary" onPress={handleSave}>
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}; 