// app/api/notion-tasks/route.ts
import { NextResponse } from 'next/server'
import { getUpcomingTasks } from '@/lib/notionAgent'

export async function GET() {
  const tasks = await getUpcomingTasks()

  const mapped = tasks.map((task: any) => {
    const props = task.properties
    return {
      id: task.id,
      title: props['Task name']?.title?.[0]?.plain_text || 'Untitled',
      dueDate: props['Due date']?.date?.start,
      status: props['Status']?.status?.name,
      priority: props['Priority']?.select?.name,
    }
  })
  // console.log("================ ")
  // console.log(mapped)
  // console.log("================")
  return NextResponse.json({ tasks: mapped })
}
