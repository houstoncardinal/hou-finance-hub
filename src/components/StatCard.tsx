import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { ReactNode } from "react";

export const StatCard = ({
  label, value, delta, trend = "up", sub, accent, children,
}: {
  label: string; value: string; delta?: string; trend?: "up" | "down"; sub?: string; accent?: boolean; children?: ReactNode;
}) => {
  const positive = trend === "up";
  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 ${accent ? "ink-card" : "glass-card"}`}>
      <div className={`text-[11px] uppercase tracking-[0.14em] ${accent ? "text-primary-foreground/60" : "text-muted-foreground"}`}>{label}</div>
      <div className="mt-3 flex items-baseline gap-2">
        <div className="font-display text-[34px] leading-none font-semibold font-mono-tab">{value}</div>
        {delta && (
          <span className={`inline-flex items-center text-[12px] font-medium ${positive ? "text-success" : "text-destructive"}`}>
            {positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {delta}
          </span>
        )}
      </div>
      {sub && <div className={`mt-1.5 text-[12px] ${accent ? "text-primary-foreground/55" : "text-muted-foreground"}`}>{sub}</div>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
};
