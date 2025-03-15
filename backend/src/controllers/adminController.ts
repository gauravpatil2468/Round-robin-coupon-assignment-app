import { Request, Response } from "express";
import Coupon from "../models/Coupon";
import Admin from "../models/Admin";
import { comparePassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";

/**
 * Admin Login
 */
export const adminLogin = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
   
    if (!admin) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }
 
    // Compare entered password with hashed password
    const isMatch = await comparePassword(password, admin.password);
   
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // Generate JWT token
    const token = generateToken( admin.username );


    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Add multiple coupons in bulk
 */
export const addCoupons = async (req: Request, res: Response): Promise<void> => {
  const { codes } = req.body;

  try {
    if (!Array.isArray(codes) || codes.length === 0) {
      res.status(400).json({ message: "Invalid input, expected an array of coupon codes." });
      return;
    }

    const coupons = codes.map((code) => ({ code }));
    await Coupon.insertMany(coupons);

    res.json({ message: "Coupons added successfully", count: coupons.length });
  } catch (error) {
    res.status(500).json({ message: "Error adding coupons" });
  }
};

export const toggleCoupon = async (req: Request, res: Response):Promise<void> => {
    const { id } = req.params;
    
    const coupon = await Coupon.findById(id);
    if (!coupon) {
       res.status(404).json({ message: "Coupon not found." });
       return;
    }
  
    // Toggle coupon availability
    coupon.isActive = !coupon.isActive;
    await coupon.save();
  
    res.json({ message: `Coupon ${coupon.isActive ? "enabled" : "disabled"} successfully.` });
    return;
  };
  

/**
 * Get all coupons
 */
export const getAllCoupons = async (req: Request, res: Response): Promise<void> => {
  try {
    const coupons = await Coupon.find();
    res.json({ coupons });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving coupons" });
  }
};
