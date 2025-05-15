// app/api/briefing/route.ts
import { NextResponse } from 'next/server'
import { getUnreadEmails } from '@/lib/gmailAgent'
import { getUpcomingEvents } from '@/lib/calendarAgent'
import { getUpcomingTasks } from '@/lib/notionAgent'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import redis from '@/lib/redis'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const cacheKey = `briefing:${session.user.email}`
  const cached = await redis.get(cacheKey)

  if (cached) {
    return NextResponse.json({ summary: cached })
  }

  const token = session.accessToken

  const [emails, events, tasks] = await Promise.all([
    getUnreadEmails(token),
    getUpcomingEvents(token),
    getUpcomingTasks(),
  ])

  const formatted = {
    emails: emails.map(e => `From: ${e.from}\nSubject: ${e.subject}\nContent: ${e.content}`).join('\n\n'),
    events: events.map(e => `Event: ${e.summary} at ${e.start}`).join('\n'),
    tasks: tasks.map((page) => {
      const title =
        page.properties['Task name']?.type === 'title'
          ? page.properties['Task name'].title?.[0]?.plain_text || 'Untitled'
          : 'Untitled'
    
      const dueDate =
        page.properties['Due date']?.type === 'date'
          ? page.properties['Due date'].date?.start || null
          : null
      const status =
        page.properties["Status"]?.type === "status"
          ? page.properties["Status"].status?.name || "Not started"
          : "Not started"
      const priority =
        page.properties['Priority']?.type === 'select'
          ? page.properties['Priority'].select?.name
          : 'Unspecified'
    
      const effort =
        page.properties['Effort level']?.type === 'select'
          ? page.properties['Effort level'].select?.name
          : 'Unspecified'
    
      return `Task: ${title} (Due: ${dueDate ?? 'TBD'}, Status: ${status}, Priority: ${priority}, Effort: ${effort})`
    }).join('\n'),
    
  }

  const prompt = `
You are a smart assistant. Write a 3–5 sentence briefing based on the following:

Emails:
${formatted.emails}

Events:
${formatted.events}

Tasks:
${formatted.tasks}

Summarize what's important today. Mention anything urgent or actionable. If nothing is given, say "No urgent or actionable items today."
`

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
  const result = await model.generateContent(prompt)
  const response = await result.response
  const summary = response.text()

  await redis.set(cacheKey, summary, 'EX', 60 * 15) // cache for 15 minutes


  return NextResponse.json({ summary })
}
