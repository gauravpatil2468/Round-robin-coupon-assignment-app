import { Router } from "express";
import { adminLogin, addCoupons, getAllCoupons, getCouponClaimHistory, updateCoupon } from "../controllers/adminController";
import { authenticateAdmin } from "../middlewares/authMiddleware"; 

console.log(getCouponClaimHistory); // Debugging: This should log the function, not 'undefined'

const router = Router();

router.post("/login", adminLogin);
router.post("/addcoupons", authenticateAdmin, addCoupons);
router.get("/coupons", authenticateAdmin, getAllCoupons);
router.put("/couponUpdate/:id", authenticateAdmin, updateCoupon);
router.get("/couponHistory/:id", authenticateAdmin, getCouponClaimHistory); // Fixed typo

export default router;
