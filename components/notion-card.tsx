"use client"

import { useState, useEffect } from "react"
import Card from "./ui/card"
import { CheckSquare, RefreshCw, Calendar, Flag } from "lucide-react"

interface Task {
  id: string
  title: string
  dueDate: string
  status: string
  priority: string
}

export default function NotionCard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  async function fetchTasks() {
    try {
      setIsRefreshing(true)
      const res = await fetch("/api/notion-tasks")
      const data = await res.json()
      setTasks(data.tasks || [])
    } catch (error) {
      console.error("Error fetching tasks:", error)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  function getPriorityColor(priority: string) {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  function getStatusColor(status: string) {
    console.log("hi")
    if (!status) return "bg-secondary text-secondary-foreground"
    
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "in progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "not started":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  const refreshAction = (
    <button
      onClick={fetchTasks}
      disabled={isRefreshing}
      className="inline-flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      aria-label="Refresh tasks"
    >
      <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
    </button>
  )

  return (
    <Card
      title="Tasks Due Soon"
      icon={<CheckSquare size={18} />}
      isLoading={isLoading}
      isEmpty={tasks.length === 0}
      emptyMessage="No tasks due soon"
      action={refreshAction}
    >
      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="group relative overflow-hidden rounded-lg border border-border/50 bg-card p-4 transition-all hover:border-primary/50 hover:bg-accent/50"
          >
            <div className="flex flex-col gap-3">
              <div className="text-sm font-medium text-card-foreground">{task.title}</div>
              <div className="flex flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-1.5 rounded-md bg-secondary/80 px-2 py-1 text-secondary-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>Due: {task.dueDate}</span>
                </div>
                <div className={`flex items-center gap-1.5 rounded-md px-2 py-1 ${getPriorityColor(task.priority)}`}>
                  <Flag className="h-3 w-3" />
                  <span>{task.priority}</span>
                </div>
                <div className={`flex items-center gap-1.5 rounded-md px-2 py-1 ${getStatusColor(task.status)}`}>
                  <CheckSquare className="h-3 w-3" />
                  <span>{task.status}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
