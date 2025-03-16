import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PrimaryButton } from "../components/buttons/PrimaryButton";
import Navbar from "../components/Navbar";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001"; // Load from .env

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // If token exists, navigate to /admin
      navigate("/admin");
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${API_URL}/api/admin/login`, form);
      const token = response.data.token; // Assuming { token: "JWT_TOKEN" }

      localStorage.setItem("token", token);
     

      // Add a delay (timeout) before navigating to /admin
      setTimeout(() => {
        // Ensure token is set before redirecting
        const tokenFromStorage = localStorage.getItem("token");
        if (tokenFromStorage) {
          navigate("/admin");
        } else {

          navigate("/");
        }
      }, 200); // 200ms delay to ensure token is set
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Define button 1 (Home)
  const button1 = {
    text: "Home", // Always Home
    action: () => navigate("/"), // Navigate to Home page
  };

  // Define button 2 (Claim)
  const button2 = {
    text: "Claim", // Always Claim
    action: () => navigate("/claim"), // Navigate to Claim page
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar button1={button1} button2={button2} />
      <div className="flex flex-grow items-center justify-center bg-gray-100 px-4">
        <div className="bg-white p-6 shadow-lg rounded-xl w-full max-w-md sm:max-w-lg lg:max-w-2xl">
          <h2 className="text-3xl font-bold text-center mb-6 sm:text-4xl">Admin Login</h2>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Username"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
              required
            />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
              required
            />
            <div className="flex justify-center">
              <PrimaryButton size="big" onClick={()=>handleSubmit} disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </PrimaryButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
