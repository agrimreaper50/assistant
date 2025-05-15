"use client"

import { useState } from "react"
import Card from "./ui/card"
import { Sparkles, RefreshCw } from "lucide-react"

interface PlanMyDayCardProps {
  className?: string;
}

export default function PlanMyDayCard({ className }: PlanMyDayCardProps) {
  const [plan, setPlan] = useState("")
  const [loading, setLoading] = useState(false)

  async function fetchPlan() {
    setLoading(true)
    try {
      const res = await fetch("/api/agent/plan-my-day")
      const data = await res.json()
      setPlan(data.plan || "Plan not generated.")
    } catch (error) {
      console.error("Failed to fetch plan:", error)
      setPlan("Error generating your plan.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card
      title="Plan My Day"
      icon={<Sparkles size={18} />}
      isLoading={loading}
      isEmpty={!plan}
      emptyMessage="Click the button to generate your plan."
      action={
        <button
          onClick={fetchPlan}
          className="inline-flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      }
      className={className}
    >
      <p className="text-sm leading-relaxed whitespace-pre-wrap">{plan}</p>
    </Card>
  )
}
