"use client";
import { useState } from "react";

export default function CheckoutClient({ cart }) {
  const [loading, setLoading] = useState(false);

  async function startCheckout() {
    try {
      setLoading(true);
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart }),
      });
      const data = await res.json();
      if (data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        alert("Checkout failed: " + JSON.stringify(data));
      }
    } catch (err) {
      console.error(err);
      alert("Checkout error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button onClick={startCheckout} disabled={loading}>
        {loading ? "Redirecting…" : "Pay with Card (Stripe Checkout)"}
      </button>
    </div>
  );
}
