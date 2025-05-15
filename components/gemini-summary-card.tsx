"use client"

import { useState, useEffect } from "react"
import Card from "./ui/card"
import { Brain } from "lucide-react"

interface Email {
  id: string
  subject: string
  from: string
}

export default function GeminiSummaryCard({ emails }: { emails: Email[] }) {
  const [summary, setSummary] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  async function fetchGeminiSummary(emails: Email[]) {
    try {
      setIsLoading(true)
      const res = await fetch('/api/gemini-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emails }),
      })
      const data = await res.json()
      setSummary(data.summary)
    } catch (error) {
      console.error("Error fetching Gemini summary:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (emails.length > 0) {
      fetchGeminiSummary(emails)
    }
  }, [emails])

  return (
    <Card
      title="Email Summary"
      icon={<Brain size={18} />}
      isLoading={isLoading}
      isEmpty={!summary}
      emptyMessage="No summary available"
    >
      <div className="prose prose-sm max-w-none">
        {summary}
      </div>
    </Card>
  )
} 