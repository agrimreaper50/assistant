// app/api/gmail/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { getUnreadEmails } from '@/lib/gmailAgent'

export async function GET() {
  const session = await getServerSession(authOptions)
  console.log('Session:', session)

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const emails = await getUnreadEmails(session.accessToken as string)
  return NextResponse.json({ emails })
}
