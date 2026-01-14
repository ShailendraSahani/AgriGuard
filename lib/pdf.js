import PDFDocument from "pdfkit";
import { writeFileSync } from "fs";
import path from "path";

export async function generateAgreementPDF(land, user = null) {
  const doc = new PDFDocument();
  const filePath = path.join(process.cwd(), "public", `${land._id}-agreement.pdf`);

  doc.pipe(writeFileSync(filePath));

  doc.fontSize(18).text("Legal Farming Agreement", { align: "center" });
  doc.moveDown();

  doc.fontSize(12).text(`Land Title: ${land.title}`);
  doc.text(`Location: ${land.location}`);
  doc.text(`Size: ${land.size}`);
  doc.text(`Soil Type: ${land.soilType}`);
  doc.text(`Lease Rate: ${land.leaseRate}`);
  doc.moveDown();

  doc.text(`Owner ID: ${land.owner}`);
  if (user) {
    doc.text(`Acquired By: ${user._id}`);
    doc.text(`User Name: ${user.name}`);
    doc.text(`User Email: ${user.email}`);
  }

  doc.moveDown();
  doc.text("Terms & Conditions: Both parties agree to the above details.");
  doc.moveDown();
  doc.text(`Owner Signature: ________`);
  if (user) doc.text(`User Signature: ________`);

  doc.end();

  return `/public/${land._id}-agreement.pdf`;
}
