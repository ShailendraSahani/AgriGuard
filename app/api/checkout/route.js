import {connectDB} from "@/lib/mongodb";
import Order from "@/Models/Order";
import Product from "@/Models/Product";
import Cart from "@/Models/Cart";

export async function POST(req) {
  try {
    const body = await req.json();
    const { cart } = body; // cart should have userEmail and items

    if (!cart || !cart.userEmail || !cart.items || cart.items.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid cart" }), { status: 400 });
    }

    await connectDB();

    // Populate product details for items
    const populatedItems = await Promise.all(
      cart.items.map(async (item) => {
        const product = await Product.findById(item.product);
        if (!product) throw new Error(`Product ${item.product} not found`);
        return {
          product: item.product,
          quantity: item.quantity,
          price: product.price,
        };
      })
    );

    // Calculate total
    const total = populatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Create order
    const order = await Order.create({
      userEmail: cart.userEmail,
      items: populatedItems,
      total,
    });

    // Clear the cart
    await Cart.findOneAndDelete({ userEmail: cart.userEmail });

    // Now create checkout session
    const sessionRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/create-checkout-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: order._id.toString() }),
    });

    const sessionData = await sessionRes.json();
    if (!sessionRes.ok) {
      return new Response(JSON.stringify({ error: sessionData.error }), { status: sessionRes.status });
    }

    return new Response(JSON.stringify({ url: sessionData.url }));
  } catch (error) {
    console.error("Checkout error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
