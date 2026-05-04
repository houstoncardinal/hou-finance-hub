// Mock data for HOU Inc. construction finance demo
export const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export const fmtCompact = (n: number) =>
  new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1, style: "currency", currency: "USD" }).format(n);

export type Project = {
  id: string; name: string; address: string; budget: number; spent: number; revenue: number; status: "active" | "closing" | "planning";
};

export const projects: Project[] = [
  { id: "p1", name: "Heights Mid-Rise", address: "1820 Yale St, Houston, TX", budget: 4_800_000, spent: 3_120_000, revenue: 3_450_000, status: "active" },
  { id: "p2", name: "Memorial Office Renovation", address: "9 Greenway Plz, Houston, TX", budget: 1_250_000, spent: 1_080_000, revenue: 1_180_000, status: "closing" },
  { id: "p3", name: "Galleria Retail Buildout", address: "5085 Westheimer Rd", budget: 920_000, spent: 410_000, revenue: 460_000, status: "active" },
  { id: "p4", name: "Spring Branch Warehouse", address: "8401 Katy Fwy", budget: 2_400_000, spent: 180_000, revenue: 240_000, status: "planning" },
];

export type Txn = {
  id: string; date: string; vendor: string; project: string; category: string; amount: number; type: "expense" | "income" | "check";
  status?: "cleared" | "pending";
};

export const transactions: Txn[] = [
  { id: "t1", date: "May 03", vendor: "Cemex Concrete", project: "Heights Mid-Rise", category: "Materials", amount: -48_200, type: "expense" },
  { id: "t2", date: "May 03", vendor: "Owner Draw #4", project: "Heights Mid-Rise", category: "Income", amount: 425_000, type: "income" },
  { id: "t3", date: "May 02", vendor: "Rivera Framing LLC", project: "Galleria Retail", category: "Subcontractor", amount: -62_400, type: "check", status: "pending" },
  { id: "t4", date: "May 02", vendor: "City of Houston Permits", project: "Spring Branch Wh.", category: "Permits", amount: -8_950, type: "expense" },
  { id: "t5", date: "May 01", vendor: "Sunbelt Rentals", project: "Memorial Office", category: "Equipment", amount: -3_280, type: "expense" },
  { id: "t6", date: "Apr 30", vendor: "Apex Electrical", project: "Heights Mid-Rise", category: "Subcontractor", amount: -28_700, type: "check", status: "cleared" },
  { id: "t7", date: "Apr 29", vendor: "Memorial Holdings", project: "Memorial Office", category: "Income", amount: 180_000, type: "income" },
  { id: "t8", date: "Apr 28", vendor: "Lowe's Pro Supply", project: "Galleria Retail", category: "Materials", amount: -2_140, type: "expense" },
];

export const cashflow = [
  { m: "Nov", inflow: 420, outflow: 380 },
  { m: "Dec", inflow: 510, outflow: 460 },
  { m: "Jan", inflow: 480, outflow: 520 },
  { m: "Feb", inflow: 620, outflow: 540 },
  { m: "Mar", inflow: 740, outflow: 610 },
  { m: "Apr", inflow: 880, outflow: 690 },
  { m: "May", inflow: 605, outflow: 482 },
];

export const categories = [
  { name: "Materials", value: 38, color: "hsl(24 92% 54%)" },
  { name: "Subcontractors", value: 27, color: "hsl(220 14% 18%)" },
  { name: "Labor", value: 18, color: "hsl(38 70% 60%)" },
  { name: "Equipment", value: 9, color: "hsl(220 8% 55%)" },
  { name: "Permits & Other", value: 8, color: "hsl(35 22% 80%)" },
];

export const vendors = [
  { name: "Cemex Concrete", category: "Materials", ytd: 412_300, open: 48_200, on1099: false },
  { name: "Rivera Framing LLC", category: "Subcontractor", ytd: 286_400, open: 62_400, on1099: true },
  { name: "Apex Electrical", category: "Subcontractor", ytd: 198_500, open: 0, on1099: true },
  { name: "Sunbelt Rentals", category: "Equipment", ytd: 64_280, open: 3_280, on1099: false },
  { name: "Lowe's Pro Supply", category: "Materials", ytd: 41_900, open: 2_140, on1099: false },
];

export const checks = [
  { num: "10428", vendor: "Rivera Framing LLC", project: "Galleria Retail", amount: 62_400, date: "May 02", status: "pending" as const },
  { num: "10427", vendor: "Cemex Concrete", project: "Heights Mid-Rise", amount: 48_200, date: "May 03", status: "pending" as const },
  { num: "10426", vendor: "Apex Electrical", project: "Heights Mid-Rise", amount: 28_700, date: "Apr 30", status: "cleared" as const },
  { num: "10425", vendor: "City of Houston", project: "Spring Branch Wh.", amount: 8_950, date: "Apr 28", status: "cleared" as const },
  { num: "10424", vendor: "Sunbelt Rentals", project: "Memorial Office", amount: 3_280, date: "Apr 27", status: "cleared" as const },
];
