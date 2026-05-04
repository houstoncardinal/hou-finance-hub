// HOU Finance OS — Local AI Intelligence Engine
// Parses natural language queries against finance data
// Supports voice commands, form-filling, and data insights

import { transactions, checks, projects, vendors, forecast, upcomingFlows, fmt, fmtCompact } from "./finance-data";

export interface AIResponse {
  text: string;
  actions?: {
    type: "navigate" | "openDrawer" | "fillForm";
    payload?: Record<string, string>;
    to?: string;
  }[];
  data?: {
    label: string;
    value: string;
    color?: string;
  }[];
}

// Vendor/project name normalization
const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

const findVendor = (query: string): string | null => {
  const q = normalize(query);
  for (const v of [...new Set(transactions.map(t => t.vendor)), ...vendors.map(v => v.name)]) {
    if (normalize(v).includes(q) || q.includes(normalize(v))) return v;
  }
  return null;
};

const findProject = (query: string): string | null => {
  const q = normalize(query);
  for (const p of [...new Set(transactions.map(t => t.project)), ...projects.map(p => p.name)]) {
    if (normalize(p).includes(q) || q.includes(normalize(p))) return p;
  }
  return null;
};

const extractAmount = (query: string): string | null => {
  const match = query.match(/\$?([0-9,]+(?:\.\d{2})?)/);
  if (match) return match[1].replace(/,/g, "");
  // Match written amounts like "forty eight thousand"
  const wordMap: Record<string, number> = {
    "forty": 40, "eight": 8, "thousand": 1000,
    "fifty": 50, "sixty": 60, "seventy": 70, "ninety": 90,
    "hundred": 100, "million": 1_000_000,
    "twenty": 20, "thirty": 30, "ten": 10, "eleven": 11, "twelve": 12,
  };
  const words = query.toLowerCase().split(" ");
  let total = 0;
  let current = 0;
  for (const w of words) {
    if (wordMap[w] && wordMap[w] >= 1000) { total += (current || 1) * wordMap[w]; current = 0; }
    else if (wordMap[w]) current += wordMap[w];
  }
  return total + current > 0 ? String(total + current) : null;
};

const detectType = (query: string): "expense" | "check" | "income" | null => {
  const q = query.toLowerCase();
  if (q.includes("check") || q.includes("cheque")) return "check";
  if (q.includes("income") || q.includes("deposit") || q.includes("payment received") || q.includes("draw")) return "income";
  if (q.includes("expense") || q.includes("spent") || q.includes("paid") || q.includes("purchase") || q.includes("bill") || q.includes("material")) return "expense";
  return null;
};

