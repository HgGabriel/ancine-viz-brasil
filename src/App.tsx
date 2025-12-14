import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import { useDashboardBackgroundRefetch } from "./hooks/useBackgroundRefetch";
import Overview from "./pages/Overview";
import Market from "./pages/Market";
import NationalProduction from "./pages/NationalProduction";
import Distribution from "./pages/Distribution";
import Exhibition from "./pages/Exhibition";
import NotFound from "./pages/NotFound";

const AppContent = () => {
  // Enable background refetching for critical dashboard data
  useDashboardBackgroundRefetch();

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/mercado" element={<Market />} />
        <Route path="/producao-nacional" element={<NationalProduction />} />
        <Route path="/distribuicao" element={<Distribution />} />
        <Route path="/exibicao" element={<Exhibition />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MainLayout>
  );
};

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
