import { AppShell } from "@/components/AppShell";
import { transactions, fmt } from "@/lib/finance-data";
import { Filter, Download, Plus, Search } from "lucide-react";
import { Link } from "react-router-dom";

const Expenses = () => (
  <AppShell>
    <div className="px-5 lg:px-10 pt-6 lg:pt-10 max-w-[1400px] mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-[12px] uppercase tracking-[0.18em] text-muted-foreground mb-2">Ledger</div>
          <h1 className="font-display text-[40px] leading-tight font-semibold tracking-tight">Expenses & Income</h1>
          <p className="mt-1.5 text-muted-foreground">Every dollar in and out, organized by project, vendor, and category.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-10 px-4 rounded-xl border border-border bg-card text-[13px] font-medium inline-flex items-center gap-1.5"><Download className="h-4 w-4" /> Export</button>
          <Link to="/new" className="h-10 px-4 rounded-xl bg-foreground text-background text-[13px] font-medium inline-flex items-center gap-1.5"><Plus className="h-4 w-4" /> New entry</Link>
        </div>
      </div>

      <div className="glass-card p-2 mb-4 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input className="w-full h-10 pl-9 pr-3 rounded-lg bg-transparent outline-none text-[14px]" placeholder="Filter by vendor, project, or amount…" />
        </div>
        {["All", "Expenses", "Income", "Checks"].map((t, i) => (
          <button key={t} className={`h-9 px-3.5 rounded-lg text-[13px] font-medium ${i === 0 ? "bg-foreground text-background" : "text-muted-foreground hover:bg-secondary"}`}>{t}</button>
        ))}
        <button className="h-9 w-9 rounded-lg hover:bg-secondary flex items-center justify-center"><Filter className="h-4 w-4" /></button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="grid grid-cols-12 px-6 py-3 text-[11px] uppercase tracking-[0.12em] text-muted-foreground border-b border-border">
          <div className="col-span-1">Date</div>
          <div className="col-span-4">Vendor</div>
          <div className="col-span-3">Project</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-2 text-right">Amount</div>
        </div>
        <div className="divide-y divide-border">
          {transactions.map((t) => (
            <div key={t.id} className="grid grid-cols-12 px-6 py-4 items-center hover:bg-secondary/40 transition-colors">
              <div className="col-span-1 text-[12px] text-muted-foreground">{t.date}</div>
              <div className="col-span-4 flex items-center gap-3">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-[10px] font-semibold ${
                  t.type === "income" ? "bg-success/12 text-success" : t.type === "check" ? "bg-accent-soft text-accent" : "bg-secondary"
                }`}>{t.type === "income" ? "IN" : t.type === "check" ? "CK" : "EX"}</div>
                <div>
                  <div className="text-[14px] font-medium">{t.vendor}</div>
                  {t.status && <div className="text-[11px] text-muted-foreground capitalize">Check · {t.status}</div>}
                </div>
              </div>
              <div className="col-span-3 text-[13px] text-muted-foreground">{t.project}</div>
              <div className="col-span-2"><span className="accent-pill !bg-secondary !text-foreground">{t.category}</span></div>
              <div className={`col-span-2 text-right font-mono-tab font-semibold tabular-nums ${t.amount >= 0 ? "text-success" : ""}`}>
                {t.amount >= 0 ? "+" : ""}{fmt(t.amount)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </AppShell>
);

export default Expenses;
