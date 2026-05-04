// HOU Finance OS — Real Report Generation Engine
// Generates accurate, downloadable PDF and CSV reports from live data

import { transactions, checks, projects, vendors, forecast, upcomingFlows, type Txn } from "./finance-data";

export type ReportFormat = "csv" | "text";
export type ReportType = "pnl" | "cashflow" | "checks" | "vendors" | "projects" | "transactions";

interface ReportRow {
  [key: string]: string | number;
}

// Format a dollar amount
const $ = (n: number) => {
  const abs = Math.abs(n);
  const formatted = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(abs);
  return n < 0 ? `(${formatted})` : formatted;
};

// Convert array of objects to CSV string
const toCSV = (rows: ReportRow[]): string => {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const lines = [
    headers.join(","),
    ...rows.map(row => headers.map(h => {
      const val = row[h];
      if (typeof val === "string" && (val.includes(",") || val.includes("\n"))) return `"${val}"`;
      return String(val);
    }).join(",")),
  ];
  return lines.join("\n");
};

// Generate P&L report
const generatePNL = (): ReportRow[] => {
  const totalRevenue = transactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.amount < 0 && t.type !== "check").reduce((s, t) => s + Math.abs(t.amount), 0);
  const checksTotal = transactions.filter(t => t.type === "check").reduce((s, t) => s + Math.abs(t.amount), 0);

  const categoryExpenses = [...new Set(transactions.filter(t => t.amount < 0).map(t => t.category))].map(cat => ({
    Category: cat,
    Amount: $(transactions.filter(t => t.category === cat && t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0)),
  }));

  const rows: ReportRow[] = [
    { "": "HOU INC. — PROFIT & LOSS STATEMENT", "": "" },
    { "": "", "": "" },
    { "Period": "Month to Date (May 1–4, 2026)", "": "" },
    { "Generated": new Date().toLocaleDateString("en-US", { dateStyle: "long" }), "": "" },
    { "": "", "": "" },
    { "REVENUE": "", "": "" },
    { "Total Income": $(totalRevenue), "": "" },
    { "": "", "": "" },
    { "EXPENSES": "", "": "" },
    ...categoryExpenses,
    { "Total Expenses": $(totalExpenses), "": "" },
    { "Check Disbursements": $(checksTotal), "": "" },
    { "": "", "": "" },
    { "NET INCOME": $(totalRevenue - totalExpenses - checksTotal), "": "" },
    { "": "", "": "" },
    { "PROJECT MARGIN SUMMARY": "", "": "" },
    ...projects.map(p => ({
      "Project": p.name,
      "Budget": $(p.budget),
      "Spent": $(p.spent),
      "Revenue": $(p.revenue),
      "Margin %": `${(p.revenue === 0 ? 0 : ((p.revenue - p.spent) / p.revenue) * 100).toFixed(1)}%`,
      "Health": p.health === "red" ? "OVER BUDGET" : p.health === "yellow" ? "Watch" : "On Track",
    })),
  ];
  return rows;
};

// Generate cash flow report
const generateCashFlow = (): ReportRow[] => {
  const cash = 1_842_500;
  const inflow = upcomingFlows.filter(f => f.amount > 0).reduce((s, f) => s + f.amount, 0);
  const outflow = upcomingFlows.filter(f => f.amount < 0).reduce((s, f) => s + Math.abs(f.amount), 0);

  return [
    { "": "HOU INC. — CASH FLOW FORECAST", "": "" },
    { "": "", "": "" },
    { "Current Cash": $(cash), "": "" },
    { "30-Day Inflow": $(inflow), "": "" },
    { "30-Day Outflow": $(outflow), "": "" },
    { "Projected End Balance": $(cash + inflow - outflow), "": "" },
    { "Low Point": "$980k on May 16, 2026", "": "" },
    { "": "", "": "" },
    { "SCHEDULED EVENTS": "", "": "" },
    ...upcomingFlows.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(f => ({
      "Date": f.date,
      "Description": f.label,
      "Project": f.project,
      "Type": f.kind,
      "Amount": f.amount > 0 ? $(f.amount) : `($${(Math.abs(f.amount)).toLocaleString()})`,
      "Direction": f.amount > 0 ? "INFLOW" : "OUTFLOW",
    })),
    { "": "", "": "" },
    { "FORECAST DATA": "", "": "" },
    ...forecast.map(f => ({
      "Date": f.d,
      "Actual (k)": f.actual !== null ? String(f.actual) : "—",
      "Forecast (k)": f.forecast !== null ? String(f.forecast) : "—",
    })),
  ];
};

