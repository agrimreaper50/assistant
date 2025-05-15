// lib/gmailAgent.ts
import { google } from 'googleapis'

interface Email {
  id: string
  subject: string
  from: string
  content: string
}

export async function getUnreadEmails(token: string) {
  const auth = new google.auth.OAuth2()
  auth.setCredentials({ access_token: token })

  const gmail = google.gmail({ version: 'v1', auth })

  const res = await gmail.users.messages.list({
    userId: 'me',
    q: 'is:unread category:primary newer_than:1d',
    maxResults: 10,
  })

  const messages = res.data.messages || []

  const summaries = await Promise.all(
    messages.map(async (msg) => {
      const full = await gmail.users.messages.get({
        userId: 'me',
        id: msg.id!,
        format: 'full',
      })

      const headers = full.data.payload?.headers || []
      const subject = headers.find(h => h.name === 'Subject')?.value || ''
      const from = headers.find(h => h.name === 'From')?.value || ''
      const content = full.data.snippet || ''

      return { id: msg.id, subject, from, content }
    })
  )

  return summaries
}
