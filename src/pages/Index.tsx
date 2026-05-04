import { AppShell } from "@/components/AppShell";
import { fmt, fmtCompact, forecast, upcomingFlows, projects, projectMargin, transactions, vendors } from "@/lib/finance-data";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine, ReferenceDot } from "recharts";
import { AlertTriangle, TrendingUp, Sparkles, Mic, Camera, Plus, ArrowUpRight, ArrowDownRight, ChevronRight, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const healthColor: Record<string, string> = {
  green: "bg-success", yellow: "bg-warning", red: "bg-destructive",
};
const healthLabel: Record<string, string> = { green: "On track", yellow: "Watch", red: "Over budget" };

const Dashboard = () => {
  const cash = 1_842_500;
  const lowCashDay = forecast.find(f => (f.forecast ?? 99999) < 1000);
  const pendingChecks = 110_600; // sum of pending
  const losingProjects = projects.filter(p => p.health === "red");

  return (
    <AppShell>
      <div className="px-5 lg:px-10 pt-6 lg:pt-10 max-w-[1480px] mx-auto animate-fade-in">
        {/* Heading */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-7">
          <div>
            <div className="text-[12px] uppercase tracking-[0.18em] text-muted-foreground mb-2">Mon · May 4 · Houston</div>
            <h1 className="font-display text-[36px] lg:text-[48px] leading-[1.02] font-semibold tracking-tight text-balance">
              Command Center
            </h1>
            <p className="mt-1.5 text-muted-foreground text-[14.5px] max-w-xl">
              6 active jobs · cash projected to dip below <span className="text-destructive font-medium">$1M on May 16</span>. One project bleeding.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="h-10 px-4 rounded-xl border border-border bg-card text-[13px] font-medium hover:bg-secondary transition-colors">This month</button>
            <Link to="/new" className="h-10 px-4 rounded-xl bg-foreground text-background text-[13px] font-medium inline-flex items-center gap-1.5 hover:opacity-90">
              <Zap className="h-4 w-4" /> Quick Add
            </Link>
          </div>
        </div>

        {/* Alert strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <AlertCard tone="warning" icon={<TrendingUp className="h-4 w-4" />}
            title="Cash dip in 12 days"
            body="Forecast: $980k on May 16 after payroll + Cemex check."
            cta="See timeline" to="/cashflow" />
          <AlertCard tone="alert" icon={<AlertTriangle className="h-4 w-4" />}
            title="Bellaire is $110k over budget"
            body="Framing + materials trending high. Margin: −15.2%."
            cta="Open project" to="/projects" />
          <AlertCard tone="info" icon={<Sparkles className="h-4 w-4" />}
            title="2 checks ($110.6k) uncleared"
            body="Rivera & Cemex — issued 1–2 days ago."
            cta="Review checks" to="/checks" />
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <Kpi accent label="Cash on hand" value={fmt(cash)} delta="+8.4%" sub="vs last month" />
          <Kpi label="Revenue · MTD" value={fmt(605_000)} delta="+22%" sub="3 projects billed" />
          <Kpi label="Expenses · MTD" value={fmt(482_900)} delta="+11%" trend="down" sub="Materials trending up" />
          <Kpi label="Avg margin" value="20.2%" delta="+1.6 pts" sub="6 active jobs" />
        </div>

        {/* Cash forecast hero */}
        <div className="ink-card p-6 lg:p-8 mb-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(circle_at_30%_20%,white,transparent_50%)]" />
          <div className="relative flex flex-wrap items-end justify-between gap-4 mb-6">
            <div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-primary-foreground/60">30-day cash forecast</div>
              <div className="mt-2 font-display text-[44px] leading-none font-semibold font-mono-tab">{fmt(cash)}</div>
              <div className="mt-1.5 text-primary-foreground/60 text-[13px] flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-warning"><AlertTriangle className="h-3.5 w-3.5" /> Low point: <span className="font-mono-tab font-medium">{fmtCompact(980_000)}</span> on May 16</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-[12px] text-primary-foreground/65">
              <Legend dot="bg-white" label="Actual" />
              <Legend dot="bg-accent" label="Forecast" />
              <Legend dot="border border-warning bg-transparent" label="Risk floor" />
            </div>
          </div>
          <div className="relative h-[240px] -mx-2">
            <ResponsiveContainer>
              <AreaChart data={forecast} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="white" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="white" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gForecast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(24 92% 54%)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(24 92% 54%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }} interval={1} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }} tickFormatter={(v) => `$${v}k`} width={42} />
                <Tooltip
                  contentStyle={{ background: "hsl(220 18% 8%)", border: "1px solid hsl(220 14% 22%)", borderRadius: 12, fontSize: 12, color: "white" }}
                  formatter={(v: number) => v ? `$${v}k` : "—"}
                />
                <ReferenceLine y={1000} stroke="hsl(38 92% 60%)" strokeDasharray="4 4" strokeOpacity={0.6} />
                <Area type="monotone" dataKey="actual" stroke="white" strokeWidth={2} fill="url(#gActual)" />
                <Area type="monotone" dataKey="forecast" stroke="hsl(24 92% 54%)" strokeWidth={2.5} fill="url(#gForecast)" strokeDasharray="0" />
                <ReferenceDot x="May 16" y={980} r={5} fill="hsl(0 72% 56%)" stroke="white" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Two-column: workflow + upcoming */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Workflow pipeline */}
          <div className="lg:col-span-2 glass-card p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Project pipeline</div>
                <div className="font-display text-[20px] font-semibold mt-0.5">Estimate → Budget → Build → Closeout</div>
              </div>
              <Link to="/projects" className="text-[13px] text-muted-foreground hover:text-foreground">All projects →</Link>
            </div>
            <div className="grid grid-cols-4 gap-2 mb-5">
              {(["Estimate", "Budget", "Build", "Closeout"] as const).map((stage, i) => {
                const stageProjects = projects.filter(p => p.stage === stage);
                const total = stageProjects.reduce((s, p) => s + (p.stage === "Build" || p.stage === "Closeout" ? p.spent : p.budget), 0);
                return (
                  <div key={stage} className="rounded-xl border border-border p-3.5 bg-background/40 relative">
                    <div className="flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground">
                      <span className="h-1 w-4 rounded-full" style={{ background: ["#cbb799", "#9b8a6e", "hsl(24 92% 54%)", "#1c1f24"][i] }} />
                      {stage}
                    </div>
                    <div className="font-display text-[22px] font-semibold mt-2 font-mono-tab">{stageProjects.length}</div>
                    <div className="text-[11px] text-muted-foreground">{fmtCompact(total)}</div>
                  </div>
                );
              })}
            </div>
            <div className="hairline mb-4" />
            <div className="space-y-2.5">
              {projects.slice(0, 4).map(p => {
                const pct = Math.round((p.spent / p.budget) * 100);
                const margin = projectMargin(p);
                return (
                  <Link key={p.id} to="/projects" className="grid grid-cols-12 gap-3 items-center py-2 hover:bg-secondary/40 rounded-lg px-2 -mx-2 transition-colors">
                    <div className="col-span-5 flex items-center gap-2.5 min-w-0">
                      <span className={`h-2 w-2 rounded-full shrink-0 ${healthColor[p.health]}`} />
                      <div className="min-w-0">
                        <div className="text-[14px] font-medium truncate">{p.name}</div>
                        <div className="text-[11.5px] text-muted-foreground">{p.type} · {p.stage} · {p.pm}</div>
                      </div>
                    </div>
                    <div className="col-span-4">
                      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div className={`h-full ${pct > 100 ? "bg-destructive" : pct > 90 ? "bg-warning" : "bg-sunset"}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-1 font-mono-tab">{fmtCompact(p.spent)} / {fmtCompact(p.budget)}</div>
                    </div>
                    <div className="col-span-2 text-right font-mono-tab text-[14px] font-semibold tabular-nums">
                      <span className={margin < 0 ? "text-destructive" : ""}>{margin.toFixed(1)}%</span>
                    </div>
                    <ChevronRight className="col-span-1 h-4 w-4 text-muted-foreground justify-self-end" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Upcoming flows */}
          <div className="glass-card p-6">
            <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Next 30 days</div>
            <div className="font-display text-[20px] font-semibold mt-0.5 mb-5">Money in & out</div>
            <div className="space-y-3 relative">
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
              {upcomingFlows.map((f, i) => (
                <div key={i} className="relative pl-7">
                  <span className={`absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-background ${f.amount > 0 ? "bg-success" : "bg-foreground"}`} />
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

        {/* Embedded copilot strip */}
        <div className="ink-card p-6 mb-6 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center gap-5">
            <div className="flex items-center gap-3 shrink-0">
              <div className="h-11 w-11 rounded-2xl bg-sunset shadow-glow flex items-center justify-center"><Sparkles className="h-5 w-5 text-white" /></div>
              <div>
                <div className="text-[11px] uppercase tracking-[0.14em] text-primary-foreground/60">Copilot</div>
                <div className="font-display text-[18px] font-semibold">Ask anything</div>
              </div>
            </div>
            <div className="flex-1 flex flex-wrap gap-2">
              {["Where are we overspending?", "Break down Bellaire", "Top 5 vendors this month", "Cash position May 20?"].map(p => (
                <Link key={p} to="/assistant" className="px-3.5 h-9 rounded-full bg-white/10 text-primary-foreground/90 text-[12.5px] hover:bg-white/15 transition-colors backdrop-blur-sm border border-white/10">
                  {p}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Two-up: Vendor intel + activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Vendor intel */}
          <div className="glass-card overflow-hidden lg:col-span-2">
            <div className="px-6 pt-5 pb-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Vendor intelligence</div>
                <div className="font-display text-[20px] font-semibold mt-0.5">Top spend & cost trends</div>
              </div>
              <Link to="/vendors" className="text-[13px] text-muted-foreground hover:text-foreground">All vendors →</Link>
            </div>
            <div className="hairline" />
            <div className="divide-y divide-border">
              {vendors.slice(0, 5).map(v => (
                <div key={v.name} className="px-6 py-3.5 grid grid-cols-12 items-center gap-3 hover:bg-secondary/40 transition-colors">
                  <div className="col-span-5 flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center text-[11px] font-semibold text-ink">{v.name.split(" ").slice(0,2).map(w => w[0]).join("")}</div>
                    <div className="min-w-0">
                      <div className="text-[14px] font-medium truncate flex items-center gap-2">
                        {v.name}
                        {v.flag === "rising" && <span className="text-[10px] uppercase tracking-[0.1em] text-destructive font-semibold">Rising</span>}
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

          {/* Latest activity */}
          <div className="glass-card overflow-hidden">
            <div className="px-6 pt-5 pb-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Recent</div>
                <div className="font-display text-[20px] font-semibold mt-0.5">Activity</div>
              </div>
              <Link to="/expenses" className="text-[13px] text-muted-foreground hover:text-foreground">All →</Link>
            </div>
            <div className="hairline" />
            <div className="divide-y divide-border">
              {transactions.slice(0, 6).map((t) => (
                <div key={t.id} className="px-6 py-3 flex items-center gap-3 hover:bg-secondary/40 transition-colors">
                  <div className={`h-7 w-7 rounded-lg flex items-center justify-center text-[10px] font-semibold ${
                    t.type === "income" ? "bg-success/12 text-success" : t.type === "check" ? "bg-accent-soft text-accent" : "bg-secondary"
                  }`}>{t.type === "income" ? "IN" : t.type === "check" ? "CK" : "EX"}</div>
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

        {/* Quick capture rail */}
        <div className="grid grid-cols-3 gap-3 mt-6 lg:hidden">
          <QuickTile icon={<Mic className="h-5 w-5" />} label="Voice" />
          <QuickTile icon={<Camera className="h-5 w-5" />} label="Scan" />
          <QuickTile icon={<Plus className="h-5 w-5" />} label="Manual" />
        </div>
      </div>
    </AppShell>
  );
};

const Kpi = ({ label, value, delta, sub, accent, trend = "up" }: { label: string; value: string; delta?: string; sub?: string; accent?: boolean; trend?: "up" | "down" }) => (
  <div className={`relative overflow-hidden rounded-2xl p-5 ${accent ? "ink-card" : "glass-card"}`}>
    <div className={`text-[11px] uppercase tracking-[0.14em] ${accent ? "text-primary-foreground/60" : "text-muted-foreground"}`}>{label}</div>
    <div className="mt-2.5 flex items-baseline gap-2">
      <div className="font-display text-[28px] lg:text-[32px] leading-none font-semibold font-mono-tab">{value}</div>
      {delta && (
        <span className={`inline-flex items-center text-[11.5px] font-medium ${trend === "up" ? "text-success" : "text-destructive"}`}>
          {trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}{delta}
        </span>
      )}
    </div>
    {sub && <div className={`mt-1.5 text-[11.5px] ${accent ? "text-primary-foreground/55" : "text-muted-foreground"}`}>{sub}</div>}
  </div>
);

const AlertCard = ({ tone, icon, title, body, cta, to }: { tone: "warning" | "alert" | "info"; icon: React.ReactNode; title: string; body: string; cta: string; to: string }) => {
  const styles = tone === "alert"
    ? "border-destructive/20 bg-destructive/5"
    : tone === "warning" ? "border-warning/30 bg-warning/5" : "border-border bg-card";
  const iconStyles = tone === "alert" ? "bg-destructive text-white" : tone === "warning" ? "bg-warning text-ink" : "bg-foreground text-background";
  return (
    <Link to={to} className={`group rounded-2xl border p-4 flex items-start gap-3 hover:shadow-card transition-shadow ${styles}`}>
      <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${iconStyles}`}>{icon}</div>
      <div className="min-w-0 flex-1">
        <div className="text-[13.5px] font-semibold leading-snug">{title}</div>
        <div className="text-[12px] text-muted-foreground mt-0.5 leading-snug">{body}</div>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform mt-1" />
    </Link>
  );
};

const Legend = ({ dot, label }: { dot: string; label: string }) => (
  <span className="inline-flex items-center gap-1.5"><span className={`h-2 w-2 rounded-full ${dot}`} />{label}</span>
);

const QuickTile = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <Link to="/new" className="glass-card p-4 flex flex-col items-center gap-2">
    <div className="h-10 w-10 rounded-xl bg-foreground text-background flex items-center justify-center">{icon}</div>
    <span className="text-[12px] font-medium">{label}</span>
  </Link>
);

export default Dashboard;
