import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { getUnreadEmails } from '@/lib/gmailAgent'
import { getUpcomingEvents } from '@/lib/calendarAgent'
import { getUpcomingTasks, createNotionTask } from '@/lib/notionAgent'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.accessToken || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const token = session.accessToken

  const [emails, events, tasks] = await Promise.all([
    getUnreadEmails(token),
    getUpcomingEvents(token),
    getUpcomingTasks(),
  ])

  const formattedContext = `
  Emails:
  ${emails.map(e => `- ${e.subject} (from ${e.from})`).join('\n') || 'None'}

  Events:
  ${events.map(e => `- ${e.summary} from ${e.start} to ${e.end}`).join('\n') || 'None'}

  Tasks:
  ${tasks.map(t => {
    const title = t.properties['Task name']?.title?.[0]?.plain_text || 'Untitled'
    const priority = t.properties['Priority']?.select?.name || 'Unspecified'
    const dueDate = t.properties['Due date']?.date?.start || 'TBD'
    return `- ${title} (priority: ${priority}, due: ${dueDate})`
  }).join('\n') || 'None'}
  `

    // 🧠 Step 1 — Think
    const thoughtPrompt = `
  You are a productivity assistant. Given the user's current schedule and inbox, reflect on any priorities, conflicts, or important observations. Use short, direct sentences.

  ${formattedContext}
  `
    const thoughtResponse = await model.generateContent(thoughtPrompt)
    const thought = thoughtResponse.response.text().trim()
  //  📋 Step 2 — Plan
    const planPrompt = `
  Based on this reasoning:

  "${thought}"

  Create a detailed plan for the user's next 6 hours. Don't include any stretching or exercise in between tasks. Start with a sentence saying this is the plan for the day. Include task names, time blocks, and reasoning for any urgent items.
  DO NOT USE MARKDOWN FORMATTING ANYWHERE IN THE PLAN. BE AS MINIMALIST AS POSSIBLE WHILE GETTING POINT ACROSS`
    const planResponse = await model.generateContent(planPrompt)
    const plan = planResponse.response.text().trim()
    console.log("================================================")
    console.log("🧠 Plan:", plan)
    console.log("================================================")

    // 🛠️ Step 3 — Act
    const actPrompt = `
  Translate the following plan into Notion tasks. Output only a JSON array using this format:

  [
    {
      "title": "string",
      "description": "string",
      "status": "Not started" | "In progress" | "Completed",
      "priority": "High" | "Medium" | "Low",
      "effort": "Small" | "Medium" | "Large",
      "dueDate": "YYYY-MM-DD" // optional
    }
  ]
  When creating tasks 10 tasks for a simple 1 task. Example: One unread email and one event should only create one task (unless email content said otherwise).
  Plan:
  ${plan}
  `
    const actResponse = await model.generateContent(actPrompt)
    let parsedTasks: any[] = []

    try {
      const raw = actResponse.response.text()
        .replace(/```json/, '')
        .replace(/```/, '')
        .trim()
      parsedTasks = JSON.parse(raw)
    } catch (err) {
      console.error("❌ Could not parse tasks:\n", actResponse.response.text())
      return NextResponse.json({ error: "Invalid JSON from Gemini", raw: actResponse.response.text() }, { status: 400 })
    }

    const created = []
    for (const task of parsedTasks) {
      try {
        const res = await createNotionTask({
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          effort: task.effort,
          dueDate: task.dueDate,
        })
        created.push(res)
      } catch (err) {
        console.error("❌ Failed to create task:", task, err)
      }
    }

    return NextResponse.json({plan})
}
