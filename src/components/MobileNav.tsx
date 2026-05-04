import { NavLink } from "react-router-dom";
import { LayoutDashboard, Receipt, Plus, FileCheck2, Sparkles } from "lucide-react";

const items = [
  { to: "/", label: "Home", icon: LayoutDashboard },
  { to: "/expenses", label: "Expenses", icon: Receipt },
  { to: "/new", label: "Add", icon: Plus, primary: true },
  { to: "/checks", label: "Checks", icon: FileCheck2 },
  { to: "/assistant", label: "AI", icon: Sparkles },
];

export const MobileNav = () => (
  <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-card/90 backdrop-blur-xl border-t border-border">
    <div className="flex items-center justify-around px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      {items.map(({ to, label, icon: Icon, primary }) =>
        primary ? (
          <NavLink key={to} to={to} className="-mt-7">
            <div className="h-14 w-14 rounded-full bg-sunset shadow-glow flex items-center justify-center text-white">
              <Icon className="h-6 w-6" strokeWidth={2.25} />
            </div>
          </NavLink>
        ) : (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-1.5 px-3 text-[10px] font-medium ${
                isActive ? "text-foreground" : "text-muted-foreground"
              }`
            }
          >
            <Icon className="h-[22px] w-[22px]" strokeWidth={1.75} />
            <span>{label}</span>
          </NavLink>
        )
      )}
    </div>
  </nav>
);
