import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateAdmin = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.header("Authorization"); // Get token from Authorization header

  if (!token) {
    res.status(401).json({ message: "Unauthorized - No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    (req as any).admin = decoded; // Attach admin info to request object
    next(); // Move to the next middleware
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
