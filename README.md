# Smart Assistant 🧠

An AI-powered dashboard that summarizes your emails, calendar events, and tasks — and generates a personalized plan for the day using Gemini and Notion.

---

## ⚙️ Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Google OAuth**
- **Gemini API (Google Generative AI)**
- **Notion API** (for task sync)
- **Google Calendar & Gmail API**
- **Redis** (for caching summaries)

---

## ✅ Features

- [x] Google sign-in via OAuth
- [x] Unread email summary from Gmail
- [x] Calendar events for the next 24 hours
- [x] Notion task integration
- [x] "Plan My Day" with Gemini prompt chaining
- [x] Auto-create tasks in Notion based on plan
- [x] Redis caching for email summaries and briefings
- [x] Modern, responsive UI

---

## 🚧 Not Yet Implemented

- [ ] “Done for today” task view
- [ ] Notifications/reminders for tasks or emails
- [ ] Redis cache invalidation on email read or task completion

---

## 🛠️ Running Locally

### 1. Clone and install:

```bash
git clone https://github.com/your-username/smart-assistant.git
cd smart-assistant
npm install
```

---

## Environment Variables Setup

To run this project locally, create a `.env.local` file in the root directory of the project and add the following environment variables:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Auth secret
NEXTAUTH_SECRET=your_nextauth_secret

# URL, same for everyone
NEXTAUTH_URL=http://localhost:3000

# Gemini API
GEMINI_API_KEY=your_google_generative_ai_key

# Notion API
NOTION_TOKEN=your_notion_integration_secret
NOTION_TASK_DB_ID=your_notion_task_database_id

# Redis
REDIS_URL=your_redis_connection_url
```
> ⚠️ **Be sure your Notion integration has access to the specified database.**  
> ⚠️ **Gmail and Google Calendar APIs must be enabled in your Google Cloud Console project.**
