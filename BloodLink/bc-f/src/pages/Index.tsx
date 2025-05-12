import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Droplet, MapPin, Users, Clock, Heart } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { toast } from "@/components/ui/sonner";
import { useUser } from "@/context/UserContext";

interface User {
  name?: string;
  avatar?: string;
  type?: "donor" | "recipient";
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const { user: currUser, signOut } = useUser(); // Access user context
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("bloodlink_user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("bloodlink_user");
      }
    }
  }, []);

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
      <Navbar user={currUser} onLogout={handleLogout} />

      <main>
        {/* Hero Section */}
        <section className="blood-gradient-bg text-white py-16 md:py-24">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Connect, Share, Save Lives
              </h1>
              <p className="text-lg md:text-xl opacity-90 max-w-md">
                BloodLink connects blood donors with recipients, making it
                easier for people to find the blood they need when they need it.
              </p>
              <div className="flex flex-wrap gap-4">
                {user ? (
                  <Button asChild size="lg" className="gap-1">
                    <Link to="/dashboard">
                      Go to Dashboard <ArrowRight size={16} />
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild size="lg" className="gap-1">
                      <Link to="/register">
                        Become a Donor <ArrowRight size={16} />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                    >
                      <Link to="/register">Find Blood</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="relative hidden md:block">
              <div className="aspect-square bg-white/10 rounded-full absolute -top-10 -right-10 w-48"></div>
              <div className="aspect-square bg-white/10 rounded-full absolute -bottom-10 -left-10 w-36"></div>
              <img
                src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80"
                alt="Blood Donation"
                className="rounded-lg shadow-xl relative z-10 object-cover aspect-video"
              />
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How BloodLink Works</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our platform makes it easy to connect blood donors with
                recipients in just a few simple steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="w-16 h-16 bg-bloodred/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-bloodred" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Create an Account
                </h3>
                <p className="text-gray-600">
                  Sign up as a donor or recipient to get started with our
                  platform
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="w-16 h-16 bg-bloodred/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Droplet className="h-8 w-8 text-bloodred" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Complete Your Profile
                </h3>
                <p className="text-gray-600">
                  Add your blood type, location, and availability as a donor
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="w-16 h-16 bg-bloodred/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-bloodred" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Connect Instantly
                </h3>
                <p className="text-gray-600">
                  Recipients can search for donors by blood type and location
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="py-16">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <p className="text-4xl font-bold text-bloodred mb-2">1,200+</p>
                <p className="text-gray-600">Registered Donors</p>
              </div>

              <div className="text-center">
                <p className="text-4xl font-bold text-bloodred mb-2">850+</p>
                <p className="text-gray-600">Recipients Helped</p>
              </div>

              <div className="text-center">
                <p className="text-4xl font-bold text-bloodred mb-2">450+</p>
                <p className="text-gray-600">Successful Donations</p>
              </div>

              <div className="text-center">
                <p className="text-4xl font-bold text-bloodred mb-2">30+</p>
                <p className="text-gray-600">Cities Covered</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-bloodblue text-white py-16">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl max-w-2xl mx-auto mb-8">
              Join our community of blood donors and recipients today. Your
              donation could save a life.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-white text-bloodblue hover:bg-gray-100"
              >
                <Link to="/register">Register as a Donor</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                <Link to="/register">Find Blood</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose BloodLink</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our platform offers several benefits to both donors and
                recipients
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-6 border rounded-lg">
                <Clock className="h-8 w-8 text-bloodred mb-4" />
                <h3 className="text-xl font-semibold mb-2">Quick Response</h3>
                <p className="text-gray-600">
                  Find donors quickly in emergency situations with our efficient
                  search system
                </p>
              </div>

              <div className="p-6 border rounded-lg">
                <MapPin className="h-8 w-8 text-bloodred mb-4" />
                <h3 className="text-xl font-semibold mb-2">Location-Based</h3>
                <p className="text-gray-600">
                  Search for donors near you to minimize travel time during
                  emergencies
                </p>
              </div>

              <div className="p-6 border rounded-lg">
                <Heart className="h-8 w-8 text-bloodred mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Life-Saving Impact
                </h3>
                <p className="text-gray-600">
                  Make a real difference by connecting those in need with
                  willing donors
                </p>
              </div>

              <div className="p-6 border rounded-lg">
                <Users className="h-8 w-8 text-bloodred mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Growing Community
                </h3>
                <p className="text-gray-600">
                  Join thousands of donors and recipients already using our
                  platform
                </p>
              </div>

              <div className="p-6 border rounded-lg">
                <Droplet className="h-8 w-8 text-bloodred mb-4" />
                <h3 className="text-xl font-semibold mb-2">All Blood Types</h3>
                <p className="text-gray-600">
                  Find donors for all blood types, including rare ones
                </p>
              </div>

              <div className="p-6 border rounded-lg">
                <ArrowRight className="h-8 w-8 text-bloodred mb-4" />
                <h3 className="text-xl font-semibold mb-2">Easy Process</h3>
                <p className="text-gray-600">
                  Simple registration and profile management for both donors and
                  recipients
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Index;
