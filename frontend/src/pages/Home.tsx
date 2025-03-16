import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Home() {
  const navigate = useNavigate();

  // Get the token from localStorage
  const token = localStorage.getItem("token");

  // Define button 1 (Admin Login or Admin)
  const button1 = {
    text: token ? "Admin" : "Admin Login", // Change text based on token
    action: () => {
      if (token) {
        // If token exists, navigate to the Admin page
        navigate("/admin");
      } else {
        // If no token, navigate to the Login page
        navigate("/login");
      }
    },
  };

  // Define button 2 (Claim)
  const button2 = {
    text: "Claim", // Always Claim regardless of token
    action: () => navigate("/claim"),
  };

  return (
    <div>
      <Navbar button1={button1} button2={button2} />
      <div className="flex flex-col items-center justify-center p-6 space-y-8">
        {/* Title */}
        <div className="text-3xl font-bold text-center">
          Welcome to CouponApp
        </div>

        {/* Animated Video Section */}
        <div className="relative w-full max-w-4xl">
          <video
            className="w-full rounded-lg shadow-lg"
            autoPlay
            loop
            muted
            src="/discount.mp4"
          >
            Your browser does not support the video tag.
          </video>
          
        </div>

        {/* Some Text or Call to Action */}
        <div className="text-center text-lg text-gray-600">
          Get the best deals and save big on your purchases! Explore our collection of coupons today.
        </div>
      </div>
    </div>
  );
}
