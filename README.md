# The Big Brain Challenge 🧠✨

A fun, kid-friendly IQ-style quiz app built with Next.js, React, and TypeScript. 60 questions across four categories — patterns, logic, math, and words — end in a fun estimated score. This is **not** a real or clinical IQ test; it's a homemade quiz for practicing thinking skills.

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Editing the questions

The question bank lives in [`lib/questions.ts`](lib/questions.ts) — 15 questions per category (`pattern`, `logic`, `math`, `verbal`), split 5 easy / 5 medium / 5 hard. Add, remove, or edit questions there; the app automatically interleaves categories and orders difficulty from easy to hard.

Scoring logic (how answers turn into the estimated score) lives in [`lib/scoring.ts`](lib/scoring.ts).

## Deploying to Vercel

1. Push this repo to GitHub (see below if you haven't already).
2. Go to [vercel.com](https://vercel.com), click **Add New → Project**, and import the GitHub repo.
3. Vercel auto-detects Next.js — just click **Deploy**.
4. Every future `git push` to `main` automatically redeploys the live site.

## Pushing to GitHub for the first time

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

(Or use `gh repo create <repo-name> --public --source=. --remote=origin --push` if you have the GitHub CLI installed.)
