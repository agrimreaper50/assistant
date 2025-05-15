// app/api/plan-my-day/route.ts
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import { getUnreadEmails } from "@/lib/gmailAgent"
import { getUpcomingEvents } from "@/lib/calendarAgent"
import { getUpcomingTasks } from "@/lib/notionAgent"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from "next/server"
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const [emails, events, tasks] = await Promise.all([
    getUnreadEmails(session.accessToken),
    getUpcomingEvents(session.accessToken),
    getUpcomingTasks(),
  ])

  const formatted = {
    emails: emails.map(e => `From: ${e.from}\nSubject: ${e.subject}\nContent: ${e.content}`).join("\n\n"),
    events: events.map(e => `Event: ${e.summary} at ${e.start}`).join("\n"),
    tasks: tasks.map((page) => {
      const title = page.properties["Task name"]?.type === "title"
        ? page.properties["Task name"].title?.[0]?.plain_text || "Untitled"
        : "Untitled"

      const due = page.properties["Due date"]?.type === "date"
        ? page.properties["Due date"].date?.start || "TBD"
        : "TBD"

      const status = page.properties["Status"]?.type === "status"
        ? page.properties["Status"].status?.name || "Not started"
        : "Not started"

      return `Task: ${title} (Due: ${due}, Status: ${status})`
    }).join("\n")
  }

  const prompt = `
You are a personal productivity assistant. Plan the user's next 6 hours based on their current unread emails, today's calendar events, and upcoming tasks. Be detailed but concise. Prioritize urgent tasks and make helpful time recommendations. If nothing is passed in just say "No urgent or actionable items today."

Emails:
${formatted.emails}

Events:
${formatted.events}

Tasks:
${formatted.tasks}
`

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
  const result = await model.generateContent(prompt)
  const response = await result.response

  return NextResponse.json({ plan: response.text() })
}
