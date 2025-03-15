import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "./models/Admin"; // Ensure correct path

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("Connected to MongoDB...");

    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;

    if (!username || !password) {
      throw new Error("ADMIN_USERNAME and ADMIN_PASSWORD must be set in .env");
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      console.log("Admin already exists. Exiting...");
      process.exit(0);
    }

    console.log("Seeding Admin Credentials:");
    console.log(`Username: ${username}`);
    console.log(`Plain Password: ${password}`);

    // Create a new admin (DO NOT hash manually; pre-save hook in model will handle it)
    const admin = new Admin({ username, password });

    await admin.save();
    console.log(`Admin user '${username}' created successfully!`);

    process.exit(0); // Exit process after seeding
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
