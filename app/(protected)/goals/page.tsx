"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import {
  Calendar,
  Plus,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MoreHorizontal,
  X,
} from "lucide-react";
import {
  createGoal,
  getGoals,
  updateGoal,
  updateSubtaskStatus,
} from "@/actions/goal.actions";
import { toast } from "sonner";

interface Resource {
  label: string;
  url: string;
}

interface Subtask {
  id: string;
  title: string;
  status: string;
}

interface Goal {
  id: string;
  title: string;
  startDate: string;
  dueDate: string;
  description: string;
  category: string;
  resources: Resource[];
  subtasks: Subtask[];
}

interface TimeRange {
  label: string;
  value: number;
}

interface NewGoal {
  title: string;
  description: string;
  category: string;
  startDate: string;
  dueDate: string;
  resources: Resource[];
  subtasks: Subtask[];
}

interface TimelineData {
  startDate: Date;
  endDate: Date;
  dates: Date[];
}

const timeRanges = [
  { label: "2 Weeks", value: 14 },
  { label: "1 Month", value: 30 },
  { label: "3 Months", value: 90 },
  { label: "6 Months", value: 180 },
];

const categories = [
  "Development",
  "Testing",
  "Design",
  "Configuration",
  "Database",
  "Deployment",
];
const kanbanColumns = ["Backlog", "In Progress", "In Review", "Done"];

function getCompletionRate(subtasks: Subtask[]): number {
  if (!subtasks.length) return 0;
  const done = subtasks.filter((s: Subtask) => s.status === "Done").length;
  return done / subtasks.length;
}

function getCompletionColor(rate: number): string {
  if (rate === 1) return "#22c55e"; // green
  if (rate === 0) return "#ef4444"; // red
  if (rate < 0.3) return "#f97316"; // orange
  if (rate < 0.7) return "#eab308"; // yellow
  return "#84cc16"; // lime
}

