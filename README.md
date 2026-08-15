# 🌿 Budget Tracker — *Spend mindfully*

A full-stack personal finance app that tracks expenses, enforces budgets, grows savings goals, auto-logs recurring transactions, and serves **AI-powered insights** about your spending — wrapped in a calm, sage-green design system.

**Live demo:** `https://budget-tracking-app-amber.vercel.app/`

---

## ✨ Features

### 💰 Core
- **Authentication** — JWT-based signup/login with persistent sessions and protected routes
- **Expenses** — full CRUD with filters (category, type, date range), running totals, and **CSV export**
- **Budgets** — monthly limits per category with live progress bars and over-budget warnings
- **Goals** — savings goals with progress tracking, deadlines, and one-click contributions
- **Recurring** — subscriptions & salary on autopilot; a backend scheduler logs due items as real transactions (weekly/monthly, pause/resume)

### 📊 Dashboard
- Hero banner with period balance summary
- Income / Expense / Balance stat cards with a 3/6/12-month range selector
- Monthly trend bar chart + category donut (Recharts)
- **GitHub-style spending heatmap** (16 weeks)
- **No-spend streak** card with a weekly check-in row
- **Budget Pulse** — your most-at-risk budgets at a glance
- **Goal Spotlight** — closest-deadline goal with quick contribute

### 🤖 AI Insights
- Natural-language "spending story" generated from your data
- Focus-area chips + 5 personalized, actionable suggestions

### 🎨 UX polish
- Custom design system (sage/cream palette, Fraunces display type)
- Skeleton loaders, toast notifications, two-click delete confirmations
- Fully componentized UI kit (Button, Input, Dropdown, Modal, Toaster…)

---

## 🛠 Tech Stack

| Layer     | Tech |
|-----------|------|
| Frontend  | React + Vite, Tailwind CSS v4, Zustand, React Router, Recharts, Axios, Lucide |
| Backend   | Node.js + Express (ESM), MongoDB + Mongoose, JWT |
| AI        | LLM-powered insights (see `backend/src/utils/aiClient.js`) |
| Hosting   | MongoDB Atlas · Render (API) · Vercel (web) |

---

## 🚀 Getting Started

### Prerequisites
- Node 18+
- MongoDB (local or Atlas)
- An API key for your AI provider

### 1. Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/budget-tracker   # or your Atlas string
JWT_SECRET=change_me_to_a_long_random_string
# + your AI provider key (see src/utils/aiClient.js)
```

```bash
npm run dev          # start the API on :5000
```

### 2. Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev          # start the app on :5173
```

Sign up, add a few expenses (or run the seeder), and explore!

---

## 📡 API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` · `/api/auth/login` | Register / authenticate |
| GET | `/api/auth/me` | Current user (🔒) |
| GET/POST | `/api/expenses` | List (filterable) / create (🔒) |
| PUT/DELETE | `/api/expenses/:id` | Update / delete (🔒) |
| GET | `/api/analytics/summary?months=` | Totals, by-category, monthly trend (🔒) |
| GET | `/api/analytics/daily?days=` | Per-day totals for heatmap & streaks (🔒) |
| GET | `/api/ai/insights` | AI spending analysis (🔒) |
| GET | `/api/budgets` | Budgets + current-month spend (🔒) |
| PUT/DELETE | `/api/budgets/:category` | Upsert / remove a budget (🔒) |
| GET/POST | `/api/goals` | List / create goals (🔒) |
| PUT/DELETE | `/api/goals/:id` | Update / delete (🔒) |
| POST | `/api/goals/:id/contribute` | Add money to a goal (🔒) |
| GET/POST | `/api/recurring` | List / create recurring items (🔒) |
| PUT/DELETE | `/api/recurring/:id` | Edit / pause / delete (🔒) |

---

## 🗂 Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/          # db connection
│   │   ├── controllers/     # auth, expenses, analytics, ai, budgets, goals, recurring
│   │   ├── middleware/      # JWT protect
│   │   ├── models/          # User, Expense, Budget, Goal, Recurring
│   │   ├── routes/
│   │   └── utils/           # generateToken, aiClient, recurringScheduler
│   └── seed.js              # demo-data generator
└── frontend/
    ├── src/
    │   ├── api/             # axios client + endpoint helpers
    │   ├── components/      # ui kit + feature components
    │   ├── pages/           # Dashboard, Expenses, Budgets, Goals, Recurring, Insights
    │   ├── store/           # zustand: auth + toasts
    │   └── lib/             # constants & formatters
    └── vercel.json          # SPA rewrites
```

---

## ☁️ Deployment

1. **Database** — MongoDB Atlas (allow `0.0.0.0/0`)
2. **API** — Render: root directory `backend`, build `npm install`, start `node server.js`; env: `MONGO_URI`, `JWT_SECRET`
3. **Web** — Vercel: root directory `frontend`, env `VITE_API_URL=https://<your-api>/api`; `vercel.json` handles SPA refreshes

---



Built with 🌿 by **Rishen Manandhar**
