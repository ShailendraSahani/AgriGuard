import connectToDB from "@/lib/mongodb.js";
import User from "@/Models/User.js";
import Order from "@/Models/Order.js";
import Product from "@/Models/Product.js";
import Service from "@/Models/Service.js";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDB();

    // Get current month and previous month dates
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const beforePreviousMonth = new Date(now.getFullYear(), now.getMonth() - 2, 1);

    // Total counts
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalServices = await Service.countDocuments();

    // Revenue from orders
    const orders = await Order.find({});
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

    // Growth calculations (simplified - compare current vs previous month)
    const usersCurrent = await User.countDocuments({ createdAt: { $gte: currentMonth } });
    const usersPrevious = await User.countDocuments({ createdAt: { $gte: previousMonth, $lt: currentMonth } });
    const usersGrowth = usersPrevious > 0 ? Math.round(((usersCurrent - usersPrevious) / usersPrevious) * 100) : 0;

    const ordersCurrent = await Order.countDocuments({ createdAt: { $gte: currentMonth } });
    const ordersPrevious = await Order.countDocuments({ createdAt: { $gte: previousMonth, $lt: currentMonth } });
    const ordersGrowth = ordersPrevious > 0 ? Math.round(((ordersCurrent - ordersPrevious) / ordersPrevious) * 100) : 0;

    const productsCurrent = await Product.countDocuments({ createdAt: { $gte: currentMonth } });
    const productsPrevious = await Product.countDocuments({ createdAt: { $gte: previousMonth, $lt: currentMonth } });
    const productsGrowth = productsPrevious > 0 ? Math.round(((productsCurrent - productsPrevious) / productsPrevious) * 100) : 0;

    const revenueCurrent = orders.filter(order => order.createdAt >= currentMonth).reduce((sum, order) => sum + (order.total || 0), 0);
    const revenuePrevious = orders.filter(order => order.createdAt >= previousMonth && order.createdAt < currentMonth).reduce((sum, order) => sum + (order.total || 0), 0);
    const revenueGrowth = revenuePrevious > 0 ? Math.round(((revenueCurrent - revenuePrevious) / revenuePrevious) * 100) : 0;

    const stats = {
      totalUsers,
      totalOrders,
      totalProducts: totalProducts + totalServices, // Combine products and services
      totalRevenue,
      usersGrowth,
      ordersGrowth,
      productsGrowth,
      revenueGrowth,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
