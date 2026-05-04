import { AppShell } from "@/components/AppShell";
import { fmt, fmtCompact, projects, projectMargin, vendors } from "@/lib/finance-data";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { Download, FileText } from "lucide-react";

const Reports = () => {
  const profitData = projects.map(p => ({ name: p.name.split(" ")[0], profit: Math.round((p.revenue - p.spent) / 1000), margin: projectMargin(p) }));
  return (
    <AppShell>
      <div className="px-5 lg:px-10 pt-6 lg:pt-10 max-w-[1480px] mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-7">
          <div>
            <div className="text-[12px] uppercase tracking-[0.18em] text-muted-foreground mb-2">Reporting</div>
            <h1 className="font-display text-[40px] leading-tight font-semibold tracking-tight">Reports</h1>
            <p className="mt-1.5 text-muted-foreground">One-click exports for ownership, accounting, and tax.</p>
          </div>
          <button className="h-10 px-4 rounded-xl bg-foreground text-background text-[13px] font-medium inline-flex items-center gap-1.5"><Download className="h-4 w-4" /> Export PDF</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          {[
            { t: "Profit by project", d: "P&L per job · MTD" },
            { t: "Monthly cash flow", d: "Inflow vs outflow" },
            { t: "Vendor payments", d: "1099-ready summary" },
            { t: "Open checks", d: "All uncleared" },
            { t: "Budget vs actual", d: "Variance by category" },
            { t: "Owner snapshot", d: "Single-page recap" },
          ].map(r => (
            <button key={r.t} className="glass-card p-4 text-left flex items-start gap-3 hover:shadow-elevated transition-shadow">
              <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center"><FileText className="h-[18px] w-[18px]" /></div>
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-medium">{r.t}</div>
                <div className="text-[12px] text-muted-foreground">{r.d}</div>
              </div>
              <Download className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>

        <div className="glass-card p-6">
          <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Profit by project · MTD</div>
          <div className="font-display text-[20px] font-semibold mt-0.5 mb-5">Where the money's actually being made</div>
          <div className="h-[320px]">
            <ResponsiveContainer>
              <BarChart data={profitData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} tickFormatter={v => `$${v}k`} width={50} />
                <Tooltip cursor={{ fill: "hsl(var(--secondary))" }} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }} formatter={(v: number) => `$${v}k`} />
                <Bar dataKey="profit" radius={[8, 8, 0, 0]}>
                  {profitData.map((d, i) => (
                    <Cell key={i} fill={d.profit < 0 ? "hsl(0 72% 56%)" : "hsl(24 92% 54%)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default Reports;
