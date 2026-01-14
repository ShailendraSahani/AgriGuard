// app/api/create-checkout-session/route.js
import connectDB from "@/lib/mongodb";
import Order from "@/Models/Order";
import Product from "@/Models/Product";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined in environment variables");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const body = await req.json();
  const { orderId } = body;
  if (!orderId) return new Response(JSON.stringify({ error: "orderId required" }), { status: 400 });

  await connectDB();
  const order = await Order.findById(orderId).populate("items.product");
  if (!order) return new Response(JSON.stringify({ error: "order not found" }), { status: 404 });

  // Create line_items for Stripe
  const line_items = order.items.map(i => ({
    price_data: {
      currency: "inr",
      product_data: { name: i.product.name },
      unit_amount: Math.round(i.price * 100),
    },
    quantity: i.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items,
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/orders?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/orders`,
    metadata: { orderId: order._id.toString() },
  });

  // store session id
  order.stripeSessionId = session.id;
  await order.save();

  return new Response(JSON.stringify({ url: session.url }));
}
