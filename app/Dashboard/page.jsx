import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route.js"; // adjust path if needed

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login"); // if not logged in, send to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-green-800 mb-6">
          Welcome, {session.user?.name} 👋
        </h1>

        {/* Dashboard Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Orders Card */}
          <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition">
            <h2 className="text-xl font-semibold text-green-700 mb-2">
              📦 My Orders
            </h2>
            <p className="text-gray-600">
              View and track all your past and current orders.
            </p>
            <button className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition">
              View Orders
            </button>
          </div>

          {/* Bookings Card */}
          <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition">
            <h2 className="text-xl font-semibold text-green-700 mb-2">
              📅 My Bookings
            </h2>
            <p className="text-gray-600">
              Manage your scheduled farming services and bookings.
            </p>
            <button className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition">
              View Bookings
            </button>
          </div>

          {/* More Features */}
          <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition">
            <h2 className="text-xl font-semibold text-green-700 mb-2">
              ⚙️ Settings & Profile
            </h2>
            <p className="text-gray-600">
              Update your account, profile picture, and preferences.
            </p>
            <button className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition">
              Manage Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
