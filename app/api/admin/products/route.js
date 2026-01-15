import {connectDB} from "@/lib/mongodb.js";
import Product from "@/Models/Product.js";
import User from "@/Models/User.js";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const products = await Product.find({})
      .populate('seller', 'name')
      .sort({ createdAt: -1 });

    const productsWithDetails = products.map((product) => ({
      id: product._id,
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      seller: product.seller?.name || 'Unknown Seller',
      status: product.status,
    }));

    return NextResponse.json(productsWithDetails);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    await connectDB();
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
