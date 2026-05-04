import { AppShell } from "@/components/AppShell";
import { Mic, Camera, Receipt, FileCheck2, TrendingUp, Sparkles, X, Check } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { recentVendors, recentProjects, categories } from "@/lib/finance-data";

const types = [
  { id: "expense", label: "Expense", icon: Receipt },
  { id: "check", label: "Check", icon: FileCheck2 },
  { id: "income", label: "Income", icon: TrendingUp },
];

const NewEntry = () => {
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("4820");
  const [vendor, setVendor] = useState(recentVendors[0]);
  const [project, setProject] = useState(recentProjects[0]);
  const [category, setCategory] = useState(categories[0]);
  const navigate = useNavigate();

  const formatted = amount ? Number(amount).toLocaleString("en-US") : "0";

  return (
    <AppShell>
      <div className="px-4 lg:px-10 pt-5 lg:pt-10 max-w-2xl mx-auto pb-12">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-1.5">Quick Add · &lt; 5 sec</div>
            <h1 className="font-display text-[28px] lg:text-[32px] leading-tight font-semibold tracking-tight">New entry</h1>
          </div>
          <Link to="/" className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center"><X className="h-4 w-4" /></Link>
        </div>

        {/* Type */}
        <div className="grid grid-cols-3 gap-2 p-1.5 bg-secondary rounded-2xl mb-5">
          {types.map(t => (
            <button key={t.id} onClick={() => setType(t.id)}
              className={`py-3 rounded-xl text-[13px] font-medium flex flex-col items-center gap-1 transition-all ${type === t.id ? "bg-card shadow-sm" : "text-muted-foreground"}`}>
              <t.icon className="h-[18px] w-[18px]" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Capture modes */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <button className="ink-card p-4 text-left flex items-center gap-3 relative">
            <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center"><Mic className="h-5 w-5" /></div>
            <div>
              <div className="font-medium text-[14px]">Voice</div>
              <div className="text-[11.5px] text-primary-foreground/55">Just speak</div>
            </div>
            <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-accent animate-pulse" />
          </button>
          <button className="glass-card p-4 text-left flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center"><Camera className="h-5 w-5" /></div>
            <div>
              <div className="font-medium text-[14px]">Scan</div>
              <div className="text-[11.5px] text-muted-foreground">OCR auto-fills</div>
            </div>
          </button>
        </div>

        {/* Amount – the hero */}
        <div className="glass-card p-6 mb-4">
          <div className="text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">Amount</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-display text-[40px] font-semibold text-muted-foreground">$</span>
            <input
              inputMode="decimal"
              value={formatted}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
              className="font-display text-[56px] lg:text-[64px] font-semibold w-full bg-transparent outline-none font-mono-tab"
            />
          </div>
        </div>

        {/* Smart pick lists */}
        <Section title="Vendor" recent={recentVendors} value={vendor} onChange={setVendor} />
        <Section title="Project" recent={recentProjects} value={project} onChange={setProject} />
        <Section title="Category" recent={categories} value={category} onChange={setCategory} compact />

        {/* AI suggestion */}
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-accent-soft text-accent text-[13px] mt-5">
          <Sparkles className="h-4 w-4 shrink-0" />
          <span><span className="font-semibold">Auto-categorized</span> as Materials → assigned to Heights based on vendor pattern.</span>
        </div>

        {/* Save */}
        <button
          onClick={() => navigate("/")}
          className="mt-5 w-full h-14 rounded-2xl bg-sunset text-white font-medium shadow-glow hover:opacity-95 transition-opacity inline-flex items-center justify-center gap-2 text-[15px]"
        >
          <Check className="h-5 w-5" /> Save · ${formatted}
        </button>

        <div className="mt-3 text-center text-[11.5px] text-muted-foreground">
          Smart defaults from your last 50 entries · tap any field to change
        </div>
      </div>
    </AppShell>
  );
};

const Section = ({ title, recent, value, onChange, compact }: { title: string; recent: string[]; value: string; onChange: (v: string) => void; compact?: boolean }) => (
  <div className="glass-card p-4 mt-3">
    <div className="text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground mb-2.5">{title}</div>
    <div className="flex flex-wrap gap-1.5">
      {recent.slice(0, compact ? 7 : 5).map(item => (
        <button key={item} onClick={() => onChange(item)}
          className={`px-3.5 h-9 rounded-full text-[13px] font-medium transition-all ${value === item ? "bg-foreground text-background" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
          {item}
        </button>
      ))}
      <button className="px-3.5 h-9 rounded-full text-[13px] font-medium bg-secondary text-muted-foreground hover:text-foreground">+ Other</button>
    </div>
  </div>
);

export default NewEntry;
