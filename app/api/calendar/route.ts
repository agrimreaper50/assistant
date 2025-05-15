// app/api/calendar/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { getUpcomingEvents } from '@/lib/calendarAgent'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const events = await getUpcomingEvents(session.accessToken as string)
  return NextResponse.json({ events })
}
