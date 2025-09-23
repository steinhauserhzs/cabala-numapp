import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MapaPessoal from "./pages/MapaPessoal";
import MapaCompartilhado from "./pages/MapaCompartilhado";
import MapaEmpresarial from "./pages/MapaEmpresarial";
import HarmoniaConjugal from "./pages/HarmoniaConjugal";
import MapaInfantil from "./pages/MapaInfantil";
import AnaliseTelefone from "./pages/AnaliseTelefone";
import AnaliseEndereco from "./pages/AnaliseEndereco";
import AnalisePlaca from "./pages/AnalisePlaca";
import CorrecaoAssinatura from "./pages/CorrecaoAssinatura";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mapa-pessoal" element={<MapaPessoal />} />
          <Route path="/mapa/:slug" element={<MapaCompartilhado />} />
          <Route path="/mapa-empresarial" element={<MapaEmpresarial />} />
          <Route path="/harmonia-conjugal" element={<HarmoniaConjugal />} />
          <Route path="/mapa-infantil" element={<MapaInfantil />} />
          <Route path="/analise-telefone" element={<AnaliseTelefone />} />
          <Route path="/analise-endereco" element={<AnaliseEndereco />} />
          <Route path="/analise-placa" element={<AnalisePlaca />} />
          <Route path="/correcao-assinatura" element={<CorrecaoAssinatura />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={<Admin />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
