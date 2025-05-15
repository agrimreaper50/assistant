// lib/calendarAgent.ts
import { google } from 'googleapis'

export async function getUpcomingEvents(token: string) {
  const auth = new google.auth.OAuth2()
  auth.setCredentials({ access_token: token })

  const calendar = google.calendar({ version: 'v3', auth })

  const now = new Date()
  const timeMin = now.toISOString()
  const timeMax = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString() // Next 24 hours

  const res = await calendar.events.list({
    calendarId: 'primary',
    timeMin,
    timeMax,
    singleEvents: true,
    orderBy: 'startTime',
  })

  const events = res.data.items || []

  return events.map(event => ({
    id: event.id,
    summary: event.summary,
    start: event.start?.dateTime || event.start?.date,
    end: event.end?.dateTime || event.end?.date,
    location: event.location,
  }))
}
