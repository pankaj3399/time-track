"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Textarea,
  Button,
  Select,
  SelectItem,
  Chip,
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { CalendarDate, getLocalTimeZone } from "@internationalized/date";
import {
  createHabitMemo,
  updateHabitMemo,
  deleteHabitMemo,
  getHabitMemos,
} from "@/actions/habit.actions";
import {
  BookOpen,
  Plus,
  Edit3,
  Trash2,
  Calendar,
  Clock,
  Tag,
  FileText,
  Save,
  X,
} from "lucide-react";

interface ProgressData {
  [year: number]: {
    [month: number]: {
      dailyNotes: {
        [date: string]: {
          date: string;
          content: string;
          tags: string[];
        };
      };
      expectedTasksNum: number;
      finishedTasksNum: number;
      completeAllStreak: number;
      tasksDoneEachDay: {
        [date: string]: number;
      };
    };
  };
}

interface Habit {
  id: string;
  title: string;
  description: string;
  category: string;
  color: string;
  completions: {
    id: string;
    date: Date;
    notes: string | null;
  }[];
  memos: {
    id: string;
    content: string;
    date: Date;
    tags: string[];
  }[];
}

interface HabitMemoResponse {
  id: string;
  content: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  habitId: string;
  tags: string[];
}

interface MemosProps {
  progress: ProgressData;
  selectedDate: CalendarDate;
  onAddMemo: (
    habitId: string,
    content: string,
    date: Date,
    tags?: string[],
  ) => Promise<void>;
  onUpdateMemo: (
    memoId: string,
    content: string,
    tags?: string[],
  ) => Promise<void>;
  onDeleteMemo: (memoId: string) => Promise<void>;
  habits: Habit[];
}

