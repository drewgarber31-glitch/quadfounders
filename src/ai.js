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
  if (isTestMode(env)) return mockReply(opts);

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
  return text;
}

/** Calls the AI and parses a JSON reply, retrying once if the JSON is broken. */
export async function callAIJson(env, opts) {
  for (let attempt = 0; attempt < 2; attempt++) {
    const text = await callAI(env, opts);
    const parsed = extractJson(text);
    if (parsed) return parsed;
  }
  throw new AIError("The AI's answer came back in the wrong format. Try again.");
}

export function extractJson(text) {
  if (!text) return null;
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
        types: ["service"],
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
          legal: { summary: "TEST MODE: Educational only. Check which registrations apply to a small service business in North Carolina using the official links below." },
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
          { id: "legal-structure", applies: true, why: "Every business has a structure, even if it's just you." },
          { id: "legal-name", applies: true, why: "Check the name isn't already used in NC." },
          { id: "legal-register", applies: true, why: "Read whether a small service business like yours needs to register." },
          { id: "legal-ein", applies: true, why: "Learn when an EIN is needed. It's free from the IRS." },
          { id: "legal-sales-tax", applies: true, why: "Check whether your service is taxable in NC." },
          { id: "legal-licenses", applies: true, why: "Check if your county or city requires a license." },
          { id: "legal-taxes", applies: true, why: "Earnings from your own business can be taxed differently." },
          { id: "legal-mentor", applies: true, why: "A free mentor can sanity-check your plan." },
        ],
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
  };
}
