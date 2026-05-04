import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { MobileNav } from "./MobileNav";
import { Search, Bell, Plus } from "lucide-react";

export const AppShell = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex bg-ivory">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/80 border-b border-border">
          <div className="h-16 px-5 lg:px-10 flex items-center gap-4">
            <div className="lg:hidden flex items-center gap-2">
              <div className="h-7 w-7 rounded-md bg-sunset flex items-center justify-center text-white font-display font-bold text-sm">H</div>
              <span className="font-display text-base font-semibold">HOU Inc.</span>
            </div>
            <div className="hidden lg:flex items-center gap-2 max-w-md w-full">
              <div className="relative w-full">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  placeholder="Search projects, vendors, checks…"
                  className="w-full h-10 pl-9 pr-3 rounded-xl bg-secondary/60 border border-transparent focus:border-border focus:bg-card outline-none text-sm placeholder:text-muted-foreground transition-colors"
                />
                <kbd className="hidden md:flex absolute right-2.5 top-1/2 -translate-y-1/2 items-center gap-1 px-1.5 h-5 rounded bg-card border border-border text-[10px] text-muted-foreground">⌘K</kbd>
              </div>
            </div>
            <div className="flex-1" />
            <button className="hidden lg:inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-foreground text-background text-[13px] font-medium hover:opacity-90 transition-opacity">
              <Plus className="h-4 w-4" /> New entry
            </button>
            <button className="h-10 w-10 rounded-xl hover:bg-secondary flex items-center justify-center relative">
              <Bell className="h-[18px] w-[18px]" strokeWidth={1.75} />
              <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-accent" />
            </button>
          </div>
        </header>
        <main className="flex-1 pb-24 lg:pb-12">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
};
