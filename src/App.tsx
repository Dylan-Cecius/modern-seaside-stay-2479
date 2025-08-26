
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
// Pages temporairement supprimées mais conservées dans les imports pour réactivation future
// import Apartments from "./pages/Apartments";
// import Amenities from "./pages/Amenities"; 
// import Gallery from "./pages/Gallery";
// import Contact from "./pages/Contact";
// import BookingPage from "./pages/BookingPage";
import { LanguageProvider } from "./contexts/LanguageContext";

// Create a react-query client
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* Routes temporairement désactivées - À réactiver quand les pages seront prêtes */}
            {/* <Route path="/apartments" element={<Apartments />} />
            <Route path="/amenities" element={<Amenities />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/booking" element={<BookingPage />} /> */}
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
