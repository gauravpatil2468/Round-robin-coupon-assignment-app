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
 * Add multiple coupons in bulk and return the updated list of coupons
 */
export const addCoupons = async (req: Request, res: Response): Promise<void> => {
  const { codes } = req.body;

  try {
    if (!Array.isArray(codes) || codes.length === 0) {
      res.status(400).json({ message: "Invalid input, expected an array of coupon codes." });
      return;
    }

    // Create coupon objects from the codes
    const coupons = codes.map((code) => ({ code }));

    // Insert the coupons into the database
    await Coupon.insertMany(coupons);

    // Fetch the updated list of coupons from the database
    const updatedCoupons = await Coupon.find();

    // Send back the updated list of coupons and a success message
    res.json({
      message: "Coupons added successfully",
      count: coupons.length,
      coupons: updatedCoupons, // Returning the updated coupons list
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding coupons" });
  }
};

/**
 * Update Coupon - Allows updating coupon properties (isActive, code, etc.)
 */
export const updateCoupon = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const updateData = req.body; // Get the fields to update

    try {
        const coupon = await Coupon.findById(id);
        if (!coupon) {
            res.status(404).json({ message: "Coupon not found." });
            return;
        }

        // Update only the fields provided in the request
        Object.keys(updateData).forEach((key) => {
            if (key in coupon) {
                (coupon as any)[key] = updateData[key];
            }
        });

        await coupon.save();
        res.json({ message: "Coupon updated successfully.", coupon });
    } catch (error) {
        res.status(500).json({ message: "Error updating coupon", error });
    }
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


/**
 * View claim history of a specific coupon
 */export const getCouponClaimHistory = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      res.status(404).json({ message: "Coupon not found." });
      return;
    }

    res.json({ coupon });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving claim history" });
  }
};


