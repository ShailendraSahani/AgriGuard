"use client";

import Image from "next/image";
import { useEffect, useState, useRef, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
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

/* =========================
   MAIN CONTENT (UNCHANGED)
========================= */
function MarketplaceContent() {
  const [market, setMarket] = useState([]);
  const [filteredMarket, setFilteredMarket] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [ordering, setOrdering] = useState(false);
  const [form, setForm] = useState({
    name: "",
    price: "",
    unit: "",
    category: "",
    description: "",
    sellerName: "",
    stock: ""
  });
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
  const router = useRouter();
  const searchParams = useSearchParams();

  const categories = ["all", "seeds", "fertilizers", "tools", "pesticides", "irrigation", "services"];

  const categoryIcons = {
    seeds: "🌱",
    fertilizers: "🧪",
    tools: "🔧",
    pesticides: "🌿",
    irrigation: "💧",
    services: "🛠️",
    all: "🌱"
  };

  /* URL CATEGORY */
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam && categories.includes(categoryParam)) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  /* FETCH PRODUCTS */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/marketplace");
        const data = await res.json();
        setMarket(data);
        setFilteredMarket(data);
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  /* FILTER + SORT */
  useEffect(() => {
    let filtered = [...market];

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    filtered.sort((a, b) =>
      sortBy === "price"
        ? a.price - b.price
        : a.name.localeCompare(b.name)
    );

    setFilteredMarket(filtered);
  }, [market, searchTerm, selectedCategory, sortBy]);

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading marketplace...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-green-50 p-6">
      <h1 className="text-3xl font-bold text-green-800 mb-6">
        🌾 AgriGuard Marketplace
      </h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">
          {error}
        </div>
      )}

      <div className="flex gap-4 mb-6">
        <input
          placeholder="Search..."
          className="border p-2 rounded w-full"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
        >
          {categories.map(c => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
        >
          <option value="name">Name</option>
          <option value="price">Price</option>
        </select>
      </div>

      {filteredMarket.length === 0 ? (
        <p>No products found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredMarket.map(item => (
            <div
              key={item._id}
              className="bg-white p-4 rounded shadow cursor-pointer"
              onClick={() => setSelectedProduct(item)}
            >
              <h3 className="font-bold">{item.name}</h3>
              <p>₹ {item.price}</p>
              <p>{item.category}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

/* =========================
   ✅ REQUIRED FIX
   Suspense Wrapper
========================= */
export default function MarketplacePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading Marketplace...
        </div>
      }
    >
      <MarketplaceContent />
    </Suspense>
  );
}
