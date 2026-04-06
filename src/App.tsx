import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index.tsx";
import SearchResults from "./pages/SearchResults.tsx";
import ListingDetail from "./pages/ListingDetail.tsx";
import NotFound from "./pages/NotFound.tsx";
import OwnerDashboard from "./pages/OwnerDashboard.tsx";
import Messages from "./pages/Messages.tsx";
import AddListing from "./pages/AddListing.tsx";
import Auth from "./pages/Auth.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import Profile from "./pages/Profile.tsx";
import BrowseWorkers from "./pages/BrowseWorkers.tsx";
import WorkerSignup from "./pages/WorkerSignup.tsx";
import WorkerDetail from "./pages/WorkerDetail.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/listing/:id" element={<ListingDetail />} />
            <Route path="/dashboard" element={<OwnerDashboard />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/add-listing" element={<AddListing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/workers" element={<BrowseWorkers />} />
            <Route path="/worker-signup" element={<WorkerSignup />} />
            <Route path="/worker/:id" element={<WorkerDetail />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
