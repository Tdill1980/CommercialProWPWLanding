import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ApprovePro from "./pages/ApprovePro";
import WallWraps from "./pages/WallWraps";
import CommandCenter from "./pages/CommandCenter";
import WooDiagnostics from "./pages/WooDiagnostics";
import EmbedCommercial from "./pages/EmbedCommercial";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/approvepro" element={<ApprovePro />} />
          <Route path="/wall-wraps" element={<WallWraps />} />
          <Route path="/commercial/command-center" element={<CommandCenter />} />
          <Route path="/admin/woo-diagnostics" element={<WooDiagnostics />} />
          <Route path="/embed/commercial" element={<EmbedCommercial />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
