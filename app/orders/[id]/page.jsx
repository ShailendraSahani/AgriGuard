"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { 
  Package, 
  User, 
  IndianRupee, 
  CheckCircle, 
  Clock, 
  Wheat, 
  Sprout, 
  CreditCard,
  ShoppingBag,
  X,
  Leaf
} from "lucide-react";

// Simple modal for zoomed images
function ImageModal({ src, onClose }) {
  if (!src) return null;
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 bg-white/90 p-2 rounded-full hover:bg-white transition-colors"
      >
        <X className="w-6 h-6 text-gray-800" />
      </button>
      <img
        src={src}
        alt="Zoomed"
        className="max-h-[90%] max-w-[90%] rounded-2xl shadow-2xl border-4 border-white"
      />
    </div>
  );
}

export default function OrderPage() {
  const { id: orderId } = useParams() || {};
  const { data: session } = useSession();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState(null);
  const [zoomImage, setZoomImage] = useState(null);

  const fetchOrder = useCallback(async () => {
    if (!orderId) return;
    try {
      const origin = window.location.origin;
      const res = await fetch(`${origin}/api/orders/${orderId}`);
      if (!res.ok) throw new Error("Failed to fetch order");
      const data = await res.json();
      setOrder(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, [fetchOrder]);

  const handlePayNow = async () => {
    if (!order) return;
    setPaying(true);
    try {
      const origin = window.location.origin;
      const res = await fetch(`${origin}/api/orders/${order._id}/checkout`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert("Failed to create checkout session");
    } catch (err) {
      console.error(err);
      alert("Payment error");
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-lime-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
          <p className="text-green-800 text-lg font-medium">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-lime-50 to-yellow-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md border-2 border-red-200">
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-red-800 text-center mb-2">Error</h2>
          <p className="text-red-600 text-center">{error}</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-lime-50 to-yellow-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md border-2 border-green-200">
          <Package className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <p className="text-green-800 text-center text-lg font-semibold">Order not found.</p>
        </div>
      </div>
    );
  }

  const isPaid = order.razorpayStatus === "paid" || order.status === "confirmed";

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-lime-50 to-yellow-50">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 opacity-10">
        <Wheat className="w-32 h-32 text-green-600" />
      </div>
      <div className="absolute bottom-20 right-10 opacity-10">
        <Sprout className="w-40 h-40 text-yellow-600" />
      </div>

      <div className="p-6 max-w-6xl mx-auto space-y-6 relative">
        {/* Order Summary Card */}
        <div className="bg-white shadow-xl rounded-2xl p-6 border-2 border-green-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-green-500 to-lime-500 p-2 rounded-xl">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-green-700 to-lime-600 bg-clip-text text-transparent">
                    Order #{order._id}
                  </h1>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-green-700 pl-12">
                <User className="w-4 h-4" />
                <span className="text-sm">
                  Placed by: <span className="font-semibold">{session?.user?.email || order.userEmail}</span>
                </span>
              </div>
              
              <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-lg border border-yellow-200 w-fit ml-12">
                <IndianRupee className="w-5 h-5 text-yellow-700" />
                <span className="text-lg font-bold text-yellow-800">
                  {order.total?.toLocaleString("en-IN") || 0}
                </span>
              </div>
            </div>
            
            <div>
              <div
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm border-2 ${
                  isPaid 
                    ? "bg-gradient-to-r from-green-100 to-lime-100 text-green-800 border-green-300" 
                    : "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-300"
                }`}
              >
                {isPaid ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Paid
                  </>
                ) : (
                  <>
                    <Clock className="w-5 h-5" />
                    Pending
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Pay Now Button */}
        {!isPaid && (
          <div className="flex justify-center">
            <button
              onClick={handlePayNow}
              disabled={paying}
              className="flex items-center gap-3 bg-gradient-to-r from-green-500 via-lime-500 to-yellow-500 text-white px-10 py-4 rounded-xl hover:from-green-600 hover:via-lime-600 hover:to-yellow-600 transition-all duration-300 shadow-xl hover:shadow-2xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <CreditCard className="w-6 h-6 group-hover:scale-110 transition-transform" />
              {paying ? "Redirecting..." : "Pay Now"}
            </button>
          </div>
        )}

        {/* Products List */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-green-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-green-500 to-lime-500 p-2 rounded-lg">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-green-800">Products</h2>
          </div>
          
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {order.items.map((item, idx) => (
              <li
                key={idx}
                className="bg-gradient-to-br from-green-50 to-yellow-50 shadow-lg rounded-2xl p-5 flex flex-col items-center hover:scale-[1.03] transition-all duration-300 border-2 border-green-100 hover:border-green-300"
              >
                {item.product?.image && (
                  <div className="relative mb-4">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-36 h-36 object-cover rounded-xl cursor-pointer shadow-md hover:shadow-xl transition-shadow border-2 border-white"
                      onClick={() => setZoomImage(item.product.image)}
                    />
                    <div className="absolute -top-2 -right-2 bg-gradient-to-br from-green-500 to-lime-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm shadow-lg">
                      {item.quantity}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-2 mb-2">
                  <Wheat className="w-4 h-4 text-green-600" />
                  <p className="font-bold text-green-900 text-center text-lg">
                    {item.product?.name || "Unknown Product"}
                  </p>
                </div>
                
                <div className="w-full space-y-2 mt-2">
                  <div className="flex justify-between items-center bg-white px-3 py-2 rounded-lg border border-green-200">
                    <span className="text-sm text-green-700">Price:</span>
                    <span className="font-bold text-green-800">₹{item.price?.toLocaleString("en-IN") || 0}</span>
                  </div>
                  
                  <div className="flex justify-between items-center bg-yellow-50 px-3 py-2 rounded-lg border border-yellow-200">
                    <span className="text-sm text-yellow-700">Subtotal:</span>
                    <span className="font-bold text-yellow-800">
                      ₹{(item.price * item.quantity)?.toLocaleString("en-IN") || 0}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Payment Details */}
        {isPaid && order.razorpaySessionId && (
          <div className="bg-white shadow-xl rounded-2xl p-6 border-2 border-green-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-br from-green-500 to-lime-500 p-2 rounded-lg">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-green-800">Payment Details</h2>
            </div>
            
            <div className="space-y-3 pl-12">
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-green-600" />
                <span className="text-green-700">
                  Razorpay Session ID: <span className="font-semibold text-green-900">{order.razorpaySessionId}</span>
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-green-700">
                  Payment Status: <span className="font-semibold text-green-900">{order.razorpayStatus}</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Image Zoom Modal */}
        {zoomImage && <ImageModal src={zoomImage} onClose={() => setZoomImage(null)} />}
      </div>
    </div>
  );
}