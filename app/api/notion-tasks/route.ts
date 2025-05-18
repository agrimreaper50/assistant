// app/api/notion-tasks/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { getUpcomingTasks } from '@/lib/notionAgent'
import { invalidateCache } from '@/lib/geminiAgent'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const tasks = await getUpcomingTasks()
  
  // Invalidate cache when new tasks are fetched
  await invalidateCache(session.user.email)
  
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
