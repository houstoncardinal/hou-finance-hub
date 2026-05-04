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
  id: string; date: string; vendor: string; project: string; category: string; amount: number;
  type: "expense" | "income" | "check"; status?: "cleared" | "pending"; note?: string;
};

export const transactions: Txn[] = [
  { id: "t1", date: "May 04", vendor: "Cemex Concrete", project: "Heights Mid-Rise", category: "Materials", amount: -48_200, type: "expense" },
  { id: "t2", date: "May 03", vendor: "Owner Draw #4", project: "Heights Mid-Rise", category: "Income", amount: 425_000, type: "income" },
  { id: "t3", date: "May 03", vendor: "Rivera Framing LLC", project: "Galleria Retail", category: "Subcontractor", amount: -62_400, type: "check", status: "pending" },
  { id: "t4", date: "May 02", vendor: "City of Houston", project: "Spring Branch Wh.", category: "Permits", amount: -8_950, type: "expense" },
  { id: "t5", date: "May 02", vendor: "Sunbelt Rentals", project: "Memorial Office", category: "Equipment", amount: -3_280, type: "expense" },
  { id: "t6", date: "May 01", vendor: "Apex Electrical", project: "Heights Mid-Rise", category: "Subcontractor", amount: -28_700, type: "check", status: "cleared" },
  { id: "t7", date: "Apr 30", vendor: "Memorial Holdings", project: "Memorial Office", category: "Income", amount: 180_000, type: "income" },
  { id: "t8", date: "Apr 29", vendor: "Bellaire Owner Pmt", project: "Bellaire Custom Home", category: "Income", amount: 95_000, type: "income" },
  { id: "t9", date: "Apr 28", vendor: "Lowe's Pro Supply", project: "Galleria Retail", category: "Materials", amount: -2_140, type: "expense" },
];

// 30-day cash forecast (today index = 4)
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
  { date: "May 06", label: "Apex Electrical", project: "Heights", amount: -28_700, kind: "Check clearing" },
  { date: "May 08", label: "Cemex Concrete", project: "Heights", amount: -48_200, kind: "Check clearing" },
  { date: "May 10", label: "Payroll · biweekly", project: "All", amount: -184_000, kind: "Recurring" },
  { date: "May 14", label: "Rivera Framing", project: "Galleria", amount: -62_400, kind: "Check clearing" },
  { date: "May 17", label: "Memorial Draw #5", project: "Memorial", amount: 220_000, kind: "Expected income" },
  { date: "May 22", label: "Galleria Milestone 2", project: "Galleria", amount: 145_000, kind: "Expected income" },
];

export const vendors = [
  { name: "Cemex Concrete", category: "Materials", ytd: 412_300, open: 48_200, on1099: false, trend: 8.2, freq: "Weekly", flag: "rising" as const },
  { name: "Rivera Framing LLC", category: "Subcontractor", ytd: 286_400, open: 62_400, on1099: true, trend: -2.1, freq: "Bi-weekly", flag: null },
  { name: "Apex Electrical", category: "Subcontractor", ytd: 198_500, open: 0, on1099: true, trend: 1.4, freq: "Monthly", flag: null },
  { name: "Sunbelt Rentals", category: "Equipment", ytd: 64_280, open: 3_280, on1099: false, trend: 14.6, freq: "Weekly", flag: "duplicate" as const },
  { name: "Triton Steel", category: "Materials", ytd: 148_900, open: 22_400, on1099: false, trend: 4.8, freq: "Bi-weekly", flag: null },
  { name: "Lowe's Pro Supply", category: "Materials", ytd: 41_900, open: 2_140, on1099: false, trend: -5.2, freq: "Daily", flag: null },
];

export const checks = [
  { num: "10428", vendor: "Rivera Framing LLC", project: "Galleria Retail", amount: 62_400, date: "May 03", status: "pending" as const, age: 1 },
  { num: "10427", vendor: "Cemex Concrete", project: "Heights Mid-Rise", amount: 48_200, date: "May 04", status: "pending" as const, age: 0 },
  { num: "10426", vendor: "Apex Electrical", project: "Heights Mid-Rise", amount: 28_700, date: "Apr 30", status: "cleared" as const, age: 4 },
  { num: "10425", vendor: "City of Houston", project: "Spring Branch Wh.", amount: 8_950, date: "Apr 28", status: "cleared" as const, age: 6 },
  { num: "10424", vendor: "Sunbelt Rentals", project: "Memorial Office", amount: 3_280, date: "Apr 27", status: "cleared" as const, age: 7 },
];

export const recentVendors = ["Cemex Concrete", "Rivera Framing LLC", "Sunbelt Rentals", "City of Houston", "Apex Electrical", "Lowe's Pro Supply"];
export const recentProjects = ["Heights Mid-Rise", "Galleria Retail", "Memorial Office", "Bellaire Custom Home", "River Oaks Remodel"];
export const categories = ["Materials", "Subcontractor", "Labor", "Equipment", "Permits", "Fuel", "Office"];
