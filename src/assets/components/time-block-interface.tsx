"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Coffee, Brain } from 'lucide-react'

interface TimeBlock {
  id: string
  name: string
  type: "focus" | "break" | "planning"
  duration: number
  description: string
  icon: React.ReactNode
}

const timeBlocks: TimeBlock[] = [
  {
    id: "focus",
    name: "Deep Focus",
    type: "focus",
    duration: 25,
    description: "Concentrated work on important tasks",
    icon: <Brain className="w-5 h-5" />
  },
  {
    id: "break",
    name: "Active Break",
    type: "break",
    duration: 5,
    description: "Rest and recharge",
    icon: <Coffee className="w-5 h-5" />
  },
  {
    id: "planning",
    name: "Planning",
    type: "planning",
    duration: 15,
    description: "Organize and prioritize upcoming work",
    icon: <Clock className="w-5 h-5" />
  }
]

interface TimeBlockInterfaceProps {
  onBlockSelect: (block: TimeBlock | null) => void
  currentBlock: TimeBlock | null
}

export function TimeBlockInterface({ onBlockSelect, currentBlock }: TimeBlockInterfaceProps) {
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null)

  const handleBlockSelect = (block: TimeBlock) => {
    if (selectedBlock === block.id) {
      setSelectedBlock(null)
      onBlockSelect(null)
    } else {
      setSelectedBlock(block.id)
      onBlockSelect(block)
    }
  }

  const getBlockColor = (type: string) => {
    switch (type) {
      case "focus":
        return "bg-red-50 border-red-200 hover:bg-red-100"
      case "break":
        return "bg-green-50 border-green-200 hover:bg-green-100"
      case "planning":
        return "bg-blue-50 border-blue-200 hover:bg-blue-100"
      default:
        return "bg-gray-50 border-gray-200 hover:bg-gray-100"
    }
  }

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "focus":
        return "bg-red-100 text-red-800"
      case "break":
        return "bg-green-100 text-green-800"
      case "planning":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 mb-4">
        Choose a time block to structure your work session
      </p>
      
      {timeBlocks.map((block) => (
        <Card
          key={block.id}
          className={`cursor-pointer transition-all duration-200 ${getBlockColor(block.type)} ${
            selectedBlock === block.id ? "ring-2 ring-offset-2 ring-blue-500" : ""
          }`}
          onClick={() => handleBlockSelect(block)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {block.icon}
                <div>
                  <h3 className="font-semibold text-gray-900">{block.name}</h3>
                  <p className="text-sm text-gray-600">{block.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getBadgeColor(block.type)}>
                  {block.duration} min
                </Badge>
                {selectedBlock === block.id && (
                  <Badge variant="default">Selected</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {selectedBlock && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Active Block:</strong> {timeBlocks.find(b => b.id === selectedBlock)?.name}
          </p>
        </div>
      )}
    </div>
  )
}
