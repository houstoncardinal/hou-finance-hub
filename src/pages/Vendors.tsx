import { AppShell } from "@/components/AppShell";
import { vendors, fmt } from "@/lib/finance-data";
import { Plus } from "lucide-react";

const Vendors = () => (
  <AppShell>
    <div className="px-5 lg:px-10 pt-6 lg:pt-10 max-w-[1400px] mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-[12px] uppercase tracking-[0.18em] text-muted-foreground mb-2">Directory</div>
          <h1 className="font-display text-[40px] leading-tight font-semibold tracking-tight">Vendors & Contractors</h1>
          <p className="mt-1.5 text-muted-foreground">Centralized history, balances, and 1099 status for every partner.</p>
        </div>
        <button className="h-10 px-4 rounded-xl bg-foreground text-background text-[13px] font-medium inline-flex items-center gap-1.5"><Plus className="h-4 w-4" /> Add vendor</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vendors.map((v) => (
          <div key={v.name} className="glass-card p-5 hover:shadow-elevated transition-shadow">
            <div className="flex items-start gap-3">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center font-display font-semibold text-ink">
                {v.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-[15px] truncate">{v.name}</div>
                <div className="text-[12px] text-muted-foreground">{v.category}</div>
              </div>
              {v.on1099 && <span className="accent-pill">1099</span>}
            </div>
            <div className="hairline my-4" />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">YTD paid</div>
                <div className="font-display text-[18px] font-semibold mt-0.5 font-mono-tab">{fmt(v.ytd)}</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Open balance</div>
                <div className={`font-display text-[18px] font-semibold mt-0.5 font-mono-tab ${v.open > 0 ? "text-accent" : ""}`}>{fmt(v.open)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </AppShell>
);

export default Vendors;
