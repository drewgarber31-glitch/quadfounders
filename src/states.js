// Official state, DC, and territory business offices.
// Every link was taken from an official federal directory, never from memory:
//   - each state's IRS "State government websites" page (irs.gov), or
//   - SBA's district office list (legacy.sba.gov), or, for territories,
//     the territory government's own site found and opened on 2026-10-17.
// Each link was then opened on 2026-10-17. verified:false means the site blocks
// automated checks, so it is listed by the IRS but could not be opened by our checker.
// kind: reg = business registration, tax = tax agency, lic = licenses and permits,
//       help = free state business help, sba = SBA district office.

export const STATES_CHECKED = "2026-10-17";

export const STATES = {
 "AL": {
  "name": "Alabama",
  "irs": "https://www.irs.gov/businesses/small-businesses-self-employed/alabama",
  "links": [
   {
    "kind": "reg",
    "name": "Alabama Secretary of State: Business Entities",
    "url": "https://www.sos.alabama.gov/business-entities",
    "verified": true
   },
   {
    "kind": "tax",
    "name": "Alabama Department of Revenue: Businesses",
    "url": "https://www.revenue.alabama.gov/businesses/",
    "verified": true
   },
   {
    "kind": "lic",
    "name": "Alabama Department of Revenue: Business licenses (state and county)",
    "url": "https://www.revenue.alabama.gov/help-center-tabs/business-licenses-state-county/",
    "verified": true
   },
   {
    "kind": "help",
    "name": "Alabama Small Business Development Center",
    "url": "https://www.asbdc.org/",
    "verified": true
   },
   {
    "kind": "sba",
    "name": "SBA Alabama District Office",
    "url": "https://legacy.sba.gov/district/alabama",
    "verified": true
   }
  ]
 },
 "AK": {
  "name": "Alaska",
  "irs": "https://www.irs.gov/businesses/small-businesses-self-employed/alaska",
  "links": [
   {
    "kind": "reg",
    "name": "Alaska Corporations, Business, and Professional Licensing",
    "url": "https://www.commerce.alaska.gov/web/cbpl/",
    "verified": true
   },
   {
    "kind": "tax",
    "name": "Alaska Department of Revenue, Tax Division",
    "url": "https://tax.alaska.gov/",
    "verified": false
   },
   {
    "kind": "sba",
    "name": "SBA Alaska District Office",
    "url": "https://legacy.sba.gov/district/alaska",
    "verified": true
   }
  ]
 },
 "AZ": {
  "name": "Arizona",
  "irs": "https://www.irs.gov/businesses/small-businesses-self-employed/arizona",
  "links": [
   {
    "kind": "reg",
    "name": "Arizona Corporation Commission",
    "url": "https://www.azcc.gov/",
    "verified": true
   },
   {
    "kind": "tax",
    "name": "Arizona Department of Revenue",
    "url": "https://www.azdor.gov/",
    "verified": true
   },
   {
    "kind": "lic",
    "name": "Arizona Department of Revenue: TPT license",
    "url": "https://azdor.gov/transaction-privilege-tax/tpt-license",
    "verified": true
   },
   {
    "kind": "help",
    "name": "Arizona Commerce Authority: Small business services",
    "url": "https://www.azcommerce.com/programs/small-business-services",
    "verified": true
   },
   {
    "kind": "sba",
    "name": "SBA Arizona District Office",
    "url": "https://legacy.sba.gov/district/arizona",
    "verified": true
   }
  ]
 },
 "AR": {
  "name": "Arkansas",
  "irs": "https://www.irs.gov/businesses/small-businesses-self-employed/arkansas",
  "links": [
   {
    "kind": "reg",
    "name": "Arkansas Secretary of State: Business and Commercial Services",
    "url": "https://www.sos.arkansas.gov/business-commercial-services-bcs",
    "verified": true
   },
   {
    "kind": "tax",
    "name": "Arkansas Department of Finance and Administration",
    "url": "https://www.dfa.arkansas.gov",
    "verified": true
   },
   {
    "kind": "help",
    "name": "Arkansas Small Business and Technology Development Center",
    "url": "https://asbtdc.org/",
    "verified": true
   },
   {
    "kind": "sba",
    "name": "SBA Arkansas District Office",
    "url": "https://legacy.sba.gov/district/arkansas",
    "verified": true
   }
  ]
 },
 "CA": {
  "name": "California",
  "irs": "https://www.irs.gov/businesses/small-businesses-self-employed/california",
  "links": [
   {
    "kind": "reg",
    "name": "California Secretary of State",
    "url": "https://www.sos.ca.gov/",
    "verified": true
   },
   {
    "kind": "tax",
    "name": "California Department of Tax and Fee Administration and Franchise Tax Board: Small Business Assistance Center",
    "url": "https://taxes.ca.gov/small-business-assistance-center/",
    "verified": true
   },
   {
    "kind": "lic",
    "name": "CalGold: California permits and licenses",
    "url": "https://www.calgold.ca.gov/",
    "verified": true
   },
   {
    "kind": "help",
    "name": "California Governor's Office of Business and Economic Development",
    "url": "https://www.business.ca.gov/",
    "verified": true
   },
   {
    "kind": "sba",
    "name": "SBA district offices (find the one for your area)",
    "url": "https://legacy.sba.gov/about-sba/sba-locations/sba-district-offices",
    "verified": true
   }
  ]
 },
 "CO": {
  "name": "Colorado",
  "irs": "https://www.irs.gov/businesses/small-businesses-self-employed/colorado",
  "links": [
   {
    "kind": "reg",
    "name": "Colorado Secretary of State",
    "url": "https://www.sos.state.co.us/",
    "verified": true
   },
   {
    "kind": "tax",
    "name": "Colorado Department of Revenue",
    "url": "https://cdor.colorado.gov/",
    "verified": true
   },
   {
    "kind": "lic",
    "name": "MyBizColorado",
    "url": "https://mybiz.colorado.gov/intro",
    "verified": false
   },
   {
    "kind": "sba",
    "name": "SBA Colorado District Office",
    "url": "https://legacy.sba.gov/district/colorado",
    "verified": true
   }
  ]
 },
 "CT": {
  "name": "Connecticut",
  "irs": "https://www.irs.gov/businesses/small-businesses-self-employed/connecticut",
  "links": [
   {
    "kind": "reg",
    "name": "Connecticut Secretary of the State",
    "url": "https://portal.ct.gov/SOTS",
    "verified": true
   },
   {
    "kind": "tax",
    "name": "Connecticut Department of Revenue Services",
    "url": "https://portal.ct.gov/drs",
    "verified": true
   },
   {
    "kind": "lic",
    "name": "Connecticut Occupational and Professional Licensing Division",
    "url": "https://portal.ct.gov/DCP/Agency-Administration/Division-Home-Pages/Occupational--Professional-Licensing-Division",
    "verified": true
   },
   {
    "kind": "sba",
    "name": "SBA Connecticut District Office",
    "url": "https://legacy.sba.gov/district/connecticut",
    "verified": true
   }
  ]
 },
 "DE": {
  "name": "Delaware",
  "irs": "https://www.irs.gov/businesses/small-businesses-self-employed/delaware",
  "links": [
   {
    "kind": "reg",
    "name": "Delaware Division of Corporations",
    "url": "https://corp.delaware.gov/",
    "verified": true
   },
   {
    "kind": "tax",
    "name": "Delaware Division of Revenue",
    "url": "https://revenue.delaware.gov/",
    "verified": true
   },
   {
    "kind": "help",
    "name": "Delaware Division of Small Business",
    "url": "https://business.delaware.gov/",
    "verified": true
   },
   {
    "kind": "sba",
    "name": "SBA Delaware District Office",
    "url": "https://legacy.sba.gov/district/delaware",
    "verified": true
   }
  ]
 },
 "DC": {
  "name": "District of Columbia",
  "irs": "https://www.irs.gov/businesses/small-businesses-self-employed/district-of-columbia",
  "links": [
   {
    "kind": "reg",
    "name": "DC Business Resource Center",
    "url": "https://dcbiz.ecenterdirect.com/",
    "verified": false
   },
   {
    "kind": "tax",
    "name": "DC Office of Tax and Revenue",
    "url": "https://otr.cfo.dc.gov/",
    "verified": true
   },
   {
    "kind": "lic",
    "name": "DC Permits, Licenses, and Certifications",
    "url": "https://dc.gov/page/permits-licenses-and-certifications",
    "verified": true
   },
   {
    "kind": "sba",
    "name": "SBA Washington Metropolitan Area District Office",
    "url": "https://legacy.sba.gov/district/washington-metropolitan",
    "verified": true
   }
  ]
 },
 "FL": {
  "name": "Florida",
  "irs": "https://www.irs.gov/businesses/small-businesses-self-employed/florida",
  "links": [
   {
    "kind": "reg",
    "name": "Florida Division of Corporations (Sunbiz)",
    "url": "https://dos.fl.gov/sunbiz",
    "verified": true
   },
   {
    "kind": "tax",
    "name": "Florida Department of Revenue: Businesses",
    "url": "https://floridarevenue.com/Pages/info_business.aspx",
    "verified": true
   },
   {
    "kind": "lic",
    "name": "Florida DBPR: Business and professional licenses",
    "url": "https://www2.myfloridalicense.com/",
    "verified": true
   },
   {
    "kind": "sba",
    "name": "SBA district offices (find the one for your area)",
    "url": "https://legacy.sba.gov/about-sba/sba-locations/sba-district-offices",
    "verified": true
   }
  ]
 },
 "GA": {
  "name": "Georgia",
  "irs": "https://www.irs.gov/businesses/small-businesses-self-employed/georgia",
  "links": [
   {
    "kind": "reg",
    "name": "Georgia Secretary of State: Corporations Division",
    "url": "https://sos.ga.gov/index.php/corporations",
    "verified": true
   },
   {
    "kind": "tax",
    "name": "Georgia Department of Revenue: Register a new business",
    "url": "https://dor.georgia.gov/taxes/register-new-business-georgia",
    "verified": true
   },
   {
    "kind": "sba",
    "name": "SBA Georgia District Office",
    "url": "https://legacy.sba.gov/district/georgia",
    "verified": true
   }
  ]
 },
 "HI": {
  "name": "Hawaii",
  "irs": "https://www.irs.gov/businesses/small-businesses-self-employed/hawaii",
  "links": [
   {
    "kind": "reg",
    "name": "Hawaii Business Registration Division",
    "url": "https://cca.hawaii.gov/breg/",
    "verified": true
   },
   {
    "kind": "tax",
    "name": "Hawaii Department of Taxation",
    "url": "https://tax.hawaii.gov/",
    "verified": true
   },
   {
    "kind": "help",
    "name": "Hawaii DBEDT Business Resources",
    "url": "https://dbedt.hawaii.gov/business-resources/",
    "verified": true
   },
   {
    "kind": "sba",
    "name": "SBA Hawaii District Office",
    "url": "https://legacy.sba.gov/district/hawaii",
    "verified": true
   }
  ]
 },
 "ID": {
  "name": "Idaho",
  "irs": "https://www.irs.gov/businesses/small-businesses-self-employed/idaho",
  "links": [
   {
    "kind": "reg",
    "name": "Idaho Secretary of State",
    "url": "https://sos.idaho.gov/",
    "verified": true
   },
   {
    "kind": "tax",
    "name": "Idaho State Tax Commission",
    "url": "https://tax.idaho.gov/",
    "verified": true
   },
   {
    "kind": "lic",
    "name": "Idaho Division of Occupational and Professional Licenses",
    "url": "https://dopl.idaho.gov/",
    "verified": true
   },
   {
    "kind": "help",
    "name": "Idaho Resources for Business",
    "url": "https://business.idaho.gov/",
    "verified": true
   },
   {
    "kind": "sba",
    "name": "SBA Boise District Office",
    "url": "https://legacy.sba.gov/district/boise",
    "verified": true
   }
  ]
 },
 "IL": {
  "name": "Illinois",
  "irs": "https://www.irs.gov/businesses/small-businesses-self-employed/illinois",
  "links": [
   {
    "kind": "reg",
    "name": "Illinois Secretary of State",
    "url": "https://www.ilsos.gov/",
    "verified": true
   },
   {
    "kind": "tax",
    "name": "Illinois Department of Revenue",
    "url": "https://tax.illinois.gov/",
    "verified": true
   },
   {
    "kind": "lic",
    "name": "Illinois: Registration, Licenses, and Permits",
    "url": "https://www.illinois.gov/business/registration-licenses-permits.html",
    "verified": true
   },
   {
    "kind": "help",
    "name": "Illinois DCEO: Step-by-step guide to starting a business",
    "url": "https://dceo.illinois.gov/smallbizassistance/beginhere/stepbystepguide.html",
    "verified": true
   },
   {
    "kind": "sba",
    "name": "SBA Illinois (Chicago District Office)",
    "url": "https://legacy.sba.gov/district/illinois",
    "verified": true
   }
  ]
 },
 "IN": {
  "name": "Indiana",
  "irs": "https://www.irs.gov/businesses/small-businesses-self-employed/indiana",
  "links": [
   {
    "kind": "reg",
    "name": "Indiana Secretary of State: Business Services Division",
    "url": "https://www.in.gov/sos/business/",
    "verified": true
   },
   {
    "kind": "tax",
    "name": "Indiana Department of Revenue",
    "url": "https://www.in.gov/dor/",
    "verified": true
   },
   {
    "kind": "lic",
    "name": "Indiana Business Owner's Guide",
    "url": "https://www.in.gov/core/business_guide.html",
    "verified": true
   },
   {
    "kind": "help",
    "name": "Indiana Small Business Development Center",
    "url": "https://isbdc.org/",
    "verified": true
   },
   {
    "kind": "sba",
    "name": "SBA Indiana District Office",
    "url": "https://legacy.sba.gov/district/indiana",
    "verified": true
   }
  ]
 },
 "IA": {
  "name": "Iowa",
  "irs": "https://www.irs.gov/businesses/small-businesses-self-employed/iowa",
  "links": [
   {
    "kind": "reg",
    "name": "Iowa Secretary of State: Business Services",
    "url": "https://sos.iowa.gov/business-services",
    "verified": true
   },
   {
    "kind": "tax",
    "name": "Iowa Department of Revenue",
    "url": "https://revenue.iowa.gov/",
    "verified": true
   },
   {
    "kind": "lic",
    "name": "Iowa Professional Licensing Bureau",
    "url": "https://dial.iowa.gov/licenses/other-professional-licensure",
    "verified": true
   },
   {
    "kind": "help",
    "name": "Iowa Economic Development Authority",
    "url": "https://opportunityiowa.gov/about/iowa-economic-development-authority",
    "verified": true
   },
   {
    "kind": "sba",
    "name": "SBA Iowa (Des Moines District Office)",
    "url": "https://legacy.sba.gov/district/iowa",
    "verified": true
   }
  ]
 },
 "KS": {
  "name": "Kansas",
  "irs": "https://www.irs.gov/businesses/small-businesses-self-employed/kansas",
  "links": [
   {
    "kind": "reg",
    "name": "Kansas Secretary of State",
    "url": "https://sos.ks.gov/",
    "verified": true
   },
   {
    "kind": "tax",
    "name": "Kansas Department of Revenue: Registering a business",
    "url": "https://www.ksrevenue.gov/busregistration.html",
    "verified": true
   },
   {
    "kind": "lic",
    "name": "Kansas Business Center",
    "url": "https://sos.ks.gov/businesses/businesses.html",
    "verified": true
   },
   {
    "kind": "sba",
    "name": "SBA Kansas (Wichita District Office)",
    "url": "https://legacy.sba.gov/district/wichita",
    "verified": true
   }
  ]
 },
 "KY": {
  "name": "Kentucky",
  "irs": "https://www.irs.gov/businesses/small-businesses-self-employed/kentucky",
  "links": [
   {
    "kind": "reg",
    "name": "Kentucky Secretary of State",
    "url": "https://www.sos.ky.gov/Pages/default.aspx",
    "verified": true
   },
   {
    "kind": "tax",
    "name": "Kentucky Department of Revenue",
    "url": "https://revenue.ky.gov/Pages/index.aspx",
    "verified": true
   },
   {
    "kind": "lic",
    "name": "Kentucky Business One Stop",
    "url": "https://kentucky.gov/business/Pages/default.aspx",
    "verified": true
   },
   {
    "kind": "help",
    "name": "Kentucky Small Business Development Center",
    "url": "https://kentuckysbdc.com/",
    "verified": true
   },
   {
    "kind": "sba",
    "name": "SBA Kentucky District Office",
    "url": "https://legacy.sba.gov/district/kentucky",
    "verified": true
   }
  ]
 },
 "LA": {
  "name": "Louisiana",
  "irs": "https://www.irs.gov/businesses/small-businesses-self-employed/louisiana",
  "links": [
   {
    "kind": "reg",
    "name": "Louisiana Secretary of State",
    "url": "https://www.sos.la.gov/Pages/default.aspx",
    "verified": false
   },
   {
    "kind": "tax",
    "name": "Louisiana Department of Revenue: Businesses",
    "url": "https://revenue.louisiana.gov/businesses/",
    "verified": true
   },
   {
    "kind": "sba",
    "name": "SBA Louisiana (New Orleans District Office)",
    "url": "https://legacy.sba.gov/district/louisiana",
    "verified": true
   }
  ]
 },
 "ME": {
  "name": "Maine",
  "irs": "https://www.irs.gov/businesses/small-businesses-self-employed/maine",
  "links": [
   {
    "kind": "reg",
    "name": "Maine Secretary of State: Corporations",
    "url": "https://www.maine.gov/sos/cec/corp/",
    "verified": true
   },
   {
    "kind": "tax",
    "name": "Maine Revenue Services",
    "url": "https://www.maine.gov/revenue/",
    "verified": true
   },
   {
    "kind": "lic",
    "name": "Maine Business Answers (licenses and permits)",
    "url": "https://apps.web.maine.gov/cgi/online/businessanswers/index.pl",
    "verified": true
   },
   {
    "kind": "sba",
    "name": "SBA Maine (Augusta District Office)",
    "url": "https://legacy.sba.gov/district/maine",
    "verified": true
   }
  ]
 },
 "MD": {
  "name": "Maryland",
  "irs": "https://www.irs.gov/businesses/small-businesses-self-employed/maryland",
  "links": [
   {
    "kind": "reg",
    "name": "Maryland Business Express",
    "url": "https://egov.maryland.gov/businessexpress",
    "verified": true
   },
   {
    "kind": "tax",
    "name": "Comptroller of Maryland",
    "url": "https://www.marylandcomptroller.gov/",
    "verified": true
   },
   {
    "kind": "lic",
    "name": "Maryland Checklist for New Businesses",
    "url": "https://dat.maryland.gov/businesses/pages/maryland-checklist-for-new-businesses.aspx",
    "verified": true
   },
   {
    "kind": "sba",
    "name": "SBA Maryland (Baltimore District Office)",
    "url": "https://legacy.sba.gov/district/baltimore",
    "verified": true
   }
  ]
 },
 "MA": {
  "name": "Massachusetts",
  "irs": "https://www.irs.gov/businesses/small-businesses-self-employed/massachusetts",
  "links": [
   {
    "kind": "reg",
    "name": "Massachusetts Corporations Division",
    "url": "https://www.sec.state.ma.us/cor/coridx.htm",
    "verified": false
   },
   {
    "kind": "tax",
    "name": "Massachusetts Department of Revenue",
    "url": "https://www.mass.gov/orgs/massachusetts-department-of-revenue",
    "verified": true
   },
   {
    "kind": "lic",
    "name": "Massachusetts Professional Licenses and Permits",
    "url": "https://www.mass.gov/topics/professional-licenses-permits",
    "verified": true
   },
   {
    "kind": "help",
    "name": "Massachusetts Office of Business Development",
    "url": "https://www.mass.gov/orgs/massachusetts-office-of-business-development",
    "verified": true
   },
   {
    "kind": "sba",
    "name": "SBA Massachusetts (Boston District Office)",
    "url": "https://legacy.sba.gov/district/massachusetts",
    "verified": true
   }
  ]
 },
 "MI": {
  "name": "Michigan",
  "irs": "https://www.irs.gov/businesses/small-businesses-self-employed/michigan",
  "links": [
   {
    "kind": "reg",
    "name": "Michigan LARA Corporations Division",
    "url": "https://www.michigan.gov/lara/bureau-list/cscl/corps",
    "verified": true
   },
   {
    "kind": "tax",
    "name": "Michigan Department of Treasury: Business taxes",
    "url": "https://www.michigan.gov/taxes/0,4676,7-238-43519---,00.html",
    "verified": true
   },
   {
    "kind": "lic",
    "name": "Michigan state license search",
    "url": "https://www.michigan.gov/statelicensesearch",
    "verified": true
   },
   {
    "kind": "sba",
    "name": "SBA Michigan (Detroit District Office)",
    "url": "https://legacy.sba.gov/district/michigan",
    "verified": true
   }
  ]
 },
 "MN": {
  "name": "Minnesota",
  "irs": "https://www.irs.gov/businesses/small-businesses-self-employed/minnesota",
  "links": [
   {
    "kind": "reg",
    "name": "Minnesota Secretary of State: Business Services",
    "url": "https://www.sos.mn.gov/business-liens/",
    "verified": true
   },
   {
    "kind": "tax",
    "name": "Minnesota Department of Revenue",
    "url": "https://www.revenue.state.mn.us/minnesota-department-revenue-divisions",
    "verified": true
   },
   {
    "kind": "lic",
    "name": "Minnesota DEED: Legal and regulatory (licenses and permits)",
    "url": "https://mn.gov/deed/business/starting-business/legal-regulatory/",
    "verified": true
   },
   {
    "kind": "sba",
    "name": "SBA Minnesota (Minneapolis District Office)",
    "url": "https://legacy.sba.gov/district/minnesota",
    "verified": true
   }
  ]
 },
 "MS": {
  "name": "Mississippi",
  "irs": "https://www.irs.gov/businesses/small-businesses-self-employed/mississippi",
  "links": [
   {
    "kind": "reg",
    "name": "Mississippi Secretary of State: One Stop Shop",
    "url": "https://www.ms.gov/sos/onestopshop",
    "verified": true
   },
   {
    "kind": "tax",
    "name": "Mississippi Department of Revenue",
    "url": "https://www.dor.ms.gov/Pages/default.aspx",
    "verified": true
   },
   {
    "kind": "sba",
    "name": "SBA Mississippi (Jackson District Office)",
    "url": "https://legacy.sba.gov/district/mississippi",
    "verified": true
   }
  ]
 },
 "MO": {
  "name": "Missouri",
  "irs": "https://www.irs.gov/businesses/small-businesses-self-employed/missouri",
  "links": [
   {
    "kind": "reg",
    "name": "Missouri Secretary of State: Businesses",
    "url": "https://www.sos.mo.gov/business",
    "verified": true
   },
   {
    "kind": "tax",
    "name": "Missouri Department of Revenue: Online business registration",
    "url": "https://dor.mo.gov/register-business/",
    "verified": true
   },
   {
    "kind": "lic",
    "name": "Missouri Business Portal",
    "url": "https://mo.gov/business",
    "verified": true
   },
   {
    "kind": "sba",
    "name": "SBA Missouri (St. Louis District Office)",
    "url": "https://legacy.sba.gov/district/st-louis",
    "verified": true
   }
  ]
 },
 "MT": {
  "name": "Montana",
  "irs": "https://www.irs.gov/businesses/small-businesses-self-employed/montana",
  "links": [
   {
    "kind": "reg",
    "name": "Montana Secretary of State: Business Services",
    "url": "https://sosmt.gov/business/",
    "verified": true
   },
   {
    "kind": "tax",
    "name": "Montana Department of Revenue",
    "url": "https://revenue.mt.gov/",
    "verified": true
   },
   {
    "kind": "lic",
    "name": "Montana business licensing boards",
    "url": "https://boards.bsd.dli.mt.gov/",
    "verified": true
   },
   {
    "kind": "help",
    "name": "Montana Small Business Development Center Network",
    "url": "https://sbdc.mt.gov/",
    "verified": true
   },
   {
    "kind": "sba",
    "name": "SBA Montana District Office",
    "url": "https://legacy.sba.gov/district/montana",
    "verified": true
   }
  ]
 },
 "NE": {
  "name": "Nebraska",
  "irs": "https://www.irs.gov/businesses/small-businesses-self-employed/nebraska",
  "links": [
   {
    "kind": "reg",
    "name": "Nebraska Secretary of State: Corporate and Business",
    "url": "https://sos.nebraska.gov/business-services/corporate-and-business",
    "verified": true
   },
   {
    "kind": "tax",
    "name": "Nebraska Department of Revenue",
    "url": "https://revenue.nebraska.gov/",
    "verified": true
   },
   {
    "kind": "lic",
    "name": "Nebraska business licensing",
    "url": "https://www.nebraska.gov/business/business-licensing/",
    "verified": true
   },
   {
    "kind": "sba",
    "name": "SBA Nebraska District Office",
    "url": "https://legacy.sba.gov/district/nebraska",
    "verified": true
   }
  ]
 },
 "NV": {
  "name": "Nevada",
  "irs": "https://www.irs.gov/businesses/small-businesses-self-employed/nevada",
  "links": [
   {
    "kind": "reg",
    "name": "Nevada Secretary of State",
    "url": "https://www.nvsos.gov/sos",
    "verified": false
   },
   {
    "kind": "tax",
    "name": "Nevada Department of Taxation",
    "url": "https://tax.nv.gov/",
    "verified": true
   },
   {
    "kind": "help",
    "name": "Nevada Small Business Development Center",
    "url": "https://nevadasbdc.org/",
    "verified": true
   },
   {
    "kind": "sba",
    "name": "SBA Nevada District Office",
    "url": "https://legacy.sba.gov/district/nevada",
    "verified": true
   }
  ]
 },
 "NH": {
  "name": "New Hampshire",
  "irs": "https://www.irs.gov/businesses/small-businesses-self-employed/new-hampshire",
  "links": [
   {
    "kind": "reg",
    "name": "New Hampshire Secretary of State: Corporation Division",
    "url": "https://www.sos.nh.gov/corporations-0",
    "verified": true
   },
   {
    "kind": "tax",
    "name": "New Hampshire Department of Revenue Administration",
    "url": "https://www.revenue.nh.gov/",
    "verified": true
   },
   {
    "kind": "sba",
    "name": "SBA New Hampshire District Office",
    "url": "https://legacy.sba.gov/district/new-hampshire",
    "verified": true
   }
  ]
 },
 "NJ": {
  "name": "New Jersey",
  "irs": "https://www.irs.gov/businesses/small-businesses-self-employed/new-jersey",
  "links": [
   {
    "kind": "reg",
    "name": "New Jersey Business Portal",
    "url": "https://business.nj.gov/",
    "verified": true
   },
   {
    "kind": "tax",
    "name": "New Jersey Division of Taxation",
    "url": "https://www.nj.gov/treasury/taxation/",
    "verified": true
   },
   {
    "kind": "sba",
    "name": "SBA New Jersey (Newark District Office)",
    "url": "https://legacy.sba.gov/district/new-jersey",
    "verified": true
   }
  ]
 },
 "NM": {
  "name": "New Mexico",
  "irs": "https://www.irs.gov/businesses/small-businesses-self-employed/new-mexico",
  "links": [
   {
    "kind": "reg",
    "name": "New Mexico Secretary of State: Business Services",
    "url": "https://www.sos.nm.gov/business-services/",
    "verified": true
   },
   {
    "kind": "tax",
    "name": "New Mexico Taxation and Revenue Department",
    "url": "https://www.tax.newmexico.gov/Default.aspx",
    "verified": true
   },
   {
    "kind": "lic",
    "name": "New Mexico Regulation and Licensing Department",
    "url": "https://www.rld.nm.gov/",
    "verified": true
   },
   {
    "kind": "sba",
    "name": "SBA New Mexico District Office",
    "url": "https://legacy.sba.gov/district/new-mexico",
    "verified": true
   }
  ]
 },
 "NY": {
  "name": "New York",
  "irs": "https://www.irs.gov/businesses/small-businesses-self-employed/new-york",
  "links": [
   {
    "kind": "reg",
    "name": "New York Department of State: Corporations",
    "url": "https://dos.ny.gov/existing-corporations-and-businesses",
    "verified": true
   },
   {
    "kind": "tax",
    "name": "New York Department of Taxation and Finance",
    "url": "https://www.tax.ny.gov/",
    "verified": true
   },
   {
    "kind": "lic",
    "name": "New York: Business licenses and permits",
    "url": "https://www.ny.gov/services/licenses",
    "verified": true
   },
   {
    "kind": "sba",
    "name": "SBA district offices (find the one for your area)",
    "url": "https://legacy.sba.gov/about-sba/sba-locations/sba-district-offices",
    "verified": true
   }
  ]
 },
 "NC": {
  "name": "North Carolina",
  "irs": "https://www.irs.gov/businesses/small-businesses-self-employed/north-carolina",
  "links": [
   {
    "kind": "reg",
    "name": "NC Secretary of State: Business Registration",
    "url": "https://www.sosnc.gov/divisions/business_registration",
    "verified": true
   },
   {
    "kind": "tax",
    "name": "NC Department of Revenue",
    "url": "https://www.ncdor.gov/",
    "verified": true
   },
   {
    "kind": "lic",
    "name": "NC Secretary of State: Licenses and permits",
    "url": "https://sosnc.gov/Guides/launching_a_business/license_permit",
    "verified": true
   },
   {
    "kind": "help",
    "name": "NC Small Business and Technology Development Center",
    "url": "https://sbtdc.org/services",
    "verified": true
   },
   {
    "kind": "sba",
    "name": "SBA North Carolina District Office",
    "url": "https://legacy.sba.gov/district/north-carolina",
    "verified": true
   }
  ]
 },
 "ND": {
  "name": "North Dakota",
  "irs": "https://www.irs.gov/businesses/small-businesses-self-employed/north-dakota",
  "links": [
   {
    "kind": "reg",
    "name": "North Dakota Secretary of State: Business services",
    "url": "https://sos.nd.gov/business/business-services",
    "verified": true
   },
   {
    "kind": "tax",
    "name": "North Dakota Office of State Tax Commissioner",
    "url": "https://www.tax.nd.gov/",
    "verified": true
   },
   {
    "kind": "lic",
    "name": "North Dakota: Licensing and registration",
    "url": "https://www.sos.nd.gov/business/licensing-registration",
    "verified": true
   },
   {
    "kind": "sba",
    "name": "SBA North Dakota (Fargo District Office)",
    "url": "https://legacy.sba.gov/district/north-dakota",
    "verified": true
   }
  ]
 },
 "OH": {
  "name": "Ohio",
  "irs": "https://www.irs.gov/businesses/small-businesses-self-employed/ohio",
  "links": [
   {
    "kind": "reg",
    "name": "Ohio Secretary of State",
    "url": "https://www.ohiosos.gov/",
    "verified": true
   },
   {
    "kind": "tax",
    "name": "Ohio Department of Taxation",
    "url": "https://tax.ohio.gov/",
    "verified": true
   },
   {
    "kind": "lic",
    "name": "Ohio: Information for businesses",
    "url": "https://ohio.gov/business",
    "verified": true
   },
   {
    "kind": "sba",
    "name": "SBA Ohio (Cleveland District Office)",
    "url": "https://legacy.sba.gov/district/central-and-southern-ohio",
    "verified": true
   }
  ]
 },
 "OK": {
  "name": "Oklahoma",
  "irs": "https://www.irs.gov/businesses/small-businesses-self-employed/oklahoma",
  "links": [
   {
    "kind": "reg",
    "name": "Oklahoma Secretary of State: Business Services",
    "url": "https://www.sos.ok.gov/business/default.aspx",
    "verified": false
   },
   {
    "kind": "tax",
    "name": "Oklahoma Tax Commission",
    "url": "https://oklahoma.gov/tax.html",
    "verified": true
   },
   {
    "kind": "lic",
    "name": "Oklahoma: Licenses and permits",
    "url": "https://oklahoma.gov/business/operate/licenses-and-permits.html",
    "verified": true
   },
   {
    "kind": "sba",
    "name": "SBA Oklahoma (Oklahoma City District Office)",
    "url": "https://legacy.sba.gov/district/oklahoma",
    "verified": true
   }
  ]
 },
 "OR": {
  "name": "Oregon",
  "irs": "https://www.irs.gov/businesses/small-businesses-self-employed/oregon",
  "links": [
   {
    "kind": "reg",
    "name": "Oregon Secretary of State: Register a business",
    "url": "https://sos.oregon.gov/business/Pages/register.aspx",
    "verified": true
   },
   {
    "kind": "tax",
    "name": "Oregon Department of Revenue",
    "url": "https://www.oregon.gov/DOR/Pages/file.aspx",
    "verified": true
   },
   {
    "kind": "sba",
    "name": "SBA Oregon (Portland District Office)",
    "url": "https://legacy.sba.gov/district/portland",
    "verified": true
   }
  ]
 },
 "PA": {
  "name": "Pennsylvania",
  "irs": "https://www.irs.gov/businesses/small-businesses-self-employed/pennsylvania",
  "links": [
   {
    "kind": "reg",
    "name": "Pennsylvania Business One-Stop Shop: Registering with Pennsylvania",
    "url": "https://business.pa.gov/register/registering-with-pennsylvania/",
    "verified": true
   },
   {
    "kind": "tax",
    "name": "Pennsylvania Department of Revenue",
    "url": "https://www.pa.gov/agencies/revenue/about-us",
    "verified": true
   },
   {
    "kind": "sba",
    "name": "SBA district offices (find the one for your area)",
    "url": "https://legacy.sba.gov/about-sba/sba-locations/sba-district-offices",
    "verified": true
   }
  ]
 },
 "RI": {
  "name": "Rhode Island",
  "irs": "https://www.irs.gov/businesses/small-businesses-self-employed/rhode-island",
  "links": [
   {
    "kind": "reg",
    "name": "Rhode Island Department of State",
    "url": "https://www.sos.ri.gov/",
    "verified": true
   },
   {
    "kind": "tax",
    "name": "Rhode Island Division of Taxation: Business registration",
    "url": "https://tax.ri.gov/resources/businesses/registration",
    "verified": true
   },
   {
    "kind": "sba",
    "name": "SBA Rhode Island (Providence District Office)",
    "url": "https://legacy.sba.gov/district/rhode-island",
    "verified": true
   }
  ]
 },
 "SC": {
  "name": "South Carolina",
  "irs": "https://www.irs.gov/businesses/small-businesses-self-employed/south-carolina",
  "links": [
   {
    "kind": "reg",
    "name": "South Carolina Business One Stop",
    "url": "https://scbos.sc.gov/",
    "verified": true
   },
   {
    "kind": "tax",
    "name": "South Carolina Business One Stop (state tax accounts)",
    "url": "https://scbos.sc.gov",
    "verified": true
   },
   {
    "kind": "sba",
    "name": "SBA South Carolina (Columbia District Office)",
    "url": "https://legacy.sba.gov/district/south-carolina",
    "verified": true
   }
  ]
 },
 "SD": {
  "name": "South Dakota",
  "irs": "https://www.irs.gov/businesses/small-businesses-self-employed/south-dakota",
  "links": [
   {
    "kind": "reg",
    "name": "South Dakota Secretary of State: Business Services",
    "url": "https://sdsos.gov/Division%20of%20Business%20Services/default.aspx",
    "verified": true
   },
   {
    "kind": "tax",
    "name": "South Dakota Department of Revenue: License requirements for sales, use, and contractor excise tax",
    "url": "https://dor.sd.gov/media/qn3a1y31/license-requirements-for-sales-use-contractors-excise-tax.pdf",
    "verified": true
   },
   {
    "kind": "sba",
    "name": "SBA South Dakota (Sioux Falls District Office)",
    "url": "https://legacy.sba.gov/district/south-dakota",
    "verified": true
   }
  ]
 },
 "TN": {
  "name": "Tennessee",
  "irs": "https://www.irs.gov/businesses/small-businesses-self-employed/tennessee",
  "links": [
   {
    "kind": "reg",
    "name": "Tennessee Secretary of State: Business Services",
    "url": "https://sos.tn.gov/businesses/services",
    "verified": true
   },
   {
    "kind": "tax",
    "name": "Tennessee Department of Revenue: Registration and licensing",
    "url": "https://www.tn.gov/revenue/taxes/business-tax/registration-and-licensing.html",
    "verified": true
   },
   {
    "kind": "sba",
    "name": "SBA Tennessee (Nashville District Office)",
    "url": "https://legacy.sba.gov/district/tennessee",
    "verified": true
   }
  ]
 },
 "TX": {
  "name": "Texas",
  "irs": "https://www.irs.gov/businesses/small-businesses-self-employed/texas",
  "links": [
   {
    "kind": "reg",
    "name": "Texas Secretary of State: Business organizations",
    "url": "https://www.sos.texas.gov/corp/boc.shtml",
    "verified": true
   },
   {
    "kind": "tax",
    "name": "Texas Comptroller: Online tax registration",
    "url": "https://comptroller.texas.gov/taxes/permit",
    "verified": true
   },
   {
    "kind": "sba",
    "name": "SBA district offices (find the one for your area)",
    "url": "https://legacy.sba.gov/about-sba/sba-locations/sba-district-offices",
    "verified": true
   }
  ]
 },
 "UT": {
  "name": "Utah",
  "irs": "https://www.irs.gov/businesses/small-businesses-self-employed/utah",
  "links": [
   {
    "kind": "reg",
    "name": "Utah Division of Corporations: Do I need to register my business?",
    "url": "https://commerce.utah.gov/2021/12/28/do-i-need-to-register/",
    "verified": true
   },
   {
    "kind": "tax",
    "name": "Utah State Tax Commission: Create and manage a tax account",
    "url": "https://tax.utah.gov/utah-taxes/registration",
    "verified": true
   },
   {
    "kind": "sba",
    "name": "SBA Utah (Salt Lake City District Office)",
    "url": "https://legacy.sba.gov/district/utah",
    "verified": true
   }
  ]
 },
 "VT": {
  "name": "Vermont",
  "irs": "https://www.irs.gov/businesses/small-businesses-self-employed/vermont",
  "links": [
   {
    "kind": "reg",
    "name": "Vermont Secretary of State: Corporations registration services",
    "url": "https://sos.vermont.gov/corporations/other-services",
    "verified": true
   },
   {
    "kind": "tax",
    "name": "Vermont Department of Taxes: Register for a business tax account",
    "url": "https://tax.vermont.gov/business/register",
    "verified": true
   },
   {
    "kind": "sba",
    "name": "SBA Vermont (Montpelier District Office)",
    "url": "https://legacy.sba.gov/district/vermont",
    "verified": true
   }
  ]
 },
 "VA": {
  "name": "Virginia",
  "irs": "https://www.irs.gov/businesses/small-businesses-self-employed/virginia",
  "links": [
   {
    "kind": "reg",
    "name": "Virginia State Corporation Commission: Clerk's Information System guide",
    "url": "https://scc.virginia.gov/getattachment/916037a7-a87d-45a9-b2cf-1315fec436c3/How-To-Guide-Fictitious-Name.pdf",
    "verified": true
   },
   {
    "kind": "tax",
    "name": "Virginia Tax: Resources for business taxpayers",
    "url": "https://tax.virginia.gov/businesses",
    "verified": true
   },
   {
    "kind": "sba",
    "name": "SBA Virginia (Richmond District Office)",
    "url": "https://legacy.sba.gov/district/virginia",
    "verified": true
   }
  ]
 },
 "WA": {
  "name": "Washington",
  "irs": "https://www.irs.gov/businesses/small-businesses-self-employed/washington",
  "links": [
   {
    "kind": "reg",
    "name": "Washington Secretary of State: Start or register a business",
    "url": "https://www.sos.wa.gov/vi/node/12457",
    "verified": true
   },
   {
    "kind": "tax",
    "name": "Washington Business Road Map: License your business",
    "url": "https://www.business.wa.gov/951",
    "verified": true
   },
   {
    "kind": "sba",
    "name": "SBA Washington (Seattle District Office)",
    "url": "https://legacy.sba.gov/district/seattle",
    "verified": true
   }
  ]
 },
 "WV": {
  "name": "West Virginia",
  "irs": "https://www.irs.gov/businesses/small-businesses-self-employed/west-virginia",
  "links": [
   {
    "kind": "reg",
    "name": "West Virginia Secretary of State: WV One Stop Business portal",
    "url": "https://sos.wv.gov/business/Documents/WVOneStop-BizWiz-SBDC.pdf",
    "verified": true
   },
   {
    "kind": "tax",
    "name": "West Virginia Tax Division: Business registration",
    "url": "https://tax.wv.gov/Business/BusinessRegistration/Pages/BusinessRegistration.aspx",
    "verified": true
   },
   {
    "kind": "sba",
    "name": "SBA West Virginia District Office",
    "url": "https://legacy.sba.gov/district/west-virginia",
    "verified": true
   }
  ]
 },
 "WI": {
  "name": "Wisconsin",
  "irs": "https://www.irs.gov/businesses/small-businesses-self-employed/wisconsin",
  "links": [
   {
    "kind": "reg",
    "name": "Wisconsin DFI: Business entity services",
    "url": "https://dfi.wi.gov/Pages/BusinessServices/BusinessEntities/CorpDataServices.aspx",
    "verified": true
   },
   {
    "kind": "tax",
    "name": "Wisconsin Department of Revenue: Business tax registration questions",
    "url": "https://www.revenue.wi.gov/Pages/FAQS/using-mta-general-questions.aspx",
    "verified": true
   },
   {
    "kind": "sba",
    "name": "SBA Wisconsin District Office",
    "url": "https://legacy.sba.gov/district/wisconsin",
    "verified": true
   }
  ]
 },
 "WY": {
  "name": "Wyoming",
  "irs": "https://www.irs.gov/businesses/small-businesses-self-employed/wyoming",
  "links": [
   {
    "kind": "reg",
    "name": "Wyoming Secretary of State: How to create a Wyoming company",
    "url": "https://sos.wyo.gov/Business/Docs/HowToCreateAWyomingCompany.pdf",
    "verified": true
   },
   {
    "kind": "tax",
    "name": "Wyoming Department of Revenue: Excise Tax Division FAQs",
    "url": "https://excise-tax-div.wyo.gov/general-administrative/excise-tax-faqs",
    "verified": true
   },
   {
    "kind": "sba",
    "name": "SBA Wyoming District Office",
    "url": "https://legacy.sba.gov/district/wyoming",
    "verified": true
   }
  ]
 },
 "PR": {
  "name": "Puerto Rico",
  "irs": null,
  "links": [
   {
    "kind": "reg",
    "name": "Puerto Rico Department of State: Registry of Corporations and Entities",
    "url": "https://estado.pr.gov/en/services/services-corporations",
    "verified": true
   },
   {
    "kind": "tax",
    "name": "Puerto Rico Departamento de Hacienda: SURI (merchant registration)",
    "url": "https://apps1.hacienda.pr.gov/SuriLandingPage",
    "verified": true
   },
   {
    "kind": "sba",
    "name": "SBA Puerto Rico and U.S. Virgin Islands District Office",
    "url": "https://legacy.sba.gov/district/puerto-rico-us-virgin-islands",
    "verified": true
   }
  ]
 },
 "VI": {
  "name": "U.S. Virgin Islands",
  "irs": null,
  "links": [
   {
    "kind": "lic",
    "name": "USVI Department of Licensing and Consumer Affairs: Steps for obtaining a business license",
    "url": "https://dlca.vi.gov/businesslicense/steps.htm",
    "verified": true
   },
   {
    "kind": "tax",
    "name": "Virgin Islands Bureau of Internal Revenue",
    "url": "https://bir.vi.gov/",
    "verified": true
   },
   {
    "kind": "sba",
    "name": "SBA Puerto Rico and U.S. Virgin Islands District Office",
    "url": "https://legacy.sba.gov/district/puerto-rico-us-virgin-islands",
    "verified": true
   }
  ]
 },
 "GU": {
  "name": "Guam",
  "irs": null,
  "links": [
   {
    "kind": "lic",
    "name": "Guam Business License and Permit Center",
    "url": "https://bsp.guam.gov/blpc",
    "verified": true
   },
   {
    "kind": "tax",
    "name": "Guam Department of Revenue and Taxation",
    "url": "https://www.guamtax.com/",
    "verified": true
   },
   {
    "kind": "sba",
    "name": "SBA Hawaii District (Guam office)",
    "url": "https://legacy.sba.gov/district/hawaii",
    "verified": true
   }
  ]
 },
 "AS": {
  "name": "American Samoa",
  "irs": null,
  "links": [
   {
    "kind": "lic",
    "name": "American Samoa Department of Commerce (business licensing)",
    "url": "https://www.doc.as.gov/",
    "verified": true
   },
   {
    "kind": "sba",
    "name": "SBA Hawaii District (serves American Samoa)",
    "url": "https://legacy.sba.gov/district/hawaii",
    "verified": true
   }
  ]
 },
 "MP": {
  "name": "Northern Mariana Islands",
  "irs": null,
  "links": [
   {
    "kind": "reg",
    "name": "CNMI Department of Commerce (corporate registrar)",
    "url": "https://www.commerce.gov.mp/",
    "verified": true
   },
   {
    "kind": "sba",
    "name": "SBA Hawaii District (Guam office serves the CNMI)",
    "url": "https://legacy.sba.gov/district/hawaii",
    "verified": true
   }
  ]
 }
};

const KIND_LABEL = { reg: "Business registration", tax: "State taxes", lic: "Licenses and permits", help: "Free business help", sba: "SBA district office", irs: "IRS: your state's business and tax links" };

export function stateName(code) {
  return STATES[code]?.name || "";
}

/** Per-project source entries for a state, keyed st_reg, st_tax, st_lic, st_help, st_sba, st_irs. */
export function stateSources(code) {
  const s = STATES[code];
  if (!s) return {};
  const out = {};
  for (const l of s.links) {
    const id = `st_${l.kind}`;
    if (out[id]) continue; // first link of each kind
    out[id] = { title: l.name, org: l.name, url: l.url, summary: `${KIND_LABEL[l.kind]} for ${s.name}.`, checked: STATES_CHECKED, state: code, verified: l.verified };
  }
  if (s.irs) out.st_irs = { title: `IRS: ${s.name} state government websites`, org: "Internal Revenue Service", url: s.irs, summary: `The IRS list of ${s.name}'s official business, tax, licensing, and employer websites.`, checked: STATES_CHECKED, state: code, verified: true };
  return out;
}

export const STATE_CODES = Object.keys(STATES);
