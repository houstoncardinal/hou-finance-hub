import { useState, useRef, useCallback, useEffect } from "react";
import { Sparkles, ArrowUp, X, Mic, MicOff, Loader2, ChevronRight, FileCheck2, ArrowRight, Square, Download, FileText } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { processQuery, createVoiceListener } from "@/lib/finance-ai";
import { downloadReport, getReportTypes } from "@/lib/finance-reports";
import type { AIResponse } from "@/lib/finance-ai";
import type { ReportType } from "@/lib/finance-reports";

const prompts = [
  "Where are we overspending right now?",
  "Which vendors costs rose the most this month?",
  "Cash position in 14 days?",
  "Profit on Bellaire Custom Home?",
];

export const CopilotDock = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "ai"; content: string; response?: AIResponse }[]>([]);
  const [input, setInput] = useState("");
  const [processing, setProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const voiceRef = useRef<ReturnType<typeof createVoiceListener> | null>(null);
  const navigate = useNavigate();

  const handleVoiceResult = useCallback((text: string) => {
    setInput(text);
    setIsListening(false);
    // Auto-submit voice input
    setTimeout(() => {
      handleSubmit(text);
    }, 300);
  }, []);

  const toggleVoice = useCallback(() => {
    if (isListening) {
      voiceRef.current?.stop();
      setIsListening(false);
      return;
    }

    if (!voiceRef.current) {
      voiceRef.current = createVoiceListener(
        handleVoiceResult,
        (err) => {
          console.error(err);
          setIsListening(false);
        }
      );
    }
    voiceRef.current.start();
    setIsListening(true);
  }, [isListening, handleVoiceResult]);

  const handleSubmit = useCallback((text?: string) => {
    const query = (text || input).trim();
    if (!query) return;

    const userMsg = { role: "user" as const, content: query };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setProcessing(true);

    // Process query
    setTimeout(() => {
      const result = processQuery(query);
      setMessages(prev => [...prev, { role: "ai", content: result.text, response: result }]);

      // If there's a form-fill action, navigate and open drawer
      if (result.actions) {
        for (const action of result.actions) {
          if (action.type === "navigate" && action.to) {
            setTimeout(() => navigate(action.to!), 1500);
          }
          if (action.type === "openDrawer") {
            // Open the quick add drawer on the main app
            console.log("OPEN DRAWER with:", action.payload);
          }
        }
      }

      setProcessing(false);
    }, 800);
  }, [input, navigate]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  return (
    <>
      {/* Floating trigger button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-24 lg:bottom-6 right-5 lg:right-8 z-40 h-14 px-5 rounded-full bg-foreground text-background shadow-elevated flex items-center gap-2 hover:bg-sunset hover:shadow-glow transition-all active:scale-[0.97]"
          aria-label="Open AI Copilot"
        >
          <Sparkles className="h-[18px] w-[18px]" />
          <span className="text-[13px] font-medium hidden sm:inline">Ask Copilot</span>
        </button>
      )}

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-end lg:items-center justify-center p-0 lg:p-6 animate-fade-in">
          <div className="w-full max-w-xl bg-card rounded-t-3xl lg:rounded-3xl shadow-elevated overflow-hidden animate-fade-up flex flex-col max-h-[90vh] lg:max-h-[80vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-sunset flex items-center justify-center">
                  <Sparkles className="h-3.5 w-3.5 text-white" />
                </div>
                <div>
                  <div className="font-display text-[16px] font-semibold leading-tight">Copilot</div>
                  <div className="text-[11px] text-muted-foreground">Intelligent finance assistant</div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="h-9 w-9 rounded-xl bg-secondary flex items-center justify-center hover:bg-border/60 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="px-5 pb-3 flex-1 overflow-y-auto min-h-[200px] space-y-4">
              {messages.length === 0 ? (
                <div className="py-6 text-center">
                  <div className="h-10 w-10 rounded-2xl bg-accent-soft flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="h-5 w-5 text-accent" />
                  </div>
                  <p className="text-[13px] text-muted-foreground">Ask me anything about your finances.</p>
                  <p className="text-[11px] text-muted-foreground/60 mt-1">I can query data, create entries, and guide you.</p>
                </div>
              ) : (
                messages.map((m, i) => (
                  <div key={i}>
                    {m.role === "user" ? (
                      <div className="flex justify-end">
                        <div className="max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[14px] leading-relaxed bg-foreground text-background">
                          {m.content}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-start">
                          <div className="max-w-[92%] rounded-2xl px-3.5 py-2.5 text-[14px] leading-relaxed bg-secondary">
                            <div className="whitespace-pre-line">{m.content}</div>
                          </div>
                        </div>

                        {/* Action cards */}
                        {m.response?.data && m.response.data.length > 0 && (
                          <div className="mt-2 ml-2 flex flex-wrap gap-1.5">
                            {m.response.data.map((d, di) => (
                              <div
                                key={di}
                                className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium flex items-center gap-1.5 border"
                                style={{
                                  backgroundColor: d.color ? `${d.color}15` : "var(--secondary)",
                                  borderColor: d.color ? `${d.color}30` : "var(--border)",
                                  color: d.color ?? "var(--foreground)",
                                }}
                              >
                                <span className="opacity-70">{d.label}</span>
                                <span className="font-semibold font-mono-tab">{d.value}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Action buttons */}
                        {m.response?.actions && m.response.actions.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5 ml-2">
                            {m.response.actions.map((a, ai) => (
                              a.type === "navigate" && a.to ? (
                                <Link
                                  key={ai}
                                  to={a.to}
                                  className="inline-flex items-center gap-1 px-2.5 h-7 rounded-lg bg-accent-soft text-accent text-[11px] font-medium hover:bg-accent/20 transition-colors"
                                  onClick={() => setTimeout(() => setOpen(false), 300)}
                                >
                                  Open <ChevronRight className="h-3 w-3" />
                                </Link>
                              ) : null
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}

              {/* Processing indicator */}
              {processing && (
                <div className="flex justify-start">
                  <div className="bg-secondary rounded-2xl px-3.5 py-2.5 flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    <span className="text-[13px] text-muted-foreground">Analyzing your data…</span>
                  </div>
                </div>
              )}

              {/* Voice listening indicator */}
              {isListening && (
                <div className="flex justify-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-soft border border-accent/20 text-accent text-[12px] font-medium animate-pulse-soft">
                    <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                    Listening… speak your query
                  </div>
                </div>
              )}
            </div>

            {/* Suggested prompts */}
            {messages.length === 0 && (
              <div className="px-5 pb-3 shrink-0">
                <div className="flex flex-wrap gap-1.5">
                  {prompts.map(p => (
                    <button
                      key={p}
                      onClick={() => { setInput(p); handleSubmit(p); }}
                      className="px-3 h-8 rounded-full border border-border bg-card text-[12px] hover:bg-secondary transition-colors hover:border-accent/30"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Composer */}
            <div className="border-t border-border p-3 flex items-end gap-2 bg-background/50 shrink-0">
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isListening ? "Listening..." : "Ask anything…"}
                className="flex-1 resize-none bg-transparent outline-none px-3 py-2 text-[14.5px] placeholder:text-muted-foreground max-h-[80px]"
              />
              <button
                onClick={toggleVoice}
                className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all ${
                  isListening ? "bg-accent text-white shadow-glow" : "hover:bg-secondary text-muted-foreground"
                }`}
              >
                {isListening ? <MicOff className="h-[18px] w-[18px]" /> : <Mic className="h-[18px] w-[18px]" />}
              </button>
              <button
                onClick={() => handleSubmit()}
                disabled={!input.trim() || processing}
                className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all ${
                  input.trim() && !processing
                    ? "bg-sunset shadow-glow text-white"
                    : "bg-secondary text-muted-foreground cursor-not-allowed"
                }`}
              >
                {processing ? <Loader2 className="h-[18px] w-[18px] animate-spin" /> : <ArrowUp className="h-[18px] w-[18px]" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};