import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  unit: { type: String, required: true },
  image: { type: String }, // Cloudinary image
  category: { type: String, required: true },
  stock: { type: Number, default: 0 },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['available', 'out of stock'], default: 'available' },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