interface Memo {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export const Memos: React.FC<MemosProps> = ({
  progress,
  selectedDate,
  onAddMemo,
  onUpdateMemo,
  onDeleteMemo,
  habits,
}) => {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [newMemo, setNewMemo] = useState("");
  const [selectedHabitId, setSelectedHabitId] = useState(
    habits.length > 0 ? habits[0].id : "",
  );
  const [editingMemo, setEditingMemo] = useState<{
    id: string;
    content: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [memoToDelete, setMemoToDelete] = useState<string | null>(null);

  // Helper function to ensure consistent date handling
  const formatDateForComparison = (date: Date | string) => {
    const dateObj = new Date(date);
    return dateObj.toISOString().split("T")[0];
  };

  // Fetch memos for the selected habit and date
  useEffect(() => {
    const fetchMemos = async () => {
      if (!selectedHabitId) return;
      setIsLoading(true);
      try {
        const response = await getHabitMemos(selectedHabitId);
        if (response.status && response.data) {
          const selectedDateStr = formatDateForComparison(selectedDate.toDate(getLocalTimeZone()));
          
          const filtered = (response.data as HabitMemoResponse[]).filter((memo) => {
            return formatDateForComparison(memo.date) === selectedDateStr;
          });

          setMemos(
            filtered.map((memo) => ({
              id: memo.id,
              content: memo.content,
              createdAt: new Date(memo.createdAt).toISOString(),
              updatedAt: new Date(memo.updatedAt).toISOString(),
              tags: memo.tags || [],
            }))
          );
        } else {
          setMemos([]);
        }
      } catch (error) {
        console.error("Error fetching memos:", error);
        setMemos([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMemos();
  }, [selectedHabitId, selectedDate]);

  const handleAddMemo = async () => {
    if (!newMemo.trim() || !selectedHabitId) return;
    setIsLoading(true);
    try {
      const selectedDateObj = selectedDate.toDate(getLocalTimeZone());
      await onAddMemo(selectedHabitId, newMemo, selectedDateObj);
      setNewMemo("");
      
      // Immediately fetch memos after adding
      const response = await getHabitMemos(selectedHabitId);
      if (response.status && response.data) {
        const selectedDateStr = formatDateForComparison(selectedDateObj);
        const filtered = (response.data as HabitMemoResponse[]).filter((memo) => {
          return formatDateForComparison(memo.date) === selectedDateStr;
        });

        setMemos(
          filtered.map((memo) => ({
            id: memo.id,
            content: memo.content,
            createdAt: new Date(memo.createdAt).toISOString(),
            updatedAt: new Date(memo.updatedAt).toISOString(),
            tags: memo.tags || [],
          }))
        );
      }
    } catch (error) {
      console.error("Error adding memo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditMemo = async (id: string, content: string) => {
    if (!content.trim()) return;
    setIsLoading(true);
    try {
      await onUpdateMemo(id, content);
      setEditingMemo(null);
      
      // Immediately fetch memos after updating
      const response = await getHabitMemos(selectedHabitId);
      if (response.status && response.data) {
        const selectedDateStr = formatDateForComparison(selectedDate.toDate(getLocalTimeZone()));
        
        const filtered = (response.data as HabitMemoResponse[]).filter((memo) => {
          return formatDateForComparison(memo.date) === selectedDateStr;
        });

        setMemos(
          filtered.map((memo) => ({
            id: memo.id,
            content: memo.content,
            createdAt: new Date(memo.createdAt).toISOString(),
            updatedAt: new Date(memo.updatedAt).toISOString(),
            tags: memo.tags || [],
          }))
        );
      }
    } catch (error) {
      console.error("Error editing memo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMemo = async (id: string) => {
    setIsLoading(true);
    try {
      await onDeleteMemo(id);
      setMemoToDelete(null);
      onClose();
      
      // Immediately fetch memos after deleting
      const response = await getHabitMemos(selectedHabitId);
      if (response.status && response.data) {
        const selectedDateStr = formatDateForComparison(selectedDate.toDate(getLocalTimeZone()));
        
        const filtered = (response.data as HabitMemoResponse[]).filter((memo) => {
          return formatDateForComparison(memo.date) === selectedDateStr;
        });

        setMemos(
          filtered.map((memo) => ({
            id: memo.id,
            content: memo.content,
            createdAt: new Date(memo.createdAt).toISOString(),
            updatedAt: new Date(memo.updatedAt).toISOString(),
            tags: memo.tags || [],
          }))
        );
      }
    } catch (error) {
      console.error("Error deleting memo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const selectedHabit = habits.find((h) => h.id === selectedHabitId);
  const selectedDateString = selectedDate
    .toDate(getLocalTimeZone())
    .toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg">
            <BookOpen className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">
              Daily Notes & Memos
            </h2>
            <p className="text-sm text-gray-400">
              Capture your thoughts and reflections
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Calendar className="w-4 h-4" />
          <span>{selectedDateString}</span>
        </div>
      </div>

      {/* Add New Memo */}
      <Card className="bg-gradient-to-r from-gray-800/50 to-gray-700/30 border border-white/10 backdrop-blur-sm">
        <CardBody className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-blue-400" />
              <h3 className="font-semibold text-white">Add New Memo</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select
                label="Select Habit"
                selectedKeys={selectedHabitId ? [selectedHabitId] : []}
                onSelectionChange={(keys) =>
                  setSelectedHabitId(Array.from(keys)[0] as string)
                }
                className="md:col-span-1"
                classNames={{
                  trigger:
                    "bg-gray-700/50 border-gray-600/50 hover:border-gray-500/50",
                  value: "text-white",
                }}
                placeholder="Choose habit..."
              >
                {habits.map((habit) => (
                  <SelectItem key={habit.id} textValue={habit.title}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: habit.color }}
                      />
                      <span>{habit.title}</span>
                    </div>
                  </SelectItem>
                ))}
              </Select>

              <Textarea
                value={newMemo}
                onChange={(e) => setNewMemo(e.target.value)}
                placeholder="Write your thoughts, reflections, or notes..."
                className="md:col-span-2"
                classNames={{
                  input: "bg-gray-700/50 text-white placeholder:text-gray-400",
                  inputWrapper:
                    "border-gray-600/50 hover:border-gray-500/50 focus-within:border-blue-500/50",
                }}
                minRows={3}
              />

              <div className="flex flex-col gap-2">
                <Button
                  onClick={handleAddMemo}
                  disabled={!newMemo.trim() || !selectedHabitId || isLoading}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium h-full"
                  startContent={<Plus className="w-4 h-4" />}
                >
                  {isLoading ? "Adding..." : "Add Memo"}
                </Button>

                {selectedHabit && (
                  <div className="flex items-center gap-2 p-2 bg-gray-700/30 rounded-lg">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: selectedHabit.color }}
                    />
                    <span className="text-xs text-gray-400 truncate">
                      {selectedHabit.title}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Memos List */}
      <div className="space-y-4">
        {isLoading && memos.length === 0 ? (
          <Card className="bg-gray-800/30 border border-white/10">
            <CardBody className="p-8 text-center">
              <div className="animate-pulse flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-gray-700/50 rounded-full"></div>
                <div className="h-4 bg-gray-700/50 rounded w-32"></div>
              </div>
              <p className="text-gray-400 mt-2">Loading memos...</p>
            </CardBody>
          </Card>
        ) : memos.length === 0 ? (
          <Card className="bg-gradient-to-br from-gray-800/30 to-gray-700/20 border border-white/10">
            <CardBody className="p-8 text-center">
              <div className="p-4 bg-gray-700/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                No memos for this date
              </h3>
              <p className="text-gray-400 mb-4">
                Start capturing your daily thoughts and reflections!
              </p>
              <div className="text-sm text-gray-500">
                Selected date:{" "}
                <span className="text-blue-400">{selectedDateString}</span>
              </div>
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                Memos ({memos.length})
              </h3>
              <div className="text-sm text-gray-400">Sorted by most recent</div>
            </div>

            {memos
              .sort(
                (a, b) =>
                  new Date(b.updatedAt).getTime() -
                  new Date(a.updatedAt).getTime(),
              )
              .map((memo) => (
                <Card
                  key={memo.id}
                  className="bg-gradient-to-r from-gray-800/50 to-gray-700/30 border border-white/10 backdrop-blur-sm"
                >
                  <CardBody className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {editingMemo?.id === memo.id ? (
                            <div className="space-y-3">
                              <Textarea
                                value={editingMemo.content}
                                onChange={(e) =>
                                  setEditingMemo({
                                    ...editingMemo,
                                    content: e.target.value,
                                  })
                                }
                                className="w-full"
                                classNames={{
                                  input:
                                    "bg-gray-700/50 text-white placeholder:text-gray-400",
                                  inputWrapper:
                                    "border-gray-600/50 hover:border-gray-500/50 focus-within:border-blue-500/50",
                                }}
                                minRows={3}
                              />
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleEditMemo(memo.id, editingMemo.content)
                                  }
                                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                                  startContent={<Save className="w-4 h-4" />}
                                >
                                  Save
                                </Button>
                                <Button
                                  size="sm"
                                  variant="flat"
                                  onClick={() => setEditingMemo(null)}
                                  className="text-gray-400 hover:text-white"
                                  startContent={<X className="w-4 h-4" />}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-white whitespace-pre-wrap">
                              {memo.content}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            isIconOnly
                            variant="light"
                            onClick={() =>
                              setEditingMemo({
                                id: memo.id,
                                content: memo.content,
                              })
                            }
                            className="text-gray-400 hover:text-white"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button
                            isIconOnly
                            variant="light"
                            onClick={() => {
                              setMemoToDelete(memo.id);
                              onOpen();
                            }}
                            className="text-gray-400 hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>Created: {formatDate(memo.createdAt)}</span>
                        </div>
                        {memo.updatedAt !== memo.createdAt && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>Updated: {formatDate(memo.updatedAt)}</span>
                          </div>
                        )}
                      </div>

                      {memo.tags && memo.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {memo.tags.map((tag, index) => (
                            <Chip
                              key={index}
                              variant="flat"
                              className="bg-gray-700/50 text-gray-300"
                              startContent={<Tag className="w-3 h-3" />}
                            >
                              {tag}
                            </Chip>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardBody>
                </Card>
              ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Delete Memo</ModalHeader>
          <ModalBody>
            <p>
              Are you sure you want to delete this memo? This action cannot be
              undone.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="flat"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              color="danger"
              onClick={() => memoToDelete && handleDeleteMemo(memoToDelete)}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
