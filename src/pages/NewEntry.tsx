import { AppShell } from "@/components/AppShell";
import { Mic, Camera, Receipt, FileCheck2, TrendingUp, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const types = [
  { id: "expense", label: "Expense", icon: Receipt, desc: "Materials, equipment, permits" },
  { id: "income", label: "Income", icon: TrendingUp, desc: "Owner draw, milestone" },
  { id: "check", label: "Check", icon: FileCheck2, desc: "Pay vendor or contractor" },
];

const NewEntry = () => {
  const [type, setType] = useState("expense");
  return (
    <AppShell>
      <div className="px-5 lg:px-10 pt-6 lg:pt-10 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-[12px] uppercase tracking-[0.18em] text-muted-foreground mb-2">Quick capture</div>
            <h1 className="font-display text-[36px] leading-tight font-semibold tracking-tight">New entry</h1>
          </div>
          <Link to="/" className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center"><X className="h-4 w-4" /></Link>
        </div>

        {/* Capture modes */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button className="ink-card p-5 text-left flex flex-col gap-3 relative overflow-hidden">
            <div className="h-11 w-11 rounded-xl bg-white/10 flex items-center justify-center"><Mic className="h-5 w-5" /></div>
            <div>
              <div className="font-medium">Voice</div>
              <div className="text-[12.5px] text-primary-foreground/60">Just speak it</div>
            </div>
            <span className="absolute top-4 right-4 h-2 w-2 rounded-full bg-accent animate-pulse" />
          </button>
          <button className="glass-card p-5 text-left flex flex-col gap-3">
            <div className="h-11 w-11 rounded-xl bg-secondary flex items-center justify-center"><Camera className="h-5 w-5" /></div>
            <div>
              <div className="font-medium">Scan receipt</div>
              <div className="text-[12.5px] text-muted-foreground">OCR auto-fills</div>
            </div>
          </button>
        </div>

        {/* Type segmented */}
        <div className="grid grid-cols-3 gap-2 p-1.5 bg-secondary rounded-2xl mb-6">
          {types.map((t) => (
            <button
              key={t.id}
              onClick={() => setType(t.id)}
              className={`py-3 rounded-xl text-[13px] font-medium flex flex-col items-center gap-1 transition-all ${
                type === t.id ? "bg-card shadow-sm" : "text-muted-foreground"
              }`}
            >
              <t.icon className="h-[18px] w-[18px]" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="glass-card p-6 space-y-5">
          <Field label="Amount">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-[44px] font-semibold text-muted-foreground">$</span>
              <input className="font-display text-[56px] font-semibold w-full bg-transparent outline-none font-mono-tab" defaultValue="4,820" />
            </div>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Vendor"><Input placeholder="Cemex Concrete" defaultValue="Cemex Concrete" /></Field>
            <Field label="Project"><Input placeholder="Select project" defaultValue="Heights Mid-Rise" /></Field>
            <Field label="Category">
              <div className="flex flex-wrap gap-1.5">
                {["Materials", "Labor", "Sub", "Equipment", "Permits"].map((c, i) => (
                  <button key={c} className={`px-3 h-8 rounded-lg text-[12.5px] font-medium ${i === 0 ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"}`}>{c}</button>
                ))}
              </div>
            </Field>
            <Field label="Date"><Input defaultValue="May 4, 2026" /></Field>
          </div>
          <Field label="Note (optional)"><Input placeholder="Slab pour, level 3" /></Field>

          <div className="flex items-center gap-2 p-3 rounded-xl bg-accent-soft text-accent text-[13px]">
            <Sparkles className="h-4 w-4 shrink-0" />
            <span><span className="font-medium">AI suggestion:</span> Categorized as Materials based on vendor history.</span>
          </div>

          <button className="w-full h-12 rounded-xl bg-sunset text-white font-medium shadow-glow hover:opacity-95 transition-opacity">
            Save entry
          </button>
        </div>
      </div>
    </AppShell>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{label}</label>
    <div className="mt-1.5">{children}</div>
  </div>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className="w-full h-11 px-3.5 rounded-xl bg-secondary/60 border border-transparent focus:bg-card focus:border-border outline-none text-[14px] transition-colors" />
);

export default NewEntry;
