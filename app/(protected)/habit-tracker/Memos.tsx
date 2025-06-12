"use client";
import React, { useState } from "react";
import { Card, CardBody, Textarea, Button } from "@heroui/react";
import { CalendarDate } from "@internationalized/date";
import { createHabitMemo, updateHabitMemo, deleteHabitMemo } from "@/actions/habit.actions";

interface MemosProps {
  progress: any;
  selectedDate: CalendarDate;
}

interface Memo {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

interface ApiMemo {
  id: string;
  habitId: string;
  content: string;
  date: Date;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface ApiResponse<T> {
  status: boolean;
  data: T;
}

export const Memos = ({ progress, selectedDate }: MemosProps) => {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [newMemo, setNewMemo] = useState("");

  const handleAddMemo = async () => {
    if (!newMemo.trim()) return;

    try {
      const response = await createHabitMemo({
        habitId: "", // This should be passed from the parent component
        content: newMemo,
        date: new Date(),
        tags: [],
      }) as ApiResponse<ApiMemo>;

      if (response.status && response.data) {
        const newMemo: Memo = {
          id: response.data.id,
          content: response.data.content,
          createdAt: response.data.createdAt.toISOString(),
          updatedAt: response.data.updatedAt.toISOString(),
          tags: response.data.tags,
        };
        setMemos([...memos, newMemo]);
        setNewMemo("");
      }
    } catch (error) {
      console.error("Error creating memo:", error);
    }
  };

  const handleEditMemo = async (id: string, content: string) => {
    try {
      const response = await updateHabitMemo({
        id,
        content,
      }) as ApiResponse<ApiMemo>;

      if (response.status && response.data) {
        const updatedMemo: Memo = {
          id: response.data.id,
          content: response.data.content,
          createdAt: response.data.createdAt.toISOString(),
          updatedAt: response.data.updatedAt.toISOString(),
          tags: response.data.tags,
        };
        setMemos(
          memos.map((memo) =>
            memo.id === id ? updatedMemo : memo
          )
        );
      }
    } catch (error) {
      console.error("Error updating memo:", error);
    }
  };

  const handleDeleteMemo = async (id: string) => {
    try {
      const response = await deleteHabitMemo(id) as ApiResponse<string>;
      if (response.status) {
        setMemos(memos.filter((memo) => memo.id !== id));
      }
    } catch (error) {
      console.error("Error deleting memo:", error);
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-4">Memos</h3>
      <div className="flex gap-2 mb-4">
        <Textarea
          value={newMemo}
          onChange={(e) => setNewMemo(e.target.value)}
          placeholder="Write a new memo..."
          className="flex-1"
        />
        <Button onClick={handleAddMemo}>Add Memo</Button>
      </div>
      <div className="space-y-4">
        {memos
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
          .map((memo) => (
            <Card key={memo.id}>
              <CardBody>
                <Textarea
                  value={memo.content}
                  onChange={(e) => handleEditMemo(memo.id, e.target.value)}
                  className="mb-2"
                />
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    <p>Created: {new Date(memo.createdAt).toLocaleString()}</p>
                    <p>Last edited: {new Date(memo.updatedAt).toLocaleString()}</p>
                  </div>
                  <Button
                    color="danger"
                    variant="light"
                    size="sm"
                    onClick={() => handleDeleteMemo(memo.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
      </div>
    </div>
  );
};
