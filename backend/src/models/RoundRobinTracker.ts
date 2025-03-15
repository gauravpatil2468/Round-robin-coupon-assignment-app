import mongoose from "mongoose";

const roundRobinSchema = new mongoose.Schema({
  lastAssignedIndex: { type: Number, default: -1 },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("RoundRobinTracker", roundRobinSchema);
