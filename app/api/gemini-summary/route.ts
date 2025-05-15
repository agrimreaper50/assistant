// app/api/gemini-summary/route.ts
import { NextResponse } from 'next/server'
import { summarizeEmails } from '@/lib/geminiAgent'

export async function POST(req: Request) {
  const { emails } = await req.json()
  const summary = await summarizeEmails(emails)
  return NextResponse.json({ summary })
}
