import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios"; // Import Axios
import { useUser } from "@/context/UserContext";
import { Navbar } from "@/components/layout/navbar";
import { useNavigate } from "react-router-dom";

interface DonorProfile {
  age: string;
  bloodType: string;
  lastDonation: string;
  sickness: string;
  medication: string;
  donationType: "paid" | "unpaid";
  available: boolean;
  contactPhone: string;
  donationNumber: number;
  _id?: string; // Add _id for existing profiles
}

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const DonorDashboard = () => {
  const navigate = useNavigate();

  const { user, signOut } = useUser(); // Access user context
  const [profile, setProfile] = useState<DonorProfile>({
    _id: "",
    age: "",
    bloodType: "",
    lastDonation: "",
    sickness: "",
    medication: "",
    donationType: "unpaid",
    available: true,
    contactPhone: "",
    donationNumber: 0,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Assuming you have an API endpoint to fetch donor profile by user ID
        const response = await axios.get(
          `http://localhost:5000/api/donor-profile/${user._id}` // Use user ID to fetch profile
        );
        console.log("Fetched profile:", response.data);
        setProfile(response.data);
        console.log("profile State:", profile);
      } catch (error) {
        console.error("Error fetching donor profile:", error);
        toast.error(
          "User data does not exist, please enter your profile details"
        );
        //If not data is returned, then set blank
        setProfile({
          _id: "",
          age: "",
          bloodType: "",
          lastDonation: "",
          sickness: "",
          medication: "",
          donationType: "unpaid",
          available: true,
          contactPhone: "",
          donationNumber: 0,
        });
      }
    };

    if (user) {
      console.log("does user exist", user);

      // Fetch profile only if user is logged in
      fetchProfile();
    }
  }, [user]); // Fetch data when user changes (login/logout)

  const handleChange = (
    field: keyof DonorProfile,
    value: string | number | boolean
  ) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleAvailability = async () => {
    const newAvailability = !profile.available;

    setProfile((prev) => ({
      ...prev,
      available: newAvailability,
    }));

    toast.success(
      `You are now ${
        newAvailability ? "available" : "unavailable"
      } for donation`
    );

    // Call backend to update immediately
    try {
      if (profile._id) {
        await axios.put(
          `http://localhost:5000/api/donor-profile/${profile._id}`,
          {
            ...profile,
            available: newAvailability,
          }
        );
      }
    } catch (error) {
      console.error("Error updating availability:", error);
      toast.error("Failed to update availability");
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    console.log("Saving profile:", profile);
    console.log("user", user);

    try {
      if (profile._id) {
        console.log("from if", profile._id);

        // Profile exists, so update by profile._id, NOT user._id
        await axios.put(
          `http://localhost:5000/api/donor-profile/${profile._id}`,
          profile
        );
      } else {
        console.log("from else");
        console.log("profile", profile);

        // Profile doesn't exist, create new
        await axios.post("http://localhost:5000/api/donor-profile", {
          ...profile,
          userId: user._id,
        });
      }

      // await axios.post("http://localhost:5000/api/donor-profile", {
      //   ...profile,
      //   userId: user._id,
      // });

      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving donor profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
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
          <h1 className="text-3xl font-bold mb-2">Donor Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your donor profile and availability
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Donor Profile</CardTitle>
              <CardDescription>
                Update your information to help recipients find you based on
                their needs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border-2 border-muted">
                  <AvatarFallback className="bg-primary text-white text-xl">
                    {profile.name ? profile.name.charAt(0) : "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold">{profile.name}</h2>
                  <p className="text-muted-foreground">{profile.location}</p>
                </div>
              </div> */}

              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                    />
                  </div> */}

                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={profile.age}
                      onChange={(e) => handleChange("age", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bloodType">Blood Type</Label>
                    <Select
                      value={profile.bloodType}
                      onValueChange={(value) =>
                        handleChange("bloodType", value)
                      }
                    >
                      <SelectTrigger id="bloodType">
                        <SelectValue placeholder="Select blood type" />
                      </SelectTrigger>
                      <SelectContent>
                        {bloodTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastDonation">Last Donation Date</Label>
                    <Input
                      id="lastDonation"
                      type="date"
                      value={profile.lastDonation}
                      onChange={(e) =>
                        handleChange("lastDonation", e.target.value)
                      }
                    />
                  </div>

                  {/* <div className="space-y-2">
                    <Label htmlFor="location">Current Location</Label>
                    <Input
                      id="location"
                      value={profile.location}
                      onChange={(e) => handleChange("location", e.target.value)}
                    />
                  </div> */}

                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input
                      id="contactPhone"
                      value={profile.contactPhone}
                      onChange={(e) =>
                        handleChange("contactPhone", e.target.value)
                      }
                    />
                  </div>

                  {/* <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={profile.contactEmail}
                      onChange={(e) =>
                        handleChange("contactEmail", e.target.value)
                      }
                    />
                  </div> */}

                  <div className="space-y-2">
                    <Label htmlFor="donationType">Donation Type</Label>
                    <Select
                      value={profile.donationType}
                      onValueChange={(value) =>
                        handleChange("donationType", value as "paid" | "unpaid")
                      }
                    >
                      <SelectTrigger id="donationType">
                        <SelectValue placeholder="Select donation type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="unpaid">Unpaid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="donationNumber">Number of Donations</Label>
                    <Input
                      id="donationNumber"
                      type="number"
                      value={profile.donationNumber}
                      onChange={(e) =>
                        handleChange("donationNumber", e.target.value)
                      }
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="sickness">Sickness History</Label>
                    <Textarea
                      id="sickness"
                      placeholder="List any past or current medical conditions..."
                      value={profile.sickness}
                      onChange={(e) => handleChange("sickness", e.target.value)}
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="medication">Medication History</Label>
                    <Textarea
                      id="medication"
                      placeholder="List any medications you are taking..."
                      value={profile.medication}
                      onChange={(e) =>
                        handleChange("medication", e.target.value)
                      }
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Blood Type
                      </h3>
                      <p className="text-2xl font-bold text-bloodred">
                        {profile.bloodType}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Age
                      </h3>
                      <p>{profile.age} years</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Last Donation
                      </h3>
                      <p>
                        {profile.lastDonation
                          ? new Date(profile.lastDonation).toLocaleDateString()
                          : "Not specified"}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Donation Type
                      </h3>
                      <p className="capitalize">{profile.donationType}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Contact Phone
                      </h3>
                      <p>{profile.contactPhone}</p>
                    </div>

                    {/* <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Contact Email
                      </h3>
                      <p>{profile.contactEmail}</p>
                    </div> */}

                    <div className="md:col-span-2">
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Sickness History
                      </h3>
                      <p>{profile.sickness || "None reported"}</p>
                    </div>

                    <div className="md:col-span-2">
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Medication History
                      </h3>
                      <p>{profile.medication || "None reported"}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
              )}
            </CardFooter>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Availability Status</CardTitle>
                <CardDescription>
                  Toggle your availability to let recipients know you're ready
                  to donate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center gap-4 py-4">
                  <div
                    className={`h-20 w-20 rounded-full flex items-center justify-center ${
                      profile.available ? "bg-green-100" : "bg-gray-100"
                    }`}
                  >
                    <div
                      className={`h-16 w-16 rounded-full ${
                        profile.available
                          ? "bg-green-500 animate-pulse-subtle"
                          : "bg-gray-300"
                      }`}
                    ></div>
                  </div>
                  <p className="font-medium text-lg">
                    {profile.available
                      ? "Available for Donation"
                      : "Not Available"}
                  </p>
                </div>

                <div className="flex items-center space-x-2 mt-4">
                  <Switch
                    checked={profile.available}
                    onCheckedChange={toggleAvailability}
                    id="availability"
                  />
                  <Label htmlFor="availability">
                    {profile.available
                      ? "I'm available to donate"
                      : "I'm not available right now"}
                  </Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Donation Stats</CardTitle>
                <CardDescription>
                  Your blood donation history and impact
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      Total Donations
                    </span>
                    <span className="font-semibold">
                      {profile.donationNumber}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Last Donation</span>
                    <span className="font-semibold">
                      {profile.lastDonation
                        ? new Date(profile.lastDonation).toLocaleDateString()
                        : "Not specified"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default DonorDashboard;
