import {connectDB} from "@/lib/mongodb.js";
import Booking from "@/Models/Booking.js";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const bookings = await Booking.find({}).sort({ date: -1 });
  return NextResponse.json(bookings);
}

export async function PATCH(req) {
  const body = await req.json();
  const { id, completed } = body;
  await connectDB();
  const booking = await Booking.findByIdAndUpdate(id, { completed }, { new: true });
  return NextResponse.json(booking);
}
