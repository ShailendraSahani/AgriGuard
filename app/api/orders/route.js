import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/Models/Order";
import Product from "@/Models/Product";
import User from "@/Models/User";
import { sendWhatsApp } from "@/lib/whatsapp";

export async function POST(req) {
  try {
    await dbConnect();

    const { userEmail, items } = await req.json();

    if (!userEmail || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
    }

    // Calculate total from items
    const total = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);

    // Create order with items array
    const newOrder = await Order.create({
      userEmail,
      items,
      total,
    });

    // Populate with product details
    const populatedOrder = await Order.findById(newOrder._id).populate("items.product");

    // Send WhatsApp confirmation
    const user = await User.findOne({ email: userEmail });
    if (user && user.phone) {
      const whatsappMessage = `📦 Order Confirmation - AgriGuard\n\nDear ${user.name},\n\nYour order has been placed successfully! Here are the details:\n\nItems:\n${populatedOrder.items.map(i => `- ${i.product?.name || "Unknown Product"} x${i.quantity}`).join("\n")}\n\nTotal: ₹${populatedOrder.total}\n\nWe will process your order soon.\n\nBest regards,\nAgriGuard Team`;
      try {
        await sendWhatsApp(user.phone, whatsappMessage);
      } catch (whatsappError) {
        console.error('Error sending WhatsApp for order:', whatsappError);
        // Continue without failing the request
      }
    }

    return NextResponse.json({
      _id: populatedOrder._id,
      userEmail: populatedOrder.userEmail,
      items: populatedOrder.items.map(i => ({
        productName: i.product?.name || "Unknown Product",
        quantity: i.quantity,
        price: i.price,
      })),
      total: populatedOrder.total,
      status: populatedOrder.status,
      createdAt: populatedOrder.createdAt,
    });
  } catch (err) {
    console.error("POST order error:", err);
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await dbConnect();

    const url = new URL(req.url);
    const userEmail = url.searchParams.get("userEmail");
    if (!userEmail) {
      return NextResponse.json({ error: "userEmail query parameter required" }, { status: 400 });
    }

    const orders = await Order.find({ userEmail }).sort({ createdAt: -1 }).populate("items.product");

    return NextResponse.json(orders);
  } catch (err) {
    console.error("GET orders error:", err);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
