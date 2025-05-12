"use client"; // Make sure you have this if using client-side components

import React, { useState, useEffect } from "react";
import axios from "axios";
import { CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { EventCard, EventProps } from "@/components/events/EventCard";
import { Navbar } from "@/components/layout/navbar";
import { toast } from "@/components/ui/sonner";
import { useUser } from "@/context/UserContext";

interface EventForm {
  title: string;
  date: string;
  location: string;
  description: string;
  type: "blood_donation" | "awareness";
  expectedAttendees: string;
}

const Events = () => {
  const [events, setEvents] = useState<EventProps[]>([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"blood_donation" | "awareness">(
    "blood_donation"
  );
  const [expectedAttendees, setExpectedAttendees] = useState("");
  const { user, setUser } = useUser(); // Access user context

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/events");
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
        toast.error("Failed to load events.");
      }
    };

    fetchEvents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newEventData: EventForm = {
      title,
      date,
      location,
      description,
      type,
      expectedAttendees,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/events",
        newEventData
      );
      setEvents([response.data, ...events]); // Add new event to the state

      // Reset form
      setTitle("");
      setDate("");
      setLocation("");
      setDescription("");
      setType("blood_donation");
      setExpectedAttendees("");

      toast.success("Event created successfully!");
    } catch (error: any) {
      console.error("Error creating event:", error);
      toast.error(error.message || "Failed to create event.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("bloodlink_user");
    setUser(null);
    toast.success("Logged out successfully");
  };

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />

      <div className="container py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Blood Donation Events</h1>
          <p className="text-muted-foreground">
            Create and discover blood donation events in your area
          </p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Form inputs (same as before, but using state variables) */}
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
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
                <Label htmlFor="type">Event Type</Label>
                <Select
                  value={type}
                  onValueChange={(value: "blood_donation" | "awareness") =>
                    setType(value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blood_donation">
                      Blood Donation
                    </SelectItem>
                    <SelectItem value="awareness">Awareness Program</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expectedAttendees">Expected Attendees</Label>
                <Input
                  id="expectedAttendees"
                  type="number"
                  value={expectedAttendees}
                  onChange={(e) => setExpectedAttendees(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full md:w-auto">
              <CalendarPlus className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          </form>
        </Card>

        <div>
          <h2 className="text-2xl font-semibold mb-6">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event._id} {...event} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Events;
