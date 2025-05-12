import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import DonorDashboard from "./DonorDashboard";
import RecipientDashboard from "./RecipientDashboard";
import { toast } from "@/components/ui/sonner";
import { useUser } from "@/context/UserContext";

interface User {
  id: string;
  name: string;
  email: string;
  type: "donor" | "recipient";
}

const Dashboard = () => {
  const { user: curUser } = useUser(); // Access user context

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In a real app, this would check the user's authentication status
    // const storedUser = localStorage.getItem("bloodlink_user");
    // if (true) {
    //   try {
    //     const parsedUser = JSON.parse(storedUser);
    //     setUser(parsedUser);
    //   } catch (error) {
    //     console.error("Error parsing user data:", error);
    //     localStorage.removeItem("bloodlink_user");
    //     toast.error("Session expired. Please log in again.");
    //   }
    // }
    // setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (false) {
    return <Navigate to="/login" replace />;
  }

  return curUser.accountType === "donor" ? (
    <DonorDashboard />
  ) : (
    <RecipientDashboard />
  );
  // return <RecipientDashboard />;
};

export default Dashboard;
