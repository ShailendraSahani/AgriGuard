import connectToDB from "@/lib/mongodb.js";
import Order from "@/Models/Order.js";
import User from "@/Models/User.js";
import { NextResponse } from "next/server";
import { sendMail } from "@/lib/mailer.js";
import { sendWhatsApp } from "@/lib/whatsapp.js";

export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Order ID and status required' }, { status: 400 });
    }

    await connectToDB();
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Send email notification
    try {
      await sendMail(updatedOrder.userEmail, "Order Status Update", `<p>Your order status has been updated to: <strong>${updatedOrder.status}</strong></p>`);
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // Continue without failing the request
    }

    // Send WhatsApp notification
    try {
      const user = await User.findOne({ email: updatedOrder.userEmail });
      if (user && user.phone) {
        const whatsappMessage = `📦 Order Status Update - AgriGuard\n\nYour order status has been updated to: ${updatedOrder.status}\n\nBest regards,\nAgriGuard Team`;
        await sendWhatsApp(user.phone, whatsappMessage);
      }
    } catch (whatsappError) {
      console.error('Error sending WhatsApp:', whatsappError);
      // Continue without failing the request
    }

    return NextResponse.json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
