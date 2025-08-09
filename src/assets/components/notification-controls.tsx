"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Bell, BellOff, Smartphone, Volume2, VolumeX } from 'lucide-react'

interface NotificationControlsProps {
  muted: boolean
  onToggle: (muted: boolean) => void
}

export function NotificationControls({ muted, onToggle }: NotificationControlsProps) {
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default")

  useEffect(() => {
    setNotificationPermission(Notification.permission)
  }, [])

  const requestNotificationPermission = async () => {
    const permission = await Notification.requestPermission()
    setNotificationPermission(permission)
  }

  const testNotification = () => {
    if (Notification.permission === "granted" && !muted) {
      new Notification("Test Notification", {
        body: "This is how you'll be notified during focus sessions!",
        icon: "/favicon.ico"
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {muted ? <BellOff className="w-5 h-5 text-gray-500" /> : <Bell className="w-5 h-5 text-blue-500" />}
          <div>
            <Label htmlFor="notification-toggle" className="text-base font-medium">
              Focus Mode Notifications
            </Label>
            <p className="text-sm text-gray-600">
              Get notified when focus sessions and breaks end
            </p>
          </div>
        </div>
        <Switch
          id="notification-toggle"
          checked={!muted}
          onCheckedChange={(checked) => onToggle(!checked)}
        />
      </div>

      {notificationPermission === "default" && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Bell className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-yellow-800">Enable Browser Notifications</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Allow notifications to get alerts when your focus sessions end, even when the app is in the background.
                </p>
                <Button 
                  onClick={requestNotificationPermission}
                  className="mt-3 bg-yellow-600 hover:bg-yellow-700"
                  size="sm"
                >
                  Enable Notifications
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {notificationPermission === "denied" && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <BellOff className="w-5 h-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-red-800">Notifications Blocked</h4>
                <p className="text-sm text-red-700 mt-1">
                  Notifications are blocked in your browser. To enable them, click the lock icon in your address bar and allow notifications for this site.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Smartphone className="w-5 h-5 text-blue-600" />
              <h4 className="font-medium text-blue-800">Mobile Distraction Control</h4>
            </div>
            <p className="text-sm text-blue-700">
              During focus sessions, consider putting your phone in Do Not Disturb mode or airplane mode to minimize distractions.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              {muted ? <VolumeX className="w-5 h-5 text-green-600" /> : <Volume2 className="w-5 h-5 text-green-600" />}
              <h4 className="font-medium text-green-800">Sound Alerts</h4>
            </div>
            <p className="text-sm text-green-700">
              {muted 
                ? "Sound notifications are currently muted. You'll only see visual alerts."
                : "Sound notifications are enabled. You'll hear alerts when sessions end."
              }
            </p>
          </CardContent>
        </Card>
      </div>

      {notificationPermission === "granted" && !muted && (
        <div className="text-center">
          <Button onClick={testNotification} variant="outline">
            Test Notification
          </Button>
        </div>
      )}

      <Card className="bg-gray-50">
        <CardContent className="p-4">
          <h4 className="font-medium text-gray-800 mb-2">Tips for Better Focus</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Close unnecessary browser tabs and applications</li>
            <li>• Use website blockers for social media during focus time</li>
            <li>• Keep your phone in another room or in a drawer</li>
            <li>• Let colleagues know when you're in a focus session</li>
            <li>• Use noise-canceling headphones or focus music</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
