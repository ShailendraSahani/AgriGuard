import nodemailer from "nodemailer";
import { sendWhatsApp } from "@/lib/whatsapp";

export async function POST(req) {
  try {
    const body = await req.json();
    const { to, subject, message, from, bookingId, serviceName, date, time, name, email, phone, price, orderId, orderItems, totalAmount, paymentId } = body;

    // Check if it's an order payment success email
    const isOrderPayment = orderId && orderItems && totalAmount && paymentId;

    // Check if it's a booking confirmation email
    const isBooking = bookingId && serviceName && date && time && name && email;

    if (isBooking) {
      // Validate booking fields
      if (!email || !serviceName || !date || !time || !name) {
        console.error("❌ Missing required booking fields");
        return new Response(
          JSON.stringify({ success: false, error: "Required booking fields missing" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      console.log("📧 Sending booking confirmation email to:", email, "for service:", serviceName);

      // Configure transporter
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      // Booking confirmation email content
      const htmlMessage = `
        <h2>🎟 Booking Confirmation - AgriGuard</h2>
        <p>Dear <strong>${name}</strong>,</p>
        <p>Your booking has been confirmed! Here are the details:</p>
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <p><strong>Booking ID:</strong> ${bookingId}</p>
          <p><strong>Service:</strong> ${serviceName}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${time}</p>
          <p><strong>Price:</strong> ₹${price}</p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
        </div>
        <p>Please arrive 10 minutes early for your appointment.</p>
        <p>If you need to reschedule or cancel, please contact us.</p>
        <hr />
        <p>Best regards,<br />AgriGuard Team</p>
      `;

      const mailOptions = {
        from: `"AgriGuard Bookings" <${process.env.SMTP_USER}>`,
        to: email,
        subject: `Booking Confirmation for ${serviceName}`,
        html: htmlMessage,
      };

      // Send email
      const info = await transporter.sendMail(mailOptions);
      console.log("✅ Booking confirmation email sent:", info.messageId);

      // Send WhatsApp message if phone is provided
      if (phone) {
        const whatsappMessage = `🎟 Booking Confirmation - AgriGuard\n\nDear ${name},\n\nYour booking has been confirmed! Here are the details:\n\nBooking ID: ${bookingId}\nService: ${serviceName}\nDate: ${date}\nTime: ${time}\nPrice: ₹${price}\n\nPlease arrive 10 minutes early for your appointment.\nIf you need to reschedule or cancel, please contact us.\n\nBest regards,\nAgriGuard Team`;
        await sendWhatsApp(phone, whatsappMessage);
      }

      return new Response(JSON.stringify({ success: true, messageId: info.messageId }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      // Handle contact email
      if (!to || !subject || !message) {
        console.error("❌ Missing required fields: to, subject, or message");
        return new Response(
          JSON.stringify({ success: false, error: "Recipient email, subject, and message are required" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      console.log("📧 Sending contact email to:", to, "from:", from, "subject:", subject);

      // Configure transporter
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      // Email content - format message as HTML
      const htmlMessage = `
        <h2>📧 New Contact Message from AgriGuard</h2>
        <p>You received a message from <strong>${from}</strong>:</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr />
        <p>${message.replace(/\n/g, '<br />')}</p>
        <hr />
        <p>Best regards,<br />AgriGuard Team</p>
      `;

      const mailOptions = {
        from: `"AgriGuard Contact" <${process.env.SMTP_USER}>`,
        to: to,
        replyTo: from,
        subject: subject,
        html: htmlMessage,
      };

      // Send email
      const info = await transporter.sendMail(mailOptions);
      console.log("✅ Contact email sent:", info.messageId);

      return new Response(JSON.stringify({ success: true, messageId: info.messageId }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500, headers: { "Content-Type": "application/json" },
    });
  }
}
