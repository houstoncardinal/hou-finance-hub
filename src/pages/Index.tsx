import { AppShell } from "@/components/AppShell";
import { StatCard } from "@/components/StatCard";
import { fmt, fmtCompact, cashflow, categories, transactions, projects } from "@/lib/finance-data";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";
import { ArrowUpRight, Sparkles, Mic, Camera, Plus, AlertCircle, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <AppShell>
      <div className="px-5 lg:px-10 pt-6 lg:pt-10 max-w-[1400px] mx-auto animate-fade-in">
        {/* Heading */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-[12px] uppercase tracking-[0.18em] text-muted-foreground mb-2">Monday · May 4 · Houston</div>
            <h1 className="font-display text-[40px] lg:text-[52px] leading-[1.02] font-semibold tracking-tight text-balance">
              Good morning, Daniel.
            </h1>
            <p className="mt-2 text-muted-foreground text-[15px] max-w-xl">
              Four active projects · cash position is <span className="text-foreground font-medium">healthy</span>. Two checks need your attention.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="h-10 px-4 rounded-xl border border-border bg-card text-[13px] font-medium hover:bg-secondary transition-colors">This month</button>
            <Link to="/new" className="h-10 px-4 rounded-xl bg-foreground text-background text-[13px] font-medium inline-flex items-center gap-1.5 hover:opacity-90">
              <Plus className="h-4 w-4" /> Log entry
            </Link>
          </div>
        </div>

        {/* KPI grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard accent label="Cash on Hand" value={fmt(1_842_500)} delta="+8.4%" sub="vs last month" />
          <StatCard label="Revenue · MTD" value={fmt(605_000)} delta="+22%" sub="3 projects billed" />
          <StatCard label="Expenses · MTD" value={fmt(482_900)} delta="+11%" trend="down" sub="Materials trending up" />
          <StatCard label="Profit Margin" value="20.2%" delta="+1.6 pts" sub="Heights project leading" />
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Cashflow */}
          <div className="lg:col-span-2 glass-card p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Cash flow</div>
                <div className="mt-1.5 font-display text-[26px] font-semibold tracking-tight">{fmtCompact(605_000)} <span className="text-muted-foreground text-lg font-normal">in</span> <span className="text-muted-foreground text-lg">·</span> {fmtCompact(482_000)} <span className="text-muted-foreground text-lg font-normal">out</span></div>
              </div>
              <div className="flex gap-1 bg-secondary rounded-lg p-1">
                {["1M", "3M", "6M", "1Y"].map((p, i) => (
                  <button key={p} className={`px-3 h-7 text-[12px] rounded-md font-medium ${i === 2 ? "bg-card shadow-sm" : "text-muted-foreground"}`}>{p}</button>
                ))}
              </div>
            </div>
            <div className="h-[260px] -mx-2">
              <ResponsiveContainer>
                <AreaChart data={cashflow} margin={{ top: 5, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gIn" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(24 92% 54%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(24 92% 54%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gOut" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(220 14% 18%)" stopOpacity={0.18} />
                      <stop offset="100%" stopColor="hsl(220 14% 18%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="m" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} tickFormatter={(v) => `$${v}k`} width={42} />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12, boxShadow: "var(--shadow-elevated)" }}
                    formatter={(v: number) => `$${v}k`}
                  />
                  <Area type="monotone" dataKey="outflow" stroke="hsl(220 14% 28%)" strokeWidth={2} fill="url(#gOut)" />
                  <Area type="monotone" dataKey="inflow" stroke="hsl(24 92% 54%)" strokeWidth={2.5} fill="url(#gIn)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Insights */}
          <div className="glass-card p-6 flex flex-col">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-accent" /> AI Insights
            </div>
            <div className="mt-5 space-y-4 flex-1">
              <Insight icon={<TrendingUp className="h-4 w-4" />} title="Heights project trending +12% over budget"
                body="Concrete costs rose 8% this week. Suggest renegotiating Cemex contract." tone="warning" />
              <Insight icon={<AlertCircle className="h-4 w-4" />} title="Possible duplicate: Sunbelt Rentals"
                body="$3,280 logged twice on May 1–2. Review both entries." tone="alert" />
              <Insight icon={<Sparkles className="h-4 w-4" />} title="Forecast: $312k cash inflow next 14 days"
                body="Memorial draw + Galleria milestone billing." tone="info" />
            </div>
            <Link to="/assistant" className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-accent hover:opacity-80">
              Ask the assistant <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Quick capture */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <QuickCapture icon={<Mic className="h-5 w-5" />} title="Voice to expense" desc="“Paid Cemex 4,800 for slab pour at Heights.”" />
          <QuickCapture icon={<Camera className="h-5 w-5" />} title="Scan a receipt" desc="OCR auto-fills vendor, total, tax." />
          <QuickCapture icon={<Plus className="h-5 w-5" />} title="Manual entry" desc="Log expense, income, or check in seconds." />
        </div>

        {/* Two-up */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 glass-card overflow-hidden">
            <div className="px-6 pt-5 pb-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Recent activity</div>
                <div className="font-display text-[20px] font-semibold mt-0.5">Latest transactions</div>
              </div>
              <Link to="/expenses" className="text-[13px] text-muted-foreground hover:text-foreground">View all →</Link>
            </div>
            <div className="hairline" />
            <div className="divide-y divide-border">
              {transactions.slice(0, 6).map((t) => (
                <div key={t.id} className="px-6 py-3.5 flex items-center gap-4 hover:bg-secondary/40 transition-colors">
                  <div className={`h-9 w-9 rounded-xl flex items-center justify-center text-[11px] font-semibold ${
                    t.type === "income" ? "bg-success/12 text-success" : t.type === "check" ? "bg-accent-soft text-accent" : "bg-secondary text-foreground"
                  }`}>
                    {t.type === "income" ? "IN" : t.type === "check" ? "CK" : "EX"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[14px] font-medium truncate">{t.vendor}</div>
                    <div className="text-[12px] text-muted-foreground truncate">{t.project} · {t.category}</div>
                  </div>
                  <div className="hidden sm:block text-[12px] text-muted-foreground w-16">{t.date}</div>
                  <div className={`font-mono-tab text-[14px] font-semibold tabular-nums ${t.amount >= 0 ? "text-success" : "text-foreground"}`}>
                    {t.amount >= 0 ? "+" : ""}{fmt(t.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="glass-card p-6">
            <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Spend by category</div>
            <div className="font-display text-[20px] font-semibold mt-0.5">This month</div>
            <div className="h-[180px] mt-4">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={categories} dataKey="value" innerRadius={52} outerRadius={78} paddingAngle={2} stroke="none">
                    {categories.map((c) => <Cell key={c.name} fill={c.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 space-y-2.5">
              {categories.map((c) => (
                <div key={c.name} className="flex items-center gap-3 text-[13px]">
                  <span className="h-2 w-2 rounded-full" style={{ background: c.color }} />
                  <span className="flex-1 text-muted-foreground">{c.name}</span>
                  <span className="font-medium font-mono-tab">{c.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Projects strip */}
        <div className="mt-6 glass-card overflow-hidden">
          <div className="px-6 pt-5 pb-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Active projects</div>
              <div className="font-display text-[20px] font-semibold mt-0.5">Portfolio at a glance</div>
            </div>
            <Link to="/projects" className="text-[13px] text-muted-foreground hover:text-foreground">All projects →</Link>
          </div>
          <div className="hairline" />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border">
            {projects.map((p) => {
              const pct = Math.round((p.spent / p.budget) * 100);
              const margin = ((p.revenue - p.spent) / p.revenue) * 100;
              return (
                <Link key={p.id} to="/projects" className="p-6 hover:bg-secondary/40 transition-colors block">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-medium text-[15px] truncate">{p.name}</div>
                      <div className="text-[12px] text-muted-foreground truncate">{p.address}</div>
                    </div>
                    <span className={`accent-pill ${p.status === "planning" ? "!bg-secondary !text-muted-foreground" : ""}`}>{p.status}</span>
                  </div>
                  <div className="mt-5 space-y-1.5">
                    <div className="flex items-baseline justify-between text-[12px] text-muted-foreground">
                      <span>{fmtCompact(p.spent)} of {fmtCompact(p.budget)}</span>
                      <span className="font-mono-tab text-foreground font-medium">{pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div className={`h-full rounded-full ${pct > 90 ? "bg-destructive" : "bg-sunset"}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-[12px]">
                    <span className="text-muted-foreground">Margin</span>
                    <span className="font-mono-tab font-semibold">{margin.toFixed(1)}%</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
};

const Insight = ({ icon, title, body, tone }: { icon: React.ReactNode; title: string; body: string; tone: "warning" | "alert" | "info" }) => {
  const toneClass =
    tone === "warning" ? "bg-accent-soft text-accent" :
    tone === "alert" ? "bg-destructive/10 text-destructive" :
    "bg-secondary text-foreground";
  return (
    <div className="flex gap-3">
      <div className={`h-8 w-8 shrink-0 rounded-lg flex items-center justify-center ${toneClass}`}>{icon}</div>
      <div>
        <div className="text-[13.5px] font-medium leading-snug">{title}</div>
        <div className="text-[12.5px] text-muted-foreground mt-0.5 leading-snug">{body}</div>
      </div>
    </div>
  );
};

const QuickCapture = ({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) => (
  <Link to="/new" className="group glass-card p-5 flex items-center gap-4 hover:shadow-elevated transition-shadow">
    <div className="h-11 w-11 rounded-xl bg-foreground text-background flex items-center justify-center group-hover:bg-sunset transition-colors">
      {icon}
    </div>
    <div className="min-w-0">
      <div className="font-medium text-[14px]">{title}</div>
      <div className="text-[12.5px] text-muted-foreground truncate">{desc}</div>
    </div>
  </Link>
);

export default Dashboard;
