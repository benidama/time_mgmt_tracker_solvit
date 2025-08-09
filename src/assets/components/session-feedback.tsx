"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart3, Clock, CheckCircle, Target, TrendingUp } from 'lucide-react'
import { SessionData } from "@/app/page"

interface SessionFeedbackProps {
  sessionData: SessionData[]
}

export function SessionFeedback({ sessionData }: SessionFeedbackProps) {
  const today = new Date().toDateString()
  const todaySession = sessionData.find(session => session.date === today)
  const recentSessions = sessionData.slice(-7) // Last 7 sessions

  const averageCompletionRate = recentSessions.length > 0 
    ? recentSessions.reduce((acc, session) => {
        const rate = session.totalTasks > 0 ? (session.completedTasks / session.totalTasks) : 0
        return acc + rate
      }, 0) / recentSessions.length * 100
    : 0

  const totalFocusTime = recentSessions.reduce((acc, session) => acc + session.totalFocusTime, 0)
  const averageFocusTime = recentSessions.length > 0 ? totalFocusTime / recentSessions.length : 0

  const getCompletionRateColor = (rate: number) => {
    if (rate >= 80) return "text-green-600"
    if (rate >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getMotivationalMessage = (rate: number) => {
    if (rate >= 90) return "Excellent work! You're crushing your goals! 🎉"
    if (rate >= 70) return "Great progress! Keep up the momentum! 💪"
    if (rate >= 50) return "Good effort! Small improvements lead to big results! 📈"
    return "Every step counts! Focus on progress, not perfection! 🌱"
  }

  return (
    <div className="space-y-6">
      {todaySession ? (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              Today's Session Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {todaySession.completedTasks}
                </div>
                <div className="text-sm text-gray-600">Tasks Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {todaySession.totalTasks}
                </div>
                <div className="text-sm text-gray-600">Total Tasks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {todaySession.focusBlocksUsed}
                </div>
                <div className="text-sm text-gray-600">Focus Blocks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {todaySession.totalFocusTime}m
                </div>
                <div className="text-sm text-gray-600">Focus Time</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Completion Rate</span>
                <span className={`text-sm font-bold ${getCompletionRateColor(todaySession.totalTasks > 0 ? (todaySession.completedTasks / todaySession.totalTasks) * 100 : 0)}`}>
                  {todaySession.totalTasks > 0 ? Math.round((todaySession.completedTasks / todaySession.totalTasks) * 100) : 0}%
                </span>
              </div>
              <Progress 
                value={todaySession.totalTasks > 0 ? (todaySession.completedTasks / todaySession.totalTasks) * 100 : 0} 
                className="h-2"
              />
            </div>

            <div className="p-3 bg-white rounded-lg border">
              <p className="text-sm text-center font-medium text-gray-700">
                {getMotivationalMessage(todaySession.totalTasks > 0 ? (todaySession.completedTasks / todaySession.totalTasks) * 100 : 0)}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-6 text-center">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="font-medium text-gray-700 mb-2">No session data for today</h3>
            <p className="text-sm text-gray-500">
              Complete a focus session to see your daily insights here!
            </p>
          </CardContent>
        </Card>
      )}

      {recentSessions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Weekly Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Average Completion Rate</span>
                  <Badge className={averageCompletionRate >= 70 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                    {Math.round(averageCompletionRate)}%
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Focus Time</span>
                  <Badge variant="outline">
                    {totalFocusTime} minutes
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Sessions Completed</span>
                  <Badge variant="outline">
                    {recentSessions.length}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Productivity Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {averageCompletionRate >= 80 && (
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800">
                      <strong>Great consistency!</strong> You're completing most of your planned tasks.
                    </p>
                  </div>
                )}
                
                {averageFocusTime >= 60 && (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                      <strong>Strong focus habits!</strong> You're averaging {Math.round(averageFocusTime)} minutes of focused work per session.
                    </p>
                  </div>
                )}

                {recentSessions.length >= 5 && (
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-sm text-purple-800">
                      <strong>Building momentum!</strong> You've completed {recentSessions.length} sessions recently.
                    </p>
                  </div>
                )}

                {averageCompletionRate < 50 && (
                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-sm text-yellow-800">
                      <strong>Tip:</strong> Try breaking down larger tasks into smaller, more manageable chunks.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {recentSessions.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentSessions.slice(-5).reverse().map((session, index) => (
                <div key={session.date} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">
                      {new Date(session.date).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-600">
                      {session.completedTasks}/{session.totalTasks} tasks • {session.totalFocusTime}m focus
                    </p>
                  </div>
                  <Badge 
                    className={
                      session.totalTasks > 0 && (session.completedTasks / session.totalTasks) >= 0.8 
                        ? "bg-green-100 text-green-800" 
                        : "bg-gray-100 text-gray-800"
                    }
                  >
                    {session.totalTasks > 0 ? Math.round((session.completedTasks / session.totalTasks) * 100) : 0}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
