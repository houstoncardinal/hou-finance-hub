import { AppShell } from "@/components/AppShell";
import { fmt, fmtCompact, forecast, upcomingFlows, projects, transactions, vendors, checks } from "@/lib/finance-data";
import { AlertTriangle, TrendingUp, Sparkles, Mic, Camera, Plus, ArrowUpRight, ArrowDownRight, ChevronRight, DollarSign, Building2, Receipt, Wallet, FileCheck2, LineChart, Activity } from "lucide-react";
import { Link } from "react-router-dom";

const healthColor: Record<string, string> = {
  green: "bg-success", yellow: "bg-warning", red: "bg-destructive",
};

// Mini sparkline SVG component
const Sparkline = ({ data, color = "#22c55e", height = 32, width = 80 }: { data: (number | null)[]; color?: string; height?: number; width?: number }) => {
  const points = data.filter((d): d is number => d !== null);
  if (points.length < 2) return null;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const stepX = width / (points.length - 1);
  const path = points.map((p, i) => `${i * stepX},${height - ((p - min) / range) * height}`).join(" L ");
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="shrink-0">
      <path d={`M ${path}`} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <path d={`M ${path} L ${width},${height} L 0,${height} Z`} fill={`${color}10`} />
    </svg>
  );
};

const Dashboard = () => {
  const cash = 1_842_500;
  const activeProjects = projects.filter(p => p.stage === "Build" || p.stage === "Budget");
  const totalExpenses = transactions.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const totalIncome = transactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalRevenue = projects.reduce((s, p) => s + p.revenue, 0);
  const totalSpent = projects.reduce((s, p) => s + p.spent, 0);
  const overallMargin = totalRevenue === 0 ? 0 : ((totalRevenue - totalSpent) / totalRevenue) * 100;
  const pendingChecks = checks.filter(c => c.status === "pending");
  const pendingTotal = pendingChecks.reduce((s, c) => s + c.amount, 0);

  // Sparkline data from forecast
  const forecastVals = forecast.map(f => f.forecast).filter((f): f is number => f !== null);
  const actualVals = forecast.map(f => f.actual).filter((f): f is number => f !== null);

  return (
    <AppShell>
      <div className="px-5 lg:px-10 pt-6 lg:pt-10 max-w-[1480px] mx-auto">
        {/* Heading */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-soft" />
              Mon · May 4 · Houston · <span className="text-accent">{projects.length} active jobs</span>
            </div>
            <h1 className="font-display text-[36px] lg:text-[48px] leading-[1.02] font-semibold tracking-tight text-balance">
              Command Center
            </h1>
            <p className="mt-1.5 text-muted-foreground text-[14.5px] max-w-xl">
              Overall margin <span className={overallMargin < 0 ? "text-destructive font-medium" : "text-success font-medium"}>{overallMargin.toFixed(1)}%</span> · {activeProjects.length} active · {pendingChecks.length} pending checks
            </p>
          </div>
          <Link to="/new" className="h-10 px-4 rounded-xl bg-accent text-white text-[13px] font-medium inline-flex items-center gap-1.5 hover:opacity-90 transition-all active:scale-[0.97] shadow-sm">
            <Plus className="h-4 w-4" /> New Entry
          </Link>
        </div>

        {/* KPI strip — industry-standard with sparklines */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {/* Cash on Hand — dark card */}
          <div className="relative overflow-hidden rounded-2xl p-5 bg-foreground text-primary-foreground shadow-lg">
            <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_30%_20%,white,transparent_50%)]" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="h-8 w-8 rounded-xl bg-white/10 flex items-center justify-center"><Wallet className="h-4 w-4" /></div>
                <Sparkline data={forecastVals} color="rgba(255,255,255,0.4)" />
              </div>
              <div className="text-[11px] uppercase tracking-[0.14em] text-primary-foreground/60">Cash on Hand</div>
              <div className="mt-2 font-display text-[28px] lg:text-[32px] leading-none font-semibold font-mono-tab">{fmt(cash)}</div>
              <div className="mt-1.5 flex items-center gap-2 text-[12px]">
                <span className="inline-flex items-center gap-0.5 text-success"><ArrowUpRight className="h-3 w-3" />+8.4%</span>
                <span className="text-primary-foreground/50">vs last month</span>
              </div>
            </div>
          </div>

          {/* Revenue — white card red accent */}
          <div className="glass-card p-5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="h-8 w-8 rounded-xl bg-success/10 flex items-center justify-center"><TrendingUp className="h-4 w-4 text-success" /></div>
              <Sparkline data={forecastVals} color="hsl(152, 52%, 36%)" />
            </div>
            <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Revenue · MTD</div>
            <div className="mt-2 font-display text-[28px] lg:text-[32px] leading-none font-semibold font-mono-tab">{fmt(totalIncome)}</div>
            <div className="mt-1.5 flex items-center gap-2 text-[12px]">
              <span className="inline-flex items-center gap-0.5 text-success"><ArrowUpRight className="h-3 w-3" />+22%</span>
              <span className="text-muted-foreground">{transactions.filter(t => t.type === "income").length} payments</span>
            </div>
          </div>

          {/* Expenses — white card red accent */}
          <div className="glass-card p-5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="h-8 w-8 rounded-xl bg-accent-soft flex items-center justify-center"><Receipt className="h-4 w-4 text-accent" /></div>
              <Sparkline data={actualVals} color="hsl(358, 62%, 47%)" />
            </div>
            <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Expenses · MTD</div>
            <div className="mt-2 font-display text-[28px] lg:text-[32px] leading-none font-semibold font-mono-tab">{fmt(totalExpenses)}</div>
            <div className="mt-1.5 flex items-center gap-2 text-[12px]">
              <span className="inline-flex items-center gap-0.5 text-accent"><ArrowUpRight className="h-3 w-3" />+11%</span>
              <span className="text-muted-foreground">{transactions.filter(t => t.type === "expense").length} transactions</span>
            </div>
          </div>

          {/* Margin — white card */}
          <div className="glass-card p-5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="h-8 w-8 rounded-xl bg-secondary flex items-center justify-center"><Activity className="h-4 w-4 text-foreground" /></div>
              <Sparkline data={projects.map(p => p.revenue === 0 ? null : ((p.revenue - p.spent) / p.revenue) * 100)} color="hsl(220, 14%, 11%)" />
            </div>
            <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Gross Margin</div>
            <div className="mt-2 font-display text-[28px] lg:text-[32px] leading-none font-semibold font-mono-tab">{overallMargin.toFixed(1)}%</div>
            <div className="mt-1.5 flex items-center gap-2 text-[12px]">
              <span className={`inline-flex items-center gap-0.5 ${overallMargin >= 0 ? "text-success" : "text-accent"}`}>
                {overallMargin >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {overallMargin.toFixed(1)} pts
              </span>
              <span className="text-muted-foreground">{activeProjects.length} active projects</span>
            </div>
          </div>
        </div>

        {/* Project pipeline & upcoming flows */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          <div className="lg:col-span-2 glass-card p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Project pipeline</div>
                <div className="font-display text-[20px] font-semibold mt-0.5">Estimate → Budget → Build → Closeout</div>
              </div>
              <Link to="/projects" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">All projects →</Link>
            </div>
            <div className="grid grid-cols-4 gap-2 mb-5">
              {(["Estimate", "Budget", "Build", "Closeout"] as const).map((stage, i) => {
                const stageProjects = projects.filter(p => p.stage === stage);
                const total = stageProjects.reduce((s, p) => s + (p.stage === "Build" || p.stage === "Closeout" ? p.spent : p.budget), 0);
                const colors = ["bg-[#cbb799]", "bg-[#9b8a6e]", "bg-accent", "bg-foreground"];
                return (
                  <div key={stage} className="rounded-xl border border-border p-3.5 bg-background/40 hover:bg-background/60 transition-colors">
                    <div className="flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground">
                      <span className={`h-1 w-4 rounded-full ${colors[i]}`} />{stage}
                    </div>
                    <div className="font-display text-[22px] font-semibold mt-2 font-mono-tab">{stageProjects.length}</div>
                    <div className="text-[11px] text-muted-foreground">{fmtCompact(total)}</div>
                  </div>
                );
              })}
            </div>
            <div className="hairline mb-4" />
            <div className="space-y-1 stagger">
              {projects.slice(0, 4).map(p => {
                const pct = Math.round((p.spent / p.budget) * 100);
                const margin = p.revenue === 0 ? 0 : ((p.revenue - p.spent) / p.revenue) * 100;
                return (
                  <Link key={p.id} to="/projects" className="grid grid-cols-12 gap-3 items-center py-2.5 hover:bg-secondary/40 rounded-lg px-2 -mx-2 transition-colors group">
                    <div className="col-span-5 flex items-center gap-2.5 min-w-0">
                      <span className={`h-2 w-2 rounded-full shrink-0 ${healthColor[p.health]}`} />
                      <div className="min-w-0">
                        <div className="text-[14px] font-medium truncate flex items-center gap-1.5">
                          {p.name}
                          {p.health === "red" && <span className="text-accent text-[10px] uppercase tracking-[0.1em] font-semibold">At risk</span>}
                        </div>
                        <div className="text-[11.5px] text-muted-foreground">{p.type} · {p.stage} · {p.pm}</div>
                      </div>
                    </div>
                    <div className="col-span-4">
                      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div className={`h-full transition-all duration-500 ${pct > 100 ? "bg-destructive" : pct > 90 ? "bg-warning" : "bg-accent"}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-1 font-mono-tab">{fmtCompact(p.spent)} / {fmtCompact(p.budget)}</div>
                    </div>
                    <div className="col-span-2 text-right font-mono-tab text-[14px] font-semibold tabular-nums">
                      <span className={margin < 0 ? "text-destructive" : margin < 10 ? "text-warning" : ""}>{margin.toFixed(1)}%</span>
                    </div>
                    <ChevronRight className="col-span-1 h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Next 30 days</div>
            <div className="font-display text-[20px] font-semibold mt-0.5 mb-5">Money in & out</div>
            <div className="space-y-3 relative">
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
              {upcomingFlows.map((f, i) => (
                <div key={i} className="relative pl-7 group">
                  <span className={`absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-background transition-transform group-hover:scale-125 ${f.amount > 0 ? "bg-success" : "bg-foreground"}`} />
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-[13.5px] font-medium truncate">{f.label}</div>
                      <div className="text-[11.5px] text-muted-foreground">{f.date} · {f.kind}</div>
                    </div>
                    <div className={`font-mono-tab text-[13.5px] font-semibold tabular-nums shrink-0 ${f.amount > 0 ? "text-success" : ""}`}>
                      {f.amount > 0 ? "+" : "−"}{fmtCompact(Math.abs(f.amount))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Vendor intel + activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="glass-card overflow-hidden lg:col-span-2">
            <div className="px-6 pt-5 pb-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Vendor intelligence</div>
                <div className="font-display text-[20px] font-semibold mt-0.5">Top spend & cost trends</div>
              </div>
              <Link to="/vendors" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">All vendors →</Link>
            </div>
            <div className="hairline" />
            <div className="divide-y divide-border">
              {vendors.slice(0, 5).map(v => (
                <div key={v.name} className="px-6 py-3.5 grid grid-cols-12 items-center gap-3 hover:bg-secondary/40 transition-colors">
                  <div className="col-span-5 flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-red-100 to-accent-soft flex items-center justify-center text-[11px] font-semibold text-ink">{v.name.split(" ").slice(0,2).map(w => w[0]).join("")}</div>
                    <div className="min-w-0">
                      <div className="text-[14px] font-medium truncate flex items-center gap-2">
                        {v.name}
                        {v.flag === "rising" && <span className="text-[10px] uppercase tracking-[0.1em] text-accent font-semibold">Rising</span>}
                        {v.flag === "duplicate" && <span className="text-[10px] uppercase tracking-[0.1em] text-warning font-semibold">Dup?</span>}
                      </div>
                      <div className="text-[11.5px] text-muted-foreground">{v.category} · {v.freq}</div>
                    </div>
                  </div>
                  <div className="col-span-3 text-[12px] text-muted-foreground">YTD <span className="font-mono-tab font-medium text-foreground">{fmtCompact(v.ytd)}</span></div>
                  <div className="col-span-2 text-[12px] text-muted-foreground">Open <span className={`font-mono-tab font-medium ${v.open > 0 ? "text-accent" : "text-foreground"}`}>{fmtCompact(v.open)}</span></div>
                  <div className={`col-span-2 text-right text-[13px] font-mono-tab font-semibold inline-flex items-center justify-end gap-1 ${v.trend > 0 ? "text-destructive" : "text-success"}`}>
                    {v.trend > 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                    {Math.abs(v.trend).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card overflow-hidden">
            <div className="px-6 pt-5 pb-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Recent</div>
                <div className="font-display text-[20px] font-semibold mt-0.5">Activity</div>
              </div>
              <Link to="/expenses" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">All →</Link>
            </div>
            <div className="hairline" />
            <div className="divide-y divide-border">
              {transactions.slice(0, 6).map(t => (
                <div key={t.id} className="px-6 py-3 flex items-center gap-3 hover:bg-secondary/40 transition-colors">
                  <div className={`h-7 w-7 rounded-lg flex items-center justify-center text-[10px] font-semibold ${t.type === "income" ? "bg-success/12 text-success" : t.type === "check" ? "bg-accent-soft text-accent" : "bg-secondary"}`}>{t.type === "income" ? "IN" : t.type === "check" ? "CK" : "EX"}</div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-medium truncate">{t.vendor}</div>
                    <div className="text-[11px] text-muted-foreground truncate">{t.date} · {t.project}</div>
                  </div>
                  <div className={`font-mono-tab text-[13px] font-semibold tabular-nums ${t.amount >= 0 ? "text-success" : ""}`}>
                    {t.amount >= 0 ? "+" : "−"}{fmtCompact(Math.abs(t.amount))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alerts & Insights — moved to bottom */}
        <div className="mt-8 mb-8">
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-3 font-medium flex items-center gap-2">
            <Activity className="h-3.5 w-3.5" /> Alerts & Insights
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 stagger">
            <AlertCard tone="warning" icon={<TrendingUp className="h-4 w-4" />}
              title="Cash dip in 12 days"
              body="Forecast: $980k on May 16 after payroll + Cemex check."
              cta="View analytics" to="/charts" />
            <AlertCard tone="alert" icon={<AlertTriangle className="h-4 w-4" />}
              title="Bellaire is $110k over budget"
              body="Framing + materials trending high. Margin: −15.2%."
              cta="Open project" to="/projects" />
            <AlertCard tone="info" icon={<Sparkles className="h-4 w-4" />}
              title={`${pendingChecks.length} checks (${fmtCompact(pendingTotal)}) uncleared`}
              body={`${pendingChecks.map(c => c.vendor).join(" & ")} — issued recently.`}
              cta="Review checks" to="/checks" />
          </div>
        </div>

        {/* Quick capture rail - mobile only */}
        <div className="grid grid-cols-3 gap-3 mt-2 lg:hidden">
          <QuickTile icon={<Mic className="h-5 w-5" />} label="Voice" />
          <QuickTile icon={<Camera className="h-5 w-5" />} label="Scan" />
          <QuickTile icon={<Plus className="h-5 w-5" />} label="Manual" />
        </div>
      </div>
    </AppShell>
  );
};

const AlertCard = ({ tone, icon, title, body, cta, to }: { tone: "warning" | "alert" | "info"; icon: React.ReactNode; title: string; body: string; cta: string; to: string }) => {
  const styles = tone === "alert" ? "border-accent/20 bg-accent-soft" : tone === "warning" ? "border-warning/30 bg-warning/5" : "border-border bg-card";
  const iconStyles = tone === "alert" ? "bg-accent text-white" : tone === "warning" ? "bg-warning text-ink" : "bg-foreground text-background";
  return (
    <Link to={to} className={`group rounded-2xl border p-4 flex items-start gap-3 hover:shadow-card transition-all ${styles}`}>
      <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${iconStyles}`}>{icon}</div>
      <div className="min-w-0 flex-1">
        <div className="text-[13.5px] font-semibold leading-snug">{title}</div>
        <div className="text-[12px] text-muted-foreground mt-0.5 leading-snug">{body}</div>
        <div className="mt-1.5 text-[11.5px] font-medium text-accent inline-flex items-center gap-0.5">{cta} <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" /></div>
      </div>
    </Link>
  );
};

const QuickTile = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <Link to="/new" className="glass-card p-4 flex flex-col items-center gap-2 active:scale-[0.97] transition-transform">
    <div className="h-10 w-10 rounded-xl bg-foreground text-background flex items-center justify-center">{icon}</div>
    <span className="text-[12px] font-medium">{label}</span>
  </Link>
);

export default Dashboard;