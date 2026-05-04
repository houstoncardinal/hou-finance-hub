import { AppShell } from "@/components/AppShell";
import { fmt, fmtCompact, forecast, upcomingFlows, projects, transactions, vendors, checks } from "@/lib/finance-data";
import { Area, Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine, ReferenceDot, Legend, ComposedChart, Line } from "recharts";
import { TrendingUp, Download, PieChart as PieChartIcon, BarChart3, Activity, AlertTriangle, DollarSign } from "lucide-react";
import { useState } from "react";

const Charts = () => {
  const [chartTab, setChartTab] = useState<"cashflow" | "spend" | "margin" | "category">("cashflow");
  const cash = 1_842_500;

  const categoryData = [...new Set(transactions.filter(t => t.amount < 0).map(t => t.category))].map(c => ({
    name: c,
    amount: transactions.filter(t => t.category === c && t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0),
  }));

  const marginData = projects.map(p => ({
    name: p.name.split(" ").slice(0, 2).join(" "),
    fullName: p.name,
    budget: p.budget, spent: p.spent, revenue: p.revenue,
    margin: p.revenue === 0 ? 0 : ((p.revenue - p.spent) / p.revenue) * 100,
    health: p.health, pct: Math.round((p.spent / p.budget) * 100),
  }));

  const projectSpendData = projects.map(p => ({
    name: p.name.split(" ").slice(0, 2).join(" "),
    fullName: p.name, spent: p.spent, committed: p.committed,
    budget: p.budget, remaining: p.budget - p.spent,
    pct: Math.round((p.spent / p.budget) * 100),
  }));

  const vendorSpendData = vendors.slice(0, 6).map(v => ({
    name: v.name.split(" ")[0], fullName: v.name, ytd: v.ytd, open: v.open, trend: v.trend,
  }));

  const inflow = upcomingFlows.filter(f => f.amount > 0).reduce((s, f) => s + f.amount, 0);
  const outflow = upcomingFlows.filter(f => f.amount < 0).reduce((s, f) => s + Math.abs(f.amount), 0);
  const totalExpenses = transactions.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const totalIncome = transactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const pendingChecksTotal = checks.filter(c => c.status === "pending").reduce((s, c) => s + c.amount, 0);

  const chartTabs = [
    { id: "cashflow" as const, label: "Cash Flow", icon: TrendingUp },
    { id: "margin" as const, label: "Profit Margins", icon: Activity },
    { id: "spend" as const, label: "Spend Analysis", icon: BarChart3 },
    { id: "category" as const, label: "By Category", icon: PieChartIcon },
  ];

  return (
    <AppShell>
      <div className="px-5 lg:px-10 pt-6 lg:pt-10 max-w-[1480px] mx-auto pb-12">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-[12px] uppercase tracking-[0.18em] text-muted-foreground mb-2">
              <Activity className="h-3.5 w-3.5 inline mr-1" /> Analytics
            </div>
            <h1 className="font-display text-[36px] lg:text-[44px] leading-tight font-semibold tracking-tight">Charts & Visualizations</h1>
            <p className="mt-1.5 text-muted-foreground text-[14.5px]">Executive dashboards powered by live financial data.</p>
          </div>
        </div>

        {/* Tab nav */}
        <div className="grid grid-cols-2 lg:flex lg:gap-1.5 mb-6">
          {chartTabs.map(t => (
            <button key={t.id} onClick={() => setChartTab(t.id)}
              className={`flex items-center justify-center lg:inline-flex gap-1.5 px-4 h-10 rounded-xl text-[13px] font-medium transition-all ${
                chartTab === t.id ? "bg-accent text-white shadow-md" : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
              }`}
            >
              <t.icon className="h-4 w-4" /> <span className="truncate">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Top stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="ink-card rounded-2xl p-5">
            <div className="text-[11px] uppercase tracking-[0.14em] text-primary-foreground/60">Cash on Hand</div>
            <div className="mt-2.5 font-display text-[28px] font-semibold font-mono-tab">{fmt(cash)}</div>
            <div className="text-[11px] text-primary-foreground/50 mt-1">Available balance</div>
          </div>
          <div className="glass-card rounded-2xl p-5">
            <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Revenue MTD</div>
            <div className="mt-2.5 font-display text-[28px] font-semibold font-mono-tab text-success">{fmt(totalIncome)}</div>
            <div className="text-[11px] text-muted-foreground mt-1">{transactions.filter(t => t.type === "income").length} payments</div>
          </div>
          <div className="glass-card rounded-2xl p-5">
            <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Expenses MTD</div>
            <div className="mt-2.5 font-display text-[28px] font-semibold font-mono-tab text-accent">{fmt(totalExpenses)}</div>
            <div className="text-[11px] text-muted-foreground mt-1">{transactions.filter(t => t.type === "expense").length} transactions</div>
          </div>
          <div className="glass-card rounded-2xl p-5">
            <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Pending Checks</div>
            <div className="mt-2.5 font-display text-[28px] font-semibold font-mono-tab text-warning">{fmt(pendingChecksTotal)}</div>
            <div className="text-[11px] text-muted-foreground mt-1">{checks.filter(c => c.status === "pending").length} uncleared</div>
          </div>
        </div>

        {/* CASH FLOW */}
        {chartTab === "cashflow" && (
          <div>
            <div className="ink-card rounded-2xl p-6 lg:p-8 text-white shadow-xl mb-4 relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_30%_20%,white,transparent_50%)]" />
              <div className="relative">
                <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.18em] text-primary-foreground/60">30-Day Cash Forecast</div>
                    <div className="mt-2 font-display text-[44px] leading-none font-semibold font-mono-tab">{fmt(cash)}</div>
                    <div className="mt-2 text-primary-foreground/55 text-[13px] flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="inline-flex items-center gap-1"><AlertTriangle className="h-3.5 w-3.5 text-warning" /> Low: <span className="font-mono-tab font-medium text-primary-foreground">{fmtCompact(980_000)}</span> May 16</span>
                      <span className="text-primary-foreground/30">·</span>
                      <span>Burn: <span className="font-mono-tab font-medium text-primary-foreground">{fmtCompact(610_000)}</span>/mo</span>
                      <span className="text-primary-foreground/30">·</span>
                      <span>In: <span className="font-mono-tab font-medium text-success">{fmtCompact(inflow)}</span></span>
                      <span className="text-primary-foreground/30">·</span>
                      <span>Out: <span className="font-mono-tab font-medium text-destructive">{fmtCompact(outflow)}</span></span>
                    </div>
                  </div>
                </div>
                <div className="h-[320px] -mx-2">
                  <ResponsiveContainer>
                    <ComposedChart data={forecast} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                      <defs><linearGradient id="cfArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ffffff" stopOpacity={0.25} /><stop offset="100%" stopColor="#ffffff" stopOpacity={0} /></linearGradient></defs>
                      <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={40} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 10 }} tickFormatter={v => `$${v}k`} width={42} />
                      <Tooltip contentStyle={{ background: "hsl(220 18% 8%)", border: "1px solid hsl(220 14% 22%)", borderRadius: 12, fontSize: 12, color: "white", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }} formatter={(v: number) => v ? [`$${v}k`, "Amount"] : ["—", ""]} labelStyle={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }} />
                      <ReferenceLine y={1000} stroke="rgba(251, 191, 36, 0.5)" strokeDasharray="4 4" strokeOpacity={0.6} label={{ value: "Risk floor", fill: "rgba(251,191,36,0.5)", fontSize: 10 }} />
                      <Area type="monotone" dataKey="actual" stroke="#ffffff" strokeWidth={2.5} fill="url(#cfArea)" name="Actual" />
                      <Area type="monotone" dataKey="forecast" stroke="#f59e0b" strokeWidth={2.5} fill="none" strokeDasharray="6 3" name="Forecast" />
                      <ReferenceDot x="May 16" y={980} r={6} fill="hsl(var(--destructive))" stroke="white" strokeWidth={2} />
                      <Line type="monotone" dataKey="forecast" stroke="#f59e0b" strokeWidth={2} dot={false} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div className="glass-card overflow-hidden">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <div><div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Schedule</div><div className="font-display text-[18px] font-semibold mt-0.5">Upcoming Events</div></div>
                <button className="h-8 px-3 rounded-lg bg-secondary text-muted-foreground text-[12px] font-medium inline-flex items-center gap-1 hover:bg-border/60 transition-colors"><Download className="h-3.5 w-3.5" /> CSV</button>
              </div>
              <div className="divide-y divide-border">
                {upcomingFlows.map((f, i) => (
                  <div key={i} className="px-6 py-3.5 flex items-center gap-4 hover:bg-secondary/40 transition-colors">
                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${f.amount > 0 ? "bg-success/12 text-success" : "bg-accent-soft text-accent"}`}>
                      {f.amount > 0 ? <TrendingUp className="h-4 w-4" /> : <DollarSign className="h-4 w-4" />}
                    </div>
                    <div className="min-w-0 flex-1"><div className="text-[14px] font-medium">{f.label}</div><div className="text-[12px] text-muted-foreground">{f.date} · {f.project} · {f.kind}</div></div>
                    <div className={`font-mono-tab text-[14px] font-semibold tabular-nums ${f.amount > 0 ? "text-success" : "text-accent"}`}>{f.amount > 0 ? "+" : "−"}{fmt(Math.abs(f.amount))}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MARGIN */}
        {chartTab === "margin" && (
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div><div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Profit Analysis</div><div className="font-display text-[20px] font-semibold mt-0.5">Project Margin Breakdown</div></div>
              <button className="h-8 px-3 rounded-lg bg-secondary text-muted-foreground text-[12px] font-medium inline-flex items-center gap-1 hover:bg-border/60 transition-colors"><Download className="h-3.5 w-3.5" /> Export</button>
            </div>
            <div className="h-[360px]">
              <ResponsiveContainer>
                <BarChart data={marginData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={v => `${v.toFixed(0)}%`} domain={[-20, 35]} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 12, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }} formatter={(v: number) => `${v.toFixed(1)}%`} labelFormatter={(label) => marginData.find(d => d.name === label)?.fullName || label} />
                  <Bar dataKey="margin" radius={[6, 6, 0, 0]} maxBarSize={48}>
                    {marginData.map((entry, i) => <Cell key={i} fill={entry.margin < 0 ? "hsl(var(--accent))" : entry.margin < 10 ? "hsl(var(--warning))" : "hsl(var(--success))"} />)}
                  </Bar>
                  <ReferenceLine y={0} stroke="hsl(var(--border))" strokeWidth={1.5} />
                  <ReferenceLine y={10} stroke="hsl(var(--warning))" strokeDasharray="4 4" strokeOpacity={0.5} label={{ value: "Target", fill: "hsl(var(--warning))", fontSize: 10, position: "right" }} />
                  <Legend formatter={(value) => <span style={{ color: "hsl(var(--muted-foreground))", fontSize: 12 }}>{value}</span>}
                    payload={[
                      { value: "Above target", type: "square", color: "hsl(var(--success))" },
                      { value: "At risk", type: "square", color: "hsl(var(--warning))" },
                      { value: "Negative", type: "square", color: "hsl(var(--accent))" },
                    ]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 grid grid-cols-2 lg:grid-cols-3 gap-3">
              {marginData.map(p => (
                <div key={p.name} className={`rounded-xl p-4 border ${p.margin < 0 ? "border-accent/20 bg-accent-soft" : p.margin < 10 ? "border-warning/20 bg-warning/5" : "border-success/20 bg-success/5"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[12px] font-medium text-muted-foreground truncate">{p.fullName}</div>
                    <span className={`text-[10px] font-semibold uppercase tracking-wider ${p.margin < 0 ? "text-accent" : p.margin < 10 ? "text-warning" : "text-success"}`}>{p.health === "red" ? "⚠ Over" : p.health === "yellow" ? "Watch" : "✅ On track"}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <div className={`font-display text-[24px] font-semibold font-mono-tab ${p.margin < 0 ? "text-accent" : p.margin < 10 ? "text-warning" : "text-success"}`}>{p.margin.toFixed(1)}%</div>
                    <span className="text-[11px] text-muted-foreground">margin</span>
                  </div>
                  <div className="mt-1.5 flex gap-3 text-[11px] text-muted-foreground">
                    <span>Revenue <span className="font-medium text-foreground">{fmtCompact(p.revenue)}</span></span>
                    <span>Spent <span className="font-medium text-foreground">{fmtCompact(p.spent)}</span></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SPEND */}
        {chartTab === "spend" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="glass-card p-6">
              <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Budget Analysis</div>
              <div className="font-display text-[20px] font-semibold mt-0.5 mb-6">Budget vs. Actual</div>
              <div className="h-[320px]">
                <ResponsiveContainer>
                  <BarChart data={projectSpendData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }} layout="vertical">
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickFormatter={v => `$${v/1000}k`} />
                    <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} width={80} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 12, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }} formatter={(v: number) => fmt(v)} labelFormatter={(label) => projectSpendData.find(d => d.name === label)?.fullName || label} />
                    <Bar dataKey="budget" fill="hsl(var(--muted))" radius={[0, 4, 4, 0]} name="Budget" />
                    <Bar dataKey="spent" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} name="Actual Spent" />
                    <Legend formatter={(value) => <span style={{ color: "hsl(var(--muted-foreground))", fontSize: 12 }}>{value}</span>} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {projectSpendData.map(p => (
                  <div key={p.name} className="flex items-center gap-3 py-1">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="font-medium truncate">{p.fullName}</span>
                        <span className={`font-mono-tab font-semibold ${p.pct > 100 ? "text-destructive" : p.pct > 90 ? "text-warning" : "text-success"}`}>{p.pct}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary mt-1 overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${p.pct > 100 ? "bg-destructive" : p.pct > 90 ? "bg-warning" : "bg-accent"}`} style={{ width: `${Math.min(p.pct, 100)}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-card p-6">
              <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Vendor Analysis</div>
              <div className="font-display text-[20px] font-semibold mt-0.5 mb-6">Top YTD Vendors</div>
              <div className="h-[320px]">
                <ResponsiveContainer>
                  <BarChart data={vendorSpendData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }} layout="vertical">
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickFormatter={v => `$${v/1000}k`} />
                    <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} width={70} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 12, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }} formatter={(v: number) => fmt(v)} labelFormatter={(label) => vendorSpendData.find(d => d.name === label)?.fullName || label} />
                    <Bar dataKey="ytd" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} name="YTD Spend" />
                    <Legend formatter={(value) => <span style={{ color: "hsl(var(--muted-foreground))", fontSize: 12 }}>{value}</span>} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {vendors.slice(0, 6).map(v => (
                  <div key={v.name} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-semibold uppercase ${v.trend > 0 ? "text-destructive" : "text-success"}`}>{v.trend > 0 ? "↑" : "↓"}</span>
                      <span className="text-[13px]">{v.name}</span>
                      {v.flag === "rising" && <span className="text-[9px] uppercase bg-accent-soft text-accent px-1.5 py-0.5 rounded font-semibold">Rising</span>}
                    </div>
                    <div className="font-mono-tab text-[13px] font-semibold">{fmtCompact(v.ytd)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CATEGORY */}
        {chartTab === "category" && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-3 glass-card p-6">
              <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Expense Allocation</div>
              <div className="font-display text-[20px] font-semibold mt-0.5 mb-4">By Category</div>
              <div className="h-[380px]">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={categoryData.filter(d => d.amount > 0)} dataKey="amount" nameKey="name" cx="50%" cy="50%" outerRadius={130} innerRadius={50} paddingAngle={3} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={{ stroke: "hsl(var(--border))", strokeWidth: 1 }}>
                      {categoryData.filter(d => d.amount > 0).map((_, i) => <Cell key={i} fill={["hsl(var(--accent))","#b91c1c","#dc2626","#f87171","hsl(var(--warning))","#f59e0b","hsl(var(--success))","#22c55e","hsl(var(--muted-foreground))","hsl(var(--foreground))"][i % 10]} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => fmt(v)} contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 12, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="lg:col-span-2 glass-card p-6">
              <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Breakdown</div>
              <div className="font-display text-[20px] font-semibold mt-0.5 mb-5">Category Details</div>
              <div className="space-y-1">
                {categoryData.filter(d => d.amount > 0).sort((a, b) => b.amount - a.amount).map((d, i) => {
                  const total = categoryData.filter(d => d.amount > 0).reduce((s, d) => s + d.amount, 0);
                  const pct = total > 0 ? (d.amount / total) * 100 : 0;
                  const palette = ["hsl(var(--accent))","#b91c1c","#dc2626","#f87171","hsl(var(--warning))","#f59e0b","hsl(var(--success))","#22c55e","hsl(var(--muted-foreground))","hsl(var(--foreground))"];
                  return (
                    <div key={d.name} className="py-2.5 group hover:bg-secondary/40 rounded-lg px-2 -mx-2 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: palette[i % 10] }} /><span className="text-[13px] font-medium">{d.name}</span></div>
                        <span className="font-mono-tab text-[13px] font-semibold">{fmtCompact(d.amount)}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-secondary overflow-hidden ml-4">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: palette[i % 10] }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default Charts;