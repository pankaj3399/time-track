"use client";
import React from "react";
import { Card, CardBody, Progress } from "@heroui/react";
import {
  TrendingUp,
  Target,
  Flame,
  Award,
  Calendar,
  CheckCircle,
} from "lucide-react";

interface StatsProps {
  progress: any;
  selectedDate: any;
}

export const Stats = ({ progress, selectedDate }: StatsProps) => {
  const year = selectedDate.year;
  const month = selectedDate.month;
  const monthData = progress?.[year]?.[month];

  const completionRate = monthData
    ? Math.min(
        (monthData.finishedTasksNum / Math.max(monthData.expectedTasksNum, 1)) *
          100,
        100,
      )
    : 0;

  const totalTasks = monthData?.finishedTasksNum || 0;
  const expectedTasks = monthData?.expectedTasksNum || 0;
  const bestStreak = monthData?.completeAllStreak || 0;

  // Calculate additional metrics
  const activeDays = monthData
    ? Object.keys(monthData.tasksDoneEachDay).length
    : 0;
  const averageTasksPerDay = activeDays > 0 ? totalTasks / activeDays : 0;
  const consistency =
    activeDays > 0
      ? (activeDays / new Date(year, month, 0).getDate()) * 100
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg">
          <TrendingUp className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">
            Performance Analytics
          </h2>
          <p className="text-sm text-gray-400">
            Your monthly habit tracking insights
          </p>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Completion Rate */}
        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 backdrop-blur-sm">
          <CardBody className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Target className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Completion Rate</h3>
                  <p className="text-xs text-gray-400">
                    Monthly target progress
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-400">
                  {completionRate.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-400">
                  {totalTasks}/{expectedTasks} tasks
                </p>
              </div>
            </div>
            <Progress
              value={completionRate}
              className="mb-2"
              classNames={{
                indicator: "bg-gradient-to-r from-green-400 to-green-500",
                track: "bg-gray-700/50",
              }}
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>0%</span>
              <span className="text-green-400 font-medium">
                {completionRate.toFixed(0)}%
              </span>
              <span>100%</span>
            </div>
          </CardBody>
        </Card>

        {/* Total Tasks */}
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 backdrop-blur-sm">
          <CardBody className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Tasks Completed</h3>
                  <p className="text-xs text-gray-400">This month</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-blue-400">{totalTasks}</p>
                <p className="text-xs text-gray-400">
                  {averageTasksPerDay.toFixed(1)} avg/day
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 p-3 bg-blue-500/10 rounded-lg">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-300">
                Active on {activeDays} days
              </span>
            </div>
          </CardBody>
        </Card>

        {/* Best Streak */}
        <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/5 border border-orange-500/20 backdrop-blur-sm">
          <CardBody className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <Flame className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Best Streak</h3>
                  <p className="text-xs text-gray-400">Consecutive days</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-orange-400">
                  {bestStreak}
                </p>
                <p className="text-xs text-gray-400">days</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 p-3 bg-orange-500/10 rounded-lg">
              <Award className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-gray-300">
                {bestStreak > 7
                  ? "Outstanding!"
                  : bestStreak > 3
                    ? "Great work!"
                    : "Keep going!"}
              </span>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gray-800/30 border border-white/10 backdrop-blur-sm">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-sm font-medium text-gray-300">
                  Consistency Score
                </span>
              </div>
              <span className="text-lg font-bold text-purple-400">
                {consistency.toFixed(0)}%
              </span>
            </div>
            <Progress
              value={consistency}
              size="sm"
              className="mt-2"
              classNames={{
                indicator: "bg-gradient-to-r from-purple-400 to-purple-500",
                track: "bg-gray-700/50",
              }}
            />
          </CardBody>
        </Card>

        <Card className="bg-gray-800/30 border border-white/10 backdrop-blur-sm">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                <span className="text-sm font-medium text-gray-300">
                  Daily Average
                </span>
              </div>
              <span className="text-lg font-bold text-cyan-400">
                {averageTasksPerDay.toFixed(1)}
              </span>
            </div>
            <div className="mt-2 text-xs text-gray-400">
              Tasks completed per active day
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Progress Indicator */}
      <Card className="bg-gradient-to-r from-gray-800/40 to-gray-700/40 border border-white/5 backdrop-blur-sm">
        <CardBody className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-300">
              Monthly Progress
            </span>
            <span className="text-sm text-gray-400">
              {Math.round(completionRate)}% Complete
            </span>
          </div>
          <div className="relative">
            <Progress
              value={completionRate}
              className="h-2"
              classNames={{
                indicator:
                  completionRate >= 80
                    ? "bg-gradient-to-r from-green-400 to-green-500"
                    : completionRate >= 60
                      ? "bg-gradient-to-r from-yellow-400 to-yellow-500"
                      : "bg-gradient-to-r from-red-400 to-red-500",
                track: "bg-gray-700/50",
              }}
            />
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Start</span>
              <span
                className={`font-medium ${
                  completionRate >= 80
                    ? "text-green-400"
                    : completionRate >= 60
                      ? "text-yellow-400"
                      : "text-red-400"
                }`}
              >
                {completionRate >= 80
                  ? "Excellent!"
                  : completionRate >= 60
                    ? "Good progress"
                    : "Keep pushing!"}
              </span>
              <span>Goal</span>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
