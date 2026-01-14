import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Land from "@/Models/Land";
import User from "@/Models/User";
import { generateAgreementPDF } from "@/lib/pdf";

export async function POST(req, { params }) {
  await connectDB();
  const { userId } = await req.json();
  const { id } = await params;

  const land = await Land.findById(id);
  const user = await User.findById(userId);

  if (!land || !user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const pdfUrl = await generateAgreementPDF(land, user);
  land.finalDocumentUrl = pdfUrl;
  land.status = "agreement_user_signed";
  land.acquiredBy = userId;
  await land.save();

  return NextResponse.json({ message: "User signed", land });
}
