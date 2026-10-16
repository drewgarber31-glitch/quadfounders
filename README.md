# Quad Founders

An AI startup co-pilot that walks college students from an idea to a launched business, around their class schedule.

**What works today**
1. **Idea in.** A student types their idea. The co-pilot asks 3 to 5 follow-up questions, one at a time, and every one can be skipped.
2. **The Quad.** It builds a business plan in 4 quadrants: idea and customer, pricing and costs, marketing and first customers, and legal and registration. Each quadrant has small tasks of 15 to 60 minutes.
3. **Guided tasks.** Each task opens a chat with the co-pilot. Legal steps link only to verified official sources.
4. **Website.** It builds a 4-page site (Home, About, Services, Contact) from the plan. Students preview it on phone or desktop, ask for changes, add contact info, and download a .zip.

**Built on:** Cloudflare Workers, a D1 database, plain HTML/CSS/JS, and Claude Haiku 5.5. The AI provider can be swapped in `src/ai.js`.

---

## Setup (about 10 minutes)

You need Node.js 18+ and your Cloudflare account.

```bash
npm install
npx wrangler login                      # opens your browser to sign in to Cloudflare
npx wrangler d1 create quadfounders     # prints a database_id
```

Copy the `database_id` it prints into `wrangler.jsonc`, replacing `REPLACE_WITH_YOUR_D1_DATABASE_ID`. Then:

```bash
npx wrangler d1 migrations apply DB --remote   # creates the tables
npx wrangler deploy                            # publishes the app
```

### Add your Anthropic API key (safely)

Never paste the key into chat, code, or `wrangler.jsonc`. Store it as a Cloudflare secret:

```bash
npx wrangler secret put ANTHROPIC_API_KEY
```

Wrangler asks you to paste the key, hides it as you type, and stores it encrypted in Cloudflare. Only the Worker can read it. Until a key is set, the app runs in **test mode** with sample answers and a yellow banner.

### Try it on your computer first (optional)

```bash
npx wrangler d1 migrations apply DB --local
npm run dev        # http://localhost:8787
```

This runs in test mode unless you create a `.dev.vars` file (see `.dev.vars.example`). That file is git-ignored, so it never gets pushed.

---

## Settings (`wrangler.jsonc` → `vars`)

| Setting | Default | What it does |
|---|---|---|
| `AI_MODEL_FAST` | `claude-haiku-5-5` | Follow-up questions and task chat |
| `AI_MODEL_BUILD` | `claude-haiku-5-5` | Business plan and website. Change to `claude-sonnet-5-5` if quality isn't good enough |
| `DAILY_AI_LIMIT_PER_VISITOR` | `60` | Max AI calls per visitor per day (cost protection) |
| `DAILY_AI_LIMIT_TOTAL` | `2000` | Max AI calls for the whole app per day (cost protection) |

There are no logins, so the daily limits are what stop a stranger from running up your AI bill. Also set a monthly spend limit in the Anthropic Console.

---

## Safety rules built in

- **Educational only.** Every AI call includes rules: no legal, tax, financial or investment advice, no promised results, and no debt management (`src/prompts.js`).
- **Never asks for** Social Security numbers, ID numbers, bank details or passwords.
- **Verified sources only.** The AI can only cite sources in `src/sources.js` (SBA, IRS, NC Secretary of State, NC Dept. of Revenue, SCORE). Each was checked by hand and dated. Unknown citations are stripped out. Legal tasks are fixed steps, not invented by the AI.
- **No made-up contact info.** The site's email, Instagram and location only come from what the student types, and they're validated.
- **Safe student sites.** All AI text is escaped. Previews run with no scripts.
- **Students own their sites.** They download the files and publish on their own account and domain.

## Known limits (honest list)

- **No logins.** A plan is reachable by anyone with its link (a random ID). Plans are listed only on the device that made them.
- **North Carolina only** for registration steps.
- **Not built yet:** one-click publishing to the student's own Cloudflare account (planned via Cloudflare's official OAuth apps), and course-load scheduling with manual entry plus the Canvas calendar feed.
- **Untested with real AI.** Token use and answer quality need testing once the key is added.

## Files

```
src/index.js      API routes, previews, cost limits
src/ai.js         AI provider + test mode
src/prompts.js    All AI instructions and safety rules
src/sources.js    Verified official source library
src/site.js       Student website renderer + .zip download
public/           The app students use (index.html, app.css, app.js)
migrations/       Database tables
```
