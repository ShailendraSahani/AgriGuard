import {connectDB} from "@/lib/mongodb.js";
import Order from "@/Models/Order.js";
import User from "@/Models/User.js";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const orders = await Order.find({})
      .populate('items.product', 'name')
      .sort({ createdAt: -1 });

    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        const user = await User.findOne({ email: order.userEmail }).select('name');
        const customer = user ? user.name : order.userEmail;

        // Get first product name for simplicity
        const product = order.items.length > 0 ? order.items[0].product?.name || 'Unknown Product' : 'Unknown Product';
        const quantity = order.items.reduce((sum, item) => sum + item.quantity, 0);

        return {
          id: order._id,
          customer,
          product,
          quantity,
          amount: order.total,
          status: order.status,
        };
      })
    );

    return NextResponse.json(ordersWithDetails);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const body = await req.json();
    const { status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Order ID and status required' }, { status: 400 });
    }

    await connectDB();
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
