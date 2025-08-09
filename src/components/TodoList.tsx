"use client";

import { useState } from "react";
import { Trash2, Plus, AlertCircle, Clock } from "lucide-react";
import type { Task } from "../types";

interface TodoListProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, "id" | "createdAt">) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  currentBlock: string;
}

export function TodoList({
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  currentBlock,
}: TodoListProps) {
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<
    "urgent" | "important" | "normal"
  >("normal");

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      onAddTask({
        text: newTaskText.trim(),
        completed: false,
        priority: newTaskPriority,
        timeBlock: currentBlock,
      });
      setNewTaskText("");
      setNewTaskPriority("normal");
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "important":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <AlertCircle className="w-3 h-3" />;
      case "important":
        return <Clock className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    const priorityOrder = { urgent: 3, important: 2, normal: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">
          Tasks ({completedTasks}/{totalTasks} completed)
        </h3>
        {totalTasks > 0 && (
          <div className="w-24 bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${
                  totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
                }%`,
              }}
            />
          </div>
        )}
      </div>

      <div className="flex gap-2 flex-wrap sm:flex-nowrap">
        <input
          type="text"
          placeholder="Add a new task..."
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
          className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={newTaskPriority}
          onChange={(e) =>
            setNewTaskPriority(
              e.target.value as "urgent" | "important" | "normal"
            )
          }
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="normal">Normal</option>
          <option value="important">Important</option>
          <option value="urgent">Urgent</option>
        </select>
        <button
          onClick={handleAddTask}
          disabled={!newTaskText.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {tasks.length >= 5 && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Tip:</strong> You have {tasks.length} tasks. Consider
            focusing on 3-5 key tasks per session for better productivity.
          </p>
        </div>
      )}

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {sortedTasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 ${
              task.completed
                ? "bg-gray-50 border-gray-200"
                : "bg-white border-gray-200 hover:border-gray-300"
            }`}
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={(e) =>
                onUpdateTask(task.id, { completed: e.target.checked })
              }
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />

            <div className="flex-1 min-w-0">
              <p
                className={`text-sm ${
                  task.completed
                    ? "line-through text-gray-500"
                    : "text-gray-900"
                }`}
              >
                {task.text}
              </p>
              {task.timeBlock && (
                <p className="text-xs text-gray-500 mt-1">
                  Assigned to: {task.timeBlock}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getPriorityColor(
                  task.priority
                )}`}
              >
                {getPriorityIcon(task.priority)}
                {task.priority}
              </span>

              <button
                onClick={() => onDeleteTask(task.id)}
                className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {tasks.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No tasks yet. Add your first task above!</p>
        </div>
      )}
    </div>
  );
}
