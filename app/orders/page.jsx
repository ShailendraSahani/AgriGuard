"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Package, Calendar, IndianRupee, Eye, ShoppingBag, Sprout, Wheat, Leaf } from "lucide-react";

export default function OrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.email) {
      fetchOrders();
    }
  }, [session]);

  async function fetchOrders() {
    try {
      const res = await fetch(`/api/orders?userEmail=${session.user.email}`);
      const data = await res.json();
      if (res.ok) {
        setOrders(data);
      } else {
        console.error("Failed to fetch orders:", data.error);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      processing: "bg-lime-100 text-lime-800 border-lime-300",
      shipped: "bg-emerald-100 text-emerald-800 border-emerald-300",
      delivered: "bg-green-100 text-green-800 border-green-300",
      cancelled: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[status?.toLowerCase()] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-lime-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
          <p className="text-green-800 text-lg font-medium">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-lime-50 to-yellow-50">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 opacity-10">
        <Wheat className="w-32 h-32 text-green-600" />
      </div>
      <div className="absolute bottom-20 right-10 opacity-10">
        <Sprout className="w-40 h-40 text-yellow-600" />
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl relative">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-green-500 to-lime-600 p-2 rounded-xl">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-700 to-lime-600 bg-clip-text text-transparent">
              My Orders
            </h1>
          </div>
          <p className="text-green-700 ml-14 flex items-center gap-2">
            <Leaf className="w-4 h-4" />
            Track and manage your agricultural orders
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border-2 border-green-100">
            <div className="bg-gradient-to-br from-green-100 to-yellow-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold text-green-800 mb-2">No orders yet</h2>
            <p className="text-green-600 mb-6">Start shopping for quality agricultural products</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 via-lime-500 to-yellow-500 text-white px-8 py-3 rounded-xl hover:from-green-600 hover:via-lime-600 hover:to-yellow-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
            >
              <Sprout className="w-5 h-5" />
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-green-100 hover:border-green-200"
              >
                <div className="p-6 bg-gradient-to-r from-green-50/50 to-yellow-50/50">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Left Section - Order Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="bg-gradient-to-br from-green-500 to-lime-500 p-1.5 rounded-lg">
                          <Package className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm text-green-700 font-medium">Order ID:</span>
                        <span className="text-sm font-mono text-green-800 bg-green-100 px-3 py-1 rounded-lg border border-green-200">
                          {order._id}
                        </span>
                      </div>

                      {order.items && order.items.length > 0 && (
                        <div className="pl-8">
                          <p className="text-base font-bold text-green-900 mb-1 flex items-center gap-2">
                            <Wheat className="w-4 h-4 text-green-600" />
                            {order.items[0].title}
                          </p>
                          {order.items.length > 1 && (
                            <p className="text-sm text-green-600 pl-6">
                              +{order.items.length - 1} more item{order.items.length > 2 ? "s" : ""}
                            </p>
                          )}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-4 pl-8">
                        <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1.5 rounded-lg border border-yellow-200">
                          <IndianRupee className="w-4 h-4 text-yellow-700" />
                          <span className="text-lg font-bold text-yellow-800">₹{order.total}</span>
                        </div>

                        <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
                          <Calendar className="w-4 h-4 text-green-700" />
                          <span className="text-sm text-green-700 font-medium">
                            {new Date(order.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>

                        <span
                          className={`px-4 py-1.5 rounded-full text-sm font-bold border-2 ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>

                    {/* Right Section - Action Button */}
                    <div className="lg:border-l-2 lg:border-green-100 lg:pl-6 lg:ml-6">
                      <Link
                        href={`/orders/${order._id}`}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 via-lime-500 to-yellow-500 text-white px-8 py-3.5 rounded-xl hover:from-green-600 hover:via-lime-600 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:shadow-xl font-bold w-full lg:w-auto group"
                      >
                        <Eye className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}