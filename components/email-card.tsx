"use client"

import { useState, useEffect } from "react"
import Card from "./ui/card"
import { Mail, RefreshCw, ChevronDown, ChevronUp } from "lucide-react"

interface Email {
  id: string
  subject: string
  from: string
}

interface EmailWithSummary extends Email {
  summary?: string
  isExpanded: boolean
  isLoadingSummary?: boolean
}

interface EmailCardProps {
  onEmailCountChange: (count: number) => void
}

export default function EmailCard({ onEmailCountChange }: EmailCardProps) {
  const [emails, setEmails] = useState<EmailWithSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  async function fetchEmails() {
    try {
      setIsRefreshing(true)
      const res = await fetch("/api/gmail")
      const data = await res.json()
      const processedEmails = (data.emails || []).map((email: any) => ({
        id: String(email.id || ''),
        subject: String(email.subject || ''),
        from: String(email.from || ''),
        isExpanded: false,
        isLoadingSummary: false
      }))
      setEmails(processedEmails)
      onEmailCountChange(processedEmails.length)
    } catch (error) {
      console.error("Error fetching emails:", error)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  async function fetchEmailSummary(email: Email) {
    try {
      const res = await fetch('/api/gemini-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emails: [email] }),
      })
      const data = await res.json()
      const emailSummary = data.summary[email.id]
      return emailSummary?.summary || 'No summary available'
    } catch (error) {
      console.error("Error fetching email summary:", error)
      return "Failed to load summary"
    }
  }

  async function toggleEmailExpansion(email: EmailWithSummary) {
    const updatedEmails = emails.map(e => {
      if (e.id === email.id) {
        return {
          ...e,
          isExpanded: !e.isExpanded,
          isLoadingSummary: !e.isExpanded
        }
      }
      return e
    })
    setEmails(updatedEmails)

    if (!email.isExpanded) {
      const summary = await fetchEmailSummary(email)
      setEmails(prevEmails => 
        prevEmails.map(e => 
          e.id === email.id ? { 
            ...e, 
            summary,
            isLoadingSummary: false
          } : e
        )
      )
    }
  }

  useEffect(() => {
    fetchEmails()
  }, [])

  const refreshAction = (
    <button
      onClick={fetchEmails}
      disabled={isRefreshing}
      className="inline-flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      aria-label="Refresh emails"
    >
      <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
    </button>
  )

  return (
    <Card
      title="Unread Emails"
      icon={<Mail size={18} />}
      isLoading={isLoading}
      isEmpty={emails.length === 0}
      emptyMessage="No unread emails"
      action={refreshAction}
    >
      <div className="space-y-3">
        {emails.map((email) => (
          <div
            key={email.id}
            className="group relative overflow-hidden rounded-lg border border-border/50 transition-all hover:border-primary/50 hover:bg-accent/50"
          >
            <div
              onClick={() => toggleEmailExpansion(email)}
              className="flex w-full cursor-pointer items-center justify-between p-4"
            >
              <div className="flex flex-col gap-1">
                <div className="line-clamp-1 text-sm font-medium text-card-foreground">
                  {email.subject || "(No subject)"}
                </div>
                <div className="line-clamp-1 text-xs text-muted-foreground">
                  From: {email.from}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-primary p-1 text-primary-foreground">
                  <Mail className="h-3 w-3" />
                </div>
                {email.isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </div>
            {email.isExpanded && (
              <div className="border-t border-border/50 bg-accent/30 p-4">
                <div className="prose prose-sm max-w-none">
                  {email.isLoadingSummary ? "Loading summary..." : email.summary}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}
