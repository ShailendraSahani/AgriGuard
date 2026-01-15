import { v2 as cloudinary } from "cloudinary";
import {connectDB} from "@/lib/mongodb";
import Land from "@/Models/Land";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const body = await req.json();
    let imageUrl = "";

    // Upload image to Cloudinary if provided
    if (body.imageBase64) {
      const uploadResponse = await cloudinary.uploader.upload(body.imageBase64, {
        folder: "lands",
      });
      imageUrl = uploadResponse.secure_url;
    }

    const newLand = await Land.create({
      ...body,
      image: imageUrl,
      owner: session.user.id,
    });

    return new Response(JSON.stringify(newLand), { status: 201 });
  } catch (err) {
    console.error("Error creating land:", err);
    return new Response(JSON.stringify({ error: "Server error", details: err.message }), {
      status: 500,
    });
  }
}

export async function GET() {
  try {
    await connectDB();

    const lands = await Land.find().populate("owner", "name email phone");

    return new Response(JSON.stringify(lands), { status: 200 });
  } catch (err) {
    console.error("Error fetching lands:", err);
    return new Response(JSON.stringify({ error: "Server error", details: err.message }), {
      status: 500,
    });
  }
}
