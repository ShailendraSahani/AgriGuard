import {connectDB} from "@/lib/mongodb.js";
import Booking from "@/Models/Booking.js";
import { sendWhatsApp } from "@/lib/whatsapp.js";

export async function GET() {
  try {
    await connectDB();
    const bookings = await Booking.find().sort({ createdAt: -1 });
    return new Response(JSON.stringify(bookings), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { serviceId, serviceName, name, email, phone, date, time } = body;
    if (!serviceId || !serviceName || !name || !email || !phone || !date || !time) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }
    const booking = await Booking.create(body);

    // Send WhatsApp confirmation
    if (phone) {
      const whatsappMessage = `🎟 Booking Confirmation - AgriGuard\n\nDear ${name},\n\nYour booking has been confirmed! Here are the details:\n\nService: ${serviceName}\nDate: ${date}\nTime: ${time}\n\nPlease arrive 10 minutes early for your appointment.\nIf you need to reschedule or cancel, please contact us.\n\nBest regards,\nAgriGuard Team`;
      try {
        await sendWhatsApp(phone, whatsappMessage);
      } catch (whatsappError) {
        console.error('Error sending WhatsApp for booking:', whatsappError);
        // Continue without failing the request
      }
    }

    return new Response(JSON.stringify(booking), { status: 201, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
