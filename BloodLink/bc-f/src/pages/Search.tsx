
import { useState } from "react";
import { Search as SearchIcon, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DonorCard, DonorProps } from "@/components/donors/DonorCard";
import { Card } from "@/components/ui/card";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const areas = ["New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX", "Miami, FL"];

// Mock data for demonstration
const mockDonors: DonorProps[] = [
  {
    id: "1",
    name: "John Smith",
    bloodType: "O+",
    location: "New York, NY",
    available: true,
    age: 28,
    lastDonation: "3 months ago",
    contactEmail: "john@example.com",
    contactPhone: "+1234567890",
    donationType: "unpaid"
  },
  {
    id: "2",
    name: "Maria Garcia",
    bloodType: "A-",
    location: "Los Angeles, CA",
    available: true,
    age: 35,
    lastDonation: "6 months ago",
    contactEmail: "maria@example.com",
    contactPhone: "+1987654321",
    donationType: "unpaid"
  },
  {
    id: "3",
    name: "David Lee",
    bloodType: "B+",
    location: "Chicago, IL",
    available: true,
    age: 42,
    lastDonation: "1 month ago",
    contactEmail: "david@example.com",
    contactPhone: "+1122334455",
    donationType: "paid"
  }
];

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBloodType, setSelectedBloodType] = useState<string>("all");
  const [selectedArea, setSelectedArea] = useState<string>("all");
  const [filteredDonors, setFilteredDonors] = useState<DonorProps[]>(mockDonors);

  const handleSearch = () => {
    let results = mockDonors;
    
    if (selectedBloodType && selectedBloodType !== "all") {
      results = results.filter(donor => donor.bloodType === selectedBloodType);
    }
    
    if (selectedArea && selectedArea !== "all") {
      results = results.filter(donor => donor.location === selectedArea);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(donor => 
        donor.name.toLowerCase().includes(term)
      );
    }
    
    setFilteredDonors(results);
  };

  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Find Blood Donors</h1>
        <p className="text-muted-foreground">Search for available donors based on blood type and location</p>
      </div>

      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="search">Search by name</Label>
            <div className="relative">
              <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
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
                {bloodTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="area">Area</Label>
            <Select
              value={selectedArea}
              onValueChange={setSelectedArea}
            >
              <SelectTrigger id="area">
                <SelectValue placeholder="Select area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Areas</SelectItem>
                {areas.map(area => (
                  <SelectItem key={area} value={area}>{area}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button onClick={handleSearch} className="mt-6 w-full md:w-auto">
          <SearchIcon className="mr-2 h-4 w-4" />
          Search Donors
        </Button>
      </Card>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Search Results</h2>
          <p className="text-sm text-muted-foreground">{filteredDonors.length} donors found</p>
        </div>
        
        {filteredDonors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDonors.map(donor => (
              <DonorCard key={donor.id} {...donor} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">No donors found</h3>
            <p className="text-muted-foreground">Try adjusting your search filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
