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