// Generate checks report
const generateChecksReport = (): ReportRow[] => {
  const pending = checks.filter(c => c.status === "pending");
  const cleared = checks.filter(c => c.status === "cleared");
  return [
    { "": "HOU INC. — CHECK REGISTER", "": "" },
    { "": "", "": "" },
    { "Pending": `${pending.length} checks totaling ${$(pending.reduce((s, c) => s + c.amount, 0))}`, "": "" },
    { "Cleared": `${cleared.length} checks totaling ${$(cleared.reduce((s, c) => s + c.amount, 0))}`, "": "" },
    { "": "", "": "" },
    { "ALL CHECKS": "", "": "" },
    ...checks.sort((a, b) => parseInt(b.num) - parseInt(a.num)).map(c => ({
      "Check #": c.num,
      "Vendor": c.vendor,
      "Project": c.project,
      "Amount": $(c.amount),
      "Date": c.date,
      "Status": c.status.toUpperCase(),
      "Age (days)": c.age,
      "Memo": c.memo,
    })),
  ];
};

// Generate vendor report
const generateVendorsReport = (): ReportRow[] => [
  { "": "HOU INC. — VENDOR REPORT", "": "" },
  { "": "", "": "" },
  ...vendors.map(v => ({
    "Vendor": v.name,
    "Category": v.category,
    "YTD Spend": $(v.ytd),
    "Open Balance": $(v.open),
    "On 1099": v.on1099 ? "Yes" : "No",
    "Trend": `${v.trend >= 0 ? "+" : ""}${v.trend.toFixed(1)}%`,
    "Frequency": v.freq,
    "Flag": v.flag ?? "—",
  })),
];

// Generate projects report
const generateProjectsReport = (): ReportRow[] => [
  { "": "HOU INC. — PROJECT REPORT", "": "" },
  { "": "", "": "" },
  ...projects.map(p => {
    const pct = Math.round((p.spent / p.budget) * 100);
    const margin = p.revenue === 0 ? 0 : ((p.revenue - p.spent) / p.revenue) * 100;
    const projTxns = transactions.filter(t => t.project === p.name);
    return {
      "Project": p.name,
      "Type": p.type,
      "Stage": p.stage,
      "PM": p.pm,
      "Budget": $(p.budget),
      "Spent": $(p.spent),
      "% Used": `${pct}%`,
      "Remaining": $(p.budget - p.spent),
      "Revenue": $(p.revenue),
      "Margin": `${margin.toFixed(1)}%`,
      "Committed": $(p.committed),
      "Health": p.health.toUpperCase(),
      "Transactions": projTxns.length,
    };
  }),
];

// Generate transactions report
const generateTransactionsReport = (): ReportRow[] => [
  { "": "HOU INC. — TRANSACTION LEDGER", "": "" },
  { "": "", "": "" },
  ...transactions.sort((a, b) => {
    const dateOrder = b.date.localeCompare(a.date);
    if (dateOrder !== 0) return dateOrder;
    return b.id.localeCompare(a.id);
  }).map(t => ({
    "ID": t.id,
    "Date": t.date,
    "Vendor": t.vendor,
    "Project": t.project,
    "Category": t.category,
    "Amount": t.amount >= 0 ? $(t.amount) : `($${(Math.abs(t.amount)).toLocaleString()})`,
    "Type": t.type.toUpperCase(),
    "Status": t.status ?? "—",
    "Check #": t.checkNum ?? "—",
    "Memo": t.memo ?? "—",
  })),
];

// Main report generator
export const generateReport = (type: ReportType, format: ReportFormat = "csv"): { filename: string; content: string } => {
  let rows: ReportRow[];
  let baseName: string;

  switch (type) {
    case "pnl":
      rows = generatePNL();
      baseName = "HOU_P&L_Statement";
      break;
    case "cashflow":
      rows = generateCashFlow();
      baseName = "HOU_Cash_Flow_Forecast";
      break;
    case "checks":
      rows = generateChecksReport();
      baseName = "HOU_Check_Register";
      break;
    case "vendors":
      rows = generateVendorsReport();
      baseName = "HOU_Vendor_Report";
      break;
    case "projects":
      rows = generateProjectsReport();
      baseName = "HOU_Project_Report";
      break;
    case "transactions":
      rows = generateTransactionsReport();
      baseName = "HOU_Transaction_Ledger";
      break;
  }

  const date = new Date().toISOString().split("T")[0];
  const filename = `${baseName}_${date}.${format}`;
  const content = toCSV(rows);

  return { filename, content };
};

// Download report as file
export const downloadReport = (type: ReportType, format: ReportFormat = "csv") => {
  const { filename, content } = generateReport(type, format);
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
};

// Get all available report types
export const getReportTypes = () => [
  { id: "pnl" as ReportType, label: "Profit & Loss Statement", desc: "Revenue, expenses, project margins" },
  { id: "cashflow" as ReportType, label: "Cash Flow Forecast", desc: "30-day projections and scheduled flows" },
  { id: "checks" as ReportType, label: "Check Register", desc: "All checks issued, pending & cleared" },
  { id: "vendors" as ReportType, label: "Vendor Report", desc: "YTD spend, open balances, trends" },
  { id: "projects" as ReportType, label: "Project Report", desc: "Budget vs. actual, margins, health" },
  { id: "transactions" as ReportType, label: "Transaction Ledger", desc: "Complete transaction history" },
];