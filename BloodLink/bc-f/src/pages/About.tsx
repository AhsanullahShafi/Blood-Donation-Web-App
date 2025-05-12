import { Heart, Users, Clock, Award, Phone, Mail, MapPin } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/navbar";
import { useUser } from "@/context/UserContext";
import { toast } from "@/components/ui/sonner";

function About() {
  const { user, signOut } = useUser(); // Access user context
  const navigate = useNavigate();

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

      <div className="min-h-screen flex flex-col">
        {/* Hero Section */}
        <div
          className="relative h-[400px] bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&q=80&w=2000")',
          }}
        >
          <div className="absolute inset-0 bg-red-900/70">
            <div className="container mx-auto px-6 h-full flex items-center">
              <div className="text-white max-w-2xl">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Saving Lives Together
                </h1>
                <p className="text-xl opacity-90">
                  Every drop counts in our mission to create a healthier
                  community through voluntary blood donation.
                </p>
                <div className="mt-8">
                  <Link
                    to="/register"
                    className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors"
                  >
                    Become a Donor
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600">
                We are dedicated to ensuring a safe and sustainable blood supply
                for our community while connecting generous donors with patients
                in need.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-red-50 p-6 rounded-lg text-center transform hover:scale-105 transition-transform">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Save Lives</h3>
                <p className="text-gray-600">
                  Your donation can save up to three lives with a single
                  contribution.
                </p>
              </div>

              <div className="bg-red-50 p-6 rounded-lg text-center transform hover:scale-105 transition-transform">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Community First</h3>
                <p className="text-gray-600">
                  Building a network of committed donors to support local
                  healthcare needs.
                </p>
              </div>

              <div className="bg-red-50 p-6 rounded-lg text-center transform hover:scale-105 transition-transform">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Quick Process</h3>
                <p className="text-gray-600">
                  Efficient donation process that respects your time and
                  commitment.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Impact Section */}
        <div className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Our Impact
                </h2>
                <p className="text-lg text-gray-600">
                  Making a difference in our community since 2020
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="bg-white p-8 rounded-lg shadow-sm">
                  <div className="text-4xl font-bold text-red-600 mb-2">
                    50,000+
                  </div>
                  <div className="text-gray-600">Donations Collected</div>
                </div>
                <div className="bg-white p-8 rounded-lg shadow-sm">
                  <div className="text-4xl font-bold text-red-600 mb-2">
                    150,000+
                  </div>
                  <div className="text-gray-600">Lives Saved</div>
                </div>
                <div className="bg-white p-8 rounded-lg shadow-sm">
                  <div className="text-4xl font-bold text-red-600 mb-2">
                    1,000+
                  </div>
                  <div className="text-gray-600">Regular Donors</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Get in Touch
                </h2>
                <p className="text-lg text-gray-600">
                  Have questions? We're here to help.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="flex items-center gap-4 bg-red-50 p-6 rounded-lg">
                  <Phone className="w-6 h-6 text-red-600" />
                  <div>
                    <div className="font-semibold">Phone</div>
                    <div className="text-gray-600">1-800-DONATE</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-red-50 p-6 rounded-lg">
                  <Mail className="w-6 h-6 text-red-600" />
                  <div>
                    <div className="font-semibold">Email</div>
                    <div className="text-gray-600">
                      contact@blooddonation.org
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-red-50 p-6 rounded-lg">
                  <MapPin className="w-6 h-6 text-red-600" />
                  <div>
                    <div className="font-semibold">Location</div>
                    <div className="text-gray-600">123 Health Street</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}

export default About;
