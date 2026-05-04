// HOU Inc. — internal finance OS data
export const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Math.abs(n));
export const fmtSigned = (n: number) =>
  (n >= 0 ? "+" : "−") + fmt(n);
export const fmtCompact = (n: number) =>
  new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1, style: "currency", currency: "USD" }).format(n);

export type Health = "green" | "yellow" | "red";

export type Project = {
  id: string; name: string; type: "Commercial" | "Residential";
  address: string; pm: string;
  stage: "Estimate" | "Budget" | "Build" | "Closeout";
  budget: number; spent: number; revenue: number; committed: number;
  health: Health;
};

export const projects: Project[] = [
  { id: "p1", name: "Heights Mid-Rise", type: "Commercial", address: "1820 Yale St", pm: "M. Alvarez", stage: "Build", budget: 4_800_000, spent: 3_120_000, revenue: 3_450_000, committed: 720_000, health: "yellow" },
  { id: "p2", name: "Memorial Office Reno", type: "Commercial", address: "9 Greenway Plz", pm: "S. Patel", stage: "Closeout", budget: 1_250_000, spent: 1_080_000, revenue: 1_320_000, committed: 40_000, health: "green" },
  { id: "p3", name: "Galleria Retail Buildout", type: "Commercial", address: "5085 Westheimer", pm: "J. Chen", stage: "Build", budget: 920_000, spent: 410_000, revenue: 460_000, committed: 280_000, health: "green" },
  { id: "p4", name: "Bellaire Custom Home", type: "Residential", address: "4711 Holt St", pm: "R. Nguyen", stage: "Build", budget: 1_180_000, spent: 1_290_000, revenue: 1_120_000, committed: 60_000, health: "red" },
  { id: "p5", name: "River Oaks Remodel", type: "Residential", address: "3320 Inwood Dr", pm: "R. Nguyen", stage: "Build", budget: 640_000, spent: 388_000, revenue: 420_000, committed: 95_000, health: "green" },
  { id: "p6", name: "Spring Branch Warehouse", type: "Commercial", address: "8401 Katy Fwy", pm: "M. Alvarez", stage: "Estimate", budget: 2_400_000, spent: 24_000, revenue: 0, committed: 0, health: "green" },
];

export const projectMargin = (p: Project) =>
  p.revenue === 0 ? 0 : ((p.revenue - p.spent) / p.revenue) * 100;

export type Txn = {
  id: string;
  date: string;
  vendor: string;
  project: string;
  category: string;
  amount: number;
  type: "expense" | "income" | "check";
  status?: "cleared" | "pending" | "void";
  note?: string;
  memo?: string;
  checkNum?: string;
};

