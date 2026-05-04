import { AppShell } from "@/components/AppShell";
import { projects, fmt, fmtCompact, projectMargin } from "@/lib/finance-data";
import { MapPin, ArrowUpRight, AlertTriangle } from "lucide-react";
import { useState } from "react";

const healthColor: Record<string, string> = { green: "bg-success", yellow: "bg-warning", red: "bg-destructive" };
const healthLabel: Record<string, string> = { green: "On track", yellow: "Watch", red: "Over budget" };

const Projects = () => {
  const [filter, setFilter] = useState<"All" | "Commercial" | "Residential" | "At risk">("All");
  const filtered = projects.filter(p =>
    filter === "All" ? true :
    filter === "At risk" ? p.health !== "green" :
    p.type === filter
  );

  return (
    <AppShell>
      <div className="px-5 lg:px-10 pt-6 lg:pt-10 max-w-[1480px] mx-auto">
        <div className="mb-7">
          <div className="text-[12px] uppercase tracking-[0.18em] text-muted-foreground mb-2">Portfolio</div>
          <h1 className="font-display text-[40px] leading-tight font-semibold tracking-tight">Projects</h1>
          <p className="mt-1.5 text-muted-foreground">Real-time profitability across every commercial and residential job.</p>
        </div>

        {/* Health summary */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <HealthCard tone="green" count={projects.filter(p => p.health === "green").length} label="On track" />
          <HealthCard tone="yellow" count={projects.filter(p => p.health === "yellow").length} label="Watch" />
          <HealthCard tone="red" count={projects.filter(p => p.health === "red").length} label="Bleeding" />
        </div>

        {/* Filter */}
        <div className="flex flex-wrap items-center gap-1.5 mb-5">
          {(["All", "Commercial", "Residential", "At risk"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`h-9 px-3.5 rounded-full text-[13px] font-medium transition-colors ${filter === f ? "bg-foreground text-background" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}>
              {f}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((p) => {
            const pct = Math.round((p.spent / p.budget) * 100);
            const margin = projectMargin(p);
            const remaining = p.budget - p.spent;
            return (
              <div key={p.id} className="glass-card p-6 hover:shadow-elevated transition-shadow group relative overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-1 ${healthColor[p.health]}`} />
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground font-medium">{p.type} · {p.stage}</span>
                    </div>
                    <div className="font-display text-[22px] font-semibold tracking-tight truncate">{p.name}</div>
                    <div className="mt-1 flex items-center gap-1.5 text-[12.5px] text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" /> {p.address} · {p.pm}
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                    p.health === "green" ? "bg-success/10 text-success" :
                    p.health === "yellow" ? "bg-warning/15 text-warning" :
                    "bg-destructive/10 text-destructive"
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${healthColor[p.health]}`} />
                    {healthLabel[p.health]}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6">
                  <Mini label="Budget" value={fmtCompact(p.budget)} />
                  <Mini label="Spent" value={fmtCompact(p.spent)} />
                  <Mini label="Committed" value={fmtCompact(p.committed)} />
                </div>

                <div className="mt-5">
                  <div className="flex items-baseline justify-between text-[12px] text-muted-foreground mb-1.5">
                    <span>Budget consumed</span>
                    <span className="font-mono-tab font-medium text-foreground">{pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden relative">
                    <div className={`h-full ${pct > 100 ? "bg-destructive" : pct > 90 ? "bg-warning" : "bg-sunset"}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                    {pct > 100 && (
                      <div className="absolute right-0 top-0 h-full bg-destructive/40" style={{ width: `${pct - 100}%`, maxWidth: "100%" }} />
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-border flex items-center justify-between">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Margin</div>
                    <div className={`font-display text-[24px] font-semibold mt-0.5 font-mono-tab ${margin < 0 ? "text-destructive" : ""}`}>{margin.toFixed(1)}%</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Remaining</div>
                    <div className={`font-mono-tab font-semibold text-[16px] mt-0.5 ${remaining < 0 ? "text-destructive" : ""}`}>{remaining < 0 ? "−" : ""}{fmt(remaining)}</div>
                  </div>
                  <button className="h-10 w-10 rounded-xl bg-foreground text-background flex items-center justify-center group-hover:bg-sunset transition-colors">
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
};

const Mini = ({ label, value }: { label: string; value: string }) => (
  <div>
    <div className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{label}</div>
    <div className="font-display text-[20px] font-semibold mt-0.5 font-mono-tab">{value}</div>
  </div>
);

const HealthCard = ({ tone, count, label }: { tone: "green" | "yellow" | "red"; count: number; label: string }) => {
  const bg = tone === "green" ? "bg-success/8 border-success/20" : tone === "yellow" ? "bg-warning/10 border-warning/25" : "bg-destructive/8 border-destructive/20";
  const text = tone === "green" ? "text-success" : tone === "yellow" ? "text-warning" : "text-destructive";
  return (
    <div className={`rounded-2xl border p-4 ${bg}`}>
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${healthColor[tone]}`} />
        <span className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{label}</span>
      </div>
      <div className={`mt-2 font-display text-[28px] font-semibold font-mono-tab ${tone === "red" ? text : ""}`}>{count}</div>
    </div>
  );
};

export default Projects;
