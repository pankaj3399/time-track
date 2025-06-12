import React from "react";
import { Card, CardBody } from "@heroui/react";

interface StatsProps {
  progress: any;
  selectedDate: any;
}

export const Stats = ({ progress, selectedDate }: StatsProps) => {
  const year = selectedDate.year;
  const month = selectedDate.month;
  const monthData = progress?.[year]?.[month];

  const completionRate = monthData
    ? (monthData.finishedTasksNum / monthData.expectedTasksNum) * 100
    : 0;

  const totalTasks = monthData?.finishedTasksNum || 0;
  const bestStreak = monthData?.completeAllStreak || 0;

  return (
    <div className="grid grid-cols-3 gap-4 mt-4">
      <Card>
        <CardBody>
          <h3 className="text-lg font-semibold">Completion Rate</h3>
          <p className="text-2xl">{completionRate.toFixed(1)}%</p>
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <h3 className="text-lg font-semibold">Total Tasks</h3>
          <p className="text-2xl">{totalTasks}</p>
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <h3 className="text-lg font-semibold">Best Streak</h3>
          <p className="text-2xl">{bestStreak} days</p>
        </CardBody>
      </Card>
    </div>
  );
};
