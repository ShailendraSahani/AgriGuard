"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function CartPage() {
  const [email, setEmail] = useState("");
  const [cart, setCart] = useState(null);

  const loadCart = async (email) => {
    if (!email) return;
    const res = await fetch(`/api/cart?email=${encodeURIComponent(email)}`);
    const data = await res.json();
    setCart(data);
  };

  useEffect(() => {
    // do nothing until user enters email
  }, []);

  const removeItem = async (productId) => {
    await fetch(`/api/cart?email=${encodeURIComponent(email)}&productId=${productId}`, { method: "DELETE" });
    loadCart(email);
  };

  const clearCart = async () => {
    await fetch(`/api/cart?email=${encodeURIComponent(email)}`, { method: "DELETE" });
    setCart({ items: [] });
  };

  const goToCheckout = () => {
    // pass email via query
    window.location.href = `/checkout?email=${encodeURIComponent(email)}`;
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

      <div className="mb-4">
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" className="border p-2 mr-2" />
        <button onClick={() => loadCart(email)} className="px-4 py-2 bg-blue-600 text-white rounded">Load Cart</button>
      </div>

      {cart && cart.items && cart.items.length > 0 ? (
        <div>
          <ul>
            {cart.items.map(i => (
              <li key={i._id} className="mb-3">
                <div className="flex justify-between">
                  <div>
                    <div className="font-semibold">{i.product.name}</div>
                    <div>Qty: {i.quantity}</div>
                    <div>Price: ₹{i.product.price}</div>
                  </div>
                  <div className="flex flex-col">
                    <button onClick={() => removeItem(i.product._id)} className="text-red-500">Remove</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-4">
            <button onClick={clearCart} className="px-4 py-2 bg-gray-300 rounded mr-2">Clear Cart</button>
            <button onClick={goToCheckout} className="px-4 py-2 bg-green-600 text-white rounded">Checkout</button>
          </div>
        </div>
      ) : (
        <p>No items in cart.</p>
      )}

      <div className="mt-6">
        <Link href="/marketplace" className="text-blue-600">← Continue shopping</Link>
      </div>
    </main>
  );
}
