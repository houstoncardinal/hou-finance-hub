import { AppShell } from "@/components/AppShell";
import { forecast, upcomingFlows, fmt, fmtCompact } from "@/lib/finance-data";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, ReferenceLine, ReferenceDot } from "recharts";
import { AlertTriangle, ArrowDownRight, ArrowUpRight } from "lucide-react";

const CashFlow = () => {
  const inflow = upcomingFlows.filter(f => f.amount > 0).reduce((s, f) => s + f.amount, 0);
  const outflow = upcomingFlows.filter(f => f.amount < 0).reduce((s, f) => s + Math.abs(f.amount), 0);

  return (
    <AppShell>
      <div className="px-5 lg:px-10 pt-6 lg:pt-10 max-w-[1480px] mx-auto">
        <div className="mb-7">
          <div className="text-[12px] uppercase tracking-[0.18em] text-muted-foreground mb-2">Liquidity</div>
          <h1 className="font-display text-[40px] leading-tight font-semibold tracking-tight">Cash Flow Forecast</h1>
          <p className="mt-1.5 text-muted-foreground">Predicted position based on outstanding checks and expected payments.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
          <Stat label="Position today" value={fmt(1_842_500)} accent />
          <Stat label="Forecast inflow · 30d" value={fmt(inflow)} tone="success" />
          <Stat label="Forecast outflow · 30d" value={fmt(outflow)} tone="destructive" />
        </div>

        <div className="ink-card p-6 mb-6">
          <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
            <div>
              <div className="text-[11px] uppercase tracking-[0.14em] text-primary-foreground/60">Cash position · next 30 days</div>
              <div className="mt-1 inline-flex items-center gap-2 text-warning text-[13px]">
                <AlertTriangle className="h-3.5 w-3.5" /> You may run low on cash in <span className="font-semibold">12 days</span>.
              </div>
            </div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer>
              <AreaChart data={forecast} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="cf1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(24 92% 54%)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="hsl(24 92% 54%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="cf2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="white" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="white" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }} tickFormatter={v => `$${v}k`} width={42} />
                <Tooltip contentStyle={{ background: "hsl(220 18% 8%)", border: "1px solid hsl(220 14% 22%)", borderRadius: 12, fontSize: 12, color: "white" }} formatter={(v: number) => v ? `$${v}k` : "—"} />
                <ReferenceLine y={1000} stroke="hsl(38 92% 60%)" strokeDasharray="4 4" />
                <Area type="monotone" dataKey="actual" stroke="white" strokeWidth={2} fill="url(#cf2)" />
                <Area type="monotone" dataKey="forecast" stroke="hsl(24 92% 54%)" strokeWidth={2.5} fill="url(#cf1)" />
                <ReferenceDot x="May 16" y={980} r={5} fill="hsl(0 72% 56%)" stroke="white" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="px-6 pt-5 pb-4">
            <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Scheduled events</div>
            <div className="font-display text-[20px] font-semibold mt-0.5">Money in & out</div>
          </div>
          <div className="hairline" />
          <div className="divide-y divide-border">
            {upcomingFlows.map((f, i) => (
              <div key={i} className="px-6 py-4 flex items-center gap-4">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${f.amount > 0 ? "bg-success/12 text-success" : "bg-secondary"}`}>
                  {f.amount > 0 ? <ArrowDownRight className="h-4 w-4 rotate-180" /> : <ArrowUpRight className="h-4 w-4 rotate-180" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[14px] font-medium">{f.label}</div>
                  <div className="text-[12px] text-muted-foreground">{f.date} · {f.project} · {f.kind}</div>
                </div>
                <div className={`font-mono-tab text-[14px] font-semibold tabular-nums ${f.amount > 0 ? "text-success" : ""}`}>
                  {f.amount > 0 ? "+" : "−"}{fmt(Math.abs(f.amount))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
};

const Stat = ({ label, value, accent, tone }: { label: string; value: string; accent?: boolean; tone?: "success" | "destructive" }) => (
  <div className={`rounded-2xl p-5 ${accent ? "ink-card" : "glass-card"}`}>
    <div className={`text-[11px] uppercase tracking-[0.14em] ${accent ? "text-primary-foreground/60" : "text-muted-foreground"}`}>{label}</div>
    <div className={`mt-2.5 font-display text-[28px] font-semibold font-mono-tab ${tone === "success" ? "text-success" : tone === "destructive" ? "text-destructive" : ""}`}>{value}</div>
  </div>
);

export default CashFlow;
