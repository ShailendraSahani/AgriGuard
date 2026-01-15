import {connectDB} from "@/lib/mongodb.js";
import Product from "@/Models/Product.js";
import Order from "@/Models/Order.js";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const alerts = [];

    // Check for low stock products
    const lowStockProducts = await Product.find({ stock: { $lt: 10 } }).select('name stock');
    lowStockProducts.forEach(product => {
      alerts.push({
        type: 'warning',
        title: 'Low Stock Alert',
        message: `${product.name} has only ${product.stock} units left.`,
      });
    });

    // Check for pending orders
    const pendingOrdersCount = await Order.countDocuments({ status: 'pending' });
    if (pendingOrdersCount > 0) {
      alerts.push({
        type: 'info',
        title: 'Pending Orders',
        message: `There are ${pendingOrdersCount} orders waiting for processing.`,
      });
    }

    // Check for out of stock products
    const outOfStockProducts = await Product.find({ stock: 0 }).select('name');
    outOfStockProducts.forEach(product => {
      alerts.push({
        type: 'warning',
        title: 'Out of Stock',
        message: `${product.name} is out of stock.`,
      });
    });

    // If no alerts, add a default one
    if (alerts.length === 0) {
      alerts.push({
        type: 'info',
        title: 'All Systems Normal',
        message: 'No alerts at this time. Everything is running smoothly.',
      });
    }

    return NextResponse.json(alerts);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 500 });
  }
}
