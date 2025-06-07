"use client";
import React from "react";
import { MonthlyProgress } from "./MonthlyProgress";
import { Stats } from "./Stats";
import { Memos } from "./Memos";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import { Tracker } from "@/types/tracker";

export default function HabitTracker() {
  const exampleTracker: Tracker = {
    categories: [
      {
        id: "school",
        category: "School",
        color: "#1E90FF",
        monthlyProgress: {
          2025: {
            6: {
              dailyNotes: {
                "2025-06-01": {
                  date: "2025-06-01",
                  content: "Read physics textbook",
                  tags: ["reading", "physics"],
                },
                "2025-06-02": {
                  date: "2025-06-02",
                  content: "Completed math homework",
                },
              },
              expectedTasksNum: 20,
              finishedTasksNum: 18,
              completeAllStreak: 1,
              tasksDoneEachDay: {
                "2025-06-01": 2,
                "2025-06-02": 1,
              },
            },
          },
        },
      },
      {
        id: "work",
        category: "Work",
        color: "#32CD32",
        monthlyProgress: {
          2025: {
            6: {
              dailyNotes: {
                "2025-06-01": {
                  date: "2025-06-01",
                  content: "Submitted team report",
                  tags: ["report", "meeting"],
                },
              },
              expectedTasksNum: 15,
              finishedTasksNum: 15,
              completeAllStreak: 3,
              tasksDoneEachDay: {
                "2025-06-01": 1,
              },
            },
          },
        },
      },
    ],
  };

  return (
    <div className="flex w-full flex-col">
      <Tabs aria-label="Category Tabs">
        {exampleTracker.categories.map((tab) => (
          <Tab key={tab.id} title={tab.category}>
            <Card>
              <CardBody>
                <MonthlyProgress progress={tab.monthlyProgress} />
                <Stats progress={tab.monthlyProgress} />
                <Memos progress={tab.monthlyProgress} />
              </CardBody>
            </Card>
          </Tab>
        ))}
      </Tabs>
    </div>
  );
}
