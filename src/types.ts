// src/types.ts
import React from "react";

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
  description: string;
  icon: React.ReactNode;
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
