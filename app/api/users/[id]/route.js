import { NextResponse } from "next/server";
import {connectDB} from "@/lib/mongodb";
import User from "@/Models/User";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    if (!id || id === '[object Object]') {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const user = await User.findById(id).select("name email phone address bio");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
