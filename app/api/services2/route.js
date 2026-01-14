import connectDB from "@/lib/mongodb";
import Service from "@/Models/Service"; // Use lowercase 'models'
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const services = await Service.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json(services, { status: 200 });
  } catch (err) {
    console.error("GET Error:", err);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    
    if (!body.name || !body.description || !body.price) {
      return NextResponse.json(
        { error: "Missing required fields: name, description, price" }, 
        { status: 400 }
      );
    }
    
    const service = await Service.create(body);
    return NextResponse.json(service, { status: 201 });
  } catch (err) {
    console.error("POST Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
