import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db"; 
import cors from "cors";
import cookieParser from "cookie-parser";
import adminRoutes from "./routes/adminRoutes";
import couponRoutes from "./routes/couponRoutes";

dotenv.config(); 

const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(express.json()); 
app.use(cors({ origin: FRONTEND_URL, credentials: true })); 
app.use(cookieParser()); 

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/coupons", couponRoutes);

// Start server only after DB connection is successful
const PORT = process.env.PORT || 3001;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err: unknown) => {
    if (err instanceof Error) {
      console.error("Failed to connect to MongoDB:", err.message);
    } else {
      console.error("An unknown error occurred:", err);
    }
    process.exit(1);
  });
