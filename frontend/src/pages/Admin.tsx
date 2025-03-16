import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CouponCard from "../components/CouponCard";
import Navbar from "../components/Navbar";
import { PrimaryButton } from "../components/buttons/PrimaryButton";
import { SecondaryButton } from "../components/buttons/SecondaryButton";

// Define the Coupon type
interface Coupon {
    _id: string;
    code: string;
    isClaimed: boolean;
    isActive: boolean;
    claimedBy: Array<{ userId: string; claimedAt: string }>;
    createdAt: string;
    __v: number;
}

export default function Admin() {
    const [coupons, setCoupons] = useState<Coupon[]>([]); // State for existing coupons
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null); // Error state
    const [newCoupons, setNewCoupons] = useState<string[]>([""]); // State for new coupon codes, starting with one empty coupon
    const navigate = useNavigate(); // To handle navigation
    const API_URL = import.meta.env.VITE_API_URL as string || "http://localhost:3001"; // Load from .env

    // Get token from localStorage
    const token = localStorage.getItem("token");

    // Redirect to home if not logged in
    useEffect(() => {
        if (!token) {
            navigate("/");
        }
    }, [token, navigate]);

    // Fetch coupons from the backend
    const fetchCoupons = async () => {
        if (!token) {
            setError("No token found, please login.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}/api/admin/coupons`, {
                headers: { Authorization: `${token}` },
            });
            setCoupons(response.data.coupons);
        } catch (err) {
            setError("Failed to fetch coupons. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Add a new blank coupon field
    const addNewCouponCard = () => {
        setNewCoupons((prev) => [...prev, ""]);
    };

    // Handle coupon code change
    const handleCodeChange = (index: number, value: string) => {
        const updatedCoupons = [...newCoupons];
        updatedCoupons[index] = value;
        setNewCoupons(updatedCoupons);
    };

    // Submit new coupons
    const submitCoupons = async () => {
        if (!token) {
            setError("No token found, please login.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(
                `${API_URL}/api/admin/addcoupons`,
                { codes: newCoupons },
                { headers: { Authorization: `${token}` } }
            );
            setCoupons(response.data.coupons); // Update list
            setNewCoupons([""]); // Reset new coupon inputs
        } catch (err) {
            setError("Failed to add new coupons. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Navigate to Coupon Details Page
    const handleCouponEdit = (couponId: string) => {
        navigate(`/admin/coupon/${couponId}`);
    };

    return (
        <div>
            <Navbar
                button1={{ text: "Home", action: () => navigate("/") }}
                button2={{
                    text: "Logout",
                    action: () => {
                        localStorage.removeItem("token");
                        navigate("/");
                    },
                }}
            />

            <div className="p-6">
                {/* Add Coupons Section */}
                <div className="flex flex-col items-center justify-center mb-6 p-4 border rounded-lg shadow-lg">
                    <div className="mb-6">
                        <SecondaryButton onClick={addNewCouponCard}>Add More Coupons</SecondaryButton>
                    </div>

                    {/* New Coupon Inputs */}
                    <div className="flex flex-wrap mb-6 w-full justify-center gap-4">
                        {newCoupons.map((coupon, index) => (
                            <CouponCard
                                key={index}
                                index={index}
                                type="add"
                                code={coupon}
                                onCodeChange={handleCodeChange}
                                onEdit={() => {}}
                            />
                        ))}
                    </div>

                    {/* Submit Coupons Button */}
                    {newCoupons.length > 0 && (
                        <PrimaryButton onClick={submitCoupons} disabled={loading}>
                            {loading ? "Submitting..." : "Submit Coupons"}
                        </PrimaryButton>
                    )}
                </div>

                {/* View Coupons Section */}
                <div className="flex flex-col items-center justify-center mb-6 p-4 border rounded-lg shadow-lg">
                    <div className="mb-6">
                        <SecondaryButton onClick={fetchCoupons} disabled={loading}>
                            {loading ? "Loading..." : "Show Available Coupons"}
                        </SecondaryButton>
                    </div>

                    {/* Error Display */}
                    {error && <p className="text-red-500 text-center">{error}</p>}

                    {/* Display Coupons */}
                    <div className="flex flex-wrap w-full justify-center gap-4">
                        {coupons.map((coupon,index) => (
                            <CouponCard
                                key={coupon._id}
                                type="view"
                                code={coupon.code}
                                index={index}
                                onCodeChange={() => {}}
                                onEdit={() => handleCouponEdit(coupon._id)}
                                isActive={coupon.isActive}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
