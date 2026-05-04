import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Expenses from "./pages/Expenses.tsx";
import Projects from "./pages/Projects.tsx";
import Checks from "./pages/Checks.tsx";
import Vendors from "./pages/Vendors.tsx";
import Assistant from "./pages/Assistant.tsx";
import NewEntry from "./pages/NewEntry.tsx";
import Help from "./pages/Help.tsx";
import Charts from "./pages/Charts.tsx";
import Documents from "./pages/Documents.tsx";
import CashFlow from "./pages/CashFlow.tsx";
import Reports from "./pages/Reports.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/checks" element={<Checks />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/cashflow" element={<CashFlow />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/new" element={<NewEntry />} />
          <Route path="/help" element={<Help />} />
          <Route path="/charts" element={<Charts />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
