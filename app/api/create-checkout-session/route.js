// app/api/create-checkout-session/route.js
import { connectDB } from "@/lib/mongodb";
import Order from "@/Models/Order";
import Razorpay from "razorpay";

export async function POST(req) {
  // ✅ env check INSIDE function
  if (
    !process.env.RAZORPAY_KEY_ID ||
    !process.env.RAZORPAY_SECRET_KEY
  ) {
    return new Response(
      JSON.stringify({ error: "Razorpay keys missing" }),
      { status: 500 }
    );
  }

  const body = await req.json();
  const { orderId } = body;

  if (!orderId) {
    return new Response(
      JSON.stringify({ error: "orderId required" }),
      { status: 400 }
    );
  }

  await connectDB();

  const order = await Order.findById(orderId).populate("items.product");
  if (!order) {
    return new Response(
      JSON.stringify({ error: "Order not found" }),
      { status: 404 }
    );
  }

  // ✅ Razorpay instance INSIDE function
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET_KEY,
  });

  // ✅ Razorpay order creation (REAL API)
  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(order.totalAmount * 100), // paise
    currency: "INR",
    receipt: order._id.toString(),
    notes: {
      orderId: order._id.toString(),
    },
  });

  // save razorpay order id
  order.razorpayOrderId = razorpayOrder.id;
  await order.save();

  return new Response(
    JSON.stringify({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID, // frontend ke liye
    }),
    { status: 200 }
  );
}
