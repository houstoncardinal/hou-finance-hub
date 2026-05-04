import { AppShell } from "@/components/AppShell";
import { checks, fmt } from "@/lib/finance-data";
import { Plus, Clock, CheckCircle2, FileImage } from "lucide-react";

const Checks = () => {
  const pending = checks.filter(c => c.status === "pending");
  const cleared = checks.filter(c => c.status === "cleared");
  const totalPending = pending.reduce((s, c) => s + c.amount, 0);

  return (
    <AppShell>
      <div className="px-5 lg:px-10 pt-6 lg:pt-10 max-w-[1400px] mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-[12px] uppercase tracking-[0.18em] text-muted-foreground mb-2">Disbursements</div>
            <h1 className="font-display text-[40px] leading-tight font-semibold tracking-tight">Checks</h1>
            <p className="mt-1.5 text-muted-foreground">Every check issued, with smart reminders for what hasn't cleared.</p>
          </div>
          <button className="h-10 px-4 rounded-xl bg-foreground text-background text-[13px] font-medium inline-flex items-center gap-1.5"><Plus className="h-4 w-4" /> Issue check</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="ink-card p-5">
            <div className="text-[11px] uppercase tracking-[0.14em] text-primary-foreground/60">Pending</div>
            <div className="mt-3 font-display text-[34px] font-semibold font-mono-tab">{fmt(totalPending)}</div>
            <div className="text-[12px] text-primary-foreground/55 mt-1">{pending.length} checks awaiting clearance</div>
          </div>
          <div className="glass-card p-5">
            <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Cleared · MTD</div>
            <div className="mt-3 font-display text-[34px] font-semibold font-mono-tab">{fmt(cleared.reduce((s, c) => s + c.amount, 0))}</div>
            <div className="text-[12px] text-muted-foreground mt-1">{cleared.length} checks reconciled</div>
          </div>
          <div className="glass-card p-5">
            <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Avg time to clear</div>
            <div className="mt-3 font-display text-[34px] font-semibold font-mono-tab">3.2 <span className="text-muted-foreground text-lg font-normal">days</span></div>
            <div className="text-[12px] text-muted-foreground mt-1">Down from 4.1 last month</div>
          </div>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <div className="font-display text-[20px] font-semibold">Check register</div>
            <div className="flex gap-1 bg-secondary rounded-lg p-1">
              {["All", "Pending", "Cleared"].map((t, i) => (
                <button key={t} className={`px-3 h-7 text-[12px] rounded-md font-medium ${i === 0 ? "bg-card shadow-sm" : "text-muted-foreground"}`}>{t}</button>
              ))}
            </div>
          </div>
          <div className="divide-y divide-border">
            {checks.map((c) => (
              <div key={c.num} className="px-6 py-4 flex items-center gap-4 hover:bg-secondary/40 transition-colors">
                <div className="h-11 w-11 rounded-xl bg-secondary flex items-center justify-center">
                  <FileImage className="h-[18px] w-[18px] text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[14px] font-medium">{c.vendor}</div>
                  <div className="text-[12px] text-muted-foreground truncate">#{c.num} · {c.project} · {c.date}</div>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-[12px]">
                  {c.status === "pending" ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-soft text-accent font-medium"><Clock className="h-3 w-3" /> Pending</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/12 text-success font-medium"><CheckCircle2 className="h-3 w-3" /> Cleared</span>
                  )}
                </div>
                <div className="font-mono-tab font-semibold tabular-nums text-[15px] w-28 text-right">{fmt(c.amount)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default Checks;
