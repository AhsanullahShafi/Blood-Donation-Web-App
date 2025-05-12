import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MapPin, Mail, Phone } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { ContactForm } from "@/components/contact/ContactForm";
import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const { user, signOut } = useUser(); // Access user context
  const navigate = useNavigate();

  // Check if user is logged in on mount
  //   useEffect(() => {
  //     const storedUser = localStorage.getItem("bloodlink_user");
  //     if (storedUser) {
  //       try {
  //         const parsedUser = JSON.parse(storedUser);
  //         setUser(parsedUser);
  //       } catch (error) {
  //         console.error("Error parsing user data:", error);
  //       }
  //     }
  //   }, []);

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
      <Navbar user={user} onLogout={handleLogout} />

      <main className="py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're here to help. Reach out to us with any questions about
              donations, blood requests, or how to get involved.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-lg shadow-sm border">
              <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
              <ContactForm />
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-lg shadow-sm border">
                <h2 className="text-2xl font-semibold mb-6">
                  Contact Information
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <MapPin className="mr-4 text-bloodred shrink-0" />
                    <div>
                      <h3 className="font-medium">Main Office</h3>
                      <p className="text-muted-foreground">
                        123 Blood Drive, Medical District
                        <br />
                        San Francisco, CA 94143
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Mail className="mr-4 text-bloodred shrink-0" />
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-muted-foreground">
                        <a
                          href="mailto:info@bloodlink.org"
                          className="hover:text-bloodred"
                        >
                          info@bloodlink.org
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Phone className="mr-4 text-bloodred shrink-0" />
                    <div>
                      <h3 className="font-medium">Phone</h3>
                      <p className="text-muted-foreground">
                        <a
                          href="tel:+14155550123"
                          className="hover:text-bloodred"
                        >
                          (415) 555-0123
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-sm border">
                <h2 className="text-2xl font-semibold mb-6">Our Hours</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span>8:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday:</span>
                    <span>9:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday:</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Contact;
