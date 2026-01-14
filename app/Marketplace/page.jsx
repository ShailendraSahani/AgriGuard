
"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  ShoppingCart, 
  Wheat, 
  Sprout, 
  Plus,
  Upload,
  Leaf,
  Package,
  IndianRupee,
  AlertCircle,
  X
} from "lucide-react";

export default function Marketplace() {
  const [market, setMarket] = useState([]);
  const [filteredMarket, setFilteredMarket] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [ordering, setOrdering] = useState(false);
  const [form, setForm] = useState({ name: "", price: "", unit: "", category: "", description: "", sellerName: "", stock: "" });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const modalRef = useRef(null);

  const { data: session, status } = useSession();

  const categories = ["all", "fruits", "vegetables", "grains", "dairy"];

  const categoryIcons = {
    fruits: "🍎",
    vegetables: "🥕",
    grains: "🌾",
    dairy: "🥛",
    all: "🌱"
  };

  // Reset quantity when modal opens with a new product
  useEffect(() => {
    if (selectedProduct) {
      setQuantity(1);
    }
  }, [selectedProduct]);

  // Load products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/marketplace", { next: { revalidate: 60 } });
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        if (Array.isArray(data)) {
          setMarket(data);
          setFilteredMarket(data);
        } else {
          setError("Invalid product data");
        }
      } catch (err) {
        console.error("Fetch products error:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter and sort
  useEffect(() => {
    let filtered = [...market];
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategory !== "all") {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    filtered.sort((a, b) => {
      if (sortBy === "price") return parseFloat(a.price) - parseFloat(b.price);
      return a.name.localeCompare(b.name);
    });
    setFilteredMarket(filtered);
  }, [market, searchTerm, selectedCategory, sortBy]);

  // Load Razorpay script
  useEffect(() => {
    if (typeof window !== "undefined" && !window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => {
        console.log("Razorpay script loaded");
        setRazorpayLoaded(true);
      };
      script.onerror = () => {
        console.error("Failed to load Razorpay script");
        setError("Failed to load payment system");
      };
      document.body.appendChild(script);
    } else if (window.Razorpay) {
      console.log("Razorpay already loaded");
      setRazorpayLoaded(true);
    }
  }, []);

  // Handle modal keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && selectedProduct) {
        setSelectedProduct(null);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedProduct]);

  // Focus modal when opened
  useEffect(() => {
    if (selectedProduct && modalRef.current) {
      modalRef.current.focus();
    }
  }, [selectedProduct]);

  // Add product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setAdding(true);
    setError("");

    if (status !== "authenticated") {
      setError("Please login to add products");
      setAdding(false);
      return;
    }

    let imageUrl = null;
    if (imageFile) {
      const fd = new FormData();
      fd.append("file", imageFile);
      try {
        const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
        if (!uploadRes.ok) throw new Error("Image upload failed");
        const { url } = await uploadRes.json();
        imageUrl = url;
      } catch (err) {
        console.error("Image upload error:", err);
        setError("Image upload failed");
        setAdding(false);
        return;
      }
    }

    try {
      const res = await fetch("/api/marketplace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, image: imageUrl }),
      });

      if (!res.ok) throw new Error("Failed to add product");

      const newItem = await res.json();
      setMarket(prev => [...prev, newItem]);
      setForm({ name: "", price: "", unit: "", category: "", description: "", sellerName: "", stock: "" });
      setImageFile(null);
      setShowAddForm(false);
    } catch (err) {
      console.error("Add product error:", err);
      setError("Failed to add product");
    } finally {
      setAdding(false);
    }
  };

  // Place order
  const placeOrder = async (product, qty) => {
    console.log("Attempting to place order for:", product.name, "Quantity:", qty);
    if (qty < 1) {
      setError("Quantity must be at least 1");
      console.error("Invalid quantity");
      return;
    }

    if (status !== "authenticated") {
      setError("Please login to place orders");
      console.error("User not authenticated");
      return;
    }

    if (!razorpayLoaded) {
      setError("Payment system is still loading. Please try again in a moment.");
      console.error("Razorpay not loaded");
      return;
    }

    if (!product.stock || product.stock < qty) {
      setError("Insufficient stock");
      console.error("Insufficient stock for:", product.name);
      return;
    }

    setOrdering(true);
    try {
      console.log("Creating order for user:", session.user.email);
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: session.user.email,
          items: [{ product: product._id, quantity: qty, price: product.price }],
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to place order");
      }

      const order = await res.json();
      console.log("Order created:", order);

      const checkoutRes = await fetch(`/api/orders/${order._id}/checkout`, {
        method: "POST",
      });
      if (!checkoutRes.ok) throw new Error("Failed to initiate checkout");
      const data = await checkoutRes.json();
      const razorpayOrder = data.order;

      if (!razorpayOrder || !razorpayOrder.amount) {
        throw new Error("Failed to initiate payment");
      }

      console.log("Razorpay order:", razorpayOrder);

      if (!window.Razorpay) {
        throw new Error("Razorpay script not loaded");
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "your-razorpay-key-id",
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency || "INR",
        name: "AgriGuard",
        description: `Order #${order._id}`,
        order_id: razorpayOrder.id,
        handler: function (response) {
          console.log("Payment successful:", response);
          alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
          setSelectedProduct(null); // Close modal on successful payment
        },
        prefill: {
          email: session.user.email,
        },
        notes: {
          order_id: order._id,
        },
        theme: {
          color: "#22c55e", // Green color to match theme
        },
      };

      console.log("Opening Razorpay checkout with options:", options);
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
        setError(`Payment failed: ${response.error.description}`);
      });
      rzp.open();
    } catch (err) {
      console.error("Place order error:", err);
      setError(err.message || "Payment failed. Try again.");
    } finally {
      setOrdering(false);
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-lime-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
          <p className="text-green-800 text-lg font-medium">Loading marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-lime-50 to-yellow-50 relative overflow-hidden">
      <div className="absolute top-20 left-10 opacity-10">
        <Wheat className="w-32 h-32 text-green-600" />
      </div>
      <div className="absolute bottom-20 right-10 opacity-10">
        <Sprout className="w-40 h-40 text-yellow-600" />
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-8 relative">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-green-500 to-lime-600 p-3 rounded-xl">
              <Package className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-700 to-lime-600 bg-clip-text text-transparent">
              AgriGuard Marketplace
            </h1>
          </div>
          <p className="text-green-700 ml-16 flex items-center gap-2">
            <Leaf className="w-4 h-4" />
            Fresh agricultural products at your doorstep
          </p>
        </div>

        {session && (
          <div className="mb-6">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 via-lime-500 to-yellow-500 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:via-lime-600 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:shadow-xl font-bold"
            >
              <Plus className="w-5 h-5" />
              Add New Product
            </button>
          </div>
        )}

        {showAddForm && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border-2 border-green-100">
            <h2 className="text-2xl font-bold text-green-800 mb-4 flex items-center gap-2">
              <Sprout className="w-6 h-6" />
              Add New Product
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-green-700 mb-2">Product Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none"
                    placeholder="e.g., Fresh Tomatoes"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-green-700 mb-2">Category</label>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    required
                    className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none"
                  >
                    <option value="">Select Category</option>
                    {categories.filter(c => c !== "all").map(cat => (
                      <option key={cat} value={cat}>
                        {categoryIcons[cat]} {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-green-700 mb-2">Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    required
                    className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-green-700 mb-2">Unit</label>
                  <input
                    type="text"
                    value={form.unit}
                    onChange={e => setForm({ ...form, unit: e.target.value })}
                    required
                    className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none"
                    placeholder="kg, dozen, litre"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-green-700 mb-2">Description</label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none"
                    placeholder="Enter product description"
                    rows={4}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-green-700 mb-2">Seller Name</label>
                  <input
                    type="text"
                    value={form.sellerName}
                    onChange={e => setForm({ ...form, sellerName: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none"
                    placeholder="e.g., Local Farmer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-green-700 mb-2">Stock Quantity</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={e => setForm({ ...form, stock: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none"
                    placeholder="e.g., 100"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-green-700 mb-2">Product Image</label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => setImageFile(e.target.files[0])}
                    className="flex-1 px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none"
                  />
                  <Upload className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleAddProduct}
                  disabled={adding}
                  className="flex-1 bg-gradient-to-r from-green-500 via-lime-500 to-yellow-500 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:via-lime-600 hover:to-yellow-600 transition-all duration-300 shadow-lg font-bold disabled:opacity-50"
                >
                  {adding ? "Adding..." : "Add Product"}
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border-2 border-green-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-600 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-600 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="pl-12 pr-8 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none appearance-none bg-white min-w-[200px]"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "🌱 All Categories" : `${categoryIcons[cat]} ${cat.charAt(0).toUpperCase() + cat.slice(1)}`}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <ArrowUpDown className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-600 w-5 h-5" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="pl-12 pr-8 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none appearance-none bg-white min-w-[180px]"
              >
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}

        {filteredMarket.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border-2 border-green-100">
            <Package className="w-20 h-20 text-green-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-green-800 mb-2">No products found</h2>
            <p className="text-green-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMarket.map(item => (
              <div 
                key={item._id} 
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-green-100 hover:border-green-300 group cursor-pointer"
                onClick={() => setSelectedProduct(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setSelectedProduct(item);
                  }
                }}
              >
                <div className="relative h-56 bg-gradient-to-br from-green-50 to-yellow-50">
                  {item.image ? (
                    <Image 
                      src={item.image} 
                      alt={item.name} 
                      fill 
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <Wheat className="w-16 h-16 text-green-300" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-sm font-semibold text-green-700">
                      {categoryIcons[item.category]} {item.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-5">
                  <h3 className="text-xl font-bold text-green-900 mb-2 flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-green-600" />
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-2 bg-yellow-50 px-3 py-2 rounded-lg border border-yellow-200">
                    <IndianRupee className="w-5 h-5 text-yellow-700" />
                    <span className="text-2xl font-bold text-yellow-800">
                      {parseFloat(item.price).toFixed(2)}
                    </span>
                    <span className="text-sm text-yellow-700">/ {item.unit}</span>
                  </div>
                  <p className={`text-sm ${item.stock > 0 ? "text-gray-600" : "text-red-600 font-semibold"}`}>
                    {item.stock > 0 ? `${item.stock} ${item.unit} available` : "Out of stock"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedProduct && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in-0 duration-300"
            onClick={() => setSelectedProduct(null)}
            role="dialog"
            aria-labelledby="modal-title"
            aria-modal="true"
          >
            <div 
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative transform transition-all animate-in slide-in-from-bottom-10 duration-300"
              onClick={e => e.stopPropagation()}
              ref={modalRef}
              tabIndex={-1}
            >
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="relative h-64 mb-4">
                {selectedProduct.image ? (
                  <Image
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    fill
                    sizes="100vw"
                    className="object-cover rounded-t-2xl"
                    priority
                  />
                ) : (
                  <div className="h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-yellow-50 rounded-t-2xl">
                    <Wheat className="w-20 h-20 text-green-300" />
                  </div>
                )}
              </div>
              <h2 id="modal-title" className="text-2xl font-bold text-green-900 mb-2 flex items-center gap-2">
                <Leaf className="w-6 h-6 text-green-600" />
                {selectedProduct.name}
              </h2>
              <p className="text-sm text-green-700 mb-2 flex items-center gap-2">
                {categoryIcons[selectedProduct.category]} {selectedProduct.category.charAt(0).toUpperCase() + selectedProduct.category.slice(1)}
              </p>
              <div className="flex items-center gap-2 mb-4 bg-yellow-50 px-3 py-2 rounded-lg border border-yellow-200">
                <IndianRupee className="w-5 h-5 text-yellow-700" />
                <span className="text-2xl font-bold text-yellow-800">
                  {parseFloat(selectedProduct.price * quantity).toFixed(2)}
                </span>
                <span className="text-sm text-yellow-700">for {quantity} {selectedProduct.unit}</span>
              </div>
              <div className="space-y-3 mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-green-700">Description</h3>
                  <p className="text-gray-600">
                    {selectedProduct.description || "No description available"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-green-700">Seller</h3>
                  <p className="text-gray-600">
                    {selectedProduct.sellerName || "Unknown Seller"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-green-700">Stock</h3>
                  <p className={`text-gray-600 ${selectedProduct.stock <= 0 ? "text-red-600 font-semibold" : ""}`}>
                    {selectedProduct.stock > 0 ? `${selectedProduct.stock} ${selectedProduct.unit} available` : "Out of stock"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-green-700">Quantity</h3>
                  <input
                    type="number"
                    min={1}
                    max={selectedProduct.stock}
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (val >= 1 && val <= selectedProduct.stock) {
                        setQuantity(val);
                      }
                    }}
                    className="w-20 px-3 py-2 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none text-center font-semibold"
                  />
                </div>
              </div>
              <button
                onClick={() => placeOrder(selectedProduct, quantity)}
                disabled={ordering || selectedProduct.stock < quantity || quantity < 1}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 via-lime-500 to-yellow-500 text-white px-4 py-3 rounded-xl hover:from-green-600 hover:via-lime-600 hover:to-yellow-600 transition-all duration-300 shadow-md hover:shadow-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                {ordering ? "Processing..." : "Order Now"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
