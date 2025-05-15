// app/api/flush-cache/route.ts
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import redis from '@/lib/redis'
import { NextResponse } from 'next/server'

export async function POST() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const cacheKey = `briefing:${session.user.email}`
  await redis.del(cacheKey)

  return NextResponse.json({ status: 'Cache cleared' })
}
