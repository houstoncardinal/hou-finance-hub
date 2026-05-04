import { ReactNode, useState, useRef, useEffect } from "react";
import { AppSidebar } from "./AppSidebar";
import { MobileNav } from "./MobileNav";
import { CopilotDock } from "./CopilotDock";
import { EntryDrawer } from "./EntryDrawer";
import type { EntryData } from "./EntryDrawer";
import { Search, Bell, Plus, Command, Sparkles, X, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AppShell = ({ children }: { children: ReactNode }) => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/expenses?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchFocused(false);
    }
  };

  const handleSave = (data: EntryData) => {
    console.log("Quick add:", data);
    setSearchQuery("");
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex bg-ivory">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/80 border-b border-border">
          <div className="h-16 px-5 lg:px-10 flex items-center gap-4">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center gap-2">
              <div className="h-7 w-7 rounded-md bg-sunset flex items-center justify-center text-white font-display font-bold text-sm">H</div>
              <span className="font-display text-base font-semibold">HOU Inc.</span>
            </div>

            {/* Search bar */}
            <div className="hidden lg:flex items-center gap-2 max-w-md w-full">
              <form onSubmit={handleSearchSubmit} className="relative w-full" role="search">
                <Search className={`h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${searchFocused ? "text-accent" : "text-muted-foreground"}`} />
                <input
                  ref={searchRef}
                  placeholder="Search projects, vendors, checks…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                  className="w-full h-10 pl-9 pr-16 rounded-xl bg-secondary/60 border border-transparent focus:border-accent/30 focus:bg-card outline-none text-sm placeholder:text-muted-foreground transition-colors"
                  aria-label="Search"
                />
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="h-5 w-5 rounded flex items-center justify-center hover:bg-secondary mr-1"
                    >
                      <X className="h-3 w-3 text-muted-foreground" />
                    </button>
                  )}
                  <kbd className="hidden md:flex items-center gap-1 px-1.5 h-5 rounded bg-card border border-border text-[10px] text-muted-foreground font-medium">
                    <Command className="h-2.5 w-2.5" />K
                  </kbd>
                </div>
              </form>
            </div>

            <div className="flex-1" />

            {/* Quick Add button */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="hidden lg:inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-foreground text-background text-[13px] font-medium hover:opacity-90 transition-opacity active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" /> Quick Add
            </button>

            {/* Notifications */}
            <button className="h-10 w-10 rounded-xl hover:bg-secondary flex items-center justify-center relative transition-colors group">
              <Bell className="h-[18px] w-[18px]" strokeWidth={1.75} />
              <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-accent group-hover:animate-pulse-soft" />
            </button>
          </div>

          {/* Mobile Quick Add strip — luxury red accent */}
          <div className="lg:hidden px-5 pb-3">
            <button
              onClick={() => setDrawerOpen(true)}
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#8B1A1A] to-[#6b1414] text-white text-[14px] font-semibold inline-flex items-center justify-center gap-2.5 shadow-lg shadow-red-900/20 active:scale-[0.98] transition-all"
            >
              <Plus className="h-5 w-5" /> Quick Add · Expense, Check, Income
            </button>
          </div>
        </header>

        <main className="flex-1 pb-28 lg:pb-12">{children}</main>
      </div>

      <CopilotDock />
      <MobileNav onQuickAdd={() => setDrawerOpen(true)} />

      {/* Universal Entry Drawer */}
      <EntryDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        defaultType="expense"
        title="Quick Add"
        onSave={handleSave}
      />
    </div>
  );
};