import mongoose from "mongoose";

const ContactRequestSchema = new mongoose.Schema(
  {
    land: { type: mongoose.Schema.Types.ObjectId, ref: "Land", required: true },
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    toOwner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, default: "" },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" }
  },
  { timestamps: true }
);

export default mongoose.models.ContactRequest ||
  mongoose.model("ContactRequest", ContactRequestSchema);