export const transactions: Txn[] = [
  { id: "t1", date: "May 04", vendor: "Cemex Concrete", project: "Heights Mid-Rise", category: "Concrete", amount: -48_200, type: "expense", memo: "Concrete pour – floors 4–6, batch #C-4418" },
  { id: "t2", date: "May 03", vendor: "Owner Draw #4", project: "Heights Mid-Rise", category: "Owner Draw", amount: 425_000, type: "income", memo: "Progress billing – structural complete milestone" },
  { id: "t3", date: "May 03", vendor: "Rivera Framing LLC", project: "Galleria Retail Buildout", category: "Framing", amount: -62_400, type: "check", status: "pending", checkNum: "10428", memo: "Phase 2 framing progress payment per contract" },
  { id: "t4", date: "May 02", vendor: "City of Houston", project: "Spring Branch Warehouse", category: "Permits & Fees", amount: -8_950, type: "expense", memo: "Building permit & inspection fees — plan #HOU-2024-0842" },
  { id: "t5", date: "May 02", vendor: "Sunbelt Rentals", project: "Memorial Office Reno", category: "Equipment Rental", amount: -3_280, type: "expense", memo: "Scissor lift rental – 2 weeks – PO #SL-4221" },
  { id: "t6", date: "May 01", vendor: "Apex Electrical", project: "Heights Mid-Rise", category: "Electrical", amount: -28_700, type: "check", status: "cleared", checkNum: "10426", memo: "Rough-in electrical floors 1–3 complete — approved by M. Alvarez" },
  { id: "t7", date: "Apr 30", vendor: "Memorial Holdings", project: "Memorial Office Reno", category: "Owner Draw", amount: 180_000, type: "income", memo: "Final draw – punch list signed off — retainage released" },
  { id: "t8", date: "Apr 29", vendor: "Bellaire Owner Pmt", project: "Bellaire Custom Home", category: "Owner Draw", amount: 95_000, type: "income", memo: "Owner payment #3 – framing complete — draw request DR-003" },
  { id: "t9", date: "Apr 28", vendor: "Lowe's Pro Supply", project: "Galleria Retail Buildout", category: "Hardware & Finishes", amount: -2_140, type: "expense", memo: "Misc hardware & finish materials — ticket #T-8821" },
  { id: "t10", date: "Apr 27", vendor: "Triton Steel", project: "Heights Mid-Rise", category: "Structural Steel", amount: -18_400, type: "check", status: "cleared", checkNum: "10425", memo: "Structural steel delivery – phase 2 — PO #TS-772" },
  { id: "t11", date: "Apr 25", vendor: "Sunbelt Rentals", project: "Bellaire Custom Home", category: "Equipment Rental", amount: -1_840, type: "expense", memo: "Concrete mixer & scaffolding — 1 week extension" },
  { id: "t12", date: "Apr 24", vendor: "Galleria Owner", project: "Galleria Retail Buildout", category: "Owner Draw", amount: 230_000, type: "income", memo: "Milestone 1 payment – framing approved — per contract §4.2" },
  { id: "t13", date: "Apr 23", vendor: "Rivera Framing LLC", project: "Heights Mid-Rise", category: "Framing", amount: -44_800, type: "check", status: "cleared", checkNum: "10423", memo: "Phase 1 framing — elevation A-B complete" },
  { id: "t14", date: "Apr 22", vendor: "Home Depot Pro", project: "River Oaks Remodel", category: "Hardware & Finishes", amount: -4_920, type: "expense", memo: "Kitchen cabinets & hardware — model Monterey Shaker" },
  { id: "t15", date: "Apr 21", vendor: "Texas Power & Light", project: "Heights Mid-Rise", category: "Utilities", amount: -12_100, type: "expense", memo: "Temp power utility — meter #HM-44289" },
];

export const checks = [
  { num: "10428", vendor: "Rivera Framing LLC", project: "Galleria Retail Buildout", amount: 62_400, date: "May 03", status: "pending" as const, age: 1, memo: "Phase 2 framing progress payment per contract" },
  { num: "10427", vendor: "Cemex Concrete", project: "Heights Mid-Rise", amount: 48_200, date: "May 04", status: "pending" as const, age: 0, memo: "Concrete pour batch #C-4418, floors 4-6" },
  { num: "10426", vendor: "Apex Electrical", project: "Heights Mid-Rise", amount: 28_700, date: "Apr 30", status: "cleared" as const, age: 4, memo: "Rough-in electrical floors 1-3 complete" },
  { num: "10425", vendor: "Triton Steel", project: "Heights Mid-Rise", amount: 18_400, date: "Apr 27", status: "cleared" as const, age: 7, memo: "Structural steel delivery – phase 2" },
  { num: "10424", vendor: "Sunbelt Rentals", project: "Memorial Office Reno", amount: 3_280, date: "Apr 27", status: "cleared" as const, age: 7, memo: "Scissor lift rental balance" },
  { num: "10423", vendor: "Rivera Framing LLC", project: "Heights Mid-Rise", amount: 44_800, date: "Apr 23", status: "cleared" as const, age: 11, memo: "Phase 1 framing — elevation A-B complete" },
];

