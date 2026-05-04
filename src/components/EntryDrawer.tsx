import { useState, useEffect, useRef } from "react";
import { X, Check, Receipt, FileCheck2, TrendingUp, Hash, CalendarDays, MessageSquare, Loader2, CheckCircle2, Trash2, Building2, User, Search, Plus, ChevronDown } from "lucide-react";
import { recentVendors, recentProjects, categories } from "@/lib/finance-data";

export interface EntryData {
  type: "expense" | "check" | "income";
  amount: string;
  vendor: string;
  project: string;
  category: string;
  checkNum?: string;
  date: string;
  memo: string;
}

interface EntryDrawerProps {
  open: boolean;
  onClose: () => void;
  defaultType?: "expense" | "check" | "income";
  editData?: Partial<EntryData & { id?: string }>;
  title?: string;
  onSave?: (data: EntryData) => void;
  onDelete?: (id: string) => void;
}

const today = new Date().toISOString().split("T")[0];

const TYPE_THEME = {
  expense: { label: "Expense", icon: Receipt, accent: "", accentBg: "bg-accent-soft", accentBorder: "border-accent/20", saveColor: "bg-accent", gradient: "from-accent to-accent/80" },
  check: { label: "Check", icon: FileCheck2, accent: "", accentBg: "bg-accent-soft", accentBorder: "border-accent/20", saveColor: "bg-accent", gradient: "from-accent to-accent/80" },
  income: { label: "Income", icon: TrendingUp, accent: "", accentBg: "bg-success/8", accentBorder: "border-success/20", saveColor: "bg-success", gradient: "from-success to-success/80" },
};