function generateDates(startDate: string | Date, days: number): Date[] {
  const dates: Date[] = [];
  const start = new Date(startDate);
  for (let i = 0; i < days; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    dates.push(date);
  }
  return dates;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function isGoalInTimeRange(
  goal: Goal,
  startDate: Date,
  endDate: Date,
): boolean {
  const goalStart = new Date(goal.startDate);
  const goalEnd = new Date(goal.dueDate);
  return goalStart <= endDate && goalEnd >= startDate;
}

export default function GoalsManagement() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedRange, setSelectedRange] = useState<number>(
    timeRanges[1].value,
  );
  const [rangeOffset, setRangeOffset] = useState<number>(0);
  const [showKanban, setShowKanban] = useState<Record<string, boolean>>({});
  const [showAddGoal, setShowAddGoal] = useState<boolean>(false);
  const [newGoal, setNewGoal] = useState<NewGoal>({
    title: "",
    description: "",
    category: categories[0],
    startDate: "",
    dueDate: "",
    resources: [{ label: "", url: "" }],
    subtasks: [{ id: "", title: "", status: kanbanColumns[0] }],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch goals on component mount
  useEffect(() => {
    fetchGoals();
  }, []);

  async function fetchGoals() {
    try {
      setIsLoading(true);
      const response = await getGoals();
      if (response.success && response.data) {
        // Transform the data to match our frontend interface
        const transformedGoals = response.data.map((goal) => ({
          id: goal.id,
          title: goal.title,
          description: goal.description,
          startDate: goal.startDate.toISOString().split("T")[0],
          dueDate: goal.dueDate.toISOString().split("T")[0],
          category: goal.category,
          resources: goal.resources.map((r) => ({
            label: r.label,
            url: r.url,
          })),
          subtasks: goal.subtasks.map((s) => ({
            id: s.id,
            title: s.title,
            status: s.status,
          })),
        }));
        setGoals(transformedGoals);
      } else {
        toast.error("Failed to fetch goals");
      }
    } catch (error) {
      console.error("Error fetching goals:", error);
      toast.error("Failed to fetch goals");
    } finally {
      setIsLoading(false);
    }
  }

  const timelineData = useMemo<TimelineData>(() => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + rangeOffset * selectedRange);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + selectedRange - 1);

    const dates = generateDates(startDate, selectedRange);
    return { startDate, endDate, dates };
  }, [selectedRange, rangeOffset]);

  const filteredGoals = useMemo<Goal[]>(() => {
    return goals.filter((goal) =>
      isGoalInTimeRange(goal, timelineData.startDate, timelineData.endDate),
    );
  }, [goals, timelineData]);

  async function onDragEnd(result: DropResult) {
    if (!result.destination) return;

    if (result.type === "GOAL") {
      const reordered = Array.from(goals);
      const [removed] = reordered.splice(result.source.index, 1);
      reordered.splice(result.destination.index, 0, removed);
      setGoals(reordered);
    } else if (result.type.startsWith("SUBTASK-")) {
      const goalId = result.type.replace("SUBTASK-", "");
      const subtaskId = result.draggableId;
      const newStatus = result.destination.droppableId;

      setGoals((prevGoals) => {
        return prevGoals.map((goal) => {
          if (goal.id !== goalId) return goal;

          const subtasks = Array.from(goal.subtasks);
          const [moved] = subtasks.splice(result.source.index, 1);
          moved.status = newStatus;

          // Get all subtasks with the new status
          const targetSubtasks = subtasks.filter(s => s.status === newStatus);
          
          // Insert the moved subtask at the correct position
          const insertIndex = subtasks.findIndex(s => s.status === newStatus) + result.destination!.index;
          subtasks.splice(insertIndex, 0, moved);

          return { ...goal, subtasks };
        });
      });
      setHasUnsavedChanges(true);
    }
  }

  async function handleSaveChanges() {
    if (!hasUnsavedChanges) return;

    setIsSaving(true);
    try {
      // Get all subtasks that need to be updated
      const updates = goals.flatMap(goal => 
        goal.subtasks.map(subtask => ({
          goalId: goal.id,
          subtaskId: subtask.id,
          status: subtask.status
        }))
      );

      // Update all subtasks in parallel
      const updatePromises = updates.map(update => 
        updateSubtaskStatus(update.goalId, update.subtaskId, update.status)
      );

      const results = await Promise.all(updatePromises);
      const allSuccessful = results.every(result => result.success);

      if (allSuccessful) {
        toast.success("Changes saved successfully");
        setHasUnsavedChanges(false);
      } else {
        toast.error("Some changes failed to save");
      }
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  }

  function getGoalPosition(goal: Goal): { left: string; width: string } {
    const goalStart = new Date(goal.startDate);
    const goalEnd = new Date(goal.dueDate);
    const timelineStart = timelineData.startDate;
    const timelineEnd = timelineData.endDate;

    const totalDays = selectedRange;
    const startOffset = Math.max(
      0,
      (goalStart.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24),
    );
    const endOffset = Math.min(
      totalDays,
      (goalEnd.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24) + 1,
    );

    const left = (startOffset / totalDays) * 100;
    const width = ((endOffset - startOffset) / totalDays) * 100;

    return { left: `${left}%`, width: `${Math.max(width, 2)}%` };
  }

  function toggleKanban(goalId: string) {
    setShowKanban((prev) => ({
      ...prev,
      [goalId]: !prev[goalId],
    }));
  }

  function handleNewGoalChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = e.target;
    setNewGoal((prev) => ({ ...prev, [name]: value }));
  }

  function handleResourceChange(
    idx: number,
    field: keyof Resource,
    value: string,
  ) {
    setNewGoal((prev) => {
      const resources = [...prev.resources];
      resources[idx][field] = value;
      return { ...prev, resources };
    });
  }

  function addResourceField() {
    setNewGoal((prev) => ({
      ...prev,
      resources: [...prev.resources, { label: "", url: "" }],
    }));
  }

  function removeResourceField(idx: number) {
    setNewGoal((prev) => {
      const resources = prev.resources.filter((_, i) => i !== idx);
      return { ...prev, resources };
    });
  }

  function handleSubtaskChange(
    idx: number,
    field: keyof Subtask,
    value: string,
  ) {
    setNewGoal((prev) => {
      const subtasks = [...prev.subtasks];
      subtasks[idx][field] = value;
      return { ...prev, subtasks };
    });
  }

  function addSubtaskField() {
    setNewGoal((prev) => ({
      ...prev,
      subtasks: [
        ...prev.subtasks,
        { id: "", title: "", status: kanbanColumns[0] },
      ],
    }));
  }

  function removeSubtaskField(idx: number) {
    setNewGoal((prev) => {
      const subtasks = prev.subtasks.filter((_, i) => i !== idx);
      return { ...prev, subtasks };
    });
  }

  async function handleAddGoal(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const response = await createGoal({
        title: newGoal.title,
        description: newGoal.description,
        category: newGoal.category,
        startDate: newGoal.startDate,
        dueDate: newGoal.dueDate,
        resources: newGoal.resources.filter((r) => r.label && r.url),
        subtasks: newGoal.subtasks
          .filter((s) => s.title)
          .map((s) => ({
            title: s.title,
            status: s.status || kanbanColumns[0],
          })),
      });

      if (response.success && response.data) {
        // Transform the response data to match our frontend interface
        const newGoalData: Goal = {
          id: response.data.id,
          title: response.data.title,
          description: response.data.description,
          startDate: response.data.startDate.toISOString().split("T")[0],
          dueDate: response.data.dueDate.toISOString().split("T")[0],
          category: response.data.category,
          resources: response.data.resources.map((r) => ({
            label: r.label,
            url: r.url,
          })),
          subtasks: response.data.subtasks.map((s) => ({
            id: s.id,
            title: s.title,
            status: s.status,
          })),
        };

        setGoals((prev) => [...prev, newGoalData]);
        setShowAddGoal(false);
        setNewGoal({
          title: "",
          description: "",
          category: categories[0],
          startDate: "",
          dueDate: "",
          resources: [{ label: "", url: "" }],
          subtasks: [{ id: "", title: "", status: kanbanColumns[0] }],
        });
        toast.success("Goal created successfully");
      } else {
        toast.error("Failed to create goal");
      }
    } catch (error) {
      console.error("Error creating goal:", error);
      toast.error("Failed to create goal");
    }
  }

  function handleCancelAddGoal() {
    setShowAddGoal(false);
    setNewGoal({
      title: "",
      description: "",
      category: categories[0],
      startDate: "",
      dueDate: "",
      resources: [{ label: "", url: "" }],
      subtasks: [{ id: "", title: "", status: kanbanColumns[0] }],
    });
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Goals</h1>
        <div className="flex gap-2">
          {hasUnsavedChanges && (
            <button
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          )}
          <button
            onClick={() => setShowAddGoal(true)}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={20} />
            Add Goal
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Time Range Controls */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setRangeOffset((prev) => prev - 1)}
              className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg"
            >
              <ChevronLeft size={20} />
            </button>

            <select
              value={selectedRange}
              onChange={(e) => setSelectedRange(Number(e.target.value))}
              className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600"
            >
              {timeRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>

            <button
              onClick={() => setRangeOffset((prev) => prev + 1)}
              className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg"
            >
              <ChevronRight size={20} />
            </button>

            <span className="text-gray-400">
              {formatDate(timelineData.startDate)} -{" "}
              {formatDate(timelineData.endDate)}
            </span>
          </div>

          {/* Timeline Header */}
          <div className="mb-4">
            <div className="flex border-b border-gray-700 pb-2">
              <div className="w-80 text-sm font-medium text-gray-400">
                Tasks
              </div>
              <div className="flex-1 relative">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  {timelineData.dates
                    .filter((_, i) => i % Math.ceil(selectedRange / 10) === 0)
                    .map((date) => (
                      <span key={date.toISOString()}>{formatDate(date)}</span>
                    ))}
                </div>
                <div className="h-px bg-gray-700"></div>
              </div>
            </div>
          </div>

          {/* Goals Timeline */}
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="goals-timeline" type="GOAL">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-2"
                >
                  {filteredGoals.map((goal, index) => {
                    const completionRate = getCompletionRate(goal.subtasks);
                    const completionColor = getCompletionColor(completionRate);
                    const position = getGoalPosition(goal);

                    return (
                      <Draggable
                        key={goal.id}
                        draggableId={goal.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div>
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`flex items-center ${snapshot.isDragging ? "opacity-50" : ""}`}
                            >
                              {/* Goal Info */}
                              <div className="w-80 pr-4">
                                <div
                                  {...provided.dragHandleProps}
                                  className="bg-gray-800 rounded-lg p-3 border border-gray-700 hover:border-gray-600 cursor-grab"
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-medium text-white">
                                      {goal.title}
                                    </h3>
                                    <button
                                      onClick={() => toggleKanban(goal.id)}
                                      className="text-gray-400 hover:text-white"
                                    >
                                      <MoreHorizontal size={16} />
                                    </button>
                                  </div>
                                  <p className="text-sm text-gray-400 mb-2">
                                    {goal.description}
                                  </p>
                                  <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <span className="bg-gray-700 px-2 py-1 rounded">
                                      {goal.category}
                                    </span>
                                    <span>
                                      {Math.round(completionRate * 100)}%
                                      complete
                                    </span>
                                  </div>
                                  {goal.resources.length > 0 && (
                                    <div className="mt-2 flex gap-2">
                                      {goal.resources.map((resource) => (
                                        <a
                                          key={resource.url}
                                          href={resource.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1"
                                        >
                                          <ExternalLink size={12} />
                                          {resource.label}
                                        </a>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Timeline Bar */}
                              <div className="flex-1 relative h-8">
                                <div
                                  className="absolute top-1 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white"
                                  style={{
                                    left: position.left,
                                    width: position.width,
                                    backgroundColor: completionColor,
                                  }}
                                >
                                  {position.width !== "2%" && (
                                    <span className="truncate px-2">
                                      {goal.title}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Kanban Board */}
                            {showKanban[goal.id] && (
                              <div className="mt-4 ml-4 bg-gray-800 rounded-lg p-4 border border-gray-700">
                                <h4 className="font-medium mb-4">
                                  Subtasks - {goal.title}
                                </h4>
                                <div className="grid grid-cols-4 gap-4">
                                  {kanbanColumns.map((column) => (
                                    <Droppable
                                      key={column}
                                      droppableId={column}
                                      type={`SUBTASK-${goal.id}`}
                                    >
                                      {(provided, snapshot) => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.droppableProps}
                                          className={`bg-gray-900 rounded-lg p-3 min-h-32 ${
                                            snapshot.isDraggingOver
                                              ? "bg-gray-700"
                                              : ""
                                          }`}
                                        >
                                          <div className="flex items-center justify-between mb-3">
                                            <h5 className="font-medium text-sm text-gray-300">
                                              {column}
                                            </h5>
                                            <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">
                                              {
                                                goal.subtasks.filter(
                                                  (s) => s.status === column,
                                                ).length
                                              }
                                            </span>
                                          </div>
                                          <div className="space-y-2">
                                            {goal.subtasks
                                              .filter(
                                                (subtask) =>
                                                  subtask.status === column,
                                              )
                                              .map((subtask, index) => (
                                                <Draggable
                                                  key={subtask.id}
                                                  draggableId={subtask.id}
                                                  index={index}
                                                >
                                                  {(provided, snapshot) => (
                                                    <div
                                                      ref={provided.innerRef}
                                                      {...provided.draggableProps}
                                                      {...provided.dragHandleProps}
                                                      className={`bg-gray-800 p-2 rounded border border-gray-600 text-sm cursor-grab ${
                                                        snapshot.isDragging
                                                          ? "opacity-50"
                                                          : ""
                                                      }`}
                                                    >
                                                      {subtask.title}
                                                    </div>
                                                  )}
                                                </Draggable>
                                              ))}
                                            {provided.placeholder}
                                          </div>
                                        </div>
                                      )}
                                    </Droppable>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </>
      )}

      {/* Add Goal Modal */}
      {showAddGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <form
            onSubmit={handleAddGoal}
            className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-2xl relative"
          >
            <button
              type="button"
              onClick={handleCancelAddGoal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4">Add New Goal</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={newGoal.title}
                  onChange={handleNewGoalChange}
                  className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Category</label>
                <select
                  name="category"
                  value={newGoal.category}
                  onChange={handleNewGoalChange}
                  className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={newGoal.startDate}
                  onChange={handleNewGoalChange}
                  className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={newGoal.dueDate}
                  onChange={handleNewGoalChange}
                  className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm mb-1">Description</label>
                <textarea
                  name="description"
                  value={newGoal.description}
                  onChange={handleNewGoalChange}
                  className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
                  rows={2}
                />
              </div>
            </div>
            {/* Resources */}
            <div className="mt-4">
              <label className="block text-sm mb-1">Resources</label>
              {newGoal.resources.map((res, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Label"
                    value={res.label}
                    onChange={(e) =>
                      handleResourceChange(idx, "label", e.target.value)
                    }
                    className="px-2 py-1 rounded bg-gray-800 border border-gray-700 text-white flex-1"
                  />
                  <input
                    type="url"
                    placeholder="URL"
                    value={res.url}
                    onChange={(e) =>
                      handleResourceChange(idx, "url", e.target.value)
                    }
                    className="px-2 py-1 rounded bg-gray-800 border border-gray-700 text-white flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => removeResourceField(idx)}
                    className="text-red-400 hover:text-red-600"
                    disabled={newGoal.resources.length === 1}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addResourceField}
                className="text-blue-400 hover:text-blue-600 text-sm mt-1"
              >
                + Add Resource
              </button>
            </div>
            {/* Subtasks */}
            <div className="mt-4">
              <label className="block text-sm mb-1">Subtasks</label>
              {newGoal.subtasks.map((sub, idx) => (
                <div key={idx} className="flex gap-2 mb-2 items-center">
                  <input
                    type="text"
                    placeholder="Subtask Title"
                    value={sub.title}
                    onChange={(e) =>
                      handleSubtaskChange(idx, "title", e.target.value)
                    }
                    className="px-2 py-1 rounded bg-gray-800 border border-gray-700 text-white flex-1"
                  />
                  <select
                    value={sub.status}
                    onChange={(e) =>
                      handleSubtaskChange(idx, "status", e.target.value)
                    }
                    className="px-2 py-1 rounded bg-gray-800 border border-gray-700 text-white"
                  >
                    {kanbanColumns.map((col) => (
                      <option key={col} value={col}>
                        {col}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => removeSubtaskField(idx)}
                    className="text-red-400 hover:text-red-600"
                    disabled={newGoal.subtasks.length === 1}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addSubtaskField}
                className="text-blue-400 hover:text-blue-600 text-sm mt-1"
              >
                + Add Subtask
              </button>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCancelAddGoal}
                className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold"
              >
                Add Goal
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
