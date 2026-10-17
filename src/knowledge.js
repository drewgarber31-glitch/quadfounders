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
  app: "Needs a real app or platform to fully work: user accounts, matching people with each other, in-app payments, bookings, or live features (for example ride matching, a campus marketplace, or a booking app)",
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
      "SBA says market research blends consumer behavior and economic trends to confirm and improve your business idea, and lets you reduce risks.",
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
      "Quad Founders suggests (not from this source): for a brand-new idea, first find out whether people actually have the problem and how they solve it today.",
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
      "Separate one-time costs (equipment, logo design, permits) from monthly costs. SBA says to count at least one year of monthly expenses, and that five years is ideal.",
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
      "SBA describes fixed costs as costs over a set period that don't change with how much you produce or sell. The formula subtracts the variable cost per unit from the price.",
      "SBA suggests adding about 10% to cover costs you can't predict. SBA says the break-even point is an estimate and is not meant to exactly determine your accounting or financing.",
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
      "Venture capital is normally offered in exchange for an ownership share and an active role in the company, and most venture capitalists want at least a seat on the board.",
      "To improve the chances of getting a loan, SBA suggests having a business plan, an expense sheet, and financial projections for the next five years.",
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
      "Describe your marketing and sales goals for the next year, list your marketing channels, explain your pricing and promotions, and include a complete breakdown of the costs of your marketing plan.",
      "Plan to compare marketing and sales costs to the revenue they generate. SBA says marketing plans should be maintained on an annual basis, at minimum.",
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
      "Don't delay or hide only the negative reviews, since that gives a biased picture. Never use fake reviews.",
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
      "Quad Founders note (not from this source): structure affects legal and tax matters. Look into it with your state's business registration office and a qualified professional.",
    ],
  },
  {
    id: "k_name_trademark",
    title: "Business name and trademarks",
    types: ["all"],
    quadrant: "legal",
    source: "uspto_search",
    points: [
      "USPTO says to do a clearance search for similar trademarks before applying to register one. A common reason trademark applications are rejected is that the name is too similar to an existing one and customers could be confused.",
      "The USPTO only checks the federal database. USPTO says it's your responsibility to search state trademark databases and the internet.",
    ],
  },
  {
    id: "k_licenses",
    title: "Licenses and permits",
    types: ["all"],
    quadrant: "legal",
    source: "sba_licenses",
    points: [
      "SBA says most small businesses need a combination of licenses and permits from federal and state agencies. What you need depends on your business activities and location.",
      "Activities regulated by a federal agency need a federal license or permit. SBA's examples include alcoholic beverages, firearms, aviation, and radio and television broadcasting.",
      "States regulate more activities than the federal government, and counties or cities may require their own licenses. Check state, county, and city rules.",
      "Some licenses expire; track renewal dates.",
      "Quad Founders note (not from this source): if you'll sell, advertise, deliver, or meet customers on a college campus or in campus housing, your school's own rules are something to look into too, for example in the student handbook or with the student activities or student involvement office. Quad Founders doesn't know any specific school's rules.",
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
      "Quad Founders note (not from this source): your own situation is something to look into with the IRS or a tax professional.",
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
      "SBA says the federal government requires every business with employees to have workers' compensation, unemployment, and disability insurance, and that some states require more. Laws vary by state.",
      "Assess risks, use a licensed agent, compare quotes, and reassess every year.",
    ],
  },

  // ---------- Type-specific ----------
  {
    id: "k_home_food",
    state: "NC",
    title: "Selling food made at home in North Carolina",
    types: ["food"],
    quadrant: "legal",
    source: "ncsu_home_food",
    points: [
      "NC home kitchens may make only shelf-stable, low-risk foods, such as baked goods that don't need refrigeration, jams, jellies and preserves, candies, and dried mixes and spices. Acid and acidified foods (like pickles or BBQ sauce) must first be evaluated for shelf stability, so contact the NCDA&CS Food Compliance Office.",
      "Not allowed from a home kitchen: refrigerated or frozen products, low-acid canned foods, dairy products, and seafood.",
      "The home kitchen must be inspected by NCDA&CS before selling. NCDA&CS does not charge for the inspection, and a permit is not issued.",
      "Homes with any pets, even pets that only come inside at night, cannot make food for sale.",
      "Labels are required for self-service sales and must include the product name and all \"Top 9\" allergens by common name.",
      "This summary is from NC State Extension (page updated April 23, 2024). Current rules are something to look into with NCDA&CS.",
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
      "USPTO says fees are subject to change annually. Patent questions are something to look into with the USPTO or a registered patent attorney or agent.",
    ],
  },
  {
    id: "k_beauty_license",
    state: "NC",
    title: "Beauty services need a state license in NC",
    types: ["beauty"],
    quadrant: "legal",
    source: "nc_gs_88b22",
    points: [
      "North Carolina law (G.S. 88B-22) says no person may practice cosmetic art for pay or reward without a license from the NC Board of Cosmetic Art Examiners, except as the law provides.",
      "License types include cosmetologist, esthetician, natural hair care specialist, and manicurist. The law also bars practicing for pay outside a licensed shop, except as the chapter provides.",
      "Quad Founders note (not from this source): licensing for hair, nail, skin, or similar paid services is something to look into with the NC Board of Cosmetic Art Examiners.",
    ],
  },
  // ---------- Added 2026-10-17 ----------
  {
    id: "k_location_zoning",
    title: "Location and zoning",
    types: ["all"],
    quadrant: "legal",
    source: "sba_location",
    points: [
      "SBA says your location determines the taxes, zoning laws, and regulations your business is subject to.",
      "SBA says zoning is typically controlled at the local level, so check with your department of city planning, or similar office. Zoning ordinances can restrict or entirely ban specific kinds of businesses in an area.",
      "SBA says you might have fewer zoning restrictions with a home-based business, but zoning ordinances can still apply to home-based businesses.",
    ],
  },
  {
    id: "k_register_dba",
    title: "Registering and DBA names",
    types: ["all"],
    quadrant: "legal",
    source: "sba_register",
    points: [
      "SBA says your location and business structure determine how you need to register.",
      "If you do business under your own legal name, SBA says you may not need to register anywhere, though you might miss liability and tax benefits. Doing business without forming another structure makes you a sole proprietor automatically.",
      "SBA says most states require you to register a DBA (doing business as) name if you use one, and a DBA doesn't give legal protection by itself.",
      "In North Carolina, an assumed business name certificate is filed with your county Register of Deeds and added to a statewide database kept by the NC Secretary of State [source:nc_abn].",
    ],
  },
  {
    id: "k_nc_licenses",
    state: "NC",
    title: "Licenses in North Carolina",
    types: ["all"],
    quadrant: "legal",
    source: "nc_licenses",
    points: [
      "The NC Secretary of State says North Carolina has no single general business license that covers every requirement.",
      "It says there are over 700 state licenses and permits, a local license may also be required, and businesses that may need an occupational license should contact that occupational board.",
      "EDPNC Small Business Advisors offer free one-on-one consultations to anyone starting a business in NC (800-228-8443) [source:edpnc_advisors].",
    ],
  },
  {
    id: "k_tax_ids",
    title: "Tax ID numbers",
    types: ["all"],
    quadrant: "legal",
    source: "sba_tax_ids",
    points: [
      "SBA says a business needs a federal tax ID (EIN) if it pays employees, operates as a corporation or partnership, or files certain employment, excise, or alcohol, tobacco, and firearms tax returns, among other cases.",
      "SBA says the need for a state tax ID depends on whether the business must pay state taxes. Check your state's Department of Revenue.",
      "In NC, registration for sales and use tax is required for activities including selling tangible personal property at retail, selling certain digital property, and selling taxable services [source:ncdor_who_registers].",
    ],
  },
  {
    id: "k_records",
    title: "Keeping business records",
    types: ["all"],
    quadrant: "pricing",
    source: "irs_records",
    points: [
      "The IRS says good records help you monitor the progress of your business, prepare your financial statements, identify sources of income, keep track of deductible expenses, prepare your tax returns, and support items reported on your tax returns.",
      "You can use any recordkeeping system that clearly shows your income and expenses.",
      "The IRS says to keep records as long as needed to prove the income or deductions on a tax return.",
    ],
  },
  {
    id: "k_hobby",
    title: "Hobby or business (IRS)",
    types: ["all"],
    quadrant: "legal",
    source: "irs_hobby",
    points: [
      "An archived IRS tax tip (April 2022) says a business operates to make a profit, while a hobby is pursued for enjoyment with no intention of making a profit.",
      "It lists factors such as whether the activity is run like a business, whether the person depends on the income, and whether it has made a profit in some years. No one factor decides it.",
      "It says hobby income must still be reported. This tip is archived, so confirm current rules with the IRS.",
    ],
  },
  {
    id: "k_workers",
    title: "If someone helps you: employees vs. contractors",
    types: ["all"],
    quadrant: "legal",
    source: "irs_contractor",
    points: [
      "The IRS looks at all evidence of control and independence, in three categories: behavioral, financial, and type of relationship.",
      "The IRS says if you treat an employee as a contractor without a reasonable basis, you may be held liable for employment taxes for that worker.",
      "SBA's hiring steps include getting an EIN, checking whether you need state or local tax IDs, and having new employees complete a Form W-4. In SBA's example, the owners complete Form I-9 and report new employees to their state directory within 20 days of the hire date [source:sba_hire].",
    ],
  },
  {
    id: "k_intl_students",
    title: "International students (F-1)",
    types: ["all"],
    quadrant: "legal",
    source: "dhs_intl_entrepreneurs",
    points: [
      "DHS Study in the States says starting your own business constitutes work for F-1 students.",
      "It says F-1 students generally need to qualify for and apply for OPT first, the work must relate to their program of study, and pre-completion OPT is limited to 20 hours a week while school is in session.",
      "Quad Founders note (not from DHS): work rules for international students are something to look into with your school's international student office. Never give immigration advice.",
    ],
  },
  {
    id: "k_trademark_rights",
    title: "Trademark rights and symbols",
    types: ["all"],
    quadrant: "legal",
    source: "uspto_trademark",
    points: [
      "USPTO says you become a trademark owner as soon as you start using it with your goods or services, but those rights are limited to the area where you do business.",
      "USPTO says federal registration creates nationwide rights.",
      "You can use TM (goods) or SM (services) without filing. Use the registered symbol only after the USPTO registers the mark, and only for the goods or services listed.",
    ],
  },
  {
    id: "k_copyright",
    title: "Copyright basics",
    types: ["digital", "product", "invention"],
    quadrant: "legal",
    source: "copyright_faq",
    points: [
      "The U.S. Copyright Office says a work is protected the moment it is created and fixed in a tangible form.",
      "Registration is generally voluntary, but you must register before suing for infringement of a U.S. work.",
      "Copyright does not protect facts, ideas, systems, or methods of operation.",
    ],
  },
  {
    id: "k_children_products",
    title: "Products for children 12 and under (CPSC)",
    types: ["product", "online", "invention"],
    quadrant: "legal",
    source: "cpsc_cpc",
    points: [
      "CPSC defines a children's product as one designed or intended primarily for children 12 or younger.",
      "Domestic manufacturers and importers of these products must certify them in a written Children's Product Certificate based on testing by a CPSC-accepted third-party lab.",
      "Registered small batch manufacturers can get some relief from certain testing, but must register every year, still issue a certificate, still use tracking labels, and always third-party test for some rules [source:cpsc_small_batch].",
    ],
  },
  {
    id: "k_textile_labels",
    title: "Clothing and textile labels (FTC)",
    types: ["product", "online"],
    quadrant: "legal",
    source: "ftc_textile",
    points: [
      "FTC says textile labels must identify fiber content, country of origin, and either the company name or a Registered Identification Number (RN).",
      "Care labels for clothing are required by a separate FTC rule.",
    ],
  },
  {
    id: "k_made_usa",
    title: "Saying \"Made in USA\" (FTC)",
    types: ["product", "online", "invention"],
    quadrant: "legal",
    source: "ftc_made_usa",
    points: [
      "FTC says an unqualified Made in USA claim needs final assembly or processing in the U.S., all significant processing in the U.S., and all or virtually all ingredients or components made and sourced in the U.S.",
      "Qualified claims describe how much is domestic, like \"Made in USA of U.S. and imported parts.\"",
    ],
  },
  {
    id: "k_cosmetics",
    title: "Making or selling cosmetics (FDA)",
    types: ["beauty", "product"],
    quadrant: "legal",
    source: "fda_cosmetics",
    points: [
      "FDA says cosmetics and their ingredients, except color additives, don't need FDA approval before sale, and the maker is responsible for a compliant label.",
      "FDA says if a product is intended to affect how the body works or to treat or prevent disease, it's a drug, and some products are both. Claims matter.",
      "FDA says you may need to register your facility and list products under MoCRA, and certain small businesses are exempt, but not for every product type.",
    ],
  },
  {
    id: "k_marketplace",
    title: "Selling on online marketplaces (FTC)",
    types: ["online"],
    quadrant: "legal",
    source: "ftc_inform",
    points: [
      "Under the INFORM Consumers Act, a high-volume seller has 200 or more sales of new or unused consumer products and $5,000 or more in gross revenue in any continuous 12 months during the past 24 months.",
      "Marketplaces must collect a high-volume seller's bank account number, tax ID, email, and phone number.",
      "At $20,000 or more in annual gross revenue on one marketplace, the marketplace must disclose the seller's name, physical address, and contact information to buyers.",
    ],
  },
  {
    id: "k_coppa",
    title: "Children's online privacy (COPPA)",
    types: ["digital", "app"],
    quadrant: "legal",
    source: "ftc_coppa",
    points: [
      "FTC says COPPA applies to websites and online services that collect personal information from kids under 13, if they are directed to children or the operator has actual knowledge it collects from kids under 13.",
      "The FTC's six steps include posting a COPPA-compliant privacy policy, notifying parents directly, and getting verifiable parental consent before collecting kids' personal information.",
    ],
  },
  {
    id: "k_free_help_nc",
    state: "NC",
    title: "Free business help in North Carolina",
    types: ["all"],
    quadrant: "legal",
    source: "nc_sbtdc",
    points: [
      "The NC SBTDC offers management counseling and education; it says most services are free and all are confidential.",
      "The NC Community College Small Business Center Network offers free, confidential one-on-one counseling and low-cost or free training [source:nc_sbcn].",
      "SCORE offers free mentoring [source:score_mentoring].",
    ],
  },
  {
    id: "k_truth_ads",
    title: "Truth in advertising (FTC)",
    types: ["all"],
    quadrant: "marketing",
    source: "ftc_ads",
    points: [
      "FTC says advertising must be truthful and non-deceptive, advertisers must have evidence to back up their claims, and ads cannot be unfair.",
    ],
  },
  {
    id: "k_canspam",
    title: "Email marketing rules (CAN-SPAM)",
    types: ["all"],
    quadrant: "marketing",
    source: "ftc_canspam",
    points: [
      "FTC's CAN-SPAM rules: no false or misleading header information, no deceptive subject lines, identify the message as an ad, include your physical location, and tell people how to opt out.",
      "Honor opt-out requests within 10 business days, and monitor anyone emailing on your behalf.",
    ],
  },
  {
    id: "k_web_access",
    title: "Accessible websites (ADA)",
    types: ["all"],
    quadrant: "marketing",
    source: "ada_web",
    points: [
      "DOJ guidance (March 18, 2022) says the ADA's requirements apply to the goods and services businesses open to the public offer, including on the web.",
      "Common problems include images without text descriptions (alt text), low color contrast, videos without captions, and sites that only work with a mouse.",
    ],
  },
  {
    id: "k_protect_data",
    title: "Protecting customer information (FTC)",
    types: ["all"],
    quadrant: "marketing",
    source: "ftc_protect_info",
    points: [
      "FTC's five principles: take stock of the personal information you have, scale down to what you need, lock it, pitch what you no longer need, and plan ahead for incidents.",
      "FTC cybersecurity basics include updating software, backing up files, strong passwords, multi-factor authentication, and encryption [source:ftc_cyber].",
    ],
  },
  {
    id: "k_nc_annual",
    state: "NC",
    title: "Keeping an NC LLC or corporation in good standing",
    types: ["all"],
    quadrant: "legal",
    source: "nc_maintaining",
    points: [
      "The NC Secretary of State says corporations, LLCs, LLPs, and LLLPs must file an annual report, and it is due whether or not the company is actually doing business.",
      "For an LLC, the first annual report is due April 15 of the year after it is created, then by April 15 each year.",
      "Registered agent name or address changes must be reported within 60 days. Not complying may be grounds for administrative dissolution.",
      "These duties apply only if you form one of these entities. A sole proprietor doesn't file an annual report with the Secretary of State.",
    ],
  },
  {
    id: "k_free_legal_nc",
    state: "NC",
    title: "Free or low-cost legal help in North Carolina",
    types: ["all"],
    quadrant: "legal",
    source: "nc_checklist",
    points: [
      "The NC Secretary of State's new business checklist lists university legal clinics, including Elon University's Small Business & Entrepreneurship Clinic, and clinics at Campbell, Duke, UNC, and Wake Forest. It says to apply before each semester and that there are no summer services.",
      "It also lists NC Central University's Intellectual Property Clinic for patents and trademarks, the NC Bar Association's Entrepreneurs Assistance Program, and NC Free Legal Answers.",
      "It lists NC LIVE, a library-provided database, for industry, competitor, and customer research.",
    ],
  },
  {
    id: "k_boi",
    title: "Beneficial ownership (BOI) reports",
    types: ["all"],
    quadrant: "legal",
    source: "fincen_boi",
    points: [
      "FinCEN says U.S. companies are exempt from Beneficial Ownership Information (BOI) reporting requirements (final rule effective August 14, 2026). Some older guides still say most businesses must file, so go by FinCEN's current page.",
    ],
  },
  // ---------- Launch path (ideas that need a real app) ----------
  {
    id: "k_unscalable",
    title: "Do things by hand first",
    types: ["app"],
    quadrant: "customer",
    source: "pg_dont_scale",
    points: [
      "Paul Graham writes that the most common unscalable thing founders have to do at the start is to recruit users manually.",
      "He writes that you can sometimes get away with doing by hand things that you plan to automate later.",
      "He also writes that sometimes the right unscalable trick is to focus on a deliberately narrow market.",
      "Quad Founders suggests (not from this source): before building an app, run the service by hand for a small group (for example, match people yourself from your sign-up list and a spreadsheet), and build only what that test proves people use.",
    ],
  },
  {
    id: "k_forms",
    title: "Collect requests with a free form",
    types: ["app"],
    quadrant: "customer",
    source: "google_forms",
    points: [
      "Google's help page says you can create a form at forms.google.com, or from a Google Sheet with Tools, then Create a new form.",
      "When you create a form in Google Sheets, the responses are saved in a new sheet, and you can choose to store form responses in a Google Sheet.",
    ],
  },
  {
    id: "k_nocode_bubble",
    title: "No-code web apps (Bubble example)",
    types: ["app"],
    quadrant: "customer",
    source: "bubble_manual",
    points: [
      "Bubble's manual says it lets you build an app by pointing and clicking instead of writing code.",
      "It says its built-in user management tools let users sign up for and log in to your app, and that it automates the database.",
      "Quad Founders suggests (not from this source): Bubble and Glide are examples, not endorsements. Compare tools, and read each tool's pricing and terms yourself before you build.",
    ],
  },
  {
    id: "k_nocode_glide",
    title: "No-code apps from a spreadsheet (Glide example)",
    types: ["app"],
    quadrant: "customer",
    source: "glide_sheets",
    points: [
      "Glide says it builds custom no-code apps from Google Sheets and generates a mobile-friendly app from your sheet that you can customize.",
    ],
  },
  {
    id: "k_payment_links",
    title: "Payment links (no code)",
    types: ["app"],
    quadrant: "pricing",
    source: "stripe_no_code",
    points: [
      "Stripe says Payment Links let you create a payment page without code and share it on social media, in emails, or on your website, including as a QR code or a buy button.",
      "The payment page is hosted by Stripe. Stripe lists automatic receipts and no-code refunds, and says you can use Payment Links to sell a product or a subscription, or accept a donation.",
      "Quad Founders never takes or handles payments. Payment providers are separate companies with their own fees and terms, so read them before you sign up.",
    ],
  },
  {
    id: "k_pci",
    title: "Card security rules (PCI DSS)",
    types: ["app"],
    quadrant: "pricing",
    source: "stripe_security",
    points: [
      "Stripe says PCI DSS is the global security standard for anyone that stores, processes, or transmits cardholder data, and anyone involved with card data must comply.",
      "It says a business that handles sensitive card data directly might be required to meet more than 300 security controls.",
      "It says many businesses don't need to handle card data: low-risk integrations send payment information directly to Stripe without it passing through your servers, which reduces your PCI obligations.",
      "It also says PCI compliance is shared: a business accepting payments must do so in a PCI-compliant manner and attest to it every year.",
    ],
  },
  {
    id: "k_stripe_age",
    title: "Age rules for payment accounts (Stripe example)",
    types: ["app"],
    quadrant: "pricing",
    source: "stripe_age",
    points: [
      "Stripe says you must be at least 13 to create a Stripe account. If you're under 18, a legal guardian must take the role of account owner, and the account can't accept charges or send money to your bank until they do.",
    ],
  },
  {
    id: "k_start_security",
    title: "Security basics for apps that collect data",
    types: ["app"],
    quadrant: "legal",
    source: "ftc_start_security",
    points: [
      "FTC's Start with Security guide says: don't collect personal information you don't need, hold on to it only as long as you have a legitimate business need, and don't use personal information when it's not necessary.",
      "For logins, it says to insist on complex and unique passwords, store passwords securely, and guard against brute force attacks.",
    ],
  },
  {
    id: "k_app_store_privacy",
    title: "App store privacy rules (Apple example)",
    types: ["app"],
    quadrant: "legal",
    source: "apple_review",
    points: [
      "Apple's App Review Guidelines say all apps must link to a privacy policy that identifies what data the app collects, how, and all uses of it, and explains data retention and deletion and how a user can request deletion.",
      "They say that if your app supports account creation, you must also offer account deletion within the app.",
    ],
  },
  {
    id: "k_work_for_hire",
    title: "Who owns code someone builds for you",
    types: ["app"],
    quadrant: "legal",
    source: "copyright_circ30",
    points: [
      "The Copyright Office says a work made by an employee within the scope of employment is a work made for hire, and the party that hired the person is both the author and the copyright owner.",
      "For specially ordered or commissioned work, it qualifies only if the parties agree in a written instrument signed by them, and only in nine categories: contributions to a collective work, parts of a motion picture or audiovisual work, translations, supplementary works, compilations, instructional texts, tests, answer material for tests, and atlases. Software is not one of the listed categories.",
      "The Copyright Office says it cannot give legal advice about the status of a work, so confirm your situation with a qualified professional.",
    ],
  },
  {
    id: "k_transfer",
    title: "Transferring copyright in writing",
    types: ["app"],
    quadrant: "legal",
    source: "usc_204",
    points: [
      "Federal law (17 U.S.C. 204) says a transfer of copyright ownership, other than by operation of law, is not valid unless it is in writing and signed by the owner of the rights being transferred or their authorized agent.",
      "Quad Founders note (not from this source): if a friend or freelancer will build your app, code ownership is something to look into with a qualified professional or a free law clinic before they start.",
    ],
  },
];
/** Cards relevant to a set of business types (and optionally one quadrant). */
// Legal-topic cards are NEVER given to the AI. Legal topics are a fixed library students read
// themselves (see LEGAL_STEPS in sources.js), so the AI can't tailor legal or regulatory guidance.
const LEGAL_CARD_IDS = new Set(["k_endorsements", "k_truth_ads", "k_canspam", "k_web_access", "k_protect_data", "k_records", "k_pci", "k_stripe_age"]);
export const isLegalCard = (k) => k.quadrant === "legal" || LEGAL_CARD_IDS.has(k.id);

/** Business (non-legal) cards for a set of business types, one quadrant (optional), and a state. */
export function knowledgeFor(types = [], quadrant, state = "NC") {
  const set = new Set(types);
  const nc = /\b(NC|North Carolina)\b/;
  return KNOWLEDGE.filter(
    (k) => !isLegalCard(k) && (k.types.includes("all") || k.types.some((t) => set.has(t))) && (!quadrant || k.quadrant === quadrant) && (!k.state || k.state === state)
  ).map((k) => (state === "NC" ? k : { ...k, points: k.points.filter((p) => !nc.test(p)) })).filter((k) => k.points.length);
}

export function knowledgeText(cards) {
  return cards
    .map((k) => `### ${k.title} [source:${k.source}]\n${k.points.map((p) => `- ${p}`).join("\n")}`)
    .join("\n\n");
}

export function cleanTypes(types) {
  if (!Array.isArray(types)) return [];
  const list = [...new Set(types.filter((t) => BUSINESS_TYPES[t]))];
  // Up to 3 business types, plus "app" when the idea needs a real app.
  return [...list.filter((t) => t !== "app").slice(0, 3), ...(list.includes("app") ? ["app"] : [])];
}
