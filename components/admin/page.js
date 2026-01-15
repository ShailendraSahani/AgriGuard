// pages/admin/bookings.js
import { useEffect, useState } from "react";

export default function AdminBookings() {
  const [secret, setSecret] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [authOk, setAuthOk] = useState(false);
  const [error, setError] = useState("");

  const fetchBookings = async (providedSecret) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/bookings", {
        headers: { "x-admin-secret": providedSecret },
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to fetch");
      setBookings(data.bookings);
      setAuthOk(true);
    } catch (err) {
      setError(err.message);
      setAuthOk(false);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    fetchBookings(secret);
  };

  const markCompleted = async (id) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-secret": secret },
        body: JSON.stringify({ status: "completed" }),
      });
      const data = await res.json();
      if (data.success) {
        setBookings((b) => b.map((bk) => (bk._id === id ? data.booking : bk)));
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const deleteBooking = async (id) => {
    if (!confirm("Delete this booking?")) return;
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "DELETE",
        headers: { "x-admin-secret": secret },
      });
      const data = await res.json();
      if (data.success) {
        setBookings((b) => b.filter((bk) => bk._id !== id));
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // optional: refresh list
  const refresh = () => fetchBookings(secret);

  return (
    <div className="min-h-screen bg-green-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-green-800 mb-6">Admin — Bookings</h1>

        {!authOk ? (
          <form onSubmit={handleLogin} className="mb-6">
            <p className="text-sm text-gray-700 mb-2">Enter admin secret to view bookings</p>
            <div className="flex gap-2">
              <input type="password" value={secret} onChange={(e) => setSecret(e.target.value)} placeholder="Admin secret" className="px-4 py-2 rounded-lg w-full" />
              <button type="submit" className="px-4 py-2 bg-green-700 text-white rounded-lg">Login</button>
            </div>
            {error && <div className="mt-2 text-red-600">{error}</div>}
          </form>
        ) : (
          <div className="flex items-center justify-between mb-4">
            <div>
              <button onClick={refresh} className="px-4 py-2 bg-white rounded-lg shadow">Refresh</button>
            </div>
            <div className="text-sm text-gray-600">Logged in (admin)</div>
          </div>
        )}

        {loading && <div>Loading...</div>}

        {bookings.length === 0 && !loading && authOk && <div className="text-gray-600">No bookings yet.</div>}

        {bookings.map((b) => (
          <div key={b._id} className="bg-white rounded-xl shadow p-4 mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="font-semibold text-gray-800">{b.name} — <span className="text-sm text-gray-500">{b.email}</span></div>
              <div className="text-sm text-gray-600">{b.service} • {new Date(b.date).toLocaleDateString()}</div>
              <div className="text-sm mt-2">{b.message}</div>
              <div className="text-xs mt-2">Status: <strong>{b.status}</strong></div>
            </div>

            <div className="mt-4 md:mt-0 flex gap-2">
              {b.status !== "completed" && (
                <button onClick={() => markCompleted(b._id)} className="px-3 py-2 bg-green-600 text-white rounded-md">Mark Completed</button>
              )}
              <button onClick={() => deleteBooking(b._id)} className="px-3 py-2 bg-red-500 text-white rounded-md">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
