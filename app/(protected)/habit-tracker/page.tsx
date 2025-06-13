"use client";
import React, { useState, useEffect } from "react";
import { MonthlyProgress } from "./MonthlyProgress";
import { Stats } from "./Stats";
import { Memos } from "./Memos";
import {
  Tabs,
  Tab,
  Card,
  CardBody,
  Button,
  useDisclosure,
  Spinner,
} from "@heroui/react";
import { today, getLocalTimeZone, CalendarDate } from "@internationalized/date";
import { Plus, Target, Calendar, BookOpen, Check } from "lucide-react";
import {
  getHabits,
  createHabit,
  completeHabit,
  createHabitMemo,
  updateHabitMemo,
  deleteHabitMemo,
} from "@/actions/habit.actions";
import { AddHabitModal } from "@/components/HabitTracker/AddHabitModal";

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

export default function HabitTracker() {
  const [selectedDate, setSelectedDate] = useState<CalendarDate>(
    today(getLocalTimeZone()),
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      setIsLoading(true);
      const response = await getHabits();
      if (response.status && response.data) {
        setHabits(response.data as Habit[]);
        // Set initial category if none selected
        if (!selectedCategory && response.data.length > 0) {
          setSelectedCategory((response.data as Habit[])[0].category);
        }
      }
    } catch (error) {
      console.error("Error fetching habits:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddHabit = async (
    habitData: Omit<Habit, "id" | "completions" | "memos">,
  ) => {
    try {
      const response = await createHabit(habitData);
      if (response.status) {
        await fetchHabits();
        onClose();
      }
    } catch (error) {
      console.error("Error creating habit:", error);
    }
  };

  const handleCompleteHabit = async (
    habitId: string,
    date: Date,
    notes?: string,
  ) => {
    try {
      const response = await completeHabit({
        habitId,
        date,
        notes,
      });
      if (response.status) {
        await fetchHabits();
      }
    } catch (error) {
      console.error("Error completing habit:", error);
    }
  };

  const handleAddMemo = async (
    habitId: string,
    content: string,
    date: Date,
    tags: string[] = [],
  ) => {
    try {
      const response = await createHabitMemo({
        habitId,
        content,
        date,
        tags,
      });
      if (response.status) {
        await fetchHabits();
      }
    } catch (error) {
      console.error("Error adding memo:", error);
    }
  };

  const handleUpdateMemo = async (
    memoId: string,
    content: string,
    tags: string[] = [],
  ) => {
    try {
      const response = await updateHabitMemo({
        id: memoId,
        content,
        tags,
      });
      if (response.status) {
        await fetchHabits();
      }
    } catch (error) {
      console.error("Error updating memo:", error);
    }
  };

  const handleDeleteMemo = async (memoId: string) => {
    try {
      const response = await deleteHabitMemo(memoId);
      if (response.status) {
        await fetchHabits();
      }
    } catch (error) {
      console.error("Error deleting memo:", error);
    }
  };

  // Group habits by category
  const habitsByCategory = habits.reduce(
    (acc: Record<string, Habit[]>, habit) => {
      if (!acc[habit.category]) {
        acc[habit.category] = [];
      }
      acc[habit.category].push(habit);
      return acc;
    },
    {},
  );

  const categories = Object.keys(habitsByCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <Target className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Habit Tracker
              </h1>
              <p className="text-gray-400 mt-1">
                Build better habits, one day at a time
              </p>
            </div>
          </div>
          <Button
            color="primary"
            onClick={onOpen}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
            startContent={<Plus size={18} />}
          >
            Add New Habit
          </Button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Spinner size="lg" color="primary" />
            <p className="text-gray-400 mt-4">Loading your habits...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 backdrop-blur-sm rounded-2xl p-12 border border-white/10 max-w-md mx-auto">
              <div className="p-4 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Target className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                No habits yet
              </h3>
              <p className="text-gray-400 mb-6">
                Create your first habit to start building better routines!
              </p>
              <Button
                color="primary"
                onClick={onOpen}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                startContent={<Plus size={18} />}
              >
                Create First Habit
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <Tabs
              aria-label="Category Tabs"
              selectedKey={selectedCategory}
              onSelectionChange={(key) => setSelectedCategory(key as string)}
              className="w-full"
              classNames={{
                tabList:
                  "bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-1",
                tab: "text-gray-400 data-[selected=true]:text-white data-[selected=true]:bg-gradient-to-r data-[selected=true]:from-blue-500 data-[selected=true]:to-purple-600 rounded-lg font-medium transition-all duration-300",
                panel: "mt-6",
              }}
            >
              {categories.map((category) => (
                <Tab
                  key={category}
                  title={
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor:
                            habitsByCategory[category][0]?.color || "#3B82F6",
                        }}
                      />
                      <span>{category}</span>
                      <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                        {habitsByCategory[category].length}
                      </span>
                    </div>
                  }
                >
                  <div className="space-y-8">
                    {/* Progress Calendar */}
                    <Card className="bg-gray-800/30 backdrop-blur-sm border border-white/10">
                      <CardBody className="p-0">
                        <div className="p-6 pb-4">
                          <div className="flex items-center gap-2 mb-4">
                            <Calendar className="w-5 h-5 text-blue-400" />
                            <h2 className="text-xl font-semibold text-white">
                              Monthly Progress
                            </h2>
                          </div>
                        </div>
                        <MonthlyProgress
                          progress={habitsByCategory[category].reduce(
                            (acc: ProgressData, habit) => {
                              const year = selectedDate.year;
                              const month = selectedDate.month;
                              if (!acc[year]) acc[year] = {};
                              if (!acc[year][month]) {
                                acc[year][month] = {
                                  dailyNotes: {},
                                  expectedTasksNum: 0,
                                  finishedTasksNum: 0,
                                  completeAllStreak: 0,
                                  tasksDoneEachDay: {},
                                };
                              }

                              habit.completions.forEach((completion) => {
                                const date = new Date(completion.date);
                                const dateStr = date
                                  .toISOString()
                                  .split("T")[0];
                                acc[year][month].tasksDoneEachDay[dateStr] = 1;
                              });

                              acc[year][month].expectedTasksNum += 30; // One task per day for the month
                              acc[year][month].finishedTasksNum += habit.completions.length;

                              return acc;
                            },
                            {},
                          )}
                          selectedDate={selectedDate}
                          onDateChange={setSelectedDate}
                          onCompleteHabit={handleCompleteHabit}
                          habits={habitsByCategory[category]}
                        />
                      </CardBody>
                    </Card>

                    {/* Statistics */}
                    <Stats
                      progress={habitsByCategory[category].reduce(
                        (acc: ProgressData, habit) => {
                          const year = selectedDate.year;
                          const month = selectedDate.month;
                          if (!acc[year]) acc[year] = {};
                          if (!acc[year][month]) {
                            acc[year][month] = {
                              dailyNotes: {},
                              expectedTasksNum: 0,
                              finishedTasksNum: 0,
                              completeAllStreak: 0,
                              tasksDoneEachDay: {},
                            };
                          }

                          const monthCompletions = habit.completions.filter(
                            (c) => {
                              const date = new Date(c.date);
                              return (
                                date.getFullYear() === year &&
                                date.getMonth() + 1 === month
                              );
                            },
                          );

                          acc[year][month].expectedTasksNum += 30;
                          acc[year][month].finishedTasksNum +=
                            monthCompletions.length;

                          return acc;
                        },
                        {},
                      )}
                      selectedDate={selectedDate}
                    />

                    {/* Memos */}
                    <Card className="bg-gray-800/30 backdrop-blur-sm border border-white/10">
                      <CardBody>
                        <div className="flex items-center gap-2 mb-4">
                          <BookOpen className="w-5 h-5 text-purple-400" />
                          <h2 className="text-xl font-semibold text-white">
                            Notes & Memos
                          </h2>
                        </div>
                        <Memos
                          progress={habitsByCategory[category].reduce(
                            (acc: ProgressData, habit) => {
                              const year = selectedDate.year;
                              const month = selectedDate.month;
                              if (!acc[year]) acc[year] = {};
                              if (!acc[year][month]) {
                                acc[year][month] = {
                                  dailyNotes: {},
                                  expectedTasksNum: 0,
                                  finishedTasksNum: 0,
                                  completeAllStreak: 0,
                                  tasksDoneEachDay: {},
                                };
                              }

                              habit.memos.forEach((memo) => {
                                const date = new Date(memo.date);
                                const dateStr = date
                                  .toISOString()
                                  .split("T")[0];
                                acc[year][month].dailyNotes[dateStr] = {
                                  date: dateStr,
                                  content: memo.content,
                                  tags: memo.tags,
                                };
                              });

                              return acc;
                            },
                            {},
                          )}
                          selectedDate={selectedDate}
                          onAddMemo={handleAddMemo}
                          onUpdateMemo={handleUpdateMemo}
                          onDeleteMemo={handleDeleteMemo}
                          habits={habitsByCategory[category]}
                        />
                      </CardBody>
                    </Card>

                    {/* Habits List */}
                    <Card className="bg-gray-800/30 backdrop-blur-sm border border-white/10">
                      <CardBody>
                        <h2 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
                          <Target className="w-5 h-5 text-green-400" />
                          Daily Habits
                        </h2>
                        <div className="space-y-6">
                          {habitsByCategory[category].map((habit) => {
                            const year = selectedDate.year;
                            const month = selectedDate.month;
                            const daysInMonth = new Date(
                              year,
                              month,
                              0,
                            ).getDate();
                            return (
                              <div
                                key={habit.id}
                                className="bg-gray-700/30 rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
                              >
                                <div className="flex items-center gap-3 mb-4">
                                  <div
                                    className="w-4 h-4 rounded-full shadow-lg"
                                    style={{ backgroundColor: habit.color }}
                                  />
                                  <h3 className="font-semibold text-lg text-white">
                                    {habit.title}
                                  </h3>
                                </div>

                                <div className="grid grid-cols-7 gap-2">
                                  {[...Array(daysInMonth)].map((_, i) => {
                                    const day = i + 1;
                                    const date = new Date(year, month - 1, day);
                                    const dateStr = date
                                      .toISOString()
                                      .split("T")[0];
                                    const completion = habit.completions.find(
                                      (c) =>
                                        new Date(c.date)
                                          .toISOString()
                                          .split("T")[0] === dateStr,
                                    );
                                    const completed = !!completion;

                                    return (
                                      <div
                                        key={day}
                                        className="flex flex-col items-center space-y-2"
                                      >
                                        <label className="relative group cursor-pointer">
                                          <input
                                            type="checkbox"
                                            checked={completed}
                                            onChange={() =>
                                              handleCompleteHabit(
                                                habit.id,
                                                date,
                                              )
                                            }
                                            className="sr-only"
                                          />
                                          <div
                                            className={`
                                            w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300
                                            ${
                                              completed
                                                ? "bg-green-500 shadow-lg shadow-green-500/30 scale-110"
                                                : "bg-gray-600/50 hover:bg-gray-500/50 border border-gray-500/30"
                                            }
                                          `}
                                          >
                                            {completed && (
                                              <Check className="w-5 h-5 text-white" />
                                            )}
                                          </div>

                                          {/* Tooltip */}
                                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                                            {completed
                                              ? "Completed"
                                              : "Click to complete"}
                                          </div>
                                        </label>
                                        <span className="text-xs text-gray-400 font-medium">
                                          {day}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                </Tab>
              ))}
            </Tabs>
          </div>
        )}

        <AddHabitModal
          isOpen={isOpen}
          onClose={onClose}
          onSubmit={handleAddHabit}
          categories={categories}
        />
      </div>
    </div>
  );
}
