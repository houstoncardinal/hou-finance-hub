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
import Documents from "./pages/Documents.tsx";

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
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/new" element={<NewEntry />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
