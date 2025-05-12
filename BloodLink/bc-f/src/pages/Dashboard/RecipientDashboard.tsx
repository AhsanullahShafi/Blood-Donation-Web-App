import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DonorCard, DonorProps } from "@/components/donors/DonorCard";
import { Card } from "@/components/ui/card";
import axios from "axios"; // Import Axios
import { Navbar } from "@/components/layout/navbar";
import { toast } from "@/components/ui/sonner"; // Assuming you're using sonner for notifications
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import emailjs from "@emailjs/browser";
const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const RecipientDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useUser(); // Access user context

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBloodType, setSelectedBloodType] = useState<string>("all"); // Default to "all"
  const [availableOnly, setAvailableOnly] = useState(true);
  const [filteredDonors, setFilteredDonors] = useState<DonorProps[]>([]);
  const [loading, setLoading] = useState(false); // Add loading state
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDonors = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get("http://localhost:5000/api/donors", {
          // Backend URL
          params: {
            bloodType: selectedBloodType,
            availableOnly: availableOnly,
            searchTerm: searchTerm,
          },
        });
        setFilteredDonors(response.data);
      } catch (err) {
        console.error("Error fetching donors:", err);
        setError("Failed to fetch donors. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDonors();
  }, [searchTerm, selectedBloodType, availableOnly]);

  console.log(filteredDonors);

  const handleSearch = () => {
    // Trigger re-fetching of donors when the search button is clicked.
    // This is especially important if you want the search to happen only after
    // the user clicks the button, rather than on every keystroke.
    // This is optional, and you can remove this function and the onClick
    // handler on the <Button> component if you prefer immediate search updates.
  };
  const handleLogout = () => {
    // localStorage.removeItem("bloodlink_user");
    // setUser(null);
    // toast.success("Logged out successfully");

    // Clear the JWT token from localStorage (or cookies)
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
          <h1 className="text-3xl font-bold mb-2">Find Blood Donors</h1>
          <p className="text-muted-foreground">
            Search for available donors based on blood type and location
          </p>
        </div>

        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="search">Search by name or location</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Type to search..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bloodType">Blood Type</Label>
              <Select
                value={selectedBloodType}
                onValueChange={setSelectedBloodType}
              >
                <SelectTrigger id="bloodType">
                  <SelectValue placeholder="Select blood type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Blood Types</SelectItem>
                  {bloodTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="availability">Availability</Label>
              <Select
                value={availableOnly.toString()}
                onValueChange={(value) => setAvailableOnly(value === "true")}
              >
                <SelectTrigger id="availability">
                  <SelectValue placeholder="Availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Available Donors Only</SelectItem>
                  <SelectItem value="false">All Donors</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button className="mt-6 w-full md:w-auto" onClick={handleSearch}>
            <Search className="mr-2 h-4 w-4" />
            Search Donors
          </Button>
        </Card>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Search Results</h2>
            <p className="text-sm text-muted-foreground">
              {filteredDonors.length} donors found
            </p>
          </div>

          {loading && <p>Loading donors...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {filteredDonors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDonors.map((donor) => (
                <DonorCard key={donor.id} {...donor} />
              ))}
            </div>
          ) : (
            !loading &&
            !error && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium">No donors found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search filters
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default RecipientDashboard;
