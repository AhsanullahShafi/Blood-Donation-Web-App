
import { DollarSign, MapPin, Phone, Building } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface BloodRequestProps {
  id: string;
  organizationName: string;
  bloodType: string;
  location: string;
  contactNumber: string;
  price: number;
  urgency: "high" | "medium" | "low";
}

export function BloodRequestCard({
  organizationName,
  bloodType,
  location,
  contactNumber,
  price,
  urgency
}: BloodRequestProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="text-xl">{organizationName}</CardTitle>
          <Badge 
            variant={
              urgency === "high" 
                ? "destructive" 
                : urgency === "medium" 
                ? "default" 
                : "secondary"
            }
          >
            {urgency.charAt(0).toUpperCase() + urgency.slice(1)} Urgency
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Building className="h-4 w-4" />
          <span>Blood Type: {bloodType}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <DollarSign className="h-4 w-4" />
          <span>Price: ${price}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Phone className="h-4 w-4" />
          <span>Contact: {contactNumber}</span>
        </div>
      </CardContent>
    </Card>
  );
}
