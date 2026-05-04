import { AppShell } from "@/components/AppShell";
import { FileText, Search, Upload } from "lucide-react";

const docs = [
  { name: "Cemex_Invoice_4821.pdf", project: "Heights Mid-Rise", size: "284 KB", date: "May 03" },
  { name: "Rivera_Contract_signed.pdf", project: "Galleria Retail", size: "1.2 MB", date: "May 02" },
  { name: "City_Permit_8451.pdf", project: "Spring Branch Wh.", size: "192 KB", date: "Apr 28" },
  { name: "Memorial_DrawSchedule.xlsx", project: "Memorial Office", size: "44 KB", date: "Apr 25" },
  { name: "Apex_W9.pdf", project: "—", size: "88 KB", date: "Apr 18" },
];

const Documents = () => (
  <AppShell>
    <div className="px-5 lg:px-10 pt-6 lg:pt-10 max-w-[1400px] mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-[12px] uppercase tracking-[0.18em] text-muted-foreground mb-2">Vault</div>
          <h1 className="font-display text-[40px] leading-tight font-semibold tracking-tight">Documents</h1>
          <p className="mt-1.5 text-muted-foreground">Receipts, invoices, contracts — searchable by AI.</p>
        </div>
        <button className="h-10 px-4 rounded-xl bg-foreground text-background text-[13px] font-medium inline-flex items-center gap-1.5"><Upload className="h-4 w-4" /> Upload</button>
      </div>

      <div className="glass-card p-2 mb-4 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input className="w-full h-10 pl-9 pr-3 rounded-lg bg-transparent outline-none text-[14px]" placeholder="Search documents by content, vendor, project…" />
        </div>
      </div>

      <div className="glass-card overflow-hidden divide-y divide-border">
        {docs.map((d) => (
          <div key={d.name} className="px-6 py-4 flex items-center gap-4 hover:bg-secondary/40 transition-colors">
            <div className="h-11 w-11 rounded-xl bg-secondary flex items-center justify-center"><FileText className="h-[18px] w-[18px] text-muted-foreground" /></div>
            <div className="min-w-0 flex-1">
              <div className="text-[14px] font-medium truncate">{d.name}</div>
              <div className="text-[12px] text-muted-foreground">{d.project} · {d.size}</div>
            </div>
            <div className="text-[12px] text-muted-foreground">{d.date}</div>
          </div>
        ))}
      </div>
    </div>
  </AppShell>
);

export default Documents;
