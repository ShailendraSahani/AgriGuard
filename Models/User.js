'use server';
import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String }, // optional avatar
    phone: { type: String },
    address: { type: String },
    bio: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

// ✅ Use mongoose.models (never destructure `models`)
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
