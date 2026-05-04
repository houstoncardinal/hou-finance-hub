import { NavLink } from "react-router-dom";
import { LayoutDashboard, FileCheck2, Receipt, FolderKanban, LineChart, Sparkles, Settings, Users, LifeBuoy, Plus } from "lucide-react";

const nav = [
  { to: "/", label: "Command Center", icon: LayoutDashboard },
  { to: "/checks", label: "Checks", icon: FileCheck2 },
  { to: "/expenses", label: "Ledger", icon: Receipt },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/charts", label: "Analytics", icon: LineChart },
  { to: "/assistant", label: "AI Copilot", icon: Sparkles },
];

export const AppSidebar = () => {
  return (
    <aside className="hidden lg:flex w-[240px] shrink-0 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border h-screen sticky top-0">
      <div className="px-6 pt-7 pb-7">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-accent shadow-glow flex items-center justify-center">
            <span className="font-display text-[15px] font-bold text-white">H</span>
          </div>
          <div className="leading-tight">
            <div className="font-display text-[16px] font-semibold tracking-tight">HOU Inc.</div>
            <div className="text-[10.5px] uppercase tracking-[0.14em] text-sidebar-foreground/55">Finance OS</div>
          </div>
        </div>
      </div>

      <nav className="px-3 flex-1 space-y-0.5">
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition-colors ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/60"
              }`
            }
          >
            <Icon className="h-[17px] w-[17px]" strokeWidth={1.75} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-4 pb-5 pt-4 border-t border-sidebar-border space-y-3">
        <NavLink to="/new" className="flex items-center gap-3 px-3 py-2 rounded-xl bg-accent/20 text-sidebar-foreground hover:bg-accent/30 text-[13.5px] font-medium transition-colors">
          <Plus className="h-[17px] w-[17px]" strokeWidth={2} /> Quick Entry
        </NavLink>
        <NavLink to="/help" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/60 text-[13.5px] transition-colors">
          <LifeBuoy className="h-[17px] w-[17px]" strokeWidth={1.75} /> Help & Guides
        </NavLink>
        <NavLink to="/settings" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/60 text-[13.5px] transition-colors">
          <Settings className="h-[17px] w-[17px]" strokeWidth={1.75} /> Settings
        </NavLink>
        <div className="flex items-center gap-3 px-2 pt-2">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-red-300 to-accent flex items-center justify-center text-[12px] font-semibold text-white">DR</div>
          <div className="leading-tight min-w-0">
            <div className="text-[12.5px] font-medium truncate">Daniel Reyes</div>
            <div className="text-[10.5px] text-sidebar-foreground/55">Owner · HOU Inc.</div>
          </div>
        </div>
      </div>
    </aside>
  );
};