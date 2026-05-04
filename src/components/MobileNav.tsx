import { NavLink } from "react-router-dom";
import { LayoutDashboard, Receipt, Plus, FileCheck2, Sparkles } from "lucide-react";

const items = [
  { to: "/", label: "Home", icon: LayoutDashboard },
  { to: "/expenses", label: "Expenses", icon: Receipt },
  { to: "/new", label: "Add", icon: Plus, primary: true },
  { to: "/checks", label: "Checks", icon: FileCheck2 },
  { to: "/assistant", label: "AI", icon: Sparkles },
];

interface MobileNavProps {
  onQuickAdd?: () => void;
}

export const MobileNav = ({ onQuickAdd }: MobileNavProps) => (
  <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-card/90 backdrop-blur-xl border-t border-border">
    <div className="flex items-center justify-around px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      {items.map(({ to, label, icon: Icon, primary }) =>
        primary ? (
          <button
            key={to}
            onClick={() => { window.location.href = "/new"; }}
            className="-mt-7"
            aria-label="Add"
          >
            <div className="h-14 w-14 rounded-full bg-sunset shadow-glow flex items-center justify-center text-white active:scale-95 transition-transform">
              <Icon className="h-6 w-6" strokeWidth={2.25} />
            </div>
          </button>
        ) : (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
          >
            {({ isActive }) => (
              <div className="flex flex-col items-center gap-0.5 py-1.5 px-3 text-[10px] font-medium relative">
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 h-1 w-6 rounded-full bg-accent animate-slide-down" />
                )}
                <div className={`relative ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                  <Icon className={`h-[22px] w-[22px] ${isActive ? "drop-shadow-sm" : ""}`} strokeWidth={isActive ? 2.25 : 1.75} />
                </div>
                <span className={`transition-colors ${isActive ? "text-foreground font-semibold" : "text-muted-foreground"}`}>{label}</span>
              </div>
            )}
          </NavLink>
        )
      )}
    </div>
  </nav>
);