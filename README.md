# Acowale CRM Machine Test by Manjula Satapathi

A lightweight customer feedback platform: a public form for submitting feedback, and an admin dashboard for tracking trends, category distribution, and acting on submissions via status updates.

**Live app:** https://acowale-pf50wy72q-manshnu.vercel.app
**Live API:** https://acowale-crm-api.onrender.com
**Admin login:** provided separately in submission email, per instructions

> Note: the backend is hosted on Render's free tier, which spins down after inactivity. The first request after a period of idleness may take 30–50 seconds to respond while it wakes up — this is expected, not a bug.

## Tech stack

- **Frontend:** React + TypeScript + Vite, Tailwind CSS, Recharts, React Router
- **Backend:** Node.js + Express + TypeScript
- **Database:** MySQL (hosted on Railway)
- **Auth:** JWT (admin routes only; public submission stays open)
- **Deployment:** Vercel (frontend), Render (backend), Railway (database)

See `DECISIONS.md` for the full reasoning behind each of these choices, including trade-offs and a mid-build database provider switch.

## Features

**Public feedback form**
- Submit feedback with category, comment, and optional email
- Client + server-side validation

**Admin dashboard** (JWT-protected)
- Total feedback count, in-progress/resolved counts
- 14-day feedback trend line chart
- Category distribution bar chart
- Recent submissions with inline status updates (received → in progress → resolved)
- Dedicated Feedback page: full paginated table, search, category filter

**Backend**
- REST APIs: submit feedback, fetch feedback (with search/filter/pagination), fetch analytics summary, update status, admin login
- Input validation (express-validator), rate limiting on public submit endpoint, structured error handling, request logging, health-check endpoint
- Environment-variable-based configuration throughout; no secrets committed to the repo

## Running locally

**Backend:**
```bash
cd backend
npm install
cp .env.example .env   # fill in your own DB credentials, JWT secret, admin email/password
npm run db:setup        # creates database + tables
npm run seed:admin       # creates the admin user from .env
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
cp .env.example .env   # set VITE_API_URL to your backend URL
npm run dev
```

## My journey (short version — see DECISIONS.md for the full log)

I built this with Claude (Anthropic) as a pairing partner — I typed and ran every command myself so I could actually explain the code in the technical interview round, rather than handing off the whole build. The backend (schema, auth, APIs) came together smoothly. The trickiest part was deployment: I initially tried TiDB Cloud for the database, hit a persistent, unexplained authentication error I couldn't resolve even after ruling out typos, whitespace, and TLS config, and made the call to switch to Railway mid-build rather than keep debugging blind against the clock. That decision — and the reasoning behind it — is documented in `DECISIONS.md`, question 6.

The frontend went through two real design passes: an initial version that technically met the spec but looked like a tutorial project, and a second pass (prompted by my own critique that it didn't actually show *trends*, just static pill counts) that added a real 14-day trend chart, a category bar chart, and status-driven "act on feedback" controls — directly responding to the brief's own language about analysing trends and building something #TeamAcowale would keep building on.
