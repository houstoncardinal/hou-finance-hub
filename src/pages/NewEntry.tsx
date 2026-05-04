import { useState, useRef } from "react";
import { AppShell } from "@/components/AppShell";
import { Mic, Camera, Receipt, FileCheck2, TrendingUp, Sparkles, X, ChevronRight, Hash, CalendarDays, MessageSquare, ArrowLeft, User, Building2, CircleDollarSign, Check, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { recentVendors, recentProjects, categories } from "@/lib/finance-data";

const TYPE_THEME = {
  expense: {
    label: "Expense",
    icon: Receipt,
    accent: "text-destructive",
    accentBg: "bg-destructive/8",
    accentBorder: "border-destructive/20",
    accentFill: "bg-destructive/10",
    selectedChip: "bg-destructive text-white border-destructive",
    gradient: "from-red-500 to-red-600",
    saveColor: "bg-destructive hover:bg-destructive/90",
    badge: "text-destructive font-medium",
    hintText: "text-destructive/70",
    bgLight: "bg-destructive/5",
  },
  check: {
    label: "Check",
    icon: FileCheck2,
    accent: "text-accent",
    accentBg: "bg-accent-soft",
    accentBorder: "border-accent/25",
    accentFill: "bg-accent-soft",
    selectedChip: "bg-accent text-white border-accent",
    gradient: "from-amber-500 to-orange-500",
    saveColor: "bg-sunset",
    badge: "text-accent font-medium",
    hintText: "text-accent/70",
    bgLight: "bg-accent-soft/50",
  },
  income: {
    label: "Income",
    icon: TrendingUp,
    accent: "text-success",
    accentBg: "bg-success/8",
    accentBorder: "border-success/20",
    accentFill: "bg-success/10",
    selectedChip: "bg-success text-white border-success",
    gradient: "from-green-500 to-emerald-500",
    saveColor: "bg-success hover:bg-success/90",
    badge: "text-success font-medium",
    hintText: "text-success/70",
    bgLight: "bg-success/5",
  },
};

const today = new Date().toISOString().split("T")[0];

const NewEntry = () => {
  const [step, setStep] = useState(0);
  const [type, setType] = useState<"expense" | "check" | "income">("expense");
  const [amount, setAmount] = useState("");
  const [vendor, setVendor] = useState("");
  const [project, setProject] = useState("");
  const [category, setCategory] = useState("Materials");
  const [checkNum, setCheckNum] = useState("");
  const [date, setDate] = useState(today);
  const [memo, setMemo] = useState("");
  const amountRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const theme = TYPE_THEME[type];
  const Icon = theme.icon;

  const displayAmount = amount
    ? Number(amount.replace(/,/g, "")).toLocaleString("en-US")
    : "";

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, "");
    setAmount(raw);
  };

  const canSubmit = amount && vendor && project;

  const handleSave = () => {
    if (!canSubmit) return;
    console.log("Save:", { type, amount, vendor, project, category, checkNum, date, memo });
    navigate("/");
  };

  // --- STEP 0: Type + Amount ---
  const renderStep0 = () => (
    <div className="animate-fade-in">
      {/* Type selector - beautiful card grid */}
      <div className="mb-6">
        <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-3 font-medium">
          What kind of transaction?
        </p>
        <div className="grid grid-cols-3 gap-3">
          {(["expense", "check", "income"] as const).map((t) => {
            const tTheme = TYPE_THEME[t];
            const TIcon = tTheme.icon;
            const isActive = type === t;
            return (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`relative rounded-2xl p-4 flex flex-col items-center gap-2.5 transition-all ${
                  isActive
                    ? `${tTheme.accentBg} shadow-lg scale-[1.02]`
                    : "bg-card border border-border hover:border-border/80 hover:shadow-sm"
                } ${isActive ? `ring-2 ring-offset-2 ring-offset-background ${tTheme.accentBorder.replace("border-", "ring-")}` : ""}`}
                style={isActive ? { boxShadow: `0 0 0 2px hsl(var(--background)), 0 0 0 4px ${t === "expense" ? "hsl(0 72% 48%)" : t === "check" ? "hsl(24 92% 54%)" : "hsl(152 52% 36%)"}` } : undefined}
              >
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all ${
                  isActive ? `${tTheme.accentFill} ${tTheme.accent} scale-110` : "bg-secondary text-muted-foreground"
                }`}>
                  <TIcon className="h-6 w-6" strokeWidth={isActive ? 2.5 : 1.75} />
                </div>
                <div className="text-center">
                  <div className={`text-[13px] font-semibold ${isActive ? "text-foreground" : "text-muted-foreground"}`}>{tTheme.label}</div>
                  <div className={`text-[10px] mt-0.5 ${isActive ? tTheme.accent : "text-muted-foreground/60"}`}>
                    {t === "expense" ? "Money out" : t === "check" ? "Paper check" : "Money in"}
                  </div>
                </div>
                {isActive && (
                  <div className={`absolute -top-1 -right-1 h-5 w-5 rounded-full ${tTheme.saveColor} text-white flex items-center justify-center shadow-sm`}>
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Amount */}
      <div className={`rounded-2xl p-5 border-2 transition-all ${
        amount ? `${theme.accentBorder} ${theme.accentBg}` : "border-border bg-card"
      }`}>
        <div className="flex items-center gap-1 mb-1">
          <span className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground font-medium">Amount</span>
          {amount && <span className={`text-[9px] ml-auto ${theme.badge}`}>{Number(amount) > 1000 ? "Large entry" : "Small entry"}</span>}
        </div>
        <div className="flex items-baseline gap-2">
          <span className={`font-display text-[40px] font-semibold leading-none transition-colors ${amount ? theme.accent : "text-muted-foreground"}`}>$</span>
          <input
            ref={amountRef}
            inputMode="decimal"
            placeholder="0.00"
            value={displayAmount}
            onChange={handleAmountChange}
            className="bg-transparent outline-none w-full font-display text-[52px] lg:text-[60px] font-semibold tracking-tight"
            autoFocus
          />
        </div>
        {amount && (
          <div className={`mt-1.5 text-[12px] ${theme.hintText} font-mono-tab`}>
            {type === "income" ? "+" : "−"} {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(amount))}
          </div>
        )}
      </div>

      <button
        onClick={() => setStep(1)}
        disabled={!amount}
        className={`mt-5 w-full h-14 rounded-2xl font-semibold text-[15px] inline-flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
          amount
            ? `${theme.saveColor} text-white shadow-lg`
            : "bg-secondary text-muted-foreground cursor-not-allowed"
        }`}
      >
        Continue <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );

  // --- STEP 1: Vendor + Project + Details (type-specific flow) ---
  const renderStep1 = () => (
    <div className="animate-fade-in">
      {/* Back */}
      <button
        onClick={() => setStep(0)}
        className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground mb-4 transition-colors group"
      >
        <div className="h-6 w-6 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-border/60 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
        </div>
        <span>Back</span>
      </button>

      {/* Type badge */}
      <div className="flex items-center gap-2 mb-4">
        <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${theme.accentFill}`}>
          <Icon className={`h-4 w-4 ${theme.accent}`} />
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground">Step 2 of 2</p>
          <p className="font-display text-[20px] font-semibold tracking-tight leading-tight">
            {theme.label} details
          </p>
        </div>
      </div>

      {/* Amount recap */}
      <div className={`${theme.bgLight} rounded-xl px-4 py-3 mb-4 flex items-center justify-between border ${theme.accentBorder}`}>
        <div className="flex items-center gap-2">
          <div className={`h-6 w-6 rounded-lg flex items-center justify-center ${theme.accentFill}`}>
            <CircleDollarSign className={`h-3.5 w-3.5 ${theme.accent}`} />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">Amount</p>
            <p className="font-mono-tab font-semibold text-[15px]">{displayAmount ? `$${displayAmount}` : "$0"}</p>
          </div>
        </div>
        <button onClick={() => setStep(0)} className="text-[11px] text-muted-foreground hover:text-foreground underline underline-offset-2">
          Edit
        </button>
      </div>

      {/* Vendor */}
      <div className="mb-3">
        <div className="flex items-center gap-1.5 mb-2">
          <User className={`h-3 w-3 ${vendor ? theme.accent : "text-muted-foreground"}`} />
          <span className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground font-medium">Vendor / Payee</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {recentVendors.map((v) => (
            <button
              key={v}
              onClick={() => setVendor(v)}
              className={`px-3 h-9 rounded-full text-[13px] font-medium transition-all border ${
                vendor === v
                  ? `${theme.selectedChip} shadow-sm`
                  : "border-border bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground hover:border-border/80"
              }`}
            >
              {v.split(" ").slice(0, 2).join(" ")}
            </button>
          ))}
        </div>
        {vendor && (
          <div className={`flex items-center gap-1.5 mt-1.5 text-[11px] ${theme.accent} font-medium`}>
            <Check className="h-3 w-3" />
            <span>{vendor}</span>
          </div>
        )}
      </div>

      {/* Project */}
      <div className="mb-3">
        <div className="flex items-center gap-1.5 mb-2">
          <Building2 className={`h-3 w-3 ${project ? theme.accent : "text-muted-foreground"}`} />
          <span className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground font-medium">Project</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {recentProjects.map((p) => (
            <button
              key={p}
              onClick={() => setProject(p)}
              className={`px-3 h-9 rounded-full text-[13px] font-medium transition-all border ${
                project === p
                  ? `${theme.selectedChip} shadow-sm`
                  : "border-border bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground hover:border-border/80"
              }`}
            >
              {p.split(" ").slice(0, 2).join(" ")}
            </button>
          ))}
        </div>
        {project && (
          <div className={`flex items-center gap-1.5 mt-1.5 text-[11px] ${theme.accent} font-medium`}>
            <Check className="h-3 w-3" />
            <span>{project}</span>
          </div>
        )}
      </div>

      {/* Category */}
      <div className="mb-3">
        <div className="flex items-center gap-1.5 mb-2">
          <CircleDollarSign className="h-3 w-3 text-muted-foreground" />
          <span className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground font-medium">Category</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {categories.slice(0, 6).map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-2.5 h-8 rounded-full text-[12px] font-medium transition-all border ${
                category === c
                  ? `${theme.selectedChip} shadow-sm`
                  : "border-border bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Check number (only for check type) */}
      {type === "check" && (
        <div className={`flex items-center gap-2 rounded-xl px-3.5 h-10 mb-3 border ${theme.accentBorder} ${theme.accentBg}`}>
          <Hash className={`h-4 w-4 ${theme.accent} shrink-0`} />
          <input
            className="bg-transparent outline-none text-[13px] font-mono-tab w-full"
            placeholder="Check number (e.g. 10429)"
            value={checkNum}
            onChange={(e) => setCheckNum(e.target.value)}
            inputMode="numeric"
          />
        </div>
      )}

      {/* Date & Memo row */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 flex items-center gap-2 rounded-xl px-3 h-10 bg-secondary/60 border border-transparent">
          <CalendarDays className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            type="date"
            className="bg-transparent outline-none text-[13px] font-medium w-full"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="flex-[2] flex items-center gap-2 rounded-xl px-3 h-10 bg-secondary/60 border border-transparent">
          <MessageSquare className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            className="bg-transparent outline-none text-[13px] w-full"
            placeholder="Memo / description (optional)"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />
        </div>
      </div>

      {/* AI suggestion */}
      {vendor && project && (
        <div className={`flex items-center gap-2 p-3 rounded-xl border mb-4 ${theme.accentBorder} ${theme.accentBg}`}>
          <Sparkles className={`h-4 w-4 shrink-0 ${theme.accent}`} />
          <span className="text-[12px] text-foreground/80">
            <span className="font-semibold">Auto-categorized</span> as {category} on {project}
          </span>
        </div>
      )}

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={!canSubmit}
        className={`w-full h-14 rounded-2xl font-semibold text-[15px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
          canSubmit
            ? `${theme.saveColor} text-white shadow-lg`
            : "bg-secondary text-muted-foreground cursor-not-allowed"
        }`}
      >
        <span>Save {theme.label}</span>
        {displayAmount && <span className="opacity-60 font-mono-tab">· ${displayAmount}</span>}
      </button>

      {!canSubmit && (
        <p className="text-center text-[11px] text-muted-foreground mt-2">
          {!vendor ? "Select a vendor" : "Select a project"}
        </p>
      )}
    </div>
  );

  return (
    <AppShell>
      <div className="px-4 lg:px-10 pt-5 lg:pt-10 max-w-2xl mx-auto pb-32 lg:pb-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-1.5 font-medium">
              {step === 0 ? "Step 1 of 2" : "Step 2 of 2"}
            </div>
            <h1 className="font-display text-[28px] lg:text-[32px] leading-tight font-semibold tracking-tight">New entry</h1>
          </div>
          <Link to="/" className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-border/60 transition-colors">
            <X className="h-4 w-4" />
          </Link>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-7">
          {[0, 1].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                s <= step ? theme.gradient : "bg-border"
              } ${s === step ? "w-10" : "w-6"}`}
            />
          ))}
          <span className="text-[10px] text-muted-foreground ml-1">
            {step === 0 ? "Amount & type" : `${theme.label} details`}
          </span>
        </div>

        {/* Type color accent stripe */}
        {step === 1 && (
          <div className={`h-0.5 rounded-full bg-gradient-to-r ${theme.gradient} mb-6 opacity-60`} />
        )}

        {step === 0 ? renderStep0() : renderStep1()}
      </div>
    </AppShell>
  );
};

export default NewEntry;