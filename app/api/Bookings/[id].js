import dbConnect from "@/lib/mongodb";
import Booking from "@/Models/Booking";
import { sendMail } from "@/lib/mail";
import { sendWhatsApp } from "@/lib/whatsapp";

export default async function handler(req, res) {
  await dbConnect();

  const { id } = req.query;

  // --- UPDATE BOOKING STATUS ---
  if (req.method === "PATCH") {
    const adminSecret = req.headers["x-admin-secret"];
    if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ success: false, error: "Status is required" });
      }

      const booking = await Booking.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      if (!booking) {
        return res.status(404).json({ success: false, error: "Booking not found" });
      }

      // --- Send status update email to customer ---
      await sendMail(
        booking.email,
        `📢 Booking ${status.toUpperCase()} - Agriguard`,
        `
          <h2>Hi ${booking.name},</h2>
          <p>Your booking for <b>${booking.service}</b> has been updated.</p>
          <p><b>Date:</b> ${new Date(booking.date).toDateString()}</p>
          <p>Status: <b>${status}</b></p>
          <br/>
          <p>Regards,</p>
          <p><b>Agriguard Team 🌱</b></p>
        `
      );

      // --- Send WhatsApp message if phone is available ---
      if (booking.phone) {
        const whatsappMessage = `📢 Booking ${status.toUpperCase()} - AgriGuard\n\nHi ${booking.name},\n\nYour booking for ${booking.service} has been updated.\n\nDate: ${new Date(booking.date).toDateString()}\nStatus: ${status}\n\nRegards,\nAgriguard Team 🌱`;
        await sendWhatsApp(booking.phone, whatsappMessage);
      }

      return res.status(200).json({ success: true, booking });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // --- Method Not Allowed ---
  res.setHeader("Allow", ["PATCH"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
