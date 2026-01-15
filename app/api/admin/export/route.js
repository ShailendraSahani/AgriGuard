import {connectDB} from "@/lib/mongodb.js";
import User from "@/Models/User.js";
import Order from "@/Models/Order.js";
import Product from "@/Models/Product.js";
import Service from "@/Models/Service.js";
import { NextResponse } from "next/server";

function arrayToCSV(data) {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvRows = [];

  // Add headers
  csvRows.push(headers.join(','));

  // Add data rows
  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header];
      // Escape commas and quotes
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value || '';
    });
    csvRows.push(values.join(','));
  });

  return csvRows.join('\n');
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const tab = searchParams.get('tab');

    if (!tab) {
      return NextResponse.json({ error: 'Tab parameter required' }, { status: 400 });
    }

    await connectDB();
    let data = [];
    let filename = '';

    switch (tab) {
      case 'users':
        const users = await User.find({}).select('name email role status createdAt');
        data = users.map(user => ({
          Name: user.name,
          Email: user.email,
          Role: user.role,
          Status: user.status,
          'Created At': user.createdAt.toISOString(),
        }));
        filename = 'users';
        break;

      case 'orders':
        const orders = await Order.find({})
          .populate('items.product', 'name')
          .sort({ createdAt: -1 });
        data = orders.map(order => ({
          'Order ID': order._id,
          'Customer Email': order.userEmail,
          'Total Amount': order.total,
          Status: order.status,
          'Created At': order.createdAt.toISOString(),
        }));
        filename = 'orders';
        break;

      case 'products':
        const products = await Product.find({})
          .populate('seller', 'name')
          .sort({ createdAt: -1 });
        data = products.map(product => ({
          Name: product.name,
          Category: product.category,
          Price: product.price,
          Stock: product.stock,
          Seller: product.seller?.name || 'Unknown',
          Status: product.status,
          'Created At': product.createdAt.toISOString(),
        }));
        filename = 'products';
        break;

      case 'services':
        const services = await Service.find({})
          .populate('provider', 'name')
          .sort({ createdAt: -1 });
        data = services.map(service => ({
          Name: service.name,
          Description: service.description,
          Price: service.price,
          Duration: service.duration,
          Provider: service.provider?.name || 'Unknown',
          Rating: service.rating,
          Status: service.status,
          'Created At': service.createdAt.toISOString(),
        }));
        filename = 'services';
        break;

      default:
        return NextResponse.json({ error: 'Invalid tab' }, { status: 400 });
    }

    const csv = arrayToCSV(data);

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename=${filename}_${new Date().toISOString().split('T')[0]}.csv`,
      },
    });
  } catch (error) {
    console.error('Error exporting data:', error);
    return NextResponse.json({ error: 'Failed to export data' }, { status: 500 });
  }
}
