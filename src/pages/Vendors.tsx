import { AppShell } from "@/components/AppShell";
import { vendors, fmt, fmtCompact } from "@/lib/finance-data";
import { Plus, ArrowUpRight, ArrowDownRight, AlertTriangle } from "lucide-react";

const Vendors = () => (
  <AppShell>
    <div className="px-5 lg:px-10 pt-6 lg:pt-10 max-w-[1480px] mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-7">
        <div>
          <div className="text-[12px] uppercase tracking-[0.18em] text-muted-foreground mb-2">Intelligence</div>
          <h1 className="font-display text-[40px] leading-tight font-semibold tracking-tight">Vendors & Subs</h1>
          <p className="mt-1.5 text-muted-foreground">Spend trends, frequency, 1099 status — all in one view.</p>
        </div>
        <button className="h-10 px-4 rounded-xl bg-foreground text-background text-[13px] font-medium inline-flex items-center gap-1.5"><Plus className="h-4 w-4" /> Add vendor</button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="grid grid-cols-12 px-6 py-3 text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground border-b border-border">
          <div className="col-span-4">Vendor</div>
          <div className="col-span-2">Frequency</div>
          <div className="col-span-2 text-right">YTD</div>
          <div className="col-span-2 text-right">Open balance</div>
          <div className="col-span-2 text-right">30d trend</div>
        </div>
        <div className="divide-y divide-border">
          {vendors.map(v => (
            <div key={v.name} className="grid grid-cols-12 items-center px-6 py-4 hover:bg-secondary/40 transition-colors">
              <div className="col-span-4 flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center text-[12px] font-semibold text-ink">
                  {v.name.split(" ").slice(0, 2).map(w => w[0]).join("")}
                </div>
                <div className="min-w-0">
                  <div className="text-[14px] font-medium truncate flex items-center gap-2">
                    {v.name}
                    {v.on1099 && <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground font-semibold">1099</span>}
                  </div>
                  <div className="text-[12px] text-muted-foreground flex items-center gap-2">
                    {v.category}
                    {v.flag === "rising" && <span className="inline-flex items-center gap-1 text-destructive font-medium"><AlertTriangle className="h-3 w-3" />Rising costs</span>}
                    {v.flag === "duplicate" && <span className="inline-flex items-center gap-1 text-warning font-medium"><AlertTriangle className="h-3 w-3" />Possible duplicate</span>}
                  </div>
                </div>
              </div>
              <div className="col-span-2 text-[13px] text-muted-foreground">{v.freq}</div>
              <div className="col-span-2 text-right font-mono-tab font-semibold tabular-nums">{fmt(v.ytd)}</div>
              <div className={`col-span-2 text-right font-mono-tab font-semibold tabular-nums ${v.open > 0 ? "text-accent" : "text-muted-foreground"}`}>{v.open > 0 ? fmt(v.open) : "—"}</div>
              <div className={`col-span-2 text-right font-mono-tab font-semibold inline-flex items-center justify-end gap-1 ${v.trend > 0 ? "text-destructive" : "text-success"}`}>
                {v.trend > 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                {Math.abs(v.trend).toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </AppShell>
);

export default Vendors;
