# Teach Us — Manjula Satapathi

## Idea: Treat "what would break at scale" as a required section of every PR, not just an interview question

This assignment asks candidates "what would break first at 100,000 users?" as a reflective question after the fact. I think that question is far more valuable asked *before* the fact — as a mandatory, one-paragraph section in every pull request template, answered by the engineer who wrote the code, before a reviewer even looks at it.

**Why this, specifically:** while building this project, I noticed a pattern in my own decisions — I made scale trade-offs constantly (a fixed connection pool size, live GROUP BY queries with no caching, a 14-day window on trend data instead of all-time) but I only had to *articulate* them because this brief explicitly asked me to. In normal day-to-day feature work, those same trade-offs get made silently, in an engineer's head, and never written down anywhere. Six months later, when the feature actually breaks under load, nobody remembers that the limit was a deliberate choice versus an oversight — and worse, the person debugging it at 2am has no record of *why* the original engineer chose 10 connections instead of 50, or a 14-day window instead of 90.

**How it would work concretely:**
- Add one required field to the PR template: "At what scale does this break, and what's the first thing that fails?"
- It doesn't need to be rigorous or benchmarked — a one-sentence honest guess is enough (e.g. "connection pool saturates somewhere around a few hundred concurrent users; would need to move to a queue or increase pool size").
- Reviewers use it as a genuine discussion prompt, not a gate — the goal isn't to block every PR that doesn't scale to a million users, it's to make scale trade-offs *visible and intentional* rather than invisible and accidental.
- Over time, this creates a searchable trail of "known scale limits" across the codebase — genuinely useful when planning capacity work, and it turns institutional knowledge that currently lives only in senior engineers' heads into something documented and transferable to newer team members.

**Why I think this fits Acowale specifically:** the brief already signals that Acowale cares about "assume this is a real product that #TeamAcowale would continue building after launch" — that framing only works if the *next* engineer touching a feature knows what corners were cut and why. A "why" a decision was made is exactly the kind of context that's expensive to reconstruct after the original author has moved to a different feature (or a different company), and cheap to capture in the moment while it's still fresh in the author's head.

**The honest limitation:** this only works if it's genuinely lightweight — the moment it becomes a mandatory essay or a box-ticking exercise nobody reads, it dies the way most process additions die. It has to stay a single honest sentence, not a scalability audit.

I don't think this is a novel idea in the abstract — plenty of teams do informal versions of it — but making it a literal required PR template field, rather than a "nice to have we should really document these," is the specific, concrete version of it that I think would actually stick.
