import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { EntryDrawer } from "@/components/EntryDrawer";
import type { EntryData } from "@/components/EntryDrawer";
import { checks, fmt } from "@/lib/finance-data";
import { Plus, Clock, CheckCircle2, FileImage, Search, X, Edit3, ArrowUpRight, ChevronRight, Hash, CircleHelp } from "lucide-react";

const Checks = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editCheck, setEditCheck] = useState<{ id: string; data: EntryData } | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "cleared">("all");
  const [search, setSearch] = useState("");

  const pending = checks.filter(c => c.status === "pending");
  const cleared = checks.filter(c => c.status === "cleared");
  const totalPending = pending.reduce((s, c) => s + c.amount, 0);

  const filtered = checks.filter(c => {
    if (filter === "pending" && c.status !== "pending") return false;
    if (filter === "cleared" && c.status !== "cleared") return false;
    if (search) {
      const q = search.toLowerCase();
      return c.vendor.toLowerCase().includes(q) || c.num.includes(q) || c.project.toLowerCase().includes(q);
    }
    return true;
  });

  const handleSave = (data: EntryData) => {
    console.log("Save check:", data);
  };

  const handleDelete = (id: string) => {
    console.log("Delete check:", id);
  };

  const openEdit = (c: typeof checks[0]) => {
    setEditCheck({
      id: c.num,
      data: {
        type: "check",
        amount: String(c.amount),
        vendor: c.vendor,
        project: c.project,
        category: "Subcontractor",
        checkNum: c.num,
        date: c.date,
        memo: c.memo,
      },
    });
    setDrawerOpen(true);
  };

  const openAdd = () => {
    setEditCheck(null);
    setDrawerOpen(true);
  };

  return (
    <AppShell>
      <div className="px-5 lg:px-10 pt-6 lg:pt-10 max-w-[1400px] mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-[12px] uppercase tracking-[0.18em] text-muted-foreground mb-2">Disbursements</div>
            <h1 className="font-display text-[40px] leading-tight font-semibold tracking-tight">Checks</h1>
            <p className="mt-1.5 text-muted-foreground">
              {pending.length > 0
                ? `${pending.length} check${pending.length > 1 ? "s" : ""} pending — ${fmt(totalPending)} awaiting clearance.`
                : "Every check issued, with smart reminders for what hasn't cleared."}
            </p>
          </div>
          <button
            onClick={openAdd}
            className="h-10 px-4 rounded-xl bg-foreground text-background text-[13px] font-medium inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" /> Issue check
          </button>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="ink-card p-5 relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(circle_at_30%_20%,white,transparent_50%)]" />
            <div className="relative">
              <div className="text-[11px] uppercase tracking-[0.14em] text-primary-foreground/60">Pending</div>
              <div className="mt-3 font-display text-[34px] font-semibold font-mono-tab">{fmt(totalPending)}</div>
              <div className="text-[12px] text-primary-foreground/55 mt-1">{pending.length} checks awaiting clearance</div>
            </div>
          </div>
          <div className="glass-card p-5">
            <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Cleared · MTD</div>
            <div className="mt-3 font-display text-[34px] font-semibold font-mono-tab">{fmt(cleared.reduce((s, c) => s + c.amount, 0))}</div>
            <div className="text-[12px] text-muted-foreground mt-1">{cleared.length} checks reconciled</div>
          </div>
          <div className="glass-card p-5">
            <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Avg time to clear</div>
            <div className="mt-3 font-display text-[34px] font-semibold font-mono-tab">3.2 <span className="text-muted-foreground text-lg font-normal">days</span></div>
            <div className="text-[12px] text-muted-foreground mt-1">Down from 4.1 last month · <span className="text-success font-medium">improving</span></div>
          </div>
        </div>

        {/* Filter & search bar */}
        <div className="glass-card p-2 mb-4 flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-9 pr-8 rounded-lg bg-transparent outline-none text-[14px]"
              placeholder="Search by vendor, #check, or project…"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 clear-btn">
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
          <div className="flex gap-1 bg-secondary rounded-lg p-1">
            {(["all", "pending", "cleared"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-3 h-7 text-[12px] rounded-md font-medium capitalize ${
                  filter === t ? "bg-card shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t} {t === "pending" && pending.length > 0 && <span className="ml-0.5 text-warning">·{pending.length}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile: card list */}
        <div className="lg:hidden space-y-2.5 mb-6 stagger">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><FileImage className="h-6 w-6" /></div>
              <p className="empty-state-text">No checks match your filters.</p>
            </div>
          ) : (
            filtered.map((c) => (
              <div
                key={c.num}
                className="mobile-card-item group relative"
              >
                <div className="flex items-start gap-3">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                    c.status === "pending" ? "bg-accent-soft" : "bg-success/10"
                  }`}>
                    <FileImage className={`h-[17px] w-[17px] ${c.status === "pending" ? "text-accent" : "text-success"}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-medium text-[14px] truncate">{c.vendor}</div>
                      <div className="font-mono-tab font-semibold text-[15px] tabular-nums shrink-0">{fmt(c.amount)}</div>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[12px] text-muted-foreground">#{c.num}</span>
                      <span className="text-[12px] text-muted-foreground">·</span>
                      <span className="text-[12px] text-muted-foreground truncate">{c.project}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        {c.status === "pending" ? (
                          <span className="badge-pending !text-[10.5px] !px-2 !py-0.5"><Clock className="h-2.5 w-2.5" /> Pending · {c.age}d</span>
                        ) : (
                          <span className="badge-cleared !text-[10.5px] !px-2 !py-0.5"><CheckCircle2 className="h-2.5 w-2.5" /> Cleared</span>
                        )}
                        <span className="text-[11px] text-muted-foreground">{c.date}</span>
                      </div>
                    </div>
                    {c.status === "pending" && (
                      <div className="mt-2.5 flex items-center gap-2 row-actions">
                        <button
                          onClick={() => openEdit(c)}
                          className="h-7 px-2.5 rounded-lg bg-foreground text-background text-[11px] font-medium inline-flex items-center gap-1 hover:opacity-90"
                        >
                          <CheckCircle2 className="h-3 w-3" /> Mark cleared
                        </button>
                        <button
                          onClick={() => openEdit(c)}
                          className="h-7 w-7 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground"
                        >
                          <Edit3 className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop: table */}
        <div className="hidden lg:block glass-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <div className="font-display text-[20px] font-semibold">Check register</div>
          </div>
          <div className="divide-y divide-border">
            {filtered.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground text-[14px]">No checks match your filters.</div>
            ) : (
              filtered.map((c) => (
                <div key={c.num} className="group px-6 py-4 flex items-center gap-4 hover:bg-secondary/40 transition-colors cursor-pointer" onClick={() => openEdit(c)}>
                  <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${
                    c.status === "pending" ? "bg-accent-soft" : "bg-success/10"
                  }`}>
                    <FileImage className={`h-[18px] w-[18px] ${c.status === "pending" ? "text-accent" : "text-success"}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[14px] font-medium">{c.vendor}</div>
                    <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground mt-0.5">
                      <Hash className="h-3 w-3" />
                      <span>{c.num}</span>
                      <span>·</span>
                      <span className="truncate">{c.project}</span>
                      <span>·</span>
                      <span>{c.date}</span>
                    </div>
                    {c.memo && (
                      <div className="text-[11.5px] text-muted-foreground/70 mt-0.5 truncate max-w-md">
                        {c.memo}
                      </div>
                    )}
                  </div>
                  <div className="hidden xl:flex items-center gap-1.5 text-[12px]">
                    {c.status === "pending" ? (
                      <span className="badge-pending"><Clock className="h-3 w-3" /> Pending · {c.age}d</span>
                    ) : (
                      <span className="badge-cleared"><CheckCircle2 className="h-3 w-3" /> Cleared</span>
                    )}
                  </div>
                  {c.status === "pending" && (
                    <div className="row-actions ml-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); openEdit(c); }}
                        className="h-8 px-3 rounded-lg bg-success/10 text-success text-[11px] font-medium inline-flex items-center gap-1 hover:bg-success/20 transition-colors"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> Clear
                      </button>
                    </div>
                  )}
                  <div className="font-mono-tab font-semibold tabular-nums text-[15px] w-28 text-right">{fmt(c.amount)}</div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Guided hint */}
        {pending.length > 0 && (
          <div className="mt-6 flex items-start gap-3 p-4 rounded-2xl bg-accent-soft/60 border border-accent/10">
            <CircleHelp className="h-5 w-5 text-accent shrink-0 mt-0.5" />
            <div className="text-[12.5px] text-foreground/80 leading-relaxed">
              <span className="font-semibold text-foreground">Tip:</span> Checks typically clear in 2–5 business days. If a check has been pending for over 7 days, consider following up with the payee or your bank.
            </div>
          </div>
        )}
      </div>

      {/* Entry Drawer for add/edit */}
      <EntryDrawer
        open={drawerOpen}
        onClose={() => { setDrawerOpen(false); setEditCheck(null); }}
        defaultType="check"
        editData={editCheck ? { ...editCheck.data, id: editCheck.id } : undefined}
        title={editCheck ? "Edit Check" : "Issue Check"}
        onSave={handleSave}
        onDelete={editCheck ? handleDelete : undefined}
      />
    </AppShell>
  );
};

export default Checks;