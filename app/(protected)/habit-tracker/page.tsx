"use client";
import React, { useState, useEffect } from "react";
import { MonthlyProgress } from "./MonthlyProgress";
import { Stats } from "./Stats";
import { Memos } from "./Memos";
import { Tabs, Tab, Card, CardBody, Button, useDisclosure } from "@heroui/react";
import { today, getLocalTimeZone, CalendarDate } from "@internationalized/date";
import { getHabits, createHabit } from "@/actions/habit.actions";
import { AddHabitModal } from "@/components/HabitTracker/AddHabitModal";

interface Habit {
  id: string;
  title: string;
  description: string;
  category: string;
  color: string;
  frequency: string;
  targetCount: number;
  completions: {
    id: string;
    date: Date;
    count: number;
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
  const [selectedDate, setSelectedDate] = useState<CalendarDate>(today(getLocalTimeZone()));
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

  const handleAddHabit = async (habitData: Omit<Habit, "id" | "completions" | "memos">) => {
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

  // Group habits by category
  const habitsByCategory = habits.reduce((acc: Record<string, Habit[]>, habit) => {
    if (!acc[habit.category]) {
      acc[habit.category] = [];
    }
    acc[habit.category].push(habit);
    return acc;
  }, {});

  const categories = Object.keys(habitsByCategory);

  return (
    <div className="flex w-full flex-col">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Habit Tracker</h1>
        <Button color="primary" onClick={onOpen}>
          Add New Habit
        </Button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : categories.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No habits found. Create your first habit to get started!</p>
        </div>
      ) : (
        <Tabs 
          aria-label="Category Tabs"
          selectedKey={selectedCategory}
          onSelectionChange={(key) => setSelectedCategory(key as string)}
        >
          {categories.map((category) => (
            <Tab key={category} title={category}>
              <Card>
                <CardBody>
                  <MonthlyProgress 
                    progress={habitsByCategory[category].reduce((acc: ProgressData, habit) => {
                      // Transform habit data into the expected progress format
                      const year = selectedDate.year;
                      const month = selectedDate.month;
                      if (!acc[year]) acc[year] = {};
                      if (!acc[year][month]) {
                        acc[year][month] = {
                          dailyNotes: {},
                          expectedTasksNum: 0,
                          finishedTasksNum: 0,
                          completeAllStreak: 0,
                          tasksDoneEachDay: {}
                        };
                      }
                      
                      // Add habit completions to the progress data
                      habit.completions.forEach((completion) => {
                        const date = new Date(completion.date);
                        const dateStr = date.toISOString().split('T')[0];
                        acc[year][month].tasksDoneEachDay[dateStr] = 
                          (acc[year][month].tasksDoneEachDay[dateStr] || 0) + completion.count;
                      });

                      return acc;
                    }, {})}
                    selectedDate={selectedDate}
                    onDateChange={setSelectedDate}
                  />
                  <Stats 
                    progress={habitsByCategory[category].reduce((acc: ProgressData, habit) => {
                      // Transform habit data into the expected progress format
                      const year = selectedDate.year;
                      const month = selectedDate.month;
                      if (!acc[year]) acc[year] = {};
                      if (!acc[year][month]) {
                        acc[year][month] = {
                          dailyNotes: {},
                          expectedTasksNum: 0,
                          finishedTasksNum: 0,
                          completeAllStreak: 0,
                          tasksDoneEachDay: {}
                        };
                      }
                      
                      // Calculate stats
                      const monthCompletions = habit.completions.filter((c) => {
                        const date = new Date(c.date);
                        return date.getFullYear() === year && date.getMonth() + 1 === month;
                      });
                      
                      acc[year][month].expectedTasksNum += habit.targetCount * 30; // Assuming daily
                      acc[year][month].finishedTasksNum += monthCompletions.reduce((sum, c) => sum + c.count, 0);
                      
                      return acc;
                    }, {})}
                    selectedDate={selectedDate}
                  />
                  <Memos 
                    progress={habitsByCategory[category].reduce((acc: ProgressData, habit) => {
                      // Transform habit data into the expected progress format
                      const year = selectedDate.year;
                      const month = selectedDate.month;
                      if (!acc[year]) acc[year] = {};
                      if (!acc[year][month]) {
                        acc[year][month] = {
                          dailyNotes: {},
                          expectedTasksNum: 0,
                          finishedTasksNum: 0,
                          completeAllStreak: 0,
                          tasksDoneEachDay: {}
                        };
                      }
                      
                      // Add memos to the progress data
                      habit.memos.forEach((memo) => {
                        const date = new Date(memo.date);
                        const dateStr = date.toISOString().split('T')[0];
                        acc[year][month].dailyNotes[dateStr] = {
                          date: dateStr,
                          content: memo.content,
                          tags: memo.tags
                        };
                      });

                      return acc;
                    }, {})}
                    selectedDate={selectedDate}
                  />
                </CardBody>
              </Card>
            </Tab>
          ))}
        </Tabs>
      )}

      <AddHabitModal 
        isOpen={isOpen} 
        onClose={onClose} 
        onSubmit={handleAddHabit}
        categories={categories}
      />
    </div>
  );
}
