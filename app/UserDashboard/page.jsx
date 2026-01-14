"use client";
import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function UserDashboard() {
  const [lands, setLands] = useState([]);
  const [showForm, setShowForm] = useState(null); // landId for open form

  const [formData, setFormData] = useState({ userName: "", email: "", agreeTerms: false });

  useEffect(() => {
    fetch("/api/lands")
      .then(res => res.json())
      .then(data => setLands(data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSignAndPay = async (landId) => {
    if (!formData.agreeTerms) return alert("Please agree to terms!");
    try {
      // User signs document
      await fetch(`/api/lands/${landId}/user-sign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName: formData.userName })
      });

      // Trigger Stripe Payment
      const res = await fetch(`/api/lands/${landId}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: formData.email })
      });
      const { id } = await res.json();
      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId: id });

    } catch (err) {
      console.error(err);
      alert("Error signing or paying!");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Available Lands</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {lands.map(land => (
          <div key={land._id} className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold">{land.title}</h2>
            <p>Status: {land.status}</p>
            {land.status === "agreement_owner_signed" && (
              <button onClick={() => setShowForm(land._id)} className="bg-blue-600 text-white px-3 py-1 rounded mt-2">Acquire Land</button>
            )}

            {showForm === land._id && (
              <form className="mt-2 p-2 border rounded bg-gray-50">
                <input name="userName" placeholder="Your Name" onChange={handleChange} className="w-full mb-2 p-2 border rounded"/>
                <input name="email" placeholder="Your Email" onChange={handleChange} className="w-full mb-2 p-2 border rounded"/>
                <div className="mb-2">
                  <input type="checkbox" name="agreeTerms" onChange={handleChange} /> I agree to user terms
                </div>
                <button type="button" onClick={() => handleSignAndPay(land._id)} className="bg-green-600 text-white px-3 py-1 rounded">Sign & Pay</button>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
