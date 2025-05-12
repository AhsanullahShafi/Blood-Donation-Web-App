import { Calendar, MapPin, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface EventProps {
  _id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  type: "blood_donation" | "awareness";
  expectedAttendees: number;
}

export function EventCard({
  title,
  date,
  location,
  description,
  type,
  expectedAttendees,
}: EventProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="text-xl">{title}</CardTitle>
          <Badge
            variant={type === "blood_donation" ? "destructive" : "secondary"}
          >
            {type === "blood_donation" ? "Blood Donation" : "Awareness"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{date}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{expectedAttendees} expected attendees</span>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
