"use client"

import { useSession, signIn } from "next-auth/react"
import Header from "@/components/header"
import EmailCard from "@/components/email-card"
import CalendarCard from "@/components/calendar-card"
import NotionCard from "@/components/notion-card"
import StatsCard from "@/components/stats-card"
import BriefingCard from "@/components/briefing-card"
import PlanMyDayCard from "@/components/plan-my-day-card"
import { Mail, Calendar, CheckSquare, Clock } from "lucide-react"
import { useState, useEffect } from "react"

export default function Home() {
  const { data: session, status } = useSession()
  const isLoading = status === "loading"
  const [currentTime, setCurrentTime] = useState(new Date())
  const [unreadEmailCount, setUnreadEmailCount] = useState(0)
  const [eventsCount, setEventsCount] = useState(0)
  const [tasksCount, setTasksCount] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    async function fetchCounts() {
      try {
        const [eventsRes, tasksRes] = await Promise.all([
          fetch("/api/calendar"),
          fetch("/api/notion-tasks")
        ])
        const eventsData = await eventsRes.json()
        const tasksData = await tasksRes.json()
        
        setEventsCount(eventsData.events?.length || 0)
        setTasksCount(tasksData.tasks?.length || 0)
      } catch (error) {
        console.error("Error fetching counts:", error)
      }
    }

    if (session) {
      fetchCounts()
    }
  }, [session])

  if (isLoading) {
    return (
      <div className="gradient-bg flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="text-lg font-medium text-white">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="gradient-bg min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="glow max-w-3xl">
              <h1 className="mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl lg:text-6xl">
                Your Personal Smart Assistant
              </h1>
              <p className="mb-10 text-xl text-gray-300">
                Connect your accounts to see all your important information in one place. Stay organized and never miss
                what matters.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <button
                  onClick={() => signIn("google")}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-lg font-medium text-primary-foreground shadow-lg transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  Sign in with Google
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-6 w-6">
                    <g>
                      <path stroke="black" strokeWidth="2" fill="#4285F4" d="M24 9.5c3.54 0 6.36 1.22 8.3 2.98l6.18-6.18C34.64 2.7 29.74 0 24 0 14.82 0 6.88 5.8 2.99 14.09l7.19 5.59C12.01 13.99 17.52 9.5 24 9.5z"/>
                      <path stroke="black" strokeWidth="2" fill="#34A853" d="M46.14 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.44c-.54 2.9-2.18 5.36-4.66 7.01l7.19 5.59C43.98 37.2 46.14 31.36 46.14 24.55z"/>
                      <path stroke="black" strokeWidth="2" fill="#FBBC05" d="M10.18 28.68A14.5 14.5 0 0 1 9.5 24c0-1.62.28-3.19.78-4.68l-7.19-5.59A23.94 23.94 0 0 0 0 24c0 3.77.9 7.34 2.49 10.47l7.69-5.79z"/>
                      <path stroke="black" strokeWidth="2" fill="#EA4335" d="M24 48c6.48 0 11.93-2.15 15.91-5.85l-7.69-5.79c-2.13 1.43-4.87 2.29-8.22 2.29-6.48 0-11.99-4.49-13.82-10.5l-7.69 5.79C6.88 42.2 14.82 48 24 48z"/>
                      <path fill="none" d="M0 0h48v48H0z"/>
                    </g>
                  </svg>
                </button>
              </div>
            </div>

            <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="gradient-border card-hover flex flex-col items-center p-8 text-center">
                <Mail className="mb-4 h-10 w-10 text-primary" />
                <h3 className="mb-2 text-xl font-bold">Email Integration</h3>
                <p className="text-muted-foreground">
                  Stay on top of your inbox with unread email notifications and quick access to important messages.
                </p>
              </div>
              <div className="gradient-border card-hover flex flex-col items-center p-8 text-center">
                <Calendar className="mb-4 h-10 w-10 text-primary" />
                <h3 className="mb-2 text-xl font-bold">Calendar Events</h3>
                <p className="text-muted-foreground">
                  Never miss an appointment with upcoming event reminders and schedule management.
                </p>
              </div>
              <div className="gradient-border card-hover flex flex-col items-center p-8 text-center">
                <CheckSquare className="mb-4 h-10 w-10 text-primary" />
                <h3 className="mb-2 text-xl font-bold">Task Management</h3>
                <p className="text-muted-foreground">
                  Keep track of your Notion tasks and stay productive with due date reminders.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">Your Dashboard</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Here's what's happening today, {session.user?.name?.split(" ")[0] || "there"}
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Current Time"
            value={currentTime.toLocaleTimeString()}
            description="Local time"
            icon={<Clock className="h-5 w-5" />}
          />
          <StatsCard
            title="Unread Emails"
            value={unreadEmailCount.toString()}
            description="In the last 24 hours"
            icon={<Mail className="h-5 w-5" />}
          />
          <StatsCard
            title="Today's Events"
            value={eventsCount.toString()}
            description="Scheduled for today"
            icon={<Calendar className="h-5 w-5" />}
          />
          <StatsCard
            title="Pending Tasks"
            value={tasksCount.toString()}
            description="Due in the next 24 hours"
            icon={<CheckSquare className="h-5 w-5" />}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <BriefingCard />
          <EmailCard onEmailCountChange={setUnreadEmailCount} />
          <CalendarCard />
          <NotionCard />
          <PlanMyDayCard className="col-span-full" />
        </div>
      </main>
    </div>
  )
}