export const forecast = [
  { d: "Apr 28", actual: 1_810, forecast: null as number | null },
  { d: "Apr 30", actual: 1_990, forecast: null },
  { d: "May 02", actual: 1_920, forecast: null },
  { d: "May 04", actual: 1_842, forecast: 1_842 },
  { d: "May 06", actual: null, forecast: 1_780 },
  { d: "May 08", actual: null, forecast: 1_640 },
  { d: "May 10", actual: null, forecast: 1_410 },
  { d: "May 12", actual: null, forecast: 1_290 },
  { d: "May 14", actual: null, forecast: 1_120 },
  { d: "May 16", actual: null, forecast: 980 },
  { d: "May 18", actual: null, forecast: 1_320 },
  { d: "May 20", actual: null, forecast: 1_580 },
  { d: "May 22", actual: null, forecast: 1_910 },
  { d: "May 24", actual: null, forecast: 2_240 },
  { d: "May 28", actual: null, forecast: 2_410 },
];

export const upcomingFlows = [
  { date: "May 06", label: "Apex Electrical", project: "Heights Mid-Rise", amount: -28_700, kind: "Check clearing" },
  { date: "May 08", label: "Cemex Concrete", project: "Heights Mid-Rise", amount: -48_200, kind: "Check clearing" },
  { date: "May 10", label: "Payroll · biweekly", project: "All", amount: -184_000, kind: "Recurring" },
  { date: "May 14", label: "Rivera Framing", project: "Galleria Retail Buildout", amount: -62_400, kind: "Check clearing" },
  { date: "May 17", label: "Memorial Draw #5", project: "Memorial Office Reno", amount: 220_000, kind: "Expected income" },
  { date: "May 22", label: "Galleria Milestone 2", project: "Galleria Retail Buildout", amount: 145_000, kind: "Expected income" },
];

export const vendors = [
  { name: "Cemex Concrete", category: "Concrete", ytd: 412_300, open: 48_200, on1099: false, trend: 8.2, freq: "Weekly", flag: "rising" as const },
  { name: "Rivera Framing LLC", category: "Framing", ytd: 286_400, open: 62_400, on1099: true, trend: -2.1, freq: "Bi-weekly", flag: null },
  { name: "Apex Electrical", category: "Electrical", ytd: 198_500, open: 0, on1099: true, trend: 1.4, freq: "Monthly", flag: null },
  { name: "Sunbelt Rentals", category: "Equipment Rental", ytd: 64_280, open: 3_280, on1099: false, trend: 14.6, freq: "Weekly", flag: "duplicate" as const },
  { name: "Triton Steel", category: "Structural Steel", ytd: 148_900, open: 22_400, on1099: false, trend: 4.8, freq: "Bi-weekly", flag: null },
  { name: "Lowe's Pro Supply", category: "Hardware & Finishes", ytd: 41_900, open: 2_140, on1099: false, trend: -5.2, freq: "Daily", flag: null },
];

export const recentVendors = ["Cemex Concrete", "Rivera Framing LLC", "Sunbelt Rentals", "City of Houston", "Apex Electrical", "Triton Steel", "Lowe's Pro Supply", "Home Depot Pro", "Texas Power & Light"];
export const recentProjects = ["Heights Mid-Rise", "Galleria Retail Buildout", "Memorial Office Reno", "Bellaire Custom Home", "River Oaks Remodel", "Spring Branch Warehouse"];

// Expanded construction industry categories — commercial & residential
export const categories = [
  "Concrete",
  "Framing",
  "Electrical",
  "Plumbing",
  "HVAC",
  "Structural Steel",
  "Roofing",
  "Drywall & Ceilings",
  "Flooring & Tile",
  "Painting & Finishes",
  "Hardware & Finishes",
  "Cabinetry & Millwork",
  "Windows & Doors",
  "Insulation",
  "Foundation & Excavation",
  "Masonry",
  "Landscaping & Site",
  "Equipment Rental",
  "Permits & Fees",
  "Utilities",
  "Insurance & Bonds",
  "Labor & Payroll",
  "Subcontractor",
  "Owner Draw",
  "General Conditions",
  "Other",
];