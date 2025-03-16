import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { PrimaryButton } from "../components/buttons/PrimaryButton";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Claim() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState<string | null>(null); // Error state
    const [success, setSuccess] = useState<string | null>(null); // Success state
    const [couponId, setCouponId] = useState<string | null>(null); // Coupon ID state
    const [remainingTime, setRemainingTime] = useState<number | null>(null); // Remaining time (ms)
    const [timeLeft, setTimeLeft] = useState<{ hours: number, minutes: number, seconds: number } | null>(null); // Formatted countdown
    const API_URL = import.meta.env.VITE_API_URL as string || "http://localhost:3001"; // Load from .env
    const button1 = {
        text: "Home",
        action: () => {
            navigate("/"); // Navigate to home page
        },
    };

    // Countdown effect
    useEffect(() => {
        if (remainingTime === null || remainingTime <= 0) {
            setTimeLeft(null);
            return;
        }

        const interval = setInterval(() => {
            setRemainingTime((prev) => (prev ? prev - 1000 : null));
        }, 1000);

        return () => clearInterval(interval);
    }, [remainingTime]);

    useEffect(() => {
        if (remainingTime && remainingTime > 0) {
            const totalSeconds = Math.floor(remainingTime / 1000);
            setTimeLeft({
                hours: Math.floor(totalSeconds / 3600),
                minutes: Math.floor((totalSeconds % 3600) / 60),
                seconds: totalSeconds % 60,
            });
        }
    }, [remainingTime]);

    const handleClaimCoupon = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        setCouponId(null);
        setRemainingTime(null);
        setTimeLeft(null);

        try {
            const response = await axios.post(
                `${API_URL}/api/coupons/claim`,
                {},
                {
                    headers: {
                        Authorization: `${localStorage.getItem("token")}`,
                    },
                    withCredentials: true, // Ensures cookies are sent
                }
            );

            if (response.data && response.data.coupon) {
                setSuccess("Coupon claimed successfully!");
                setCouponId(response.data.coupon.code);
            }
        } catch (err: any) {
            if (err.response) {
                if (err.response.status === 429) {
                    const remainingTimeMs = err.response.data.remainingTimeMs;
                    setError(err.response.data.message);
                    setRemainingTime(remainingTimeMs);
                } else {
                    setError("Failed to claim coupon. Please try again.");
                }
            } else {
                setError("Network error. Please check your connection.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen">
            <Navbar button1={button1} />
            <div className="flex flex-grow items-center justify-center bg-gray-100 px-4">
                <div className="bg-white p-6 shadow-lg rounded-xl w-full max-w-md sm:max-w-lg lg:max-w-2xl text-center h-full max-h-6/12 flex flex-col items-center justify-center space-y-6">
                    <h2 className="text-3xl font-bold mb-6">Claim a Coupon</h2>

                    {/* Success or Error Messages */}
                    {success && <p className="text-green-500 mb-4">{success}</p>}
                    {couponId && <p className="text-blue-500 mb-4">Your coupon Code: {couponId}</p>}
                    {error && <p className="text-red-500 mb-4">{error}</p>}

                    {/* Claim Button */}
                    <PrimaryButton size="big" onClick={handleClaimCoupon} disabled={loading}>
                        {loading ? "Claiming..." : "Claim Coupon"}
                    </PrimaryButton>

                    {/* Countdown Display */}
                    {timeLeft && remainingTime && remainingTime > 0 && (
                        <p className="mt-4 text-yellow-500">
                            Please wait for {`${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`} before claiming again.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
