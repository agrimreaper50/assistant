"use client"

import { useState, useEffect } from "react"
import Card from "./ui/card"
import { Calendar, RefreshCw, MapPin, Clock } from "lucide-react"

interface Event {
  id: string
  summary: string
  start: string
  end: string
  location?: string
}

// Helper function to format time
function formatTime(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }
  return new Date(dateString).toLocaleString("en-US", options)
}

export default function CalendarCard() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  async function fetchEvents() {
    try {
      setIsRefreshing(true)
      const res = await fetch("/api/calendar")
      const data = await res.json()
      setEvents(data.events || [])
    } catch (error) {
      console.error("Error fetching events:", error)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const refreshAction = (
    <button
      onClick={fetchEvents}
      disabled={isRefreshing}
      className="inline-flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      aria-label="Refresh events"
    >
      <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
    </button>
  )

  return (
    <Card
      title="Today's Events"
      icon={<Calendar size={18} />}
      isLoading={isLoading}
      isEmpty={events.length === 0}
      emptyMessage="No events today"
      action={refreshAction}
    >
      <div className="space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="group relative overflow-hidden rounded-lg border border-border/50 bg-card p-4 transition-all hover:border-primary/50 hover:bg-accent/50"
          >
            <div className="flex flex-col gap-3">
              <div className="text-sm font-medium text-card-foreground">{event.summary}</div>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-1.5 rounded-md bg-secondary/80 px-2 py-1 text-xs text-secondary-foreground">
                  <Clock className="h-3 w-3" />
                  <span>
                    {formatTime(event.start)} - {formatTime(event.end)}
                  </span>
                </div>
                {event.location && (
                  <div className="flex items-center gap-1.5 rounded-md bg-secondary/80 px-2 py-1 text-xs text-secondary-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{event.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
