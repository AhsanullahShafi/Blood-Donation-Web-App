import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DonorDashboard from "./pages/Dashboard/DonorDashboard";
import RecipientDashboard from "./pages/Dashboard/RecipientDashboard";
import Search from "./pages/Search";
import NotFound from "./pages/NotFound";
import Events from "./pages/Events";
import BloodRequests from "./pages/BloodRequests";
import UserProvider, { useUser } from "./context/UserContext";
import Contact from "./pages/Contact";
// import { decode } from "jsonwebtoken"; // Import decode function from jsonwebtoken
const queryClient = new QueryClient();

// Create a ProtectedRoute component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useUser(); // Access user context

  let location = useLocation();

  // If not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const App = () => (
  <UserProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            {/* <Route path="/search" element={<Search />} />*/}
            <Route path="/events" element={<Events />} />
            <Route path="/blood-requests" element={<BloodRequests />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </UserProvider>
);

export default App;
