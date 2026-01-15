import { NextResponse } from "next/server";
import {connectDB} from "@/lib/mongodb";
import Order from "@/Models/Order";
import crypto from "crypto";

export async function POST(req) {
  await connectDB();

  const body = await req.text();
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  const signature = req.headers.get("x-razorpay-signature");

  // Verify signature
  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(body)
    .digest("hex");

  if (signature !== expectedSignature) {
    console.error("Webhook signature verification failed");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event;
  try {
    event = JSON.parse(body);
  } catch (err) {
    console.error("Invalid JSON in webhook body:", err);
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  switch (event.event) {
    case "payment.captured":
      const payment = event.payload.payment.entity;
      const orderId = payment.notes?.order_id;
      if (orderId) {
        const order = await Order.findById(orderId);
        if (order && order.status === "pending") {
          order.status = "confirmed";
          order.razorpaySessionId = payment.id;
          order.razorpayStatus = "paid";
          await order.save();
          console.log(`Order ${orderId} marked as confirmed via Razorpay`);
        }
      }
      break;
    default:
      console.log(`Unhandled event type: ${event.event}`);
  }

  return NextResponse.json({ received: true });
}
