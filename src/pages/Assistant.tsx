import { AppShell } from "@/components/AppShell";
import { Sparkles, ArrowUp, Mic } from "lucide-react";

const suggestions = [
  "How much did we spend on concrete last month?",
  "Which project is most profitable?",
  "Show all uncleared checks over $25k",
  "Forecast cash position for next 30 days",
];

const Assistant = () => (
  <AppShell>
    <div className="px-5 lg:px-10 pt-6 lg:pt-10 max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 accent-pill mb-5">
          <Sparkles className="h-3.5 w-3.5" /> AI Assistant
        </div>
        <h1 className="font-display text-[44px] lg:text-[56px] leading-[1.02] font-semibold tracking-tight text-balance">
          Ask anything about your finances.
        </h1>
        <p className="mt-3 text-muted-foreground text-[15px] max-w-xl mx-auto">
          Natural-language queries across every project, check, vendor, and document. Trained on HOU Inc.'s ledger.
        </p>
      </div>

      {/* Sample conversation */}
      <div className="space-y-5 mb-8">
        <Bubble role="user">Which project had the highest material cost last month?</Bubble>
        <Bubble role="ai">
          <span className="font-medium">Heights Mid-Rise</span> led material spend in April with{" "}
          <span className="font-mono-tab font-semibold">$612,400</span> — primarily Cemex concrete pours
          (62%) and rebar from Triton Steel (24%). That's <span className="text-accent font-medium">+18%</span> vs March.
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[["Concrete", "$382k"], ["Rebar", "$148k"], ["Other", "$82k"]].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-secondary/60 p-3">
                <div className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{k}</div>
                <div className="font-mono-tab font-semibold mt-0.5">{v}</div>
              </div>
            ))}
          </div>
        </Bubble>
      </div>

      {/* Composer */}
      <div className="glass-card p-3 shadow-elevated">
        <div className="flex items-end gap-2">
          <textarea
            rows={2}
            placeholder="Ask about expenses, projects, vendors, forecasts…"
            className="flex-1 resize-none bg-transparent outline-none px-3 py-2 text-[14.5px] placeholder:text-muted-foreground"
          />
          <button className="h-10 w-10 rounded-xl hover:bg-secondary flex items-center justify-center"><Mic className="h-[18px] w-[18px]" /></button>
          <button className="h-10 w-10 rounded-xl bg-sunset shadow-glow text-white flex items-center justify-center"><ArrowUp className="h-[18px] w-[18px]" /></button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <button key={s} className="px-3.5 h-9 rounded-full border border-border bg-card text-[13px] hover:bg-secondary transition-colors">
            {s}
          </button>
        ))}
      </div>
    </div>
  </AppShell>
);

const Bubble = ({ role, children }: { role: "user" | "ai"; children: React.ReactNode }) => (
  <div className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}>
    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-[14.5px] leading-relaxed ${
      role === "user" ? "bg-foreground text-background" : "glass-card"
    }`}>
      {children}
    </div>
  </div>
);

export default Assistant;
