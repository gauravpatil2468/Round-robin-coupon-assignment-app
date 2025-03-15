import express from "express";
import { claimCoupon } from "../controllers/couponController";
import limiter from "../middlewares/rateLimit";

const router = express.Router();
router.post("/claim",limiter, claimCoupon);

export default router;
