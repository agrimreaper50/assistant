// lib/geminiAgent.ts
import redis from './redis'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

type Email = {
  id: string
  subject: string
  from: string
  content: string
  read: boolean
}

export async function summarizeEmails(emails: Email[]) {
  const summaries: { [id: string]: { subject: string; from: string; summary: string } } = {}

  for (const email of emails) {
    const cacheKey = `summary:${email.id}`

    if (email.read) {
      await redis.del(cacheKey) // 🚮 delete from Redis
      continue
    }

    const cached = await redis.get(cacheKey)

    if (cached) {
      summaries[email.id] = JSON.parse(cached)
      continue
    }

    // ✍️ If not cached, run Gemini
    const prompt = `Summarize this email in exactly 3 sentences. Include the sender's intent, the main content, and whether any action is needed:\n\nFrom: ${email.from}\nSubject: ${email.subject}\nContent: ${email.content}`
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const result = await model.generateContent(prompt)
    const response = await result.response
    const summary = response.text()
    console.log("here")
    console.log(summary)
    const resultObj = {
      subject: email.subject,
      from: email.from,
      summary,
    }

    await redis.set(cacheKey, JSON.stringify(resultObj), 'EX', 60 * 60 * 24)
    summaries[email.id] = resultObj
  }
  return summaries
}

export async function invalidateCache(userEmail: string) {
  const cacheKeys = [
    `briefing:${userEmail}`,
    `plan:${userEmail}`,
  ]
  
  // Delete all cache keys
  await Promise.all(cacheKeys.map(key => redis.del(key)))
  
  // Also delete all email summaries
  const emailKeys = await redis.keys('summary:*')
  if (emailKeys.length > 0) {
    await Promise.all(emailKeys.map(key => redis.del(key)))
  }
}
