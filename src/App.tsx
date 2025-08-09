"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { TimeBlockInterface } from "./components/TimeBlockInterface";
import { PomodoroTimer } from "./components/PomodoroTimer";
import { TodoList } from "./components/TodoList";
import { NotificationControls } from "./components/NotificationControls";
import { SessionFeedback } from "./components/SessionFeedback";
import { Clock, CheckSquare, Bell, BarChart3 } from "lucide-react";

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: "urgent" | "important" | "normal";
  timeBlock: string;
  createdAt: Date;
}

export interface TimeBlock {
  id: string;
  name: string;
  type: "focus" | "break" | "planning";
  duration: number;
  tasks: Task[];
  completed: boolean;
}

export interface SessionData {
  date: string;
  completedTasks: number;
  totalTasks: number;
  focusBlocksUsed: number;
  totalFocusTime: number;
}

function App() {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "tasks" | "settings" | "insights"
  >("dashboard");
  const [currentBlock, setCurrentBlock] = useState<TimeBlock | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sessionData, setSessionData] = useState<SessionData[]>([]);
  const [notificationsMuted, setNotificationsMuted] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("time-management-tasks");
    const savedSessions = localStorage.getItem("time-management-sessions");
    const savedNotifications = localStorage.getItem("notifications-muted");

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    if (savedSessions) {
      setSessionData(JSON.parse(savedSessions));
    }
    if (savedNotifications) {
      setNotificationsMuted(JSON.parse(savedNotifications));
    }
  }, []);

  // Save data to localStorage when state changes
  useEffect(() => {
    localStorage.setItem("time-management-tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(
      "time-management-sessions",
      JSON.stringify(sessionData)
    );
  }, [sessionData]);

  useEffect(() => {
    localStorage.setItem(
      "notifications-muted",
      JSON.stringify(notificationsMuted)
    );
  }, [notificationsMuted]);

  const addTask = (task: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, ...updates } : task))
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const completeSession = (completedTasks: number, focusTime: number) => {
    const today = new Date().toDateString();
    const newSession: SessionData = {
      date: today,
      completedTasks,
      totalTasks: tasks.length,
      focusBlocksUsed: Math.ceil(focusTime / 25),
      totalFocusTime: focusTime,
    };

    setSessionData((prev) => {
      const existingIndex = prev.findIndex((session) => session.date === today);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = newSession;
        return updated;
      }
      return [...prev, newSession];
    });
  };

  const TabButton = ({
    icon,
    label,
    isActive,
    onClick,
  }: {
    id: string;
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
        isActive
          ? "bg-blue-500 text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Focus Flow</h1>
          <p className="text-gray-600">
            Your structured approach to productive time management
          </p>
        </header>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <TabButton
            id="dashboard"
            icon={<Clock className="w-4 h-4" />}
            label="Dashboard"
            isActive={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
          />
          <TabButton
            id="tasks"
            icon={<CheckSquare className="w-4 h-4" />}
            label="Tasks"
            isActive={activeTab === "tasks"}
            onClick={() => setActiveTab("tasks")}
          />
          <TabButton
            id="settings"
            icon={<Bell className="w-4 h-4" />}
            label="Settings"
            isActive={activeTab === "settings"}
            onClick={() => setActiveTab("settings")}
          />
          <TabButton
            id="insights"
            icon={<BarChart3 className="w-4 h-4" />}
            label="Insights"
            isActive={activeTab === "insights"}
            onClick={() => setActiveTab("insights")}
          />
        </div>

        {/* Tab Content */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Time Blocks</h2>
                <TimeBlockInterface
                  onBlockSelect={setCurrentBlock}
                  currentBlock={currentBlock}
                />
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Pomodoro Timer</h2>
                <PomodoroTimer
                  onSessionComplete={completeSession}
                  notificationsMuted={notificationsMuted}
                />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Today's Tasks</h2>
              <TodoList
                tasks={tasks.slice(0, 5)}
                onAddTask={addTask}
                onUpdateTask={updateTask}
                onDeleteTask={deleteTask}
                currentBlock={currentBlock?.name || ""}
              />
            </div>
          </div>
        )}

        {activeTab === "tasks" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">All Tasks</h2>
            <TodoList
              tasks={tasks}
              onAddTask={addTask}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
              currentBlock={currentBlock?.name || ""}
            />
          </div>
        )}

        {activeTab === "settings" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              Notification Settings
            </h2>
            <NotificationControls
              muted={notificationsMuted}
              onToggle={setNotificationsMuted}
            />
          </div>
        )}

        {activeTab === "insights" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Session Insights</h2>
            <SessionFeedback sessionData={sessionData} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
