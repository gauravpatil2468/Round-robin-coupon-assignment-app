import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { PrimaryButton } from "../components/buttons/PrimaryButton";
import { SecondaryButton } from "../components/buttons/SecondaryButton";

interface ClaimedBy {
  ip: string;
  sessionId: string;
  claimedAt: string;
}

interface Coupon {
  _id: string;
  code: string;
  isClaimed: boolean;
  isActive: boolean;
  claimedBy: ClaimedBy[];
  createdAt: string;
}

export default function CouponDetails() {
  const { id } = useParams<{ id: string }>(); // Get coupon ID from URL params
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedCode, setUpdatedCode] = useState("");
  const [updatedActiveStatus, setUpdatedActiveStatus] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL as string || "http://localhost:3001";
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      fetchCouponDetails();
    }
  }, [id, token]);

  const fetchCouponDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/admin/couponHistory/${id}`, {
        headers: { Authorization: `${token}` },
      });
      setCoupon(response.data.coupon);
      setUpdatedCode(response.data.coupon.code);
      setUpdatedActiveStatus(response.data.coupon.isActive);
    } catch (err) {
      setError("Failed to fetch coupon details.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCoupon = async () => {
    if (!coupon) return;

    setLoading(true);
    try {
      const response = await axios.put(
        `${API_URL}/api/admin/couponUpdate/${coupon._id}`,
        {
          code: updatedCode,
          isActive: updatedActiveStatus,
        },
        { headers: { Authorization: `${token}` } }
      );

      setCoupon(response.data.coupon);
      setIsEditing(false);
    } catch {
      setError("Failed to update coupon.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Coupon Details</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {coupon && (
        <div className="border p-4 rounded-lg shadow-lg">
          {isEditing ? (
            <>
              <label className="block font-semibold mb-2">Edit Coupon Code:</label>
              <input
                type="text"
                value={updatedCode}
                onChange={(e) => setUpdatedCode(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg mb-4"
              />

              <label className="block font-semibold mb-2">Active Status:</label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={updatedActiveStatus}
                  onChange={() => setUpdatedActiveStatus((prev) => !prev)}
                  className="w-5 h-5"
                />
                <span>{updatedActiveStatus ? "Active" : "Inactive"}</span>
              </label>

              <div className="flex space-x-4 mt-4">
                <PrimaryButton onClick={handleUpdateCoupon} disabled={loading}>
                  {loading ? "Updating..." : "Save Changes"}
                </PrimaryButton>
                <SecondaryButton onClick={() => setIsEditing(false)}>Cancel</SecondaryButton>
              </div>
            </>
          ) : (
            <>
              <p><strong>Coupon Code:</strong> {coupon.code}</p>
              <p><strong>Active:</strong> {coupon.isActive ? "Yes" : "No"}</p>
              <p><strong>Claimed:</strong> {coupon.isClaimed ? "Yes" : "No"}</p>

              <h3 className="mt-4 text-lg font-semibold">Claim History:</h3>
              <ul className="list-disc pl-5">
                {coupon.claimedBy.length > 0 ? (
                  coupon.claimedBy.map((claim, index) => (
                    <li key={index}>
                      <p><strong>IP:</strong> {claim.ip}</p>
                      <p><strong>Session:</strong> {claim.sessionId}</p>
                      <p><strong>Claimed At:</strong> {new Date(claim.claimedAt).toLocaleString()}</p>
                    </li>
                  ))
                ) : (
                  <p>No claims found.</p>
                )}
              </ul>

              <div className="flex space-x-4 mt-4">
                <PrimaryButton onClick={() => setIsEditing(true)}>Edit Coupon</PrimaryButton>
                <SecondaryButton onClick={() => navigate(-1)}>Go Back</SecondaryButton>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
