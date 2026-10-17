# Quad Founders

An AI startup co-pilot that walks college students from an idea to a launched business, around their class schedule.

**What works today**
1. **Idea in.** A student types their idea. The co-pilot asks 3 to 5 follow-up questions, one at a time, and every one can be skipped.
2. **The Quad.** It builds a business plan in 4 quadrants: idea and customer, pricing and costs, marketing and first customers, and legal and registration. Each quadrant has small tasks of 15 to 60 minutes.
3. **Guided tasks.** Each task opens a chat with the co-pilot. Legal steps link only to verified official sources.
4. **Test site.** It builds a 4-page test site (Home, About, Services, Contact) from the plan, with a sign-up form that collects a visitor's name, email, and one optional answer. Students share a live link (`/s/:publicId`, which never reveals the plan) or download a .zip; the form works in both. Sign-ups show in the app, download as CSV, and can be deleted.
5. **Launch path.** Test sites can't run logins, matching, or payments. For ideas that need a real app, the plan adds sourced steps in order: run it by hand first, take payments through a hosted payment link (Quad Founders never handles money), try a no-code builder, then privacy policy, accounts, code ownership, and insurance.

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
npx wrangler d1 migrations apply DB --remote   # creates the tables (run again after pulling new migrations)
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
- **Legal topics are only flagged, never advised on.** Legal, tax, licensing, insurance, privacy, payments, IP, and immigration steps are worded as "Look into..." and always shown (the AI can't hide one as "doesn't apply"). The co-pilot never says what applies or what a student must do, and refuses to write legal documents. A server-side filter (`legalSafe` in `src/index.js`) also drops any sentence like "you don't need a license" from legal steps, summaries, walkthroughs, and chat replies.
- **Never asks for** Social Security numbers, ID numbers, bank details or passwords.
- **Verified sources only.** The AI can only cite sources in `src/sources.js` (SBA, IRS, NC Secretary of State, NC Dept. of Revenue, SCORE). Each was checked by hand and dated. Unknown citations are stripped out. Legal tasks are fixed steps, not invented by the AI.
- **No made-up contact info.** The site's email, Instagram and location only come from what the student types, and they're validated.
- **Safe student sites.** All AI text is escaped. Previews run with no scripts.
- **Test sites only.** Student sites can't run logins, matching, or payments, and the AI is told never to claim they can. App ideas get a launch path instead.
- **Sign-ups are minimal and deletable.** Name, email, and one optional answer. Sensitive questions are blocked. The form needs the student's contact email (so visitors can ask to be removed), says visitors must be 13+, and links to `/privacy`. Spam limits: a hidden honeypot field, 30 sign-ups per network per site per day, 2,000 per site. CSV exports are protected against spreadsheet formulas.
- **Delete anytime.** Students can delete one sign-up, all of them, or the whole plan (plan, chats, site, and sign-ups).

## Knowledge library (how the co-pilot is grounded)

The AI model itself isn't retrained. Instead, every plan and co-pilot answer is given a **verified knowledge library** (`src/knowledge.js`) and told to base any rule, fee, requirement or number on it, citing the source.

- **For every business:** market research, competitive analysis, lean business plan, startup costs, break-even, funding, marketing plan, FTC rules on reviews and influencer disclosures, business structure, trademarks, licenses, self-employment taxes, banking and insurance (SBA, IRS, USPTO, FTC).
- **Business-type rules:** the co-pilot detects the type (service, product, online, food, digital, beauty) and adds matching rules:
  - **Food:** NC home food rules (NC State Extension on NCDA&CS)
  - **Online:** FTC shipping and refund rule
  - **Beauty:** NC cosmetic art licensing law (G.S. 88B-22)
  - **Products:** product liability insurance
- **If the library doesn't cover something,** the co-pilot says so and points to the official source, a local office, or a free SCORE mentor. It doesn't guess.
- **To add knowledge:** read the official page yourself, add the source to `src/sources.js` with the date you checked it, then add a card to `src/knowledge.js` containing only what that page says.

**Gaps to fill next:** no type-specific cards yet for service or digital businesses, county and city rules, or states other than NC.

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
public/           Landing page at / (index.html, landing.css, landing.js), app at /app (app.html, app.css, app.js), shared styles in base.css
migrations/       Database tables
```
