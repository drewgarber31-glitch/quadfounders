// Quad Founders knowledge library.
//
// Every point below was taken from an official or highly reliable page that was opened and
// read by hand (dates are in sources.js). The AI is told to base its guidance on these points
// and cite their source ids. Do not add a point without reading its source page first.
//
// types: which business types a card applies to ("all" = every business).
// quadrant: which part of the plan it feeds (customer, pricing, marketing, legal).

export const BUSINESS_TYPES = {
  service: "Service done by you (tutoring, cleaning, photography, moving help, DJing, coaching)",
  product: "Physical products you make or buy and resell (crafts, clothing, prints, reselling)",
  online: "Selling online and shipping orders (online store, Etsy-style shop, dropshipping)",
  food: "Food or drinks made at home to sell (baked goods, candy, jams, snacks)",
  digital: "Digital products or tech (apps, websites, templates, content, social media services)",
  beauty: "Hair, nails, makeup, lashes, skincare, or other personal-care services",
  invention: "A new invention, product, or technology that doesn't really exist yet",
};

export const KNOWLEDGE = [
  // ---------- Idea and customer ----------
  {
    id: "k_market_research",
    title: "Market research basics",
    types: ["all"],
    quadrant: "customer",
    source: "sba_market_research",
    points: [
      "Market research confirms and improves a business idea and reduces risk before money is spent.",
      "Check six things: demand (do people want it?), market size (how many would be interested?), economic indicators (income range, employment), location (where customers are and where you can reach), market saturation (how many similar options exist), and pricing (what customers pay for alternatives).",
      "Secondary research uses existing sources for general, quantifiable questions like trends, demographics, and household income.",
      "Primary research asks customers directly through surveys, questionnaires, focus groups, or interviews. It gives a nuanced view of your specific audience but can be time-consuming.",
    ],
  },
  {
    id: "k_competition",
    title: "Competitive analysis",
    types: ["all"],
    quadrant: "customer",
    source: "sba_market_research",
    points: [
      "Identify competitors by product line or service and by market segment, including indirect competitors.",
      "For each competitor, look at market share, strengths and weaknesses, your window of opportunity, how important your target market is to them, and barriers to entry.",
      "The goal is to define a competitive edge that creates sustainable revenue.",
    ],
  },
  {
    id: "k_lean_plan",
    title: "Lean startup business plan",
    types: ["all"],
    quadrant: "customer",
    source: "sba_business_plan",
    points: [
      "A lean startup plan is typically one page and can take about an hour. It suits people who want to launch quickly, have a simple business, or expect to revise often. Traditional plans are longer and are what lenders and investors commonly request.",
      "The lean plan has nine parts: key partnerships, key activities, key resources, value proposition, customer relationships, customer segments, channels, cost structure, and revenue streams.",
      "Customer segments should describe a specific target market, because the business won't serve everyone.",
      "The value proposition is a clear statement of the unique value the business offers.",
    ],
  },

  {
    id: "k_customer_discovery",
    title: "Customer discovery for new ideas",
    types: ["all"],
    quadrant: "customer",
    source: "icorps_discovery",
    points: [
      "Customer discovery is the process of understanding customers' needs, then using what you learn to change the product or the target customer.",
      "Test your assumptions by interviewing potential customers and people in the industry before building much.",
      "In the NSF I-Corps Hub program at the University of Alaska Fairbanks, each team must conduct a minimum of 20 interviews over the 6- to 7-week program. That's one program's requirement, not a universal rule.",
      "For a brand-new idea, the most important early question is whether people actually have the problem and how they solve it today.",
    ],
  },

  // ---------- Pricing and costs ----------
  {
    id: "k_startup_costs",
    title: "Startup costs",
    types: ["all"],
    quadrant: "pricing",
    source: "sba_startup_costs",
    points: [
      "Costs depend on business type (brick-and-mortar, online, or service).",
      "Common costs: equipment and supplies, licenses and permits, insurance, inventory, advertising and marketing, market research, printed materials, and a website.",
      "Separate one-time costs (equipment, logo design, permits) from monthly costs. Count at least one year of monthly expenses.",
      "For uncertain costs, look online and talk to mentors, vendors, and service providers about what similar businesses pay.",
    ],
  },
  {
    id: "k_break_even",
    title: "Break-even point",
    types: ["all"],
    quadrant: "pricing",
    source: "sba_startup_costs",
    points: [
      "Break-even formula: Fixed Costs ÷ (Price − Variable Costs) = Break-Even Point in Units.",
      "Fixed costs don't change with volume (for example rent or insurance). Variable costs change with each sale (for example materials per item).",
      "Add a buffer of about 10% for unpredictable costs. A break-even analysis is an estimate, not a substitute for real accounting.",
    ],
  },
  {
    id: "k_funding",
    title: "Funding options",
    types: ["all"],
    quadrant: "pricing",
    source: "sba_fund",
    points: [
      "Self-funding (bootstrapping) keeps full control but you take on all the risk. Don't spend more than you can afford.",
      "Crowdfunding suits creative works and physical products; backers usually get a perk, not ownership, and owners keep control. Read the platform's fine print.",
      "Investors usually want ownership and some control in exchange for funding.",
      "Small business loans usually require a business plan, expense sheet, and financial projections.",
    ],
  },

  // ---------- Marketing ----------
  {
    id: "k_marketing_plan",
    title: "Marketing plan",
    types: ["all"],
    quadrant: "marketing",
    source: "sba_marketing",
    points: [
      "Describe the target market in detail: size, demographics, unique traits, and trends.",
      "Describe the competitive advantage: a better product, lower price, or better customer experience.",
      "Write a sales plan: how customers actually buy, step by step, after deciding to.",
      "Set specific goals for the next year, choose channels, set pricing and promotions, and budget every marketing cost.",
      "Compare marketing costs to the revenue they bring in (return on investment) and review the plan at least once a year.",
    ],
  },
  {
    id: "k_endorsements",
    title: "Social media, influencers, and reviews (FTC)",
    types: ["all"],
    quadrant: "marketing",
    source: "ftc_endorsements",
    points: [
      "If you give someone free products, money, or perks to post about you, they must clearly disclose it. Labels like \"#ad\" or \"Paid ad\" at the start of a post are likely effective. Vague tags like \"#partner\" or \"#ambassador\" or a simple thank-you are not enough.",
      "Friends, family, and employees who promote your business should disclose their connection.",
      "Never offer a discount or reward only for positive reviews. You may ask all customers for honest reviews, positive or negative.",
      "Don't hide, delay, or ask people to delete negative reviews, and never use fake reviews or fake likes.",
      "Disclosures in videos should be in the video itself, and repeated during livestreams.",
    ],
  },

  // ---------- Legal and registration (all) ----------
  {
    id: "k_structure",
    title: "Business structure",
    types: ["all"],
    quadrant: "legal",
    source: "sba_structure",
    points: [
      "Sole proprietorship: easy to form and full control, but the owner can be personally liable for business debts. SBA notes it suits low-risk businesses and testing an idea.",
      "Partnership: simplest structure for two or more owners; unlimited personal liability unless set up as an LP or LLP.",
      "LLC: protects owners from personal liability in most instances, with pass-through taxes; SBA notes it suits medium- or higher-risk businesses.",
      "Corporations give the strongest liability protection but cost more to form and require more record-keeping.",
      "Choosing a structure has legal and tax effects. Students should confirm with the NC Secretary of State and a qualified professional.",
    ],
  },
  {
    id: "k_name_trademark",
    title: "Business name and trademarks",
    types: ["all"],
    quadrant: "legal",
    source: "uspto_search",
    points: [
      "Search for similar trademarks before choosing a name. A common reason trademark applications are rejected is that the name is too similar to an existing one and customers could be confused.",
      "The USPTO only checks the federal database, so also search state records (NC Secretary of State) and the internet.",
    ],
  },
  {
    id: "k_licenses",
    title: "Licenses and permits",
    types: ["all"],
    quadrant: "legal",
    source: "sba_licenses",
    points: [
      "Most small businesses need some combination of federal, state, and local licenses and permits, depending on the activity and location.",
      "Federal licenses apply only to federally regulated activities (for example alcohol, firearms, aviation, broadcasting).",
      "States regulate more activities than the federal government, and counties or cities may require their own licenses. Check state, county, and city rules.",
      "Some licenses expire; track renewal dates.",
    ],
  },
  {
    id: "k_taxes_self_employed",
    title: "Taxes when you work for yourself",
    types: ["all"],
    quadrant: "legal",
    source: "irs_self_employed",
    points: [
      "You are generally self-employed if you run your own business, including part-time or gig work.",
      "The IRS says you must file a tax return if your net earnings from self-employment were $400 or more.",
      "Self-employment tax covers Social Security and Medicare. Self-employed people generally pay estimated taxes quarterly (Form 1040-ES).",
      "Students should confirm their own situation with the IRS or a tax professional.",
    ],
  },
  {
    id: "k_banking",
    title: "Business bank account",
    types: ["all"],
    quadrant: "legal",
    source: "sba_bank",
    points: [
      "Keeping business money separate from personal money supports limited liability protection and looks professional.",
      "Open a business account once you start accepting or spending money for the business.",
      "Banks typically ask for an EIN (or Social Security number for a sole proprietor), formation documents, ownership agreements, and a business license. Compare fees, minimum balances, and transaction costs.",
    ],
  },
  {
    id: "k_insurance",
    title: "Business insurance",
    types: ["all"],
    quadrant: "legal",
    source: "sba_insurance",
    points: [
      "Insurance covers costs from accidents, disasters, or lawsuits that a business may not be able to absorb.",
      "General liability fits any business. Product liability fits businesses that make or sell products. Professional liability fits service businesses. Home-based business coverage can be added to a homeowner's policy as a rider.",
      "Businesses with employees must carry workers' compensation, unemployment, and disability insurance.",
      "Assess risks, use a licensed agent, compare quotes, and reassess every year.",
    ],
  },

  // ---------- Type-specific ----------
  {
    id: "k_home_food",
    title: "Selling food made at home in North Carolina",
    types: ["food"],
    quadrant: "legal",
    source: "ncsu_home_food",
    points: [
      "NC home kitchens may make only shelf-stable, low-risk foods, such as baked goods that don't need refrigeration, jams, jellies and preserves, candies, and dried mixes and spices.",
      "Not allowed from a home kitchen: refrigerated or frozen products, low-acid canned foods, dairy products, and seafood.",
      "The home kitchen must be inspected by NCDA&CS before selling. NCDA&CS does not charge for the inspection.",
      "Homes with any pets, even pets that only come inside at night, cannot make food for sale.",
      "Labels are required for self-service sales and must include the product name and all \"Top 9\" allergens by common name.",
      "This summary is from NC State Extension (updated April 23, 2024). Confirm current rules with NCDA&CS before selling.",
    ],
  },
  {
    id: "k_online_shipping",
    title: "Shipping rules for online sellers (FTC)",
    types: ["online"],
    quadrant: "legal",
    source: "ftc_mail_order",
    points: [
      "You must have a reasonable basis for any shipping time you state or imply.",
      "If you don't state a shipping time, you must reasonably expect to ship within 30 days.",
      "If an order will be late, you must ask the customer to agree to the delay and tell them they can cancel for a full, prompt refund.",
      "If you can't ship at all, cancel and refund the full amount, including shipping. Store credit can't replace a required refund.",
    ],
  },
  {
    id: "k_product_liability",
    title: "Selling physical products",
    types: ["product", "online", "food"],
    quadrant: "legal",
    source: "sba_insurance",
    points: [
      "SBA lists product liability insurance for businesses that make, distribute, or sell products; it covers losses when a defective product causes injury.",
    ],
  },
  {
    id: "k_ip_types",
    title: "Trademarks, patents, and copyrights",
    types: ["invention", "digital", "product"],
    quadrant: "legal",
    source: "uspto_ip_types",
    points: [
      "A trademark is a word, phrase, or design that identifies your goods or services and distinguishes them from others.",
      "A patent covers technical inventions that are new, unique, and usable in some industry. It protects against others making, using, or selling the invention without the inventor's consent.",
      "A copyright covers original creative works (artistic, literary, or other created works) that exist in a tangible form.",
    ],
  },
  {
    id: "k_provisional_patent",
    title: "Provisional patent applications",
    types: ["invention"],
    quadrant: "legal",
    source: "uspto_provisional",
    points: [
      "A provisional patent application sets an official U.S. filing date and allows \"Patent Pending\" for 12 months. It is not examined and won't become a patent unless a full (nonprovisional) application follows within 12 months. The 12 months can't be extended.",
      "USPTO warns that publicly disclosing an invention can cost you rights. Students should be careful about posting or pitching an invention's details publicly before getting advice.",
      "USPTO warns that some invention promotion firms misuse the provisional process and leave inventors with no patent.",
      "Fees change yearly. Patent questions should go to the USPTO or a registered patent attorney or agent.",
    ],
  },
  {
    id: "k_beauty_license",
    title: "Beauty services need a state license in NC",
    types: ["beauty"],
    quadrant: "legal",
    source: "nc_gs_88b22",
    points: [
      "North Carolina law (G.S. 88B-22) says no person may practice cosmetic art for pay or reward without a license from the NC Board of Cosmetic Art Examiners, except as the law provides.",
      "License types include cosmetologist, esthetician, natural hair care specialist, and manicurist. The law also bars practicing for pay outside a licensed shop, except as the chapter provides.",
      "Students offering hair, nail, skin, or similar services for pay must check licensing rules with the Board before starting.",
    ],
  },
];

/** Cards relevant to a set of business types (and optionally one quadrant). */
export function knowledgeFor(types = [], quadrant) {
  const set = new Set(types);
  return KNOWLEDGE.filter(
    (k) => (k.types.includes("all") || k.types.some((t) => set.has(t))) && (!quadrant || k.quadrant === quadrant)
  );
}

export function knowledgeText(cards) {
  return cards
    .map((k) => `### ${k.title} [source:${k.source}]\n${k.points.map((p) => `- ${p}`).join("\n")}`)
    .join("\n\n");
}

export function cleanTypes(types) {
  return Array.isArray(types) ? [...new Set(types.filter((t) => BUSINESS_TYPES[t]))].slice(0, 3) : [];
}
