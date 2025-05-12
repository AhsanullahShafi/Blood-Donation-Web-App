import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { Navbar } from "@/components/layout/navbar";
import axios from "axios";
import { useUser } from "@/context/UserContext";

export interface LoginData {
  email: string;
  password: string;
}

const Login = () => {
  const { setUser } = useUser(); // Use the setUser function from the context
  const handleLogout = () => {
    localStorage.removeItem("bloodlink_user"); //Clear from localStorage, will need to re-login when refreshed
    setUser(null); // --Assuming that set user is for setting global state with useContext or redux and will need to be used.
    toast.success("Logged out successfully");
  };

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard"; // Default redirect after login

  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      //Make request to our backend now
      const response = await axios.post("http://localhost:5000/api/login", {
        email: formData.email,
        password: formData.password,
      });

      // Assuming your backend sends back a token and user info
      const { token } = response.data;

      // Store token (e.g., in localStorage)
      localStorage.setItem("bloodlink_token", token);

      //Decode the jwt token for user information
      //To install, run npm i jwt-decode
      const jwt_decode = (token: any) => {
        try {
          return JSON.parse(atob(token.split(".")[1]));
        } catch (e) {
          return null;
        }
      };
      const decodedToken = jwt_decode(token);

      // Store user info using setUser from UserContext
      setUser(decodedToken); // Set user context

      //localStorage requires string format so wrap with JSON.stringify
      localStorage.setItem("bloodlink_user", JSON.stringify(decodedToken));

      toast.success("Successfully logged in!");
      navigate(from, { replace: true }); // redirect to original route
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to log in. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar user={{}} onLogout={handleLogout} />

      <div className="container flex items-center justify-center min-h-[85vh] py-8">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription>Sign in to your BloodLink account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="text-sm text-center text-muted-foreground mt-2">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default Login;
