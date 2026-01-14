import { buffer } from "micro";
import Stripe from "stripe";
import connectDB from "@/lib/mongodb.js";
import Booking from "@/Models/Booking.js";
import Land from "@/Models/Land.js";
import { transporter } from "@/lib/mailer.js";
import { sendWhatsApp } from "@/lib/whatsapp.js";
export const config = { api: { bodyParser: false } };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    await connectDB();

    if (session.metadata.service) {
      const { service, name, email, date, message } = session.metadata;
      await Booking.create({ service, name, email, date, message });
    }

    if (session.metadata.landId) {
      const land = await Land.findById(session.metadata.landId).populate("owner acquiredBy");

      if (land) {
        land.status = "leased";
        await land.save();

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: [land.owner.email, land.acquiredBy.email],
          subject: "Land Lease Agreement Completed",
          text: `The land "${land.title}" has been leased successfully.`,
          attachments: [
            {
              filename: "agreement.pdf",
              path: land.finalDocumentUrl,
            },
          ],
        });

        // Send WhatsApp to owner and acquiredBy if they have phones
        const whatsappMessage = `🏠 Land Lease Agreement Completed - AgriGuard\n\nThe land "${land.title}" has been leased successfully.\n\nPlease check your email for the agreement document.\n\nBest regards,\nAgriGuard Team`;
        if (land.owner.phone) {
          await sendWhatsApp(land.owner.phone, whatsappMessage);
        }
        if (land.acquiredBy.phone) {
          await sendWhatsApp(land.acquiredBy.phone, whatsappMessage);
        }
      }
    }
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}