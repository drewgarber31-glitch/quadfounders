// Verified source library.
// Every entry was opened and checked by hand. The AI may ONLY cite sources by these ids.
// It can never invent a link. When you add a source, open the page yourself first and
// record what it says and the date you checked it.

export const SOURCES = {
  sba_steps: {
    title: "SBA: 10 steps to start your business",
    org: "U.S. Small Business Administration",
    url: "https://www.sba.gov/business-guide/10-steps-start-your-business",
    summary:
      "Federal guide covering market research, business plans, startup costs, structure, naming, registration, tax IDs, licenses, bank accounts, and insurance.",
    checked: "2026-10-16",
  },
  irs_ein: {
    title: "IRS: Get an Employer Identification Number (EIN)",
    org: "Internal Revenue Service",
    url: "https://www.irs.gov/businesses/small-businesses-self-employed/get-an-employer-identification-number",
    summary:
      "Apply for an EIN directly from the IRS for free. The IRS warns to beware of websites that charge for an EIN.",
    checked: "2026-10-16",
  },
  nc_sos_registration: {
    title: "NC Secretary of State: Business Registration",
    org: "North Carolina Department of the Secretary of State",
    url: "https://www.sosnc.gov/divisions/business_registration",
    summary:
      "Register a new business entity in North Carolina, search assumed business names (DBA), and find forms and fees. Online filing is faster.",
    checked: "2026-10-16",
  },
  ncdor_sales_tax: {
    title: "NC Department of Revenue: Sales and Use Tax Registration",
    org: "North Carolina Department of Revenue",
    url: "https://www.ncdor.gov/taxes-forms/sales-and-use-tax/sales-and-use-tax-registration",
    summary:
      "How to register for a sales and use tax certificate in North Carolina. NCDOR says there is no fee to apply and warns about third-party sites that charge.",
    checked: "2026-10-16",
  },
  score_mentoring: {
    title: "SCORE: Free business mentoring",
    org: "SCORE",
    url: "https://www.score.org/about-score",
    summary: "Free, confidential mentoring from experienced business leaders, for the life of your business.",
    checked: "2026-10-13",
  },
};

// The legal and registration quadrant is built from these fixed steps, not invented by AI.
// The AI only decides which ones apply and explains why in plain language.
export const LEGAL_STEPS = [
  {
    id: "legal-structure",
    title: "Choose a business structure",
    sources: ["sba_steps"],
    minutes: 30,
  },
  {
    id: "legal-name",
    title: "Check your business name in North Carolina",
    sources: ["nc_sos_registration"],
    minutes: 15,
  },
  {
    id: "legal-register",
    title: "Decide whether to register with the NC Secretary of State",
    sources: ["nc_sos_registration", "sba_steps"],
    minutes: 30,
  },
  {
    id: "legal-ein",
    title: "Decide whether you need a free EIN from the IRS",
    sources: ["irs_ein"],
    minutes: 15,
  },
  {
    id: "legal-sales-tax",
    title: "Check if you need to register for NC sales tax",
    sources: ["ncdor_sales_tax"],
    minutes: 20,
  },
  {
    id: "legal-mentor",
    title: "Book a free mentor session to review your plan",
    sources: ["score_mentoring"],
    minutes: 15,
  },
];

export function sourceList(ids = Object.keys(SOURCES)) {
  return ids
    .filter((id) => SOURCES[id])
    .map((id) => `- ${id}: ${SOURCES[id].title}. ${SOURCES[id].summary}`)
    .join("\n");
}
