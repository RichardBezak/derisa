import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PreDeti from "./pages/PreDeti";

const queryClient = new QueryClient();

const KidsAppRedirect = ({ app }: { app: string }) => {
  if (typeof window !== "undefined") window.location.replace(`/pre-deti/${app}/index.html`);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/pre-deti" element={<PreDeti />} />
          {/* Kids apps are separate static builds in public/pre-deti/<app>/ — force a full load */}
          <Route path="/pre-deti/mumo/*" element={<KidsAppRedirect app="mumo" />} />
          <Route path="/pre-deti/jezko/*" element={<KidsAppRedirect app="jezko" />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