// Main query processor
export const processQuery = (query: string): AIResponse => {
  const q = query.toLowerCase();

  // --- FORM FILLING: "Add/record/create a $X [type] to [project] from [vendor]" ---
  if (q.includes("add") || q.includes("record") || q.includes("create") || q.includes("new")) {
    const amount = extractAmount(query);
    const vendor = findVendor(query);
    const project = findProject(query);
    const type = detectType(query) || "expense";

    if (amount && vendor && project) {
      return {
        text: `I'll create a new ${type} entry for **${vendor}** on **${project}** for **$${Number(amount).toLocaleString()}**.`,
        actions: [{ type: "openDrawer", payload: { type, amount, vendor, project, memo: query } }],
        data: [
          { label: type === "income" ? "Income" : "Expense", value: fmt(Number(amount)), color: type === "income" ? "#22c55e" : type === "check" ? "#f59e0b" : "#ef4444" },
          { label: "Vendor", value: vendor },
          { label: "Project", value: project },
        ],
      };
    }
    if (amount && !vendor) {
      return {
        text: `I see an amount of **$${Number(amount).toLocaleString()}** but couldn't identify the vendor. Which vendor should I use? Options: Cemex Concrete, Rivera Framing, Apex Electrical, Sunbelt Rentals, Triton Steel, Lowe's Pro Supply.`,
        actions: [{ type: "openDrawer", payload: { type: type || "expense", amount } }],
      };
    }
  }

  // --- OVERSPENDING ANALYSIS ---
  if (q.includes("overspend") || q.includes("over budget") || q.includes("bleeding") || q.includes("at risk")) {
    const red = projects.filter(p => p.health === "red");
    const yellow = projects.filter(p => p.health === "yellow");
    return {
      text: `**${red.length} project${red.length !== 1 ? "s are" : " is"} over budget.** Bellaire Custom Home is **$110k over** with a −15.2% margin. Heights Mid-Rise is flagged as watch (yellow) — spent ${Math.round((projects.find(p => p.id === "p1")?.spent ?? 0) / (projects.find(p => p.id === "p1")?.budget ?? 1) * 100)}% of budget.`,
      data: [
        ...red.map(p => ({ label: p.name, value: `−${fmt(p.spent - p.budget)}`, color: "#ef4444" })),
        ...yellow.slice(0, 1).map(p => ({ label: p.name, value: "Watch", color: "#f59e0b" })),
      ],
      actions: [{ type: "navigate", to: "/projects" }],
    };
  }

  // --- CASH POSITION ---
  if (q.includes("cash") || q.includes("position") || q.includes("balance") || q.includes("runway") || q.includes("bank")) {
    const cash = 1_842_500;
    const lowPoint = forecast.find(f => f.forecast && f.forecast < 1000);
    return {
      text: `Cash on hand: **${fmt(cash)}**. 30-day forecast shows a low of **${fmtCompact(980_000)}** on May 16. Net monthly burn: **~${fmtCompact(610_000)}**. ${lowPoint ? "⚠️ Risk of dipping below $1M." : "Cash position is healthy."}`,
      data: [
        { label: "Cash on Hand", value: fmt(cash), color: "#22c55e" },
        { label: "Low Point", value: `May 16 · ${fmtCompact(980_000)}`, color: "#ef4444" },
        { label: "Net Burn", value: `${fmtCompact(610_000)}/mo`, color: "#f59e0b" },
      ],
      actions: [{ type: "navigate", to: "/cashflow" }],
    };
  }

  // --- PENDING CHECKS ---
  if (q.includes("check") && (q.includes("pending") || q.includes("uncleared") || q.includes("outstanding") || !q.includes("cleared"))) {
    const pending = checks.filter(c => c.status === "pending");
    const total = pending.reduce((s, c) => s + c.amount, 0);
    return {
      text: pending.length === 0
        ? "✅ All checks have cleared. No pending checks."
        : `**${pending.length} check${pending.length > 1 ? "s" : ""} pending** totaling ${fmt(total)}. ${pending.map(c => `${c.vendor} (#${c.num}) — ${fmt(c.amount)} — ${c.age}d ago`).join(". ")}.`,
      data: pending.map(c => ({
        label: `#${c.num} · ${c.vendor}`,
        value: fmt(c.amount),
        color: c.age > 5 ? "#ef4444" : "#f59e0b",
      })),
      actions: pending.length > 0 ? [{ type: "navigate", to: "/checks" }] : undefined,
    };
  }

  // --- VENDOR ANALYSIS ---
  if (q.includes("vendor") || q.includes("supplier") || q.includes("spend")) {
    const top = [...vendors].sort((a, b) => b.ytd - a.ytd).slice(0, 5);
    return {
      text: `**Top vendors by YTD spend:** ${top.map((v, i) => `${i + 1}. ${v.name} — ${fmtCompact(v.ytd)}${v.flag === "rising" ? " (rising)" : v.flag === "duplicate" ? " (duplicate?)" : ""}`).join(" · ")}. Total tracked: ${vendors.length} vendors.`,
      data: top.map(v => ({ label: v.name, value: fmtCompact(v.ytd), color: v.flag === "rising" ? "#ef4444" : v.flag === "duplicate" ? "#f59e0b" : "#6b7280" })),
      actions: [{ type: "navigate", to: "/vendors" }],
    };
  }

  // --- PROFIT / MARGIN ---
  if (q.includes("profit") || q.includes("margin") || q.includes("profitable") || q.includes("revenue")) {
    const best = [...projects].sort((a, b) => {
      const mA = a.revenue === 0 ? 0 : ((a.revenue - a.spent) / a.revenue) * 100;
      const mB = b.revenue === 0 ? 0 : ((b.revenue - b.spent) / b.revenue) * 100;
      return mB - mA;
    });
    const totalRevenue = projects.reduce((s, p) => s + p.revenue, 0);
    const totalSpent = projects.reduce((s, p) => s + p.spent, 0);
    const overallMargin = totalRevenue === 0 ? 0 : ((totalRevenue - totalSpent) / totalRevenue) * 100;
    return {
      text: `**Overall margin: ${overallMargin.toFixed(1)}%** (${fmtCompact(totalRevenue)} revenue vs ${fmtCompact(totalSpent)} spent). Most profitable: **${best[0].name}** at ${(((best[0].revenue - best[0].spent) / best[0].revenue) * 100).toFixed(1)}%.`,
      data: projects.slice(0, 4).map(p => {
        const m = p.revenue === 0 ? 0 : ((p.revenue - p.spent) / p.revenue) * 100;
        return { label: p.name, value: `${m.toFixed(1)}%`, color: m < 0 ? "#ef4444" : m < 10 ? "#f59e0b" : "#22c55e" };
      }),
      actions: [{ type: "navigate", to: "/reports" }],
    };
  }

  // --- RECENT ACTIVITY ---
  if (q.includes("recent") || q.includes("latest") || q.includes("last") || q.includes("activity") || q.includes("new")) {
    const recent = transactions.slice(0, 5);
    return {
      text: `**${recent.length} most recent transactions:** ${recent.map(t => `${t.vendor} — ${t.amount >= 0 ? "+" : "−"}${fmt(Math.abs(t.amount))} (${t.date})`).join(" · ")}.`,
      data: recent.map(t => ({
        label: `${t.vendor} · ${t.date}`,
        value: t.amount >= 0 ? `+${fmt(t.amount)}` : `−${fmt(Math.abs(t.amount))}`,
        color: t.amount >= 0 ? "#22c55e" : "#ef4444",
      })),
      actions: [{ type: "navigate", to: "/expenses" }],
    };
  }

  // --- PROJECT SPECIFIC ---
  const project = findProject(query);
  if (project) {
    const p = projects.find(pr => normalize(pr.name).includes(normalize(project)) || normalize(project).includes(normalize(pr.name)));
    if (p) {
      const pct = Math.round((p.spent / p.budget) * 100);
      const margin = p.revenue === 0 ? 0 : ((p.revenue - p.spent) / p.revenue) * 100;
      const projTxns = transactions.filter(t => normalize(t.project).includes(normalize(p.name)));
      return {
        text: `**${p.name}** — ${p.stage} | ${p.type} | PM: ${p.pm}.\nBudget: ${fmt(p.budget)} · Spent: ${fmt(p.spent)} (${pct}%) · Revenue: ${fmt(p.revenue)}.\nMargin: **${margin.toFixed(1)}%** · Health: **${p.health === "red" ? "⚠️ Over budget" : p.health === "yellow" ? "👀 Watch" : "✅ On track"}**.\n${projTxns.length} transactions recorded. Latest: ${projTxns.slice(-1)[0]?.vendor ?? "N/A"} — ${fmt(Math.abs(projTxns.slice(-1)[0]?.amount ?? 0))}.`,
        data: [
          { label: "Budget", value: fmt(p.budget) },
          { label: "Spent", value: fmt(p.spent), color: pct > 100 ? "#ef4444" : pct > 90 ? "#f59e0b" : "#22c55e" },
          { label: "Revenue", value: fmt(p.revenue) },
          { label: "Margin", value: `${margin.toFixed(1)}%`, color: margin < 0 ? "#ef4444" : margin < 10 ? "#f59e0b" : "#22c55e" },
        ],
        actions: [{ type: "navigate", to: "/projects" }],
      };
    }
  }

  // --- HELP / CAPABILITIES ---
  if (q.includes("help") || q.includes("what can") || q.includes("capabilities") || q.includes("what do")) {
    return {
      text: "I can help you with:\n\n• **Financial queries**: \"What's our cash position?\", \"Which project is most profitable?\"\n• **Transaction management**: \"Add a $48k expense to Heights from Cemex Concrete\"\n• **Status checks**: \"Show all pending checks\", \"Any vendors overspending?\"\n• **Analysis**: \"Break down Bellaire\", \"Top vendors this month\"\n• **Navigation**: I'll guide you to the right page with one click.",
    };
  }

  // --- DEFAULT: Summary ---
  return {
    text: `Here's your current financial snapshot:\n\n• **Cash**: ${fmt(1_842_500)} (${fmtCompact(980_000)} low on May 16)\n• **Pending checks**: ${checks.filter(c => c.status === "pending").length} totaling ${fmt(checks.filter(c => c.status === "pending").reduce((s, c) => s + c.amount, 0))}\n• **Active projects**: ${projects.filter(p => p.stage === "Build" || p.stage === "Budget").length}\n• **MTD Revenue**: ${fmt(605_000)} · **MTD Expenses**: ${fmt(482_900)}\n\nWhat would you like to know more about?`,
    data: [
      { label: "Cash", value: fmt(1_842_500), color: "#22c55e" },
      { label: "Pending Checks", value: fmt(checks.filter(c => c.status === "pending").reduce((s, c) => s + c.amount, 0)), color: "#f59e0b" },
      { label: "Revenue MTD", value: fmt(605_000), color: "#22c55e" },
      { label: "Expenses MTD", value: fmt(482_900), color: "#ef4444" },
    ],
  };
};

// Speech recognition interface
export const createVoiceListener = (
  onResult: (text: string) => void,
  onError?: (error: string) => void
): { start: () => void; stop: () => void; isListening: boolean } => {
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SpeechRecognition) {
    onError?.("Speech recognition not available in this browser. Use Chrome or Edge.");
    return { start: () => {}, stop: () => {}, isListening: false };
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.continuous = false;
  let listening = false;

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
    listening = false;
  };

  recognition.onerror = (event: any) => {
    onError?.(`Voice error: ${event.error}`);
    listening = false;
  };

  recognition.onend = () => { listening = false; };

  return {
    start: () => { listening = true; recognition.start(); },
    stop: () => { listening = false; recognition.abort(); },
    get isListening() { return listening; },
  };
};