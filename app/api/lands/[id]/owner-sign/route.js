import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Land from "@/Models/Land";
import { generateAgreementPDF } from "@/lib/pdf";

export async function POST(_, { params }) {
  await connectDB();
  const { id } = await params;
  const land = await Land.findById(id);
  if (!land) return NextResponse.json({ error: "Land not found" }, { status: 404 });

  const pdfUrl = await generateAgreementPDF(land);
  land.ownerSignedDocumentUrl = pdfUrl;
  land.status = "agreement_owner_signed";
  await land.save();

  return NextResponse.json({ message: "Owner signed", land });
}
