import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import connectDB from "@/lib/mongodb";
import Land from "@/Models/Land";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req, { params }) {
  await connectDB();
  const { userEmail } = await req.json();
  const { id } = await params;

  const land = await Land.findById(id);
  if (!land) return NextResponse.json({ error: "Land not found" }, { status: 404 });

  const options = {
    amount: land.leaseRate * 100, // amount in paise (Rs * 100)
    currency: "INR",
    receipt: `receipt_${land._id}`,
    notes: {
      landId: land._id.toString(),
      userEmail,
    },
  };

  try {
    const order = await razorpay.orders.create(options);
    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Razorpay order creation failed:", error);
    return NextResponse.json({ error: "Payment initiation failed" }, { status: 500 });
  }
}
