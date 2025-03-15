import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    isClaimed: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }, // Allow admin to enable/disable
    claimedBy: [
      {
        ip: { type: String, required: true },
        sessionId: { type: String, required: true },
        claimedAt: { type: Date, default: Date.now } // Track when it was claimed
      }
    ],
    createdAt: { type: Date, default: Date.now }
  });
  

export default mongoose.model("Coupon", couponSchema);
