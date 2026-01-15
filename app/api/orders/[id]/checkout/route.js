import { NextResponse } from "next/server";
import {connectDB} from "@/lib/mongodb";
import Order from "@/Models/Order";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req, { params }) {
  try {
    const { id: orderId } = await params;

    await connectDB();

    const order = await Order.findById(orderId).populate("items.product");
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const totalAmount = order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    ) * 100; // amount in paise

    // Razorpay max amount check (avoid 400 error)
    if (totalAmount > 1000000000) {
      return NextResponse.json(
        { error: "Amount exceeds maximum allowed by Razorpay" },
        { status: 400 }
      );
    }

    const options = {
      amount: totalAmount,
      currency: "INR",
      receipt: `order_${order._id}`,
      notes: { order_id: order._id.toString() },
      payment_capture: 1,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    const checkoutUrl = `https://api.razorpay.com/v1/checkout/embedded?order_id=${razorpayOrder.id}&key_id=${process.env.RAZORPAY_KEY_ID}`;

    return NextResponse.json({ order: razorpayOrder, url: checkoutUrl });
  } catch (err) {
    console.error("Razorpay checkout error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
