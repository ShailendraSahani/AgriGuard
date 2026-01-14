import connectDB from "@/lib/mongodb";
import Product from "@/Models/Product";

export async function GET() {
  await connectDB();
  const products = await Product.find();
  return Response.json(products);
}
