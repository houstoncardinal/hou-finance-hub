import { AppShell } from "@/components/AppShell";
import { projects, fmt, fmtCompact } from "@/lib/finance-data";
import { MapPin, ArrowUpRight } from "lucide-react";

const Projects = () => (
  <AppShell>
    <div className="px-5 lg:px-10 pt-6 lg:pt-10 max-w-[1400px] mx-auto">
      <div className="mb-8">
        <div className="text-[12px] uppercase tracking-[0.18em] text-muted-foreground mb-2">Portfolio</div>
        <h1 className="font-display text-[40px] leading-tight font-semibold tracking-tight">Projects</h1>
        <p className="mt-1.5 text-muted-foreground">Drill down to every dollar tied to each Houston project.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {projects.map((p) => {
          const pct = Math.round((p.spent / p.budget) * 100);
          const margin = ((p.revenue - p.spent) / p.revenue) * 100;
          const remaining = p.budget - p.spent;
          return (
            <div key={p.id} className="glass-card p-6 hover:shadow-elevated transition-shadow group">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-display text-[22px] font-semibold tracking-tight">{p.name}</div>
                  <div className="mt-1 flex items-center gap-1.5 text-[12.5px] text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" /> {p.address}
                  </div>
                </div>
                <span className={`accent-pill ${p.status === "planning" ? "!bg-secondary !text-muted-foreground" : ""}`}>{p.status}</span>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <Mini label="Budget" value={fmtCompact(p.budget)} />
                <Mini label="Spent" value={fmtCompact(p.spent)} />
                <Mini label="Remaining" value={fmtCompact(remaining)} />
              </div>

              <div className="mt-5">
                <div className="flex items-baseline justify-between text-[12px] text-muted-foreground mb-1.5">
                  <span>Budget consumed</span>
                  <span className="font-mono-tab font-medium text-foreground">{pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div className={`h-full ${pct > 90 ? "bg-destructive" : "bg-sunset"}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-border flex items-center justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Margin</div>
                  <div className="font-display text-[24px] font-semibold mt-0.5">{margin.toFixed(1)}%</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Revenue</div>
                  <div className="font-mono-tab font-semibold text-[16px] mt-0.5">{fmt(p.revenue)}</div>
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

const Mini = ({ label, value }: { label: string; value: string }) => (
  <div>
    <div className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{label}</div>
    <div className="font-display text-[20px] font-semibold mt-0.5 font-mono-tab">{value}</div>
  </div>
);

export default Projects;
