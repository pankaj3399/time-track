"use client";
import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
} from "@heroui/react";

interface HabitFormData {
  title: string;
  description: string;
  category: string;
  color: string;
}

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: HabitFormData) => void;
  categories: string[];
}

export const AddHabitModal = ({ isOpen, onClose, onSubmit, categories }: AddHabitModalProps) => {
  const [formData, setFormData] = useState<HabitFormData>({
    title: "",
    description: "",
    category: "",
    color: "#1E90FF",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      title: "",
      description: "",
      category: "",
      color: "#1E90FF",
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>Add New Habit</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <Textarea
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <Select
                label="Category"
                selectedKeys={[formData.category]}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string;
                  setFormData({ ...formData, category: selected });
                }}
                required
              >
                {categories.map((category) => (
                  <SelectItem key={category}>
                    {category}
                  </SelectItem>
                ))}
              </Select>
              <Input
                type="color"
                label="Color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" type="submit">
              Add Habit
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}; 