export const EntryDrawer = ({ open, onClose, defaultType = "expense", editData, title, onSave, onDelete }: EntryDrawerProps) => {
  const [type, setType] = useState<"expense" | "check" | "income">(defaultType);
  const [amount, setAmount] = useState(editData?.amount ?? "");
  const [vendor, setVendor] = useState(editData?.vendor ?? "");
  const [vendorSearch, setVendorSearch] = useState("");
  const [vendorOpen, setVendorOpen] = useState(false);
  const [customVendor, setCustomVendor] = useState(false);
  const [project, setProject] = useState(editData?.project ?? "");
  const [projectOpen, setProjectOpen] = useState(false);
  const [projectSearch, setProjectSearch] = useState("");
  const [customProject, setCustomProject] = useState(false);
  const [category, setCategory] = useState(editData?.category ?? "Concrete");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [customCategory, setCustomCategory] = useState(false);
  const [checkNum, setCheckNum] = useState(editData?.checkNum ?? "");
  const [date, setDate] = useState(editData?.date ?? today);
  const [memo, setMemo] = useState(editData?.memo ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const amountRef = useRef<HTMLInputElement>(null);
  const vendorRef = useRef<HTMLDivElement>(null);
  const projectRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);

  const theme = TYPE_THEME[type];
  const Icon = theme.icon;

  useEffect(() => {
    if (open) {
      setSaved(false); setSaving(false);
      if (editData) {
        setType(editData.type ?? defaultType);
        setAmount(editData.amount ?? "");
        setVendor(editData.vendor ?? "");
        setProject(editData.project ?? "");
        setCategory(editData.category ?? "Concrete");
        setCheckNum(editData.checkNum ?? "");
        setMemo(editData.memo ?? "");
        setDate(editData.date ?? today);
      } else {
        setType(defaultType); setAmount(""); setVendor(""); setProject(""); setCategory("Concrete"); setCheckNum(""); setMemo(""); setDate(today);
      }
      setTimeout(() => amountRef.current?.focus(), 200);
    }
  }, [open, defaultType, editData]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (vendorRef.current && !vendorRef.current.contains(e.target as Node)) setVendorOpen(false);
      if (projectRef.current && !projectRef.current.contains(e.target as Node)) setProjectOpen(false);
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) setCategoryOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const displayAmount = amount ? Number(amount.replace(/,/g, "")).toLocaleString("en-US") : "";
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value.replace(/[^0-9.]/g, ""));
  const canSave = amount && vendor && project;

  const handleSave = () => {
    if (!canSave) return;
    setSaving(true);
    setTimeout(() => {
      setSaving(false); setSaved(true);
      onSave?.({ type, amount, vendor, project, category, checkNum, date, memo });
      setTimeout(() => onClose(), 600);
    }, 600);
  };

  const handleDelete = () => { if (editData?.id && onDelete) { onDelete(editData.id); onClose(); } };
  const isEdit = !!editData?.id;

  // Filtered lists
  const filteredVendors = recentVendors.filter(v => v.toLowerCase().includes(vendorSearch.toLowerCase()));
  const filteredProjects = recentProjects.filter(p => p.toLowerCase().includes(projectSearch.toLowerCase()));
  const filteredCategories = categories.filter(c => c.toLowerCase().includes(categorySearch.toLowerCase()));

  // --- DROPDOWN COMPONENT ---
  const Dropdown = ({ items, selected, onSelect, search, onSearchChange, open, setOpen, placeholder, onAddNew, addNewLabel, refObj }: {
    items: string[]; selected: string; onSelect: (v: string) => void;
    search: string; onSearchChange: (v: string) => void;
    open: boolean; setOpen: (v: boolean) => void;
    placeholder: string; onAddNew?: () => void; addNewLabel?: string;
    refObj: React.RefObject<HTMLDivElement>;
  }) => (
    <div ref={refObj} className="relative">
      <button type="button" onClick={() => setOpen(!open)}
        className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-left border transition-all ${
          selected ? "border-accent/30 bg-accent-soft" : "border-border bg-card hover:border-accent/20"
        }`}
      >
        <span className={`text-[13px] flex-1 ${selected ? "font-medium text-foreground" : "text-muted-foreground"}`}>
          {selected || placeholder}
        </span>
        <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute z-20 mt-1 w-full rounded-xl bg-card border border-border shadow-xl animate-fade-in overflow-hidden">
          <div className="p-2 border-b border-border">
            <div className="flex items-center gap-2 px-2 h-8 rounded-lg bg-secondary/60">
              <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <input value={search} onChange={e => onSearchChange(e.target.value)} className="bg-transparent outline-none text-[12px] w-full" placeholder={`Search ${placeholder.toLowerCase()}...`} autoFocus />
            </div>
          </div>
          <div className="max-h-[160px] overflow-y-auto py-1">
            {items.length === 0 && (
              <div className="px-3 py-4 text-center text-[11px] text-muted-foreground">No results</div>
            )}
            {items.map(item => (
              <button key={item} type="button" onClick={() => { onSelect(item); setOpen(false); onSearchChange(""); }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-[13px] text-left transition-colors ${
                  selected === item ? "bg-accent-soft text-accent font-medium" : "hover:bg-secondary text-foreground"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${selected === item ? "bg-accent" : "bg-border"}`} />
                {item}
              </button>
            ))}
          </div>
          {onAddNew && (
            <button type="button" onClick={onAddNew}
              className="w-full flex items-center gap-2 px-3 py-2.5 border-t border-border text-[12px] font-medium text-accent hover:bg-accent-soft transition-colors"
            >
              <Plus className="h-3.5 w-3.5" /> {addNewLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm animate-fade-backdrop" onClick={onClose} aria-hidden />
      <div className="entry-sheet animate-slide-up lg:animate-scale-in" role="dialog" aria-modal aria-label={title ?? (isEdit ? "Edit Entry" : "New Entry")}>
        <div className="flex justify-center pt-2.5 pb-0 lg:hidden"><div className="h-1 w-10 rounded-full bg-border" /></div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-3 pb-3 lg:pt-5">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl flex items-center justify-center bg-accent-soft"><Icon className="h-4 w-4 text-accent" /></div>
            <div>
              <p className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground">{isEdit ? "Edit" : "Quick capture"}</p>
              <h2 className="font-display text-[17px] font-semibold tracking-tight leading-tight">{title ?? (isEdit ? "Edit Transaction" : "New Entry")}</h2>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {isEdit && onDelete && <button onClick={handleDelete} className="h-8 w-8 rounded-xl bg-secondary hover:bg-accent-soft hover:text-accent flex items-center justify-center transition-colors"><Trash2 className="h-[15px] w-[15px]" /></button>}
            <button onClick={onClose} className="h-8 w-8 rounded-xl bg-secondary hover:bg-border/60 flex items-center justify-center transition-colors"><X className="h-[15px] w-[15px]" /></button>
          </div>
        </div>

        {/* Content — no scroll */}
        <div className="px-5 pb-5 space-y-3">
          {/* Type selector */}
          <div className="flex gap-1.5">
            {(["expense", "check", "income"] as const).map(t => {
              const Ti = TYPE_THEME[t].icon;
              const isA = type === t;
              return (
                <button key={t} onClick={() => setType(t)}
                  className={`flex-1 py-2 rounded-xl text-[11px] font-medium flex items-center justify-center gap-1.5 transition-all ${
                    isA ? "bg-accent text-white shadow-sm" : "bg-secondary/60 text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  <Ti className="h-3.5 w-3.5" strokeWidth={2} />
                  <span>{TYPE_THEME[t].label}</span>
                </button>
              );
            })}
          </div>

          {/* Amount */}
          <div className="flex items-center gap-3 rounded-xl px-4 py-3 border-2 border-border bg-card">
            <span className="font-display text-[28px] font-semibold text-muted-foreground leading-none">$</span>
            <input ref={amountRef} inputMode="decimal" placeholder="0.00" value={displayAmount} onChange={handleAmountChange}
              className="bg-transparent outline-none w-full font-display text-[32px] font-semibold tracking-tight" aria-label="Amount" />
          </div>

          {/* Vendor dropdown */}
          <Dropdown items={filteredVendors} selected={vendor} onSelect={v => { setVendor(v); setCustomVendor(false); }}
            search={vendorSearch} onSearchChange={setVendorSearch} open={vendorOpen} setOpen={setVendorOpen}
            placeholder="Select vendor / payee..." refObj={vendorRef}
            onAddNew={() => { setCustomVendor(true); setVendorOpen(false); setVendor(""); setVendorSearch(""); }}
            addNewLabel="Add new vendor..." />

          {/* Custom vendor input */}
          {customVendor && (
            <div className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 border border-accent/30 bg-accent-soft animate-fade-in">
              <User className="h-4 w-4 text-accent shrink-0" />
              <input value={vendor} onChange={e => setVendor(e.target.value)} className="bg-transparent outline-none text-[13px] w-full" placeholder="Enter vendor name..." autoFocus />
              {vendor && <button onClick={() => { setCustomVendor(false); setVendor(""); }} className="text-[10px] text-muted-foreground hover:text-foreground">Cancel</button>}
            </div>
          )}

          {/* Project dropdown */}
          <Dropdown items={filteredProjects} selected={project} onSelect={p => { setProject(p); setCustomProject(false); }}
            search={projectSearch} onSearchChange={setProjectSearch} open={projectOpen} setOpen={setProjectOpen}
            placeholder="Select project..." refObj={projectRef}
            onAddNew={() => { setCustomProject(true); setProjectOpen(false); setProject(""); setProjectSearch(""); }}
            addNewLabel="Add new project..." />

          {/* Custom project input */}
          {customProject && (
            <div className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 border border-accent/30 bg-accent-soft animate-fade-in">
              <Building2 className="h-4 w-4 text-accent shrink-0" />
              <input value={project} onChange={e => setProject(e.target.value)} className="bg-transparent outline-none text-[13px] w-full" placeholder="Enter project name..." autoFocus />
              {project && <button onClick={() => { setCustomProject(false); setProject(""); }} className="text-[10px] text-muted-foreground hover:text-foreground">Cancel</button>}
            </div>
          )}

          {/* Category dropdown */}
          <Dropdown items={filteredCategories} selected={category} onSelect={setCategory}
            search={categorySearch} onSearchChange={setCategorySearch} open={categoryOpen} setOpen={setCategoryOpen}
            placeholder="Select category..." refObj={categoryRef}
            onAddNew={() => { setCustomCategory(true); setCategoryOpen(false); setCategory(""); setCategorySearch(""); }}
            addNewLabel="Add new category..." />

          {/* Custom category input */}
          {customCategory && (
            <div className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 border border-accent/30 bg-accent-soft animate-fade-in">
              <input value={category} onChange={e => setCategory(e.target.value)} className="bg-transparent outline-none text-[13px] w-full" placeholder="Enter category name..." autoFocus />
              {category && <button onClick={() => { setCustomCategory(false); }} className="text-[10px] text-muted-foreground hover:text-foreground">Done</button>}
            </div>
          )}

          {/* Check number + Date + Memo row */}
          <div className="flex gap-2">
            {type === "check" && (
              <div className="flex items-center gap-1.5 rounded-xl px-3 h-10 bg-secondary/60 border border-transparent shrink-0">
                <Hash className="h-3.5 w-3.5 text-accent shrink-0" />
                <input className="bg-transparent outline-none text-[12px] font-mono-tab w-16" placeholder="#" value={checkNum} onChange={e => setCheckNum(e.target.value)} inputMode="numeric" />
              </div>
            )}
            <div className="flex items-center gap-1.5 rounded-xl px-3 h-10 bg-secondary/60 border border-transparent shrink-0">
              <CalendarDays className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <input type="date" className="bg-transparent outline-none text-[12px] font-medium w-full" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div className="flex-1 flex items-center gap-1.5 rounded-xl px-3 h-10 bg-secondary/60 border border-transparent">
              <MessageSquare className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <input className="bg-transparent outline-none text-[12px] w-full" placeholder="Memo (optional)" value={memo} onChange={e => setMemo(e.target.value)} />
            </div>
          </div>

          {/* Save */}
          <button onClick={handleSave} disabled={!canSave || saving || saved}
            className={`w-full h-12 rounded-2xl font-semibold text-[14px] flex items-center justify-center gap-2 transition-all ${
              saved ? "bg-success text-white" : canSave ? "bg-accent text-white shadow-lg hover:opacity-90 active:scale-[0.98]" : "bg-secondary text-muted-foreground cursor-not-allowed"
            }`}
          >
            {saved ? <><CheckCircle2 className="h-5 w-5 animate-check-pop" /> Saved!</>
            : saving ? <><Loader2 className="h-5 w-5 animate-spin" /> Saving…</>
            : <><span>{isEdit ? "Update" : "Save"} {TYPE_THEME[type].label}</span>{amount && <span className="opacity-60 font-mono-tab">· ${displayAmount}</span>}</>}
          </button>

          {!canSave && !saving && !saved && <p className="text-center text-[10px] text-muted-foreground">{!amount ? "Enter an amount" : !vendor ? "Select a vendor" : "Select a project"}</p>}
        </div>

        <div className={`h-1 rounded-b-3xl bg-gradient-to-r ${theme.gradient}`} />
      </div>
    </>
  );
};