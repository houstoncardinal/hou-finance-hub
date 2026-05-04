import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { EntryDrawer } from "@/components/EntryDrawer";
import type { EntryData } from "@/components/EntryDrawer";
import { transactions, fmt, fmtCompact } from "@/lib/finance-data";
import { Filter, Download, Plus, Search, X, Edit3, ArrowUpRight, ArrowDownRight, ChevronRight, Receipt, TrendingUp, FileCheck2 } from "lucide-react";

const Expenses = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editTxn, setEditTxn] = useState<{ id: string; data: EntryData } | null>(null);
  const [filter, setFilter] = useState<"all" | "expense" | "income" | "check">("all");
  const [search, setSearch] = useState("");

  const expenses = transactions.filter(t => t.amount < 0 && t.type === "expense");
  const income = transactions.filter(t => t.amount > 0);
  const checkTxns = transactions.filter(t => t.type === "check");

  const totalExpenses = expenses.reduce((s, t) => s + Math.abs(t.amount), 0);
  const totalIncome = income.reduce((s, t) => s + t.amount, 0);

  const filtered = transactions.filter(t => {
    if (filter !== "all" && t.type !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return t.vendor.toLowerCase().includes(q) || t.project.toLowerCase().includes(q) || t.category.toLowerCase().includes(q) || t.memo?.toLowerCase().includes(q);
    }
    return true;
  });

  const handleSave = (data: EntryData) => {
    console.log("Save txn:", data);
  };

  const handleDelete = (id: string) => {
    console.log("Delete txn:", id);
  };

  const openEdit = (t: typeof transactions[0]) => {
    setEditTxn({
      id: t.id,
      data: {
        type: t.type,
        amount: String(Math.abs(t.amount)),
        vendor: t.vendor,
        project: t.project,
        category: t.category,
        checkNum: t.checkNum ?? "",
        date: t.date,
        memo: t.memo ?? "",
      },
    });
    setDrawerOpen(true);
  };

  const openAdd = () => {
    setEditTxn(null);
    setDrawerOpen(true);
  };

  const typeIcon = (type: string) => {
    switch (type) {
      case "income": return TrendingUp;
      case "check": return FileCheck2;
      default: return Receipt;
    }
  };

  const typeStyles = (type: string) => {
    switch (type) {
      case "income": return "bg-success/12 text-success";
      case "check": return "bg-accent-soft text-accent";
      default: return "bg-secondary";
    }
  };

  const typeLabel = (type: string) => {
    switch (type) {
      case "income": return "IN";
      case "check": return "CK";
      default: return "EX";
    }
  };

  return (
    <AppShell>
      <div className="px-5 lg:px-10 pt-6 lg:pt-10 max-w-[1400px] mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-[12px] uppercase tracking-[0.18em] text-muted-foreground mb-2">Ledger</div>
            <h1 className="font-display text-[40px] leading-tight font-semibold tracking-tight">Expenses & Income</h1>
            <p className="mt-1.5 text-muted-foreground">Every dollar in and out, organized by project, vendor, and category.</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="h-10 px-4 rounded-xl border border-border bg-card text-[13px] font-medium inline-flex items-center gap-1.5 hover:bg-secondary transition-colors">
              <Download className="h-4 w-4" /> Export
            </button>
            <button
              onClick={openAdd}
              className="h-10 px-4 rounded-xl bg-foreground text-background text-[13px] font-medium inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity"
            >
              <Plus className="h-4 w-4" /> New entry
            </button>
          </div>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="glass-card p-4 lg:p-5">
            <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">All transactions</div>
            <div className="mt-2 font-display text-[26px] lg:text-[30px] font-semibold font-mono-tab">{transactions.length}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">Across 15 entries</div>
          </div>
          <div className="glass-card p-4 lg:p-5">
            <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Expenses · MTD</div>
            <div className="mt-2 font-display text-[26px] lg:text-[30px] font-semibold font-mono-tab">{fmt(totalExpenses)}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3 text-destructive" /> <span className="text-destructive">+11%</span> vs last month
            </div>
          </div>
          <div className="glass-card p-4 lg:p-5">
            <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Income · MTD</div>
            <div className="mt-2 font-display text-[26px] lg:text-[30px] font-semibold font-mono-tab">{fmt(totalIncome)}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3 text-success" /> <span className="text-success">+22%</span> vs last month
            </div>
          </div>
          <div className="ink-card p-4 lg:p-5 relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(circle_at_30%_20%,white,transparent_50%)]" />
            <div className="relative">
              <div className="text-[11px] uppercase tracking-[0.14em] text-primary-foreground/60">Net · MTD</div>
              <div className="mt-2 font-display text-[26px] lg:text-[30px] font-semibold font-mono-tab">{fmt(totalIncome - totalExpenses)}</div>
              <div className="text-[11px] text-primary-foreground/55 mt-0.5">
                {totalIncome > totalExpenses ? "Positive cash month" : "Net negative"}
              </div>
            </div>
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
              placeholder="Filter by vendor, project, or amount…"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 clear-btn">
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
          {(["all", "expense", "income", "check"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`h-9 px-3.5 rounded-lg text-[13px] font-medium capitalize ${
                filter === t ? "bg-foreground text-background" : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Mobile: card list */}
        <div className="lg:hidden space-y-2.5 mb-6 stagger">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><Receipt className="h-6 w-6" /></div>
              <p className="empty-state-text">No transactions match your filters.</p>
            </div>
          ) : (
            filtered.map((t) => {
              const Icon = typeIcon(t.type);
              return (
                <div
                  key={t.id}
                  className="mobile-card-item group"
                  onClick={() => openEdit(t)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${typeStyles(t.type)}`}>
                      <Icon className="h-[17px] w-[17px]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-medium text-[14px] truncate">{t.vendor}</div>
                        <div className={`font-mono-tab font-semibold text-[15px] tabular-nums shrink-0 ${t.amount >= 0 ? "text-success" : ""}`}>
                          {t.amount >= 0 ? "+" : "−"}{fmtCompact(Math.abs(t.amount))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[12px] text-muted-foreground">{t.date}</span>
                        <span className="text-[12px] text-muted-foreground">·</span>
                        <span className="text-[12px] text-muted-foreground truncate">{t.project}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="accent-pill !bg-secondary !text-foreground !text-[10px] !px-2 !py-0.5">{t.category}</span>
                        {t.type === "check" && t.checkNum && (
                          <span className="text-[10px] text-muted-foreground">#{t.checkNum}</span>
                        )}
                      </div>
                      {t.status && (
                        <span className={`inline-flex items-center gap-1 mt-1.5 text-[10px] font-medium ${
                          t.status === "pending" ? "text-accent" : "text-success"
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${t.status === "pending" ? "bg-accent" : "bg-success"}`} />
                          {t.status === "pending" ? "Pending" : "Cleared"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop: table */}
        <div className="hidden lg:block glass-card overflow-hidden">
          <div className="grid grid-cols-12 px-6 py-3 text-[11px] uppercase tracking-[0.12em] text-muted-foreground border-b border-border">
            <div className="col-span-1">Date</div>
            <div className="col-span-4">Vendor</div>
            <div className="col-span-2">Project</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-1 text-center">Type</div>
            <div className="col-span-2 text-right">Amount</div>
          </div>
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground text-[14px]">No transactions match your filters.</div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map((t) => {
                const Icon = typeIcon(t.type);
                return (
                  <div
                    key={t.id}
                    className="group grid grid-cols-12 px-6 py-4 items-center hover:bg-secondary/40 transition-colors cursor-pointer"
                    onClick={() => openEdit(t)}
                  >
                    <div className="col-span-1 text-[12px] text-muted-foreground font-mono-tab">{t.date}</div>
                    <div className="col-span-4 flex items-center gap-3 min-w-0">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-[10px] font-semibold ${typeStyles(t.type)}`}>
                        <Icon className="h-[15px] w-[15px]" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[14px] font-medium truncate">{t.vendor}</div>
                        {t.memo && (
                          <div className="text-[11.5px] text-muted-foreground/70 truncate">{t.memo}</div>
                        )}
                      </div>
                    </div>
                    <div className="col-span-2 text-[13px] text-muted-foreground truncate">{t.project}</div>
                    <div className="col-span-2">
                      <span className="accent-pill !bg-secondary !text-foreground">{t.category}</span>
                    </div>
                    <div className="col-span-1 flex justify-center">
                      {t.status ? (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          t.status === "pending" ? "bg-accent-soft text-accent" : "bg-success/12 text-success"
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${t.status === "pending" ? "bg-accent" : "bg-success"}`} />
                          {t.status === "pending" ? "Pending" : "Cleared"}
                        </span>
                      ) : (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${typeStyles(t.type)}`}>
                          {typeLabel(t.type)}
                        </span>
                      )}
                    </div>
                    <div className={`col-span-2 text-right font-mono-tab font-semibold tabular-nums flex items-center justify-end gap-2 ${t.amount >= 0 ? "text-success" : ""}`}>
                      {t.amount >= 0 ? "+" : "−"}{fmt(t.amount)}
                      <Edit3 className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Entry Drawer for add/edit */}
      <EntryDrawer
        open={drawerOpen}
        onClose={() => { setDrawerOpen(false); setEditTxn(null); }}
        defaultType="expense"
        editData={editTxn ? { ...editTxn.data, id: editTxn.id } : undefined}
        title={editTxn ? "Edit Transaction" : "New Transaction"}
        onSave={handleSave}
        onDelete={editTxn ? handleDelete : undefined}
      />
    </AppShell>
  );
};

export default Expenses;