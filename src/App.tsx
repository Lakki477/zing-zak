
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import DiscoverPage from "./pages/DiscoverPage";
import UploadPage from "./pages/UploadPage";
import { InboxPage } from "./pages/MessagingPage";
import MessagingPage from "./pages/MessagingPage";
import ProfilePage from "./pages/ProfilePage";
import CommentsPage from "./pages/CommentsPage";
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
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/inbox" element={<InboxPage />} />
          <Route path="/messages/:userId" element={<MessagingPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />
          <Route path="/comments/:videoId" element={<CommentsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
