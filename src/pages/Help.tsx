import { AppShell } from "@/components/AppShell";
import { useState } from "react";
import { BookOpen, FileCheck2, Receipt, LineChart, BarChart3, ChevronRight, Sparkles, Plus, User, Building2, CircleDollarSign, Hash, CalendarDays, MessageSquare, Download, Filter, Search, CheckCircle2, Clock, ArrowUpRight, ArrowDownRight, Lightbulb, Play, Eye, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface GuideModule {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  summary: string;
  sections: { title: string; content: string; tip?: string }[];
}

const guides: GuideModule[] = [
  {
    id: "checks",
    title: "Checks",
    icon: <FileCheck2 className="h-6 w-6" />,
    color: "text-accent",
    gradient: "from-amber-500 to-orange-500",
    summary: "Issue, track, and reconcile checks. Monitor pending vs cleared with smart reminders.",
    sections: [
      {
        title: "Issuing a Check",
        content: "Click 'Issue Check' → select Check type → enter amount, vendor, project, and check number. Date defaults to today. Add an optional memo for the invoice or PO reference.",
        tip: "Check numbers auto-increment from the last issued check."
      },
      {
        title: "Tracking Clearance",
        content: "Pending checks show with an amber badge and age in days. Click 'Mark cleared' or the edit icon to update status. Checks typically clear in 2–5 business days.",
        tip: "If a check is pending for 7+ days, follow up with the payee or your bank."
      },
      {
        title: "Filtering & Searching",
        content: "Use the filter tabs (All / Pending / Cleared) or type in the search bar to find by vendor name, check number, or project.",
      },
    ],
  },
  {
    id: "ledger",
    title: "Ledger (Expenses & Income)",
    icon: <Receipt className="h-6 w-6" />,
    color: "text-foreground",
    gradient: "from-slate-500 to-slate-700",
    summary: "View every transaction — expenses, income, and checks — in one unified feed.",
    sections: [
      {
        title: "Viewing Transactions",
        content: "The Ledger shows all transactions sorted by date. Use filter tabs (All / Expense / Income / Check) or search by vendor, project, or category.",
      },
      {
        title: "Adding a Transaction",
        content: "Click 'New Entry' → choose type → enter amount → select vendor and project → add optional details. Income entries show in green, expenses in default, checks in amber.",
      },
      {
        title: "Editing & Deleting",
        content: "Click any row to open the edit drawer. Modify amount, vendor, project, or details. Use the trash icon to delete entries.",
        tip: "Use the memo field to store invoice numbers, PO references, or contract notes."
      },
    ],
  },
  {
    id: "cashflow",
    title: "Cash Flow",
    icon: <LineChart className="h-6 w-6" />,
    color: "text-success",
    gradient: "from-emerald-500 to-green-500",
    summary: "30-day cash forecast with upcoming inflows and outflows. See your runway at a glance.",
    sections: [
      {
        title: "Reading the Forecast",
        content: "The chart shows actuals (white line) and projections (amber line). The dotted risk floor at $1M warns when cash is low. Red dots mark critical low points.",
        tip: "Hover over data points for exact values. The 'Next 30 days' panel shows each scheduled flow."
      },
      {
        title: "Understanding Cash Dips",
        content: "When forecast dips below $1M, an alert triggers. Common causes: large payroll runs, check clearings, or delayed owner payments. Plan ahead by scheduling draws.",
      },
    ],
  },
  {
    id: "reports",
    title: "Reports",
    icon: <BarChart3 className="h-6 w-6" />,
    color: "text-indigo-500",
    gradient: "from-indigo-500 to-purple-500",
    summary: "Profit & loss, project margins, vendor spend analysis, and exportable summaries.",
    sections: [
      {
        title: "Generating Reports",
        content: "Navigate to Reports from the sidebar. Select date range and report type (P&L, margin analysis, vendor spend, etc.). Export as PDF or CSV.",
      },
      {
        title: "Understanding Margins",
        content: "Each project shows margin percentage. Green = healthy (>10%), Yellow = watch (0-10%), Red = negative. Click any project for detailed breakdown.",
      },
    ],
  },
  {
    id: "projects",
    title: "Projects & Vendors",
    icon: <Building2 className="h-6 w-6" />,
    color: "text-blue-500",
    gradient: "from-blue-500 to-cyan-500",
    summary: "Manage construction projects and vendor relationships across all stages.",
    sections: [
      {
        title: "Project Pipeline",
        content: "Projects flow through Estimate → Budget → Build → Closeout. Each stage shows count and total value. Click through to see detailed budgets and spending.",
      },
      {
        title: "Vendor Intelligence",
        content: "Track YTD spend, open balances, and cost trends. Flags like 'Rising' or 'Duplicate' help identify vendors needing attention.",
        tip: "Use the search bar to quickly find any vendor or project."
      },
    ],
  },
  {
    id: "copilot",
    title: "AI Copilot",
    icon: <Sparkles className="h-6 w-6" />,
    color: "text-accent",
    gradient: "from-amber-400 to-orange-500",
    summary: "Ask questions, get insights, and control the platform with natural language or voice.",
    sections: [
      {
        title: "Asking Questions",
        content: "Click 'Ask Copilot' or press the floating button. Type your question or use voice input. Examples: 'Where are we overspending?', 'Cash position in 14 days?'",
      },
      {
        title: "Voice Commands",
        content: "Tap the microphone icon to speak your query. The Copilot will transcribe and respond with data-driven insights from your ledger.",
        tip: "Try: 'Add a $48k expense to Heights from Cemex Concrete' — the Copilot can fill forms for you."
      },
      {
        title: "Smart Suggestions",
        content: "The Copilot analyzes your data and surfaces proactive alerts, cost-saving opportunities, and actionable insights on the dashboard.",
      },
    ],
  },
];

const Help = () => {
  const [activeGuide, setActiveGuide] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const guide = guides.find(g => g.id === activeGuide);

  return (
    <AppShell>
      <div className="px-5 lg:px-10 pt-6 lg:pt-10 max-w-[1200px] mx-auto pb-12">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-[12px] uppercase tracking-[0.18em] text-muted-foreground mb-2">
              <HelpCircle className="h-3.5 w-3.5 inline mr-1" /> Support
            </div>
            <h1 className="font-display text-[36px] lg:text-[44px] leading-tight font-semibold tracking-tight">
              Help & Guides
            </h1>
            <p className="mt-1.5 text-muted-foreground text-[14.5px]">
              Everything you need to master HOU Finance OS.
            </p>
          </div>
        </div>

        {!activeGuide ? (
          <>
            {/* Hero welcome card */}
            <div className="ink-card p-6 lg:p-8 mb-8 relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(circle_at_70%_30%,white,transparent_60%)]" />
              <div className="relative flex flex-col lg:flex-row gap-6 items-start lg:items-center">
                <div className="h-14 w-14 rounded-2xl bg-sunset shadow-glow flex items-center justify-center shrink-0">
                  <BookOpen className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-display text-[22px] font-semibold text-balance">
                    Welcome to HOU Finance OS
                  </div>
                  <p className="text-primary-foreground/70 text-[14px] mt-1 max-w-xl">
                    Select a guide below to learn how to use each feature. From issuing checks to generating reports — we've got you covered.
                  </p>
                </div>
              </div>
            </div>

            {/* Guide cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
              {guides.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setActiveGuide(g.id)}
                  className="group glass-card p-5 text-left hover:shadow-elevated hover:scale-[1.02] transition-all active:scale-[0.98]"
                >
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${g.gradient} text-white mb-4 group-hover:scale-110 transition-transform`}>
                    {g.icon}
                  </div>
                  <div className="font-display text-[18px] font-semibold mb-1.5">{g.title}</div>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">{g.summary}</p>
                  <div className="mt-3 flex items-center gap-1 text-[12px] font-medium text-accent">
                    <span>Learn more</span>
                    <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              ))}
            </div>

            {/* Quick links */}
            <div className="mt-8 glass-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="h-5 w-5 text-accent" />
                <span className="font-display text-[18px] font-semibold">Pro Tips</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { icon: <Search className="h-4 w-4" />, text: "Press ⌘K anywhere to search" },
                  { icon: <Plus className="h-4 w-4" />, text: "Quick Add from any page via the header" },
                  { icon: <Eye className="h-4 w-4" />, text: "Click any row to edit details inline" },
                  { icon: <Download className="h-4 w-4" />, text: "Export reports as PDF or CSV" },
                  { icon: <Sparkles className="h-4 w-4" />, text: "Ask Copilot questions in natural language" },
                  { icon: <Clock className="h-4 w-4" />, text: "Use filters to focus on pending items" },
                ].map((tip, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/60">
                    <div className="h-8 w-8 rounded-lg bg-accent-soft text-accent flex items-center justify-center">
                      {tip.icon}
                    </div>
                    <span className="text-[13px] font-medium">{tip.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Detail view for a specific guide */
          <div className="animate-fade-in">
            <button
              onClick={() => setActiveGuide(null)}
              className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground mb-5 transition-colors group"
            >
              <div className="h-6 w-6 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-border/60">
                <ChevronRight className="h-3.5 w-3.5 rotate-180" />
              </div>
              <span>All guides</span>
            </button>

            <div className={`rounded-2xl p-6 lg:p-8 bg-gradient-to-br ${guide!.gradient} text-white mb-6 relative overflow-hidden`}>
              <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_70%_30%,white,transparent_60%)]" />
              <div className="relative flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  {guide!.icon}
                </div>
                <div>
                  <div className="font-display text-[28px] font-semibold">{guide!.title}</div>
                  <p className="text-white/70 text-[14px] mt-1">{guide!.summary}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {guide!.sections.map((section, i) => {
                const sectionId = `${guide!.id}-${i}`;
                const isExpanded = expandedSection === sectionId;
                return (
                  <div key={i} className="glass-card overflow-hidden">
                    <button
                      onClick={() => setExpandedSection(isExpanded ? null : sectionId)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-secondary/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-xl bg-secondary flex items-center justify-center text-[11px] font-semibold">
                          {i + 1}
                        </div>
                        <div>
                          <div className="text-[15px] font-semibold">{section.title}</div>
                        </div>
                      </div>
                      <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                    </button>
                    {isExpanded && (
                      <div className="px-6 pb-5 pt-0 border-t border-border animate-slide-down">
                        <div className="mt-4 text-[14px] text-foreground/80 leading-relaxed">
                          {section.content}
                        </div>
                        {section.tip && (
                          <div className="mt-3 flex items-start gap-2 p-3 rounded-xl bg-accent-soft/60 border border-accent/10">
                            <Lightbulb className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                            <span className="text-[12.5px] text-foreground/80">
                              <span className="font-semibold text-accent">Tip:</span> {section.tip}
                            </span>
                          </div>
                        )}
                        {/* Quick action link */}
                        <div className="mt-4">
                          <Link
                            to={`/${guide!.id === "ledger" ? "expenses" : guide!.id === "copilot" ? "assistant" : guide!.id}`}
                            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl bg-foreground text-background text-[12px] font-medium hover:opacity-90 transition-opacity"
                          >
                            Open {guide!.title} <ArrowUpRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default Help;