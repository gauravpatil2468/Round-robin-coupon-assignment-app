import mongoose from "mongoose";
import { hashPassword } from "../utils/hash";

const AdminSchema = new mongoose.Schema({
  username: { type: String , required: true, unique: true },
  password: { type: String, required: true },
});


AdminSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hashPassword(this.password);
  }
  next();
});

const Admin = mongoose.model("Admin", AdminSchema);
export default Admin;
