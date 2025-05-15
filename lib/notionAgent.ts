// lib/notionAgent.ts
import { Client } from '@notionhq/client'
import { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints'

const notion = new Client({ auth: process.env.NOTION_API_KEY })

export async function createNotionTask({
  title,
  description,
  status = 'Not started',
  priority = 'Medium',
  effort = 'Small',
  dueDate,
}: {
  title: string
  description?: string
  status?: string
  priority?: string
  effort?: string
  dueDate?: string // YYYY-MM-DD format
}) {
  const sanitize = (value: string | undefined, allowed: string[], fallback: string) =>
    allowed.includes(value || '') ? value! : fallback

  const allowedStatuses = ['Not started', 'In progress', 'Completed']
  const allowedPriorities = ['High', 'Medium', 'Low']
  const allowedEffortLevels = ['Small', 'Medium', 'Large']

  status = sanitize(status, allowedStatuses, 'Not started')
  priority = sanitize(priority, allowedPriorities, 'Medium')
  effort = sanitize(effort, allowedEffortLevels, 'Small')

  if (dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
    console.warn('⚠️ Invalid dueDate, ignoring:', dueDate)
    dueDate = undefined
  }

  // ✅ Log what you're creating
  console.log('🔧 Creating task in Notion with sanitized values:', {
    title,
    status,
    priority,
    effort,
    dueDate,
    description,
  })

  try {
    const res = await notion.pages.create({
      parent: {
        database_id: process.env.NOTION_TASK_DB_ID!,
      },
      properties: {
        'Task name': {
          title: [{ text: { content: title } }],
        },
        'Status': {
          status: { name: status },
        },
        'Priority': {
          select: { name: priority },
        },
        'Effort level': {
          select: { name: effort },
        },
        ...(dueDate && {
          'Due date': {
            date: { start: dueDate },
          },
        }),
        ...(description && {
          'Description': {
            rich_text: [{ text: { content: description } }],
          },
        }),
      },
    })

    console.log('✅ Task created in Notion:', res.id)
    return { taskId: res.id }
  } catch (error) {
    console.error('❌ Failed to create Notion task:', error)
    throw error
  }
}



export async function getUpcomingTasks(): Promise<QueryDatabaseResponse['results']> {
    const now = new Date()
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
  
    const start = now.toISOString().split('T')[0]
    const end = tomorrow.toISOString().split('T')[0]
  
    const response = await notion.databases.query({
      database_id: process.env.NOTION_TASK_DB_ID!,
      filter: {
        and: [
            {
              property: 'Due date',
              date: {
                on_or_after: start,
              },
            },
            {
              property: 'Due date',
              date: {
                on_or_before: end,
              },
            },
          ],
      },
      sorts: [
        {
          property: 'Due date',
          direction: 'ascending',
        },
      ],
    })
    return response.results
  }