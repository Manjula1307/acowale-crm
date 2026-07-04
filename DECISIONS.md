# Engineering Decision Log — Acowale CRM Machine Test by Manjula Satapathi

## 1. Why did you choose this technology stack?
React + TypeScript + Node.js/Express + MySQL — the same stack I used in my nDMatrix internship and in my own deployed projects (MediScan, Farm2You). Choosing a stack I already have production experience with let me spend my time budget on the actual product requirements (trend analysis, status workflows, auth) rather than learning new tooling under a deadline. TypeScript specifically was chosen over plain JS because `strict` mode catches undefined/null bugs at compile time rather than at 1am in production.

## 2. Why did you choose this database?
MySQL, because the data here is genuinely relational and small in shape — feedback rows with a fixed set of fields, filtered and grouped by category/status/date. That's a strong fit for SQL's `GROUP BY`/`WHERE` over a document store. I deployed it on Railway (MySQL-compatible, generous free tier). I initially tried TiDB Cloud Starter for its indefinitely-free tier, but hit a persistent, unexplained authentication failure against the default root user (confirmed not a typo — tested with four separately-generated fresh passwords, all failing identically) that I couldn't resolve within a reasonable time budget. I made the call to switch providers rather than keep debugging an opaque auth issue — Railway's $5/30-day trial credit comfortably covers a submission-length evaluation window.

## 3. Why did you structure your application this way?
Separate `frontend`/`backend` folders so each deploys independently (Vercel builds only the frontend, Render only the backend). Inside the backend, routes/controllers/db/middleware are split by responsibility (routes just wire URLs to controller functions; controllers hold logic; middleware holds cross-cutting concerns like auth). On the frontend, pages are route-level screens, components are reusable pieces (StatusDropdown, CategoryDropdown, chart wrappers) shared between the Overview and Feedback pages.

## 4. What trade-offs did you make due to time constraints?
- Switched database providers mid-build (TiDB → Railway) rather than losing more time to an unexplained auth issue — a real, live trade-off, not a hypothetical one.
- Pagination on the Feedback page uses a simple "disable Next if fewer than page-size rows returned" approach instead of a true total-count/total-pages query — works correctly but can't jump to an arbitrary page number.
- Skipped CI/CD and formal monitoring/observability (bonus items) in favor of getting auth, validation, and the trend/status features — which map directly to the brief's own core ask — done well.
- The public form re-fetches feedback data on every keystroke in the admin search box rather than debouncing — invisible at this data volume, but a real, known limitation at scale.

## 5. What would you improve if you had one more week?
- Real pagination with total counts.
- Debounced search.
- A proper multi-admin `roles` system instead of a single seeded admin.
- Unit tests around the controllers (validation edge cases, status transitions).
- CI/CD (GitHub Actions running tests + typecheck on push).
- Basic monitoring/alerting (e.g. a simple uptime check hitting `/api/health`).

## 6. What was the most difficult technical challenge you faced?
Getting TiDB Cloud to accept a valid, freshly-generated password. I methodically ruled out typos (verified via `JSON.stringify` logging of the exact env values), trailing whitespace, TLS/SSL configuration, and even created a brand-new dedicated database user from scratch — all failed identically with the same generic "access denied" error. After confirming the database and schema worked fine through TiDB's own browser SQL editor (so the account/cluster itself was healthy), I concluded the issue was specific to how the CLI/driver was authenticating against that particular cluster, and switched to Railway rather than continue debugging blind against a deadline. This was also a real lesson in knowing when to stop debugging and change approach.

## 7. Which AI tools did you use?
Claude (Anthropic), used conversationally throughout — for planning, code generation (which I then typed/pasted into my own VS Code and ran myself), debugging error messages, and design decisions. I did not use an AI coding agent with direct file/terminal access to my machine; every command was run by me, every result reported back.

## 8. Share one instance where AI helped you.
When my dashboard's category chart rendered as a solid black block instead of colored bars, I described the symptom and pasted a screenshot. Claude correctly diagnosed that I'd used a raw `<rect>` element instead of Recharts' `<Cell>` component for per-bar coloring — a Recharts-specific API detail I wouldn't have known to look for from the visual symptom alone.

## 9. Share one instance where you disagreed with AI and why.
Claude's first-pass admin dashboard used plain category "pills" showing counts, with no time-based visualization at all. When I pushed back that the brief specifically says "analyse trends" and pointed out my dashboard didn't show any trend, Claude agreed this was a real gap (not just a styling complaint) and we added a genuine 14-day trend line backed by a new `GROUP BY DATE(created_at)` backend query — a functional gap I caught, not just a visual preference.

## 10. What would break first if this application suddenly had 100,000 users?
The database connection pool (`connectionLimit: 10` in `pool.ts`) would saturate almost immediately — ten concurrent connections cannot serve 100,000 users' worth of concurrent requests. Right behind that, the `getSummary` endpoint's category/status GROUP BY queries scan the entire `feedback` table on every dashboard load with no caching — at 100,000+ rows this would slow dramatically without an index strategy or a cached/materialized summary table refreshed on a schedule instead of computed live per-request.

## 11. What is one thing in this assignment that you would improve, change, or challenge?
The reference dashboard screenshot in the brief shows a donut chart for category distribution, but with 4–5 categories a donut is genuinely harder to compare at a glance than a horizontal bar chart (a well-known human-perception limitation with pie/donut charts). I'd challenge including a specific visual reference at all, even framed as "inspiration only" — it's very easy for it to anchor evaluators (and candidates) toward matching it rather than making independent product/UX judgment calls, which the brief otherwise explicitly says it wants to see.
