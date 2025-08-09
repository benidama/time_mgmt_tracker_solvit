import {
  BarChart3,
  Clock,
  CheckCircle,
  Target,
  TrendingUp,
} from "lucide-react";
import type { SessionData } from "../types";

interface SessionFeedbackProps {
  sessionData: SessionData[];
}

export function SessionFeedback({ sessionData }: SessionFeedbackProps) {
  const today = new Date().toDateString();
  const todaySession = sessionData.find((session) => session.date === today);
  const recentSessions = sessionData.slice(-7);

  const averageCompletionRate =
    recentSessions.length > 0
      ? (recentSessions.reduce((acc, session) => {
          const rate =
            session.totalTasks > 0
              ? session.completedTasks / session.totalTasks
              : 0;
          return acc + rate;
        }, 0) /
          recentSessions.length) *
        100
      : 0;

  const totalFocusTime = recentSessions.reduce(
    (acc, session) => acc + session.totalFocusTime,
    0
  );
  const averageFocusTime =
    recentSessions.length > 0 ? totalFocusTime / recentSessions.length : 0;

  const getCompletionRateColor = (rate: number) => {
    if (rate >= 80) return "text-green-600";
    if (rate >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getMotivationalMessage = (rate: number) => {
    if (rate >= 90) return "Excellent work! You're crushing your goals! 🎉";
    if (rate >= 70) return "Great progress! Keep up the momentum! 💪";
    if (rate >= 50)
      return "Good effort! Small improvements lead to big results! 📈";
    return "Every step counts! Focus on progress, not perfection! 🌱";
  };

  return (
    <div className="space-y-6">
      {todaySession ? (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            <h3 className="text-xl font-semibold">Today's Session Summary</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
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

          <div className="space-y-2 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Completion Rate</span>
              <span
                className={`text-sm font-bold ${getCompletionRateColor(
                  todaySession.totalTasks > 0
                    ? (todaySession.completedTasks / todaySession.totalTasks) *
                        100
                    : 0
                )}`}
              >
                {todaySession.totalTasks > 0
                  ? Math.round(
                      (todaySession.completedTasks / todaySession.totalTasks) *
                        100
                    )
                  : 0}
                %
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    todaySession.totalTasks > 0
                      ? (todaySession.completedTasks /
                          todaySession.totalTasks) *
                        100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>

          <div className="p-3 bg-white rounded-lg border">
            <p className="text-sm text-center font-medium text-gray-700">
              {getMotivationalMessage(
                todaySession.totalTasks > 0
                  ? (todaySession.completedTasks / todaySession.totalTasks) *
                      100
                  : 0
              )}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="font-medium text-gray-700 mb-2">
            No session data for today
          </h3>
          <p className="text-sm text-gray-500">
            Complete a focus session to see your daily insights here!
          </p>
        </div>
      )}

      {recentSessions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Weekly Overview</h3>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Average Completion Rate
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    averageCompletionRate >= 70
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {Math.round(averageCompletionRate)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Focus Time</span>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {totalFocusTime} minutes
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Sessions Completed
                </span>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {recentSessions.length}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Productivity Insights</h3>
            </div>

            <div className="space-y-3">
              {averageCompletionRate >= 80 && (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800">
                    <strong>Great consistency!</strong> You're completing most
                    of your planned tasks.
                  </p>
                </div>
              )}

              {averageFocusTime >= 60 && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>Strong focus habits!</strong> You're averaging{" "}
                    {Math.round(averageFocusTime)} minutes of focused work per
                    session.
                  </p>
                </div>
              )}

              {recentSessions.length >= 5 && (
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm text-purple-800">
                    <strong>Building momentum!</strong> You've completed{" "}
                    {recentSessions.length} sessions recently.
                  </p>
                </div>
              )}

              {averageCompletionRate < 50 && (
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    <strong>Tip:</strong> Try breaking down larger tasks into
                    smaller, more manageable chunks.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {recentSessions.length > 1 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Recent Sessions</h3>
          </div>

          <div className="space-y-3">
            {recentSessions
              .slice(-5)
              .reverse()
              .map((session) => (
                <div
                  key={session.date}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {new Date(session.date).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-600">
                      {session.completedTasks}/{session.totalTasks} tasks •{" "}
                      {session.totalFocusTime}m focus
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      session.totalTasks > 0 &&
                      session.completedTasks / session.totalTasks >= 0.8
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {session.totalTasks > 0
                      ? Math.round(
                          (session.completedTasks / session.totalTasks) * 100
                        )
                      : 0}
                    %
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
