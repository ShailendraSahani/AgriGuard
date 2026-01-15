import {connectDB} from "@/lib/mongodb.js";
import User from "@/Models/User.js";
import Order from "@/Models/Order.js";
import Product from "@/Models/Product.js";
import Service from "@/Models/Service.js";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    // Get recent activities from different models (last 10 total)
    const recentUsers = await User.find({}).sort({ _id: -1 }).limit(3).select('name email createdAt');
    const recentOrders = await Order.find({}).sort({ _id: -1 }).limit(3).select('userEmail total createdAt');
    const recentProducts = await Product.find({}).sort({ _id: -1 }).limit(2).select('name createdAt');
    const recentServices = await Service.find({}).sort({ _id: -1 }).limit(2).select('name createdAt');

    const activities = [];

    // Format user activities
    recentUsers.forEach(user => {
      activities.push({
        type: 'user',
        message: `New user registered: ${user.name}`,
        time: user.createdAt ? new Date(user.createdAt).toLocaleString() : new Date().toLocaleString(),
      });
    });

    // Format order activities
    recentOrders.forEach(order => {
      activities.push({
        type: 'order',
        message: `New order placed for ₹${order.total}`,
        time: order.createdAt ? new Date(order.createdAt).toLocaleString() : new Date().toLocaleString(),
      });
    });

    // Format product activities
    recentProducts.forEach(product => {
      activities.push({
        type: 'product',
        message: `New product added: ${product.name}`,
        time: product.createdAt ? new Date(product.createdAt).toLocaleString() : new Date().toLocaleString(),
      });
    });

    // Format service activities
    recentServices.forEach(service => {
      activities.push({
        type: 'service',
        message: `New service added: ${service.name}`,
        time: service.createdAt ? new Date(service.createdAt).toLocaleString() : new Date().toLocaleString(),
      });
    });

    // Sort by time descending
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));

    // Take last 10
    const recentActivity = activities.slice(0, 10);

    return NextResponse.json(recentActivity);
  } catch (error) {
    console.error('Error fetching activity:', error);
    return NextResponse.json({ error: 'Failed to fetch activity' }, { status: 500 });
  }
}
