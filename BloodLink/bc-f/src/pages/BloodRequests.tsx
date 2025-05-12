import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Building } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Navbar } from "@/components/layout/navbar";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { toast } from "@/components/ui/sonner"; // Assuming you're using sonner for notifications

// Define the BloodRequestProps interface
interface BloodRequestProps {
  _id?: string; // Changed id to _id to match MongoDB and made it optional for creation
  organizationName: string;
  bloodType: string;
  location: string;
  contactNumber: string;
  price: number;
  urgency: "high" | "medium" | "low";
}

const BloodRequestCard = ({
  organizationName,
  bloodType,
  location,
  contactNumber,
  price,
  urgency,
}: BloodRequestProps) => (
  <Card>
    <CardHeader>
      <CardTitle>{organizationName}</CardTitle>
      <CardDescription>{location}</CardDescription>
    </CardHeader>
    <CardContent className="space-y-2">
      <p>Blood Type: {bloodType}</p>
      <p>Contact: {contactNumber}</p>
      <p>Price: ${price}</p>
      <p>Urgency: {urgency}</p>
    </CardContent>
    <CardFooter>
      <Button>Contact</Button>
    </CardFooter>
  </Card>
);

const BloodRequests = () => {
  const [requests, setRequests] = useState<BloodRequestProps[]>([]); // Initialize as empty array
  const [organizationName, setOrganizationName] = useState("");
  const [bloodType, setBloodType] = useState("A+");
  const [location, setLocation] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [price, setPrice] = useState("");
  const [urgency, setUrgency] = useState<"high" | "medium" | "low">("medium");
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [error, setError] = useState<string | null>(null); // Add error state

  const { user, signOut } = useUser(); // Access user context

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          "http://localhost:5000/api/blood-requests"
        ); // Corrected endpoint
        setRequests(response.data);
      } catch (err: any) {
        console.error("Error fetching requests:", err);
        setError(err.message || "Failed to fetch blood requests"); // Handle errors
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newRequest: BloodRequestProps = {
      organizationName,
      bloodType,
      location,
      contactNumber,
      price: parseFloat(price),
      urgency,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/blood-requests",
        newRequest
      ); // Corrected endpoint
      setRequests([response.data, ...requests]); // Add the response (with the _id)
      // Reset form
      setOrganizationName("");
      setBloodType("A+");
      setLocation("");
      setContactNumber("");
      setPrice("");
      setUrgency("medium");
    } catch (err: any) {
      console.error("Error creating request:", err);
      setError(err.message || "Failed to create blood request");
    }
  };

  if (isLoading) {
    return <div>Loading blood requests...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleLogout = () => {
    localStorage.removeItem("bloodlink_token");
    localStorage.removeItem("bloodlink_user"); // Remove user info too
    signOut();
    // Call the logout function passed from the parent component
    toast.success("Logged out successfully"); // Display a success message
    navigate("/"); // Redirect to the homepage or login page, whatever is appropriate
  };

  return (
    <>
      <Navbar user={{}} onLogout={handleLogout} />
      <div className="container py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Blood Donation Requests</h1>
          <p className="text-muted-foreground">
            Post blood donation requests or find requests near you
          </p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="organizationName">Organization Name</Label>
                <Input
                  id="organizationName"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bloodType">Blood Type</Label>
                <Select value={bloodType} onValueChange={setBloodType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                      (type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number</Label>
                <Input
                  id="contactNumber"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="urgency">Urgency Level</Label>
                <Select
                  value={urgency}
                  onValueChange={(value: "high" | "medium" | "low") =>
                    setUrgency(value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full md:w-auto">
              <Building className="mr-2 h-4 w-4" />
              Post Request
            </Button>
          </form>
        </Card>

        <div>
          <h2 className="text-2xl font-semibold mb-6">Current Requests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests &&
              requests.map((request) => (
                <BloodRequestCard key={request._id} {...request} /> // Changed key to _id
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default BloodRequests;
