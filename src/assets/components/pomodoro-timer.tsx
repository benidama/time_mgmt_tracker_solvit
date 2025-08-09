"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Play, Pause, RotateCcw, Settings } from 'lucide-react'
import { Badge } from "@/components/ui/badge"

interface PomodoroTimerProps {
  onSessionComplete: (completedTasks: number, focusTime: number) => void
  notificationsMuted: boolean
}

export function PomodoroTimer({ onSessionComplete, notificationsMuted }: PomodoroTimerProps) {
  const [focusTime, setFocusTime] = useState(25)
  const [breakTime, setBreakTime] = useState(5)
  const [timeLeft, setTimeLeft] = useState(focusTime * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const [sessionsCompleted, setSessionsCompleted] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const [totalFocusTime, setTotalFocusTime] = useState(0)
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimerComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeLeft])

  const handleTimerComplete = () => {
    setIsRunning(false)
    
    if (!notificationsMuted) {
      // Simple browser notification
      if (Notification.permission === "granted") {
        new Notification(
          isBreak ? "Break time is over!" : "Focus session complete!",
          {
            body: isBreak ? "Ready to focus again?" : "Time for a break!",
            icon: "/favicon.ico"
          }
        )
      }
    }

    if (!isBreak) {
      setSessionsCompleted(prev => prev + 1)
      setTotalFocusTime(prev => prev + focusTime)
      setIsBreak(true)
      setTimeLeft(breakTime * 60)
    } else {
      setIsBreak(false)
      setTimeLeft(focusTime * 60)
    }
  }

  const startTimer = () => {
    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission()
    }
    setIsRunning(true)
  }

  const pauseTimer = () => {
    setIsRunning(false)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setIsBreak(false)
    setTimeLeft(focusTime * 60)
  }

  const completeSession = () => {
    onSessionComplete(0, totalFocusTime) // Tasks completed would be tracked separately
    setSessionsCompleted(0)
    setTotalFocusTime(0)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progress = isBreak 
    ? (breakTime > 0 ? ((breakTime * 60 - timeLeft) / (breakTime * 60)) * 100 : 0)
    : (focusTime > 0 ? ((focusTime * 60 - timeLeft) / (focusTime * 60)) * 100 : 0)

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="relative w-48 h-48 mx-auto mb-4">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              className="text-gray-200"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - Math.max(0, Math.min(100, progress)) / 100)}`}
              className={isBreak ? "text-green-500" : "text-red-500"}
              style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">
                {formatTime(timeLeft)}
              </div>
              <Badge className={isBreak ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                {isBreak ? "Break" : "Focus"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-2">
        <Button
          onClick={isRunning ? pauseTimer : startTimer}
          className={isRunning ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"}
        >
          {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
          {isRunning ? "Pause" : "Start"}
        </Button>
        <Button onClick={resetTimer} variant="outline">
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
        <Button onClick={() => setShowSettings(!showSettings)} variant="outline">
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      {showSettings && (
        <Card className="bg-gray-50">
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="focus-time">Focus Time (minutes)</Label>
                <Input
                  id="focus-time"
                  type="number"
                  value={focusTime}
                  onChange={(e) => {
                    const value = parseInt(e.target.value)
                    setFocusTime(value)
                    if (!isBreak && !isRunning) {
                      setTimeLeft(value * 60)
                    }
                  }}
                  min="1"
                  max="60"
                />
              </div>
              <div>
                <Label htmlFor="break-time">Break Time (minutes)</Label>
                <Input
                  id="break-time"
                  type="number"
                  value={breakTime}
                  onChange={(e) => {
                    const value = parseInt(e.target.value)
                    setBreakTime(value)
                    if (isBreak && !isRunning) {
                      setTimeLeft(value * 60)
                    }
                  }}
                  min="1"
                  max="30"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="text-center space-y-2">
        <p className="text-sm text-gray-600">
          Sessions completed today: <span className="font-semibold">{sessionsCompleted}</span>
        </p>
        <p className="text-sm text-gray-600">
          Total focus time: <span className="font-semibold">{totalFocusTime} minutes</span>
        </p>
        {sessionsCompleted > 0 && (
          <Button onClick={completeSession} variant="outline" size="sm">
            Complete Session & Save Progress
          </Button>
        )}
      </div>
    </div>
  )
}
