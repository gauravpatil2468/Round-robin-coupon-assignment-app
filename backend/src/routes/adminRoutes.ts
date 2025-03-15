import { Router } from "express";
import { adminLogin, addCoupons, getAllCoupons, toggleCoupon } from "../controllers/adminController";
import { authenticateAdmin } from "../middlewares/authMiddleware"; // Import middleware

const router = Router();

router.post("/login", adminLogin); // Login route (no auth needed)

// Protected routes (require admin authentication)
router.post("/addcoupons", authenticateAdmin, addCoupons);
router.get("/coupons", authenticateAdmin, getAllCoupons);
router.put("/togglecoupon/:id", authenticateAdmin, toggleCoupon);

export default router;
