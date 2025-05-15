"use client"

import { useState, useEffect } from "react"
import Card from "./ui/card"
import { Sparkles, RefreshCw } from "lucide-react"

export default function BriefingCard() {
  const [briefing, setBriefing] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  async function fetchBriefing() {
    try {
      setIsRefreshing(true)
      const res = await fetch("/api/briefing")
      const data = await res.json()
      setBriefing(data.summary)
    } catch (error) {
      console.error("Error fetching briefing:", error)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchBriefing()
  }, [])

  const refreshAction = (
    <button
      onClick={fetchBriefing}
      disabled={isRefreshing}
      className="inline-flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      aria-label="Refresh briefing"
    >
      <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
    </button>
  )

  return (
    <Card
      title="Daily Briefing"
      icon={<Sparkles size={18} />}
      isLoading={isLoading}
      isEmpty={!briefing}
      emptyMessage="No briefing available"
      action={refreshAction}
      className="col-span-full"
    >
      <div className="prose prose-sm max-w-none dark:prose-invert">
        {briefing}
      </div>
    </Card>
  )
}
