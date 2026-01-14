
import { NextResponse } from "next/server";
import { verifyPassword } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/Models/User";

export async function POST(request) {
  const { email, password } = await request.json();

  await connectDB();

  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const isValid = await verifyPassword(password, user.password);

  if (!isValid) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  // TODO: Generate and return a token or session

  return NextResponse.json({ message: "Login successful" });
}
