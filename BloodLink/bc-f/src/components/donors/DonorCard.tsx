import { UserCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useRef, useState } from "react";
import { toast } from "@/components/ui/sonner";
import { useUser } from "@/context/UserContext";
import emailjs from "@emailjs/browser";

export interface DonorProps {
  id: string;
  name: string;
  bloodType: string;
  location: string;
  available: boolean;
  age?: number;
  lastDonation?: string;
  contactEmail?: string;
  contactPhone?: string;
  image?: string;
  donationType: "paid" | "unpaid";
}

export function DonorCard({
  id,
  name,
  bloodType,
  location,
  available,
  age,
  lastDonation,
  contactEmail,
  contactPhone,
  image,
  donationType,
}: DonorProps) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const formRef = useRef(null);

  const { user, signOut } = useUser(); // Access user context

  const handleSendMessage = async (e: any) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }
    console.log(e.target.value, "e.target");

    setIsSending(true);

    emailjs.sendForm(
      "service_sd16s4c",
      "template_zv84f0l",
      formRef.current,
      "wb57V38hBWaGA3N2T"
    );
    console.log("Sending message to donor:", formRef.current);

    try {
      // In a real app, this would send an email or message
      console.log("Sending message to donor:", id, message);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Message sent successfully!");
      setMessage("");
      setDialogOpen(false);
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="blood-card overflow-hidden">
      <div className="relative">
        {available ? (
          <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600">
            Available
          </Badge>
        ) : (
          <Badge variant="outline" className="absolute top-2 right-2 bg-muted">
            Unavailable
          </Badge>
        )}
        <div
          className={`p-6 ${
            donationType === "unpaid" ? "bg-bloodblue/10" : "bg-bloodred/10"
          }`}
        >
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-white">
              {image ? (
                <AvatarImage src={image} alt={user.name} />
              ) : (
                <AvatarFallback className="bg-primary text-white text-xl">
                  {user.name.charAt(0)}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.location}</p>
            </div>
          </div>
        </div>
      </div>
      <CardContent className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Blood Type</p>
            <p className="text-xl font-bold text-bloodred">{bloodType}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Donation Type</p>
            <p className="text-sm font-medium capitalize">{donationType}</p>
          </div>
          {age && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Age</p>
              <p className="text-sm font-medium">{age} years</p>
            </div>
          )}
          {lastDonation && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Last Donation</p>
              <p className="text-sm font-medium">{lastDonation}</p>
            </div>
          )}
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="w-full mt-4"
              disabled={!available}
              variant={available ? "default" : "outline"}
            >
              <UserCheck className="mr-2 h-4 w-4" />
              {available ? "Contact Donor" : "Currently Unavailable"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Contact {user.name}</DialogTitle>
              <DialogDescription>
                Send a message to this donor. They will receive your contact
                information to get back to you.
              </DialogDescription>
            </DialogHeader>
            <form ref={formRef} onSubmit={handleSendMessage}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <div className="col-span-4">
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Explain why you need blood donation, including any urgency or special requirements..."
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="resize-none"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSending}>
                  {isSending ? "Sending..." : "Send message"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
