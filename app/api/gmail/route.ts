// app/api/gmail/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { getUnreadEmails } from '@/lib/gmailAgent'
import { invalidateCache } from '@/lib/geminiAgent'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || !session.accessToken || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const emails = await getUnreadEmails(session.accessToken as string)
  
  // Invalidate cache when new emails are fetched
  await invalidateCache(session.user.email)
  
  return NextResponse.json({ emails })
}
