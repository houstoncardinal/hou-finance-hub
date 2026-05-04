import { useState } from "react";
import { Sparkles, ArrowUp, X, Mic } from "lucide-react";
import { Link } from "react-router-dom";

const prompts = [
  "Where are we overspending right now?",
  "Which vendors costs rose the most this month?",
  "Cash position in 14 days?",
  "Profit on Bellaire Custom Home?",
];

export const CopilotDock = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      {/* Embedded strip in dashboard (rendered by parent) is separate.
          This component is the floating dock for non-dashboard pages. */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-24 lg:bottom-6 right-5 lg:right-8 z-40 h-14 px-5 rounded-full bg-foreground text-background shadow-elevated flex items-center gap-2 hover:bg-sunset hover:shadow-glow transition-all"
          aria-label="Open AI Copilot"
        >
          <Sparkles className="h-[18px] w-[18px]" />
          <span className="text-[13px] font-medium hidden sm:inline">Ask Copilot</span>
        </button>
      )}
      {open && (
        <div className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-end lg:items-center justify-center p-0 lg:p-6 animate-fade-in">
          <div className="w-full max-w-xl bg-card rounded-t-3xl lg:rounded-3xl shadow-elevated overflow-hidden animate-fade-up">
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-sunset flex items-center justify-center"><Sparkles className="h-3.5 w-3.5 text-white" /></div>
                <div>
                  <div className="font-display text-[16px] font-semibold leading-tight">Copilot</div>
                  <div className="text-[11px] text-muted-foreground">Live on your ledger</div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="h-9 w-9 rounded-xl bg-secondary flex items-center justify-center"><X className="h-4 w-4" /></button>
            </div>

            <div className="px-5 pb-3 max-h-[55vh] overflow-y-auto space-y-4">
              <Bubble role="ai">
                Cash on hand is <span className="font-semibold font-mono-tab">$1.84M</span>. Forecast dips to{" "}
                <span className="text-destructive font-medium">$980k on May 16</span> after payroll + Cemex. Memorial draw on May 17 should bring it back to safe.
              </Bubble>
              <Bubble role="user">Where are we overspending?</Bubble>
              <Bubble role="ai">
                <span className="font-medium">Bellaire Custom Home</span> is{" "}
                <span className="text-destructive font-medium">$110k over budget</span> driven by framing + materials.
                <Link to="/projects" className="block mt-2 text-accent text-[13px] font-medium">Open project →</Link>
              </Bubble>
            </div>

            <div className="px-5 pb-3">
              <div className="flex flex-wrap gap-1.5 mb-3">
                {prompts.map(p => (
                  <button key={p} className="px-3 h-8 rounded-full border border-border bg-card text-[12px] hover:bg-secondary transition-colors">{p}</button>
                ))}
              </div>
            </div>

            <div className="border-t border-border p-3 flex items-end gap-2 bg-background/50">
              <textarea rows={1} placeholder="Ask anything…" className="flex-1 resize-none bg-transparent outline-none px-3 py-2 text-[14.5px] placeholder:text-muted-foreground" />
              <button className="h-10 w-10 rounded-xl hover:bg-secondary flex items-center justify-center"><Mic className="h-[18px] w-[18px]" /></button>
              <button className="h-10 w-10 rounded-xl bg-sunset shadow-glow text-white flex items-center justify-center"><ArrowUp className="h-[18px] w-[18px]" /></button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const Bubble = ({ role, children }: { role: "user" | "ai"; children: React.ReactNode }) => (
  <div className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}>
    <div className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[14px] leading-relaxed ${
      role === "user" ? "bg-foreground text-background" : "bg-secondary"
    }`}>
      {children}
    </div>
  </div>
);
