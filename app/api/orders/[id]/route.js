import { NextResponse } from "next/server";
import connectDB  from "@/lib/mongodb";
import Order from "@/Models/Order";

export async function GET(req, context) {
  try {
    await connectDB();

    // Await params before using
    const params = await context.params;
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const order = await Order.findById(id).populate("items.product");
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (err) {
    console.error("GET order error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req, context) {
  try {
    await connectDB();

    const params = await context.params;
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const { status } = await req.json();
    if (!status || !["pending", "confirmed", "shipped", "delivered"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true }).populate("items.product");
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (err) {
    console.error("PUT order error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
