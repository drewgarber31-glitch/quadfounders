// AI provider layer. Swap providers here without touching the rest of the app.
// If no API key is set, the app runs in TEST MODE with sample answers so you can
// click through every screen without spending money.

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";

export function isTestMode(env) {
  return !env.ANTHROPIC_API_KEY;
}

/**
 * @param {object} env  Worker env
 * @param {object} opts { kind, system, messages, maxTokens, build }
 *   kind: "followup" | "plan" | "quadrant" | "chat" | "site" | "siteEdit" (used by test mode)
 *   build: true to use the stronger "build" model
 * @returns {Promise<string>} the model's text reply
 */
export async function callAI(env, opts) {
  return (await callAIRaw(env, opts)).text;
}

// Returns { text, stopReason } so callers can tell when an answer was cut off.
async function callAIRaw(env, opts) {
  if (isTestMode(env)) return { text: mockReply(opts), stopReason: "end_turn" };

  const provider = env.AI_PROVIDER || "anthropic";
  if (provider !== "anthropic") {
    throw new AIError(`AI provider "${provider}" is not set up yet.`);
  }

  const model = opts.build ? env.AI_MODEL_BUILD : env.AI_MODEL_FAST;
  const res = await fetch(ANTHROPIC_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": ANTHROPIC_VERSION,
    },
    body: JSON.stringify({
      model: model || "claude-haiku-5-5",
      max_tokens: opts.maxTokens || 1500,
      system: opts.system,
      messages: opts.messages,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("AI error", res.status, detail.slice(0, 500));
    throw new AIError(
      res.status === 429
        ? "The AI is busy right now. Wait a minute and try again."
        : "The AI couldn't answer right now. Try again in a moment."
    );
  }
  const data = await res.json();
  const text = (data.content || [])
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("");
  if (!text) throw new AIError("The AI sent an empty answer. Try again.");
  return { text, stopReason: data.stop_reason };
}

/** Calls the AI and parses a JSON reply, retrying once if the JSON is broken. */
// If an answer is cut off for length, the retry gets twice the room (up to 8000 tokens).
export async function callAIJson(env, opts) {
  let maxTokens = opts.maxTokens || 1500;
  for (let attempt = 0; attempt < 2; attempt++) {
    const { text, stopReason } = await callAIRaw(env, { ...opts, maxTokens });
    const parsed = extractJson(text);
    if (parsed) return parsed;
    // Shows up in `npx wrangler tail` so we can see why parsing failed.
    console.error("AI JSON parse failed", JSON.stringify({ kind: opts.kind, attempt, stopReason, maxTokens, length: text.length, start: text.slice(0, 200), end: text.slice(-200) }));
    if (stopReason === "max_tokens") maxTokens = Math.min(maxTokens * 2, 8000);
  }
  throw new AIError("The AI's answer came back in the wrong format. Try again.");
}

export function extractJson(text) {
  if (!text) return null;
  text = text.replace(/```(?:json)?/gi, ""); // drop markdown code fences if the model adds them
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end <= start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
}

export class AIError extends Error {}

// ---------------- Test mode ----------------

function mockReply({ kind, messages }) {
  const last = messages?.[messages.length - 1]?.content || "";
  switch (kind) {
    case "followup":
      return JSON.stringify({
        title: "Campus sneaker cleaning",
        // Test mode marks app-style ideas so the launch path can be tried without a key.
        types: /\b(ride|rides|match|matching|app|marketplace|booking)\b/i.test(last) ? ["service", "app"] : ["service"],
        novelty: "twist",
        questions: [
          { id: "q1", text: "Who would your first 10 customers be?", hint: "Friends in my dorm and on my club team" },
          { id: "q2", text: "What would you charge, roughly?", hint: "$15 to $25 a pair" },
          { id: "q3", text: "How many hours a week can you spend on this?", hint: "About 5 hours" },
          { id: "q4", text: "What do you need to buy to get started?", hint: "Brushes, cleaner, a drying rack" },
        ],
      });
    case "plan":
      return JSON.stringify({
        quadrants: {
          customer: { summary: "TEST MODE: Students who care about how their sneakers look but don't have time to clean them. Start with your dorm and club teams, where you already know people." },
          pricing: { summary: "TEST MODE: Test a price range by asking 10 potential customers what they'd pay. Track supply costs per pair so you know your profit per job." },
          marketing: { summary: "TEST MODE: Before-and-after photos are your best ad. Post them, and offer a small discount for referrals." },
          legal: { summary: "TEST MODE: Educational only. Topics to look into for a small service business: registration, sales tax, and licenses, each linked to its official source." },
        },
        tasks: [
          { quadrant: "customer", title: "Talk to 5 possible customers", why: "Learn what they'd actually pay for.", basis: "Market research basics", minutes: 45 },
          { quadrant: "customer", title: "Write a one-sentence description of your customer", why: "Keeps every decision focused.", minutes: 15 },
          { quadrant: "pricing", title: "List your startup supplies and their costs", why: "You need this to set a price.", basis: "Startup costs", minutes: 30 },
          { quadrant: "pricing", title: "Pick a test price and a backup price", why: "Testing beats guessing.", minutes: 20 },
          { quadrant: "marketing", title: "Take before-and-after photos of your own shoes", why: "Proof that your work is good.", minutes: 30 },
          { quadrant: "marketing", title: "Ask 3 friends to share your first post", why: "Your first customers come from people who know you.", minutes: 15 },
        ],
        legal: [
          { id: "legal-structure", applies: true, why: "Look into how each structure treats a one-person business like this." },
          { id: "legal-name", applies: true, why: "Look into whether the name is already in use." },
          { id: "legal-register", applies: true, why: "Look into what the state office says about registering a small service business." },
          { id: "legal-ein", applies: true, why: "Look into the IRS page on when an EIN comes up. It's free from the IRS." },
          { id: "legal-sales-tax", applies: true, why: "Look into how sales tax treats a service like this." },
          { id: "legal-licenses", applies: true, why: "Look into what your county and city list for licenses." },
          { id: "legal-taxes", applies: true, why: "Look into how the IRS treats earnings from your own business." },
          { id: "legal-mentor", applies: true, why: "A free mentor can sanity-check your plan." },
        ],
        assumptions: [
          { text: "TEST MODE: Students in my dorm care enough about clean sneakers to pay for it.", test: "Ask 10 dorm-mates what they'd pay and whether they've ever paid for it." },
          { text: "TEST MODE: I can clean a pair in under 30 minutes.", test: "Time yourself cleaning 3 pairs." },
          { text: "TEST MODE: Word of mouth will bring the first 10 customers.", test: "Post before-and-after photos and count messages in a week." },
        ],
      });
    case "ideas":
      return JSON.stringify({
        ideas: [
          { title: "Lab report peer review swaps", oneLiner: "TEST MODE: A scheduled swap where STEM students trade feedback on lab report drafts.", problem: "Lab reports get marked down for formatting and clarity, not the science.", customer: "First- and second-year STEM students", whatsNew: "Trades feedback between peers in the same course instead of paid editing.", firstTest: "Ask 10 classmates how they check lab reports today and whether they'd swap drafts.", fit: "Uses your writing skills and fits 4 hours a week with no startup cost.", watchOut: "Check your professors' rules on collaboration before launching." },
          { title: "Club gear return tracker", oneLiner: "TEST MODE: A simple check-out system for club teams' shared gear.", problem: "Club teams lose shared equipment every season.", customer: "Club sports officers", whatsNew: "Built for student-run clubs instead of big athletic departments.", firstTest: "Interview 5 club officers about how they track gear now.", fit: "Uses your coding skills; free to prototype.", watchOut: "" },
          { title: "Dorm move-out swap day", oneLiner: "TEST MODE: Organized swaps so move-out items go to incoming students.", problem: "Good furniture gets thrown away at move-out.", customer: "Students moving out and moving in", whatsNew: "Matches items to next year's students before move-out week.", firstTest: "Ask 10 students what they threw away last move-out.", fit: "Mostly organizing, low budget.", watchOut: "Check campus rules on events and selling on university property." },
          { title: "Study-abroad packing check", oneLiner: "TEST MODE: A checklist service for students before study abroad.", problem: "Students forget documents and adapters before going abroad.", customer: "Students departing for study abroad", whatsNew: "Personal checklist tied to their destination.", firstTest: "Talk to 5 students who just got back about what they forgot.", fit: "Fits a few hours a week.", watchOut: "Don't give legal or medical advice about visas or medication." },
        ],
      });
    case "guide":
      return JSON.stringify({
        steps: [
          { title: "List who you already know", how: "TEST MODE: Write down 10 people who might have this problem, starting with your dorm and club team." },
          { title: "Write 3 questions", how: "TEST MODE: Ask how they handle the problem today and what it costs them. Avoid asking if they'd buy. [source:sba_market_research]" },
          { title: "Have the conversations", how: "TEST MODE: Talk to at least 5 people this week and take notes right after each one." },
          { title: "Write down what you learned", how: "TEST MODE: Note what surprised you and whether your first assumption held up." },
        ],
        opening: "TEST MODE: Let's get this done in 4 small steps. First, who are 3 people you already know who deal with this problem?",
      });
    case "quadrant":
      return JSON.stringify({ summary: `TEST MODE: Updated summary based on your feedback: "${String(last).split("My feedback:").pop().trim().slice(0, 120)}"` });
    case "chat":
      return `**TEST MODE reply.** Connect your API key for real answers.\n\nLet's break this into small steps:\n- **Step 1:** Write down what you already know.\n- **Step 2:** Pick one thing to try this week.\n\nWhat do you want to start with? [source:sba_steps]`;
    case "site":
      return JSON.stringify(sampleSite());
    case "siteEdit": {
      const site = sampleSite();
      site.tagline = `TEST MODE edit: ${String(last).split("My change:").pop().trim().slice(0, 60)}`;
      return JSON.stringify(site);
    }
    default:
      return "TEST MODE";
  }
}

function sampleSite() {
  return {
    businessName: "Fresh Kicks Campus",
    tagline: "Sneaker cleaning by students, for students",
    palette: "lawn",
    pages: {
      home: {
        headline: "Make your sneakers look new again",
        intro: "We clean sneakers for students on campus. Drop them off, and pick them up looking fresh.",
        cta: "See services",
        highlights: [
          { title: "Student run", text: "Started by students who love sneakers." },
          { title: "Careful cleaning", text: "Gentle products made for each material." },
        ],
      },
      about: {
        headline: "Why we started",
        story: "We kept seeing great sneakers get worn down by campus life. So we started cleaning them for friends, and it grew from there.",
        values: ["Care with every pair", "Fair student prices"],
      },
      services: {
        headline: "Services",
        items: [
          { name: "Basic clean", description: "Uppers, midsoles, and laces.", price: "" },
          { name: "Deep clean", description: "Everything in Basic, plus insoles and stain work.", price: "" },
        ],
      },
      contact: { headline: "Get in touch", text: "Message us to set up a drop-off.", email: "", instagram: "", location: "" },
    },
    waitlist: {
      headline: "Be first in line",
      text: "TEST MODE: Leave your email and we'll let you know when drop-offs open in your dorm.",
      question: "Which dorm do you live in?",
      button: "Join the waitlist",
    },
  };
}
