"use client";

import React, { useState, useEffect } from "react";
import type { TimeBlock, Task, SessionData } from "./types";
import { TimeBlockInterface } from "./components/TimeBlockInterface";
import { PomodoroTimer } from "./components/PomodoroTimer";
import { TodoList } from "./components/TodoList";
import { NotificationControls } from "./components/NotificationControls";
import { SessionFeedback } from "./components/SessionFeedback";
import { Clock, CheckSquare, Bell, BarChart3 } from "lucide-react";

function App() {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "tasks" | "settings" | "insights"
  >("dashboard");
  const [currentBlock, setCurrentBlock] = useState<TimeBlock | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sessionData, setSessionData] = useState<SessionData[]>([]);
  const [notificationsMuted, setNotificationsMuted] = useState(false);

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    const savedSessions = localStorage.getItem("sessions");
    const savedNotifications = localStorage.getItem("notifications-muted");

    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedSessions) setSessionData(JSON.parse(savedSessions));
    if (savedNotifications)
      setNotificationsMuted(JSON.parse(savedNotifications));
  }, []);

  useEffect(
    () => localStorage.setItem("tasks", JSON.stringify(tasks)),
    [tasks]
  );
  useEffect(
    () => localStorage.setItem("sessions", JSON.stringify(sessionData)),
    [sessionData]
  );
  useEffect(
    () =>
      localStorage.setItem(
        "notifications-muted",
        JSON.stringify(notificationsMuted)
      ),
    [notificationsMuted]
  );

  const addTask = (task: Omit<Task, "id" | "createdAt">) => {
    setTasks((prev) => [
      ...prev,
      { ...task, id: Date.now().toString(), createdAt: new Date() },
    ]);
  };
  const updateTask = (taskId: string, updates: Partial<Task>) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t))
    );
  const deleteTask = (taskId: string) =>
    setTasks((prev) => prev.filter((t) => t.id !== taskId));

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
      const idx = prev.findIndex((s) => s.date === today);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = newSession;
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
          <h1 className="text-4xl font-bold mb-2">Focus Flow</h1>
          <p className="text-gray-600">
            Your structured approach to productive time management
          </p>
        </header>

        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <TabButton
            icon={<Clock />}
            label="Dashboard"
            isActive={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
          />
          <TabButton
            icon={<CheckSquare />}
            label="Tasks"
            isActive={activeTab === "tasks"}
            onClick={() => setActiveTab("tasks")}
          />
          <TabButton
            icon={<Bell />}
            label="Settings"
            isActive={activeTab === "settings"}
            onClick={() => setActiveTab("settings")}
          />
          <TabButton
            icon={<BarChart3 />}
            label="Insights"
            isActive={activeTab === "insights"}
            onClick={() => setActiveTab("insights")}
          />
        </div>

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
