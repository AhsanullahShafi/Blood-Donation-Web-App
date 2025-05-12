// Register.jsx (Frontend)
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { AvatarUpload } from "@/components/ui/avatar-upload";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase, isSupabaseConfigured } from "@/lib/supabase"; // Assuming you still use supabase for auth.
import { Navbar } from "@/components/layout/navbar";
import axios from "axios"; // Import Axios

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  location: string;
  accountType: "donor" | "recipient";
  profileImage?: File;
}

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: "",
    accountType: "donor",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRadioChange = (value: "donor" | "recipient") => {
    setFormData({ ...formData, accountType: value });
  };

  const handleImageChange = (file: File) => {
    setFormData({ ...formData, profileImage: file });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      // Create FormData object
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("accountType", formData.accountType);

      if (formData.profileImage) {
        formDataToSend.append("profileImage", formData.profileImage); // Append the image
      }

      // Send the data to the backend API
      const response = await axios.post(
        "http://localhost:5000/api/register",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Important for file uploads
          },
        }
      );

      toast.success("Registration successful!");
      navigate("/login"); // Redirect to login page after successful registration
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(
        error?.response?.data?.message || "Registration failed" // Access the error message from the backend
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    // localStorage.removeItem("bloodlink_user");
    // setUser(null);
    // toast.success("Logged out successfully");
  };

  return (
    <>
      <Navbar user={{}} onLogout={handleLogout} />
      <div className="container flex items-center justify-center py-8">
        <Card className="w-full max-w-lg mx-auto">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl font-bold">
              Create an account
            </CardTitle>
            <CardDescription>
              Join BloodLink to connect donors and recipients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="mx-auto flex justify-center">
                <AvatarUpload onImageChange={handleImageChange} />
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
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

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>

                  <Input
                    id="location"
                    name="location"
                    placeholder="City, Country"
                    required
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Account Type</Label>
                  <RadioGroup
                    value={formData.accountType}
                    onValueChange={handleRadioChange as (value: string) => void}
                    className="flex flex-col md:flex-row gap-4"
                  >
                    <div className="flex items-center space-x-2 border rounded-md p-4 flex-1 cursor-pointer hover:border-primary transition-colors">
                      <RadioGroupItem value="donor" id="donor" />
                      <Label
                        htmlFor="donor"
                        className="cursor-pointer font-medium"
                      >
                        Blood Donor
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 border rounded-md p-4 flex-1 cursor-pointer hover:border-primary transition-colors">
                      <RadioGroupItem value="recipient" id="recipient" />
                      <Label
                        htmlFor="recipient"
                        className="cursor-pointer font-medium"
                      >
                        Blood Recipient
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="text-sm text-center text-muted-foreground mt-2">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default Register;
