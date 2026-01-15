// app/api/cart/route.js
import {connectDB} from "@/lib/mongodb";
import Cart from "@/Models/Cart";
import Product from "@/Models/Product";

export async function GET(req) {
  const url = new URL(req.url);
  const email = url.searchParams.get("email");
  if (!email) return new Response(JSON.stringify({ error: "email required" }), { status: 400 });

  await connectDB();
  const cart = await Cart.findOne({ userEmail: email }).populate("items.product");
  return Response.json(cart || { userEmail: email, items: [] });
}

export async function POST(req) {
  // Body: { userEmail, productId, quantity }
  const body = await req.json();
  const { userEmail, productId, quantity = 1 } = body;
  if (!userEmail || !productId) return new Response(JSON.stringify({ error: "missing fields" }), { status: 400 });

  await connectDB();

  // ensure product exists
  const product = await Product.findById(productId);
  if (!product) return new Response(JSON.stringify({ error: "product not found" }), { status: 404 });

  let cart = await Cart.findOne({ userEmail });
  if (!cart) {
    cart = await Cart.create({ userEmail, items: [{ product: productId, quantity }] });
  } else {
    const idx = cart.items.findIndex(i => i.product.toString() === productId);
    if (idx > -1) {
      cart.items[idx].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }
    await cart.save();
  }

  const populated = await cart.populate("items.product").execPopulate?.() ?? await Cart.findById(cart._id).populate("items.product");
  return Response.json(populated);
}

export async function DELETE(req) {
  // expect query params: ?email=...&productId=... or if productId absent, clear cart
  const url = new URL(req.url);
  const email = url.searchParams.get("email");
  const productId = url.searchParams.get("productId");

  if (!email) return new Response(JSON.stringify({ error: "email required" }), { status: 400 });

  await connectDB();
  const cart = await Cart.findOne({ userEmail: email });
  if (!cart) return new Response(JSON.stringify({ ok: true }));

  if (!productId) {
    await Cart.deleteOne({ userEmail: email });
    return Response.json({ ok: true });
  } else {
    cart.items = cart.items.filter(i => i.product.toString() !== productId);
    await cart.save();
    const populated = await Cart.findById(cart._id).populate("items.product");
    return Response.json(populated);
  }
}
