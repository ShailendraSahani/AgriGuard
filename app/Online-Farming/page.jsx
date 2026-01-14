
"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function OnlineFarming() {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("browse");

  const placeholderImage = 'https://via.placeholder.com/400x300/cccccc/000000?text=No+Image+Available';

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    size: "",
    soilType: "",
    facilities: "",
    leaseRate: "",
    badges: [],
    imageFile: null,
    listingType: "paid",
    sharingPercentage: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [selectedLand, setSelectedLand] = useState(null);
  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    soilType: "",
    leaseRate: "",
    sortBy: "rating",
    viewMode: "grid"
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [comparedLands, setComparedLands] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showLeaseModal, setShowLeaseModal] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [contactMethod, setContactMethod] = useState('message');
  const [emailData, setEmailData] = useState({ subject: '', message: '' });
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [scheduleData, setScheduleData] = useState({ date: '', time: '', phone: '' });
  const [userPhone, setUserPhone] = useState('');

  const fetchLands = async () => {
    setLoading(true);
    try {
      const response = await fetch(window.location.origin + '/api/lands');
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch lands: ${response.status} ${errorText}`);
      }
      const data = await response.json();
      setLands(data);
    } catch (error) {
      console.error('Error fetching lands:', error);
      showToast("Failed to load lands ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLands();
  }, []);

  useEffect(() => {
    if (selectedLand && selectedLand.owner) {
      setOwnerPhone(selectedLand.owner.phone || '');
      setOwnerEmail(selectedLand.owner.email || '');
    }
  }, [selectedLand]);

  useEffect(() => {
    const fetchUserPhone = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch('/api/auth/me');
          if (response.ok) {
            const data = await response.json();
            setUserPhone(data.user.phone || '');
          }
        } catch (error) {
          console.error('Error fetching user phone:', error);
        }
      }
    };
    fetchUserPhone();
  }, [session]);

  useEffect(() => {
    if (showScheduleModal && userPhone) {
      setScheduleData(prev => ({ ...prev, phone: userPhone }));
    }
  }, [showScheduleModal, userPhone]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const toggleCompare = (land) => {
    if (comparedLands.find(l => l._id === land._id)) {
      setComparedLands(prev => prev.filter(l => l._id !== land._id));
      showToast("Removed from comparison 📊");
    } else if (comparedLands.length < 3) {
      setComparedLands(prev => [...prev, land]);
      showToast("Added to comparison 📈");
    } else {
      showToast("Maximum 3 lands can be compared ⚠️");
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "badges") setFormData({ ...formData, badges: value.split(",") });
    else if (name === "imageFile") {
      const file = files[0];
      setFormData({ ...formData, imageFile: file });
      setPreviewImage(file ? URL.createObjectURL(file) : null);
    } else setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session) {
      showToast("Please log in to list your land ❌");
      return;
    }
    setLoading(true);
    try {
      let imageBase64 = null;
      if (formData.imageFile) {
        imageBase64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(formData.imageFile);
          reader.onload = () => resolve(reader.result);
        });
      }

      const submitData = {
        ...formData,
        leaseRate: formData.listingType === "sharing" ? 0 : parseFloat(formData.leaseRate),
        facilities: formData.facilities ? formData.facilities.split(',').map(f => f.trim()).filter(Boolean) : [],
        imageBase64,
        sharingPercentage: formData.listingType === "sharing" ? parseFloat(formData.sharingPercentage) : 0,
      };

      const response = await fetch('/api/lands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create land');
      }

      fetchLands();
      showToast("Land listed successfully! 🎉");
      setShowForm(false);
      setFormData({
        title: "",
        description: "",
        location: "",
        size: "",
        soilType: "",
        facilities: "",
        leaseRate: "",
        badges: [],
        imageFile: null,
        listingType: "paid",
        sharingPercentage: "",
      });
      setPreviewImage(null);
    } catch (error) {
      showToast(error.message || "Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  const filteredLands = lands.filter((land) => {
    const keywordLower = filters.keyword.toLowerCase();
    return (
      (!keywordLower || land.title.toLowerCase().includes(keywordLower) || land.description.toLowerCase().includes(keywordLower)) &&
      (!filters.location || land.location.toLowerCase().includes(filters.location.toLowerCase())) &&
      (!filters.soilType || land.soilType.toLowerCase().includes(filters.soilType.toLowerCase())) &&
      (!filters.leaseRate || land.leaseRate <= parseFloat(filters.leaseRate))
    );
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-low': return parseFloat(a.leaseRate) - parseFloat(b.leaseRate);
      case 'price-high': return parseFloat(b.leaseRate) - parseFloat(a.leaseRate);
      case 'size': return parseFloat(b.size) - parseFloat(a.size);
      case 'rating': return b.rating - a.rating;
      default: return 0;
    }
  });

  const tabs = [
    { id: "browse", label: "🏡 Browse Lands", count: filteredLands.length }
  ];

  const handleLeaseProcess = async () => {
    if (!session) {
      showToast("Please log in to start lease process ❌");
      return;
    }
    try {
      const response = await fetch(`/api/lands/${selectedLand._id}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': session.user.id,
        },
        body: JSON.stringify({ message: "Interested in leasing this land." }),
      });
      if (!response.ok) throw new Error('Failed to send request');
      showToast("Lease process started! 📋");
      setShowLeaseModal(false);
    } catch (error) {
      showToast(error.message || "Something went wrong ❌");
    }
  };

  const handleContact = async () => {
    if (!session) {
      showToast("Please log in to contact owner ❌");
      return;
    }
    try {
      if (contactMethod === 'message') {
        const response = await fetch(`/api/lands/${selectedLand._id}/contact`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': session.user.id,
          },
          body: JSON.stringify({ message: contactMessage }),
        });
        if (!response.ok) throw new Error('Failed to send message');
        showToast("Message sent to owner! 📧");
        setContactMessage('');
      } else if (contactMethod === 'email') {
        const response = await fetch('/api/sendEmail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: ownerEmail,
            subject: emailData.subject,
            message: emailData.message,
            from: session.user.email,
          }),
        });
        if (!response.ok) throw new Error('Failed to send email');
        showToast("Email sent to owner! 📧");
        setEmailData({ subject: '', message: '' });
      } else if (contactMethod === 'phone') {
        setShowContactModal(false);
        return;
      }
      setShowContactModal(false);
    } catch (error) {
      showToast(error.message || "Something went wrong ❌");
    }
  };

  const handleScheduleVisit = async () => {
    if (!session) {
      showToast("Please log in to schedule visit ❌");
      return;
    }
    try {
      const response = await fetch('/api/Bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedLand._id,
          serviceName: selectedLand.title,
          name: session.user.name,
          email: session.user.email,
          phone: scheduleData.phone,
          date: scheduleData.date,
          time: scheduleData.time,
        }),
      });
      if (!response.ok) throw new Error('Failed to schedule visit');
      showToast("Visit scheduled! 📅");
      setShowScheduleModal(false);
      setScheduleData({ date: '', time: '', phone: '' });
    } catch (error) {
      showToast(error.message || "Something went wrong ❌");
    }
  };

  const handlePayment = async () => {
    if (!session) {
      showToast("Please log in to make payment ❌");
      return;
    }
    try {
      if (!window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
        });
      }

      const response = await fetch(`/api/lands/${selectedLand._id}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: session.user.email }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create payment order');
      }
      const { id, amount, currency, key } = await response.json();

      const options = {
        key: key,
        amount: amount,
        currency: currency,
        name: 'AgriGuard Pro',
        description: `Lease payment for ${selectedLand.title}`,
        order_id: id,
        handler: function (response) {
          showToast("Payment successful! 🎉");
          setShowLeaseModal(false);
          setSelectedLand(null);
        },
        prefill: {
          name: session.user.name,
          email: session.user.email,
        },
        theme: {
          color: '#15803d',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      showToast(error.message || "Payment initiation failed ❌");
    }
  };

  const SkeletonCard = () => (
    <div className="animate-pulse bg-gray-100 rounded-lg h-64 w-full"></div>
  );

  return (
    <div className="min-h-screen bg-green-50">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 10 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50 bg-green-700 text-white px-4 py-2 rounded-lg shadow-md"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="bg-green-700 py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold text-yellow-300">🌾 AgriGuard Pro</h1>
            <p className="text-sm text-yellow-100 mt-1">Lease farmland with confidence</p>
          </motion.div>

          {/* Navigation Tabs */}
          <div className="flex justify-center gap-2 mt-4">
            {tabs.map(tab => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-yellow-400 text-green-900'
                    : 'bg-green-800 text-yellow-100 hover:bg-green-600'
                }`}
              >
                {tab.label} {tab.count !== null && `(${tab.count})`}
              </motion.button>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="flex justify-center gap-2 mt-4">
            {session && (
              <motion.button
                onClick={() => setShowForm(!showForm)}
                whileHover={{ scale: 1.05 }}
                className="bg-yellow-400 text-green-900 px-4 py-2 rounded-lg text-sm font-medium"
              >
                {showForm ? "Close Form ✕" : "List Land +"}
              </motion.button>
            )}
            {comparedLands.length > 0 && (
              <motion.button
                onClick={() => setShowComparison(true)}
                whileHover={{ scale: 1.05 }}
                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Compare ({comparedLands.length}) 📊
              </motion.button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Land Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <motion.form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-lg shadow-sm border border-green-200"
              >
                <h2 className="text-xl font-semibold text-green-900 mb-4">List Your Farmland</h2>

                <div className="mb-4">
                  <h3 className="text-sm font-medium text-green-900 mb-2">Listing Type</h3>
                  <div className="flex gap-4">
                    <label className="flex items-center text-sm">
                      <input type="radio" name="listingType" value="sharing" checked={formData.listingType === "sharing"} onChange={handleChange} className="mr-2 text-green-600" />
                      Sharing
                    </label>
                    <label className="flex items-center text-sm">
                      <input type="radio" name="listingType" value="paid" checked={formData.listingType === "paid"} onChange={handleChange} className="mr-2 text-green-600" />
                      Paid
                    </label>
                  </div>
                </div>

                {formData.listingType === "sharing" && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-green-900 mb-1">Sharer Percentage (%)</label>
                    <input
                      type="number"
                      name="sharingPercentage"
                      placeholder="e.g., 30"
                      value={formData.sharingPercentage}
                      onChange={handleChange}
                      className="w-full p-2 border border-green-200 rounded-lg focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                    />
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { name: "title", placeholder: "Land Title" },
                    { name: "location", placeholder: "Location" },
                    { name: "size", placeholder: "Size (e.g., 25 Acres)" },
                    { name: "soilType", placeholder: "Soil Type" },
                    { name: "facilities", placeholder: "Facilities (comma separated)" },
                    ...(formData.listingType === "paid" ? [{ name: "leaseRate", placeholder: "Monthly Rate ($)", type: "number" }] : []),
                    { name: "badges", placeholder: "Tags (comma separated)" },
                  ].map((field) => (
                    <div key={field.name}>
                      <input
                        type={field.type || "text"}
                        name={field.name}
                        placeholder={field.placeholder}
                        value={formData[field.name]}
                        onChange={handleChange}
                        className="w-full p-2 border border-green-200 rounded-lg focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                      />
                    </div>
                  ))}

                  <div className="sm:col-span-2">
                    <textarea
                      name="description"
                      placeholder="Detailed Description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      className="w-full p-2 border border-green-200 rounded-lg focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 resize-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="flex items-center justify-center w-full p-3 border border-dashed border-green-300 rounded-lg cursor-pointer hover:border-yellow-400 hover:bg-yellow-50/50">
                      <span className="text-sm text-green-900">Upload Land Image</span>
                      <input type="file" name="imageFile" accept="image/*" onChange={handleChange} className="hidden" />
                    </label>
                  </div>

                  {previewImage && (
                    <div className="sm:col-span-2">
                      <Image src={previewImage} alt="Preview" className="h-40 w-full rounded-lg object-cover" width={400} height={300} />
                    </div>
                  )}
                </div>

                <div className="mt-4 text-center">
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-green-700 text-white px-6 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                  >
                    {loading ? "Submitting..." : "Submit Listing"}
                  </motion.button>
                </div>
              </motion.form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters & Controls */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-green-200"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {[
                { placeholder: "Search...", value: filters.keyword, key: "keyword" },
                { placeholder: "Location...", value: filters.location, key: "location" },
                { placeholder: "Soil Type...", value: filters.soilType, key: "soilType" },
                { placeholder: "Max Budget...", value: filters.leaseRate, key: "leaseRate", type: "number" },
              ].map((filter) => (
                <input
                  key={filter.key}
                  placeholder={filter.placeholder}
                  type={filter.type || "text"}
                  value={filter.value}
                  onChange={(e) => setFilters({ ...filters, [filter.key]: e.target.value })}
                  className="px-3 py-2 border border-green-200 rounded-lg focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 w-full sm:w-36 text-sm"
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                className="px-3 py-2 border border-green-200 rounded-lg focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-sm"
              >
                <option value="rating">Rating</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="size">Size</option>
              </select>

              <div className="flex border border-green-200 rounded-lg">
                {['grid', 'list'].map(view => (
                  <button
                    key={view}
                    onClick={() => setFilters({ ...filters, viewMode: view })}
                    className={`px-3 py-2 text-sm ${filters.viewMode === view ? 'bg-green-700 text-white' : 'bg-white text-green-900'}`}
                  >
                    {view === 'grid' ? '⊞' : '☰'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Land Cards */}
        <AnimatePresence mode="wait">
          {activeTab === "browse" && (
            <motion.div
              key="browse"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <motion.div
                layout
                className={filters.viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}
              >
                <AnimatePresence>
                  {loading ? (
                    Array.from({ length: 4 }).map((_, index) => (
                      <motion.div
                        key={`skeleton-${index}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <SkeletonCard />
                      </motion.div>
                    ))
                  ) : (
                    filteredLands.map((land, index) => (
                      <motion.div
                        key={land._id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={`relative bg-white rounded-lg shadow-sm border border-green-200 overflow-hidden ${
                          filters.viewMode === 'grid' ? 'h-64' : 'flex items-center p-3 space-x-3'
                        }`}
                      >
                        <div className={`relative overflow-hidden ${
                          filters.viewMode === 'grid' ? 'h-36' : 'w-20 h-16 rounded-md'
                        }`}>
                          <motion.img
                            src={land.image || placeholderImage}
                            alt={land.title}
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                            className="w-full h-full object-cover"
                            onClick={() => setSelectedLand(land)}
                          />
                          <div className="absolute top-1.5 left-1.5 flex gap-1 flex-wrap">
                            {land.badges?.slice(0, 2).map((badge, i) => (
                              <span
                                key={i}
                                className="bg-yellow-300 text-green-900 px-1.5 py-0.5 rounded-full text-xs"
                              >
                                {badge.length > 10 ? `${badge.slice(0, 10)}...` : badge}
                              </span>
                            ))}
                            {land.badges?.length > 2 && (
                              <span className="bg-gray-200 text-gray-800 px-1.5 py-0.5 rounded-full text-xs">
                                +{land.badges.length - 2}
                              </span>
                            )}
                          </div>
                          <div className="absolute bottom-1.5 left-1.5 bg-green-900/80 text-white px-1.5 py-0.5 rounded-md text-xs">
                            ⭐ {land.rating}
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleCompare(land); }}
                            className={`absolute top-1.5 right-1.5 p-1 rounded-full ${
                              comparedLands.find(l => l._id === land._id)
                                ? 'bg-green-600 text-white'
                                : 'bg-white text-green-900'
                            }`}
                          >
                            📊
                          </button>
                        </div>

                        <div className={`p-3 ${filters.viewMode === 'list' ? 'flex-1' : ''}`}>
                          <h3 className="text-sm font-medium text-green-900 truncate">{land.title}</h3>
                          <p className="text-xs text-gray-600 line-clamp-2">{land.description}</p>
                          <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-600">
                            <span className="truncate">📍 {land.location}</span>
                            <span className="truncate">🌾 {land.size}</span>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-sm font-medium text-yellow-600 truncate">
                              {land.leaseRate === 0 ? `Sharing: ${land.sharingPercentage}%` : `$${land.leaseRate}/mo`}
                            </span>
                            <button
                              onClick={() => setSelectedLand(land)}
                              className="bg-green-600 text-white px-3 py-1 rounded-md text-xs"
                            >
                              View
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Comparison Modal */}
      <AnimatePresence>
        {showComparison && comparedLands.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowComparison(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-green-200 flex justify-between items-center">
                <h2 className="text-lg font-medium text-green-900">Compare Lands</h2>
                <button onClick={() => setShowComparison(false)} className="text-green-900 hover:text-green-700">✕</button>
              </div>
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {comparedLands.map(land => (
                  <div key={land._id} className="border border-green-200 rounded-lg overflow-hidden">
                    <Image src={land.image || placeholderImage} alt={land.title} className="w-full h-24 object-cover" width={400} height={300} />
                    <div className="p-3 text-sm">
                      <h3 className="font-medium text-green-900 truncate">{land.title}</h3>
                      <div className="mt-2 space-y-1 text-xs text-gray-600">
                        <p className="truncate">Location: {land.location}</p>
                        <p className="truncate">Size: {land.size}</p>
                        <p className="truncate">Soil: {land.soilType}</p>
                        <p>Rating: ⭐ {land.rating}</p>
                        <p>Price: <span className="text-yellow-600">{land.leaseRate === 0 ? `Sharing: ${land.sharingPercentage}%` : `$${land.leaseRate}/mo`}</span></p>
                      </div>
                      <button
                        onClick={() => toggleCompare(land)}
                        className="w-full mt-2 bg-red-600 text-white py-1 rounded-md text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Land Detail Modal */}
      <AnimatePresence>
        {selectedLand && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setSelectedLand(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-48">
                <img
                  src={selectedLand.image || placeholderImage}
                  alt={selectedLand.title}
                  className="w-full h-full object-cover rounded-t-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/50 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <h2 className="text-lg font-medium text-white truncate">{selectedLand.title}</h2>
                  <div className="flex gap-2 text-xs text-white">
                    <span>⭐ {selectedLand.rating} ({selectedLand.totalReviews})</span>
                    <span>👤 {selectedLand.owner?.name || selectedLand.owner}</span>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleCompare(selectedLand); }}
                  className={`absolute top-3 right-3 p-1 rounded-full ${
                    comparedLands.find(l => l._id === selectedLand._id) ? 'bg-green-600 text-white' : 'bg-white text-green-900'
                  }`}
                >
                  📊
                </button>
              </div>

              <div className="p-4">
                <div className="grid lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-2">
                    <h3 className="text-sm font-medium text-green-900 mb-2">Description</h3>
                    <p className="text-sm text-gray-600">{selectedLand.description}</p>

                    <div className="mt-4 grid sm:grid-cols-2 gap-3">
                      {[
                        { label: "Location", value: selectedLand.location },
                        { label: "Size", value: selectedLand.size },
                        { label: "Soil Type", value: selectedLand.soilType },
                        { label: "Facilities", value: Array.isArray(selectedLand.facilities) ? selectedLand.facilities.join(', ') : selectedLand.facilities },
                        { label: "Water Source", value: selectedLand.waterSource },
                        { label: "Electricity", value: selectedLand.electricityAvailable ? "Available" : "Not Available" },
                        { label: "Soil pH", value: selectedLand.soilPH },
                        { label: "Available From", value: selectedLand.availableFrom },
                      ].map((detail, i) => (
                        detail.value && (
                          <div key={i} className="text-sm">
                            <p className="text-gray-600 text-xs">{detail.label}</p>
                            <p className="font-medium truncate">{detail.value}</p>
                          </div>
                        )
                      ))}
                    </div>

                    {selectedLand.badges?.length > 0 && (
                      <div className="mt-4">
                        <h3 className="text-sm font-medium text-green-900 mb-2">Features</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedLand.badges.map((badge, i) => (
                            <span key={i} className="bg-yellow-300 text-green-900 px-2 py-1 rounded-full text-xs">
                              {badge.length > 10 ? `${badge.slice(0, 10)}...` : badge}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedLand.nearbyMarkets && (
                      <div className="mt-4">
                        <h3 className="text-sm font-medium text-green-900 mb-2">Nearby Markets</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedLand.nearbyMarkets.map((market, i) => (
                            <span key={i} className="bg-green-100 text-green-900 px-2 py-1 rounded-full text-xs">
                              {market.length > 10 ? `${market.slice(0, 10)}...` : market}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="text-center mb-3">
                        <span className="text-lg font-medium text-yellow-600">
                          {selectedLand.leaseRate === 0 ? `Sharing: ${selectedLand.sharingPercentage}%` : `$${selectedLand.leaseRate}/mo`}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <button
                          onClick={() => setShowLeaseModal(true)}
                          className="w-full bg-green-700 text-white py-2 rounded-md text-sm"
                        >
                          {selectedLand.leaseRate === 0 ? 'Share Now' : 'Lease Now'}
                        </button>
                        <button
                          onClick={() => setShowContactModal(true)}
                          className="w-full border border-green-700 text-green-700 py-2 rounded-md text-sm"
                        >
                          Contact Owner
                        </button>
                        <button
                          onClick={() => setShowScheduleModal(true)}
                          className="w-full border border-yellow-400 text-yellow-600 py-2 rounded-md text-sm"
                        >
                          Schedule Visit
                        </button>
                      </div>
                    </div>

                    {selectedLand.weatherData && (
                      <div className="mt-4 bg-green-50 p-3 rounded-lg">
                        <h3 className="text-sm font-medium text-green-900 mb-2">Weather</h3>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Temperature: {selectedLand.weatherData.temp}°C</p>
                          <p>Humidity: {selectedLand.weatherData.humidity}%</p>
                          <p>Rainfall: {selectedLand.weatherData.rainfall}</p>
                        </div>
                      </div>
                    )}

                    {selectedLand.certifications?.length > 0 && (
                      <div className="mt-4 bg-green-50 p-3 rounded-lg">
                        <h3 className="text-sm font-medium text-green-900 mb-2">Certifications</h3>
                        <div className="space-y-1">
                          {selectedLand.certifications.map((cert, i) => (
                            <p key={i} className="text-sm text-gray-600 truncate">{cert}</p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <button
                    onClick={() => setSelectedLand(null)}
                    className="bg-green-900 text-white px-4 py-2 rounded-md text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lease Modal */}
      <AnimatePresence>
        {showLeaseModal && selectedLand && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowLeaseModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-lg max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-green-200 flex justify-between items-center">
                <h2 className="text-lg font-medium text-green-900">
                  {selectedLand.leaseRate === 0 ? 'Confirm Sharing' : 'Confirm Lease'}
                </h2>
                <button onClick={() => setShowLeaseModal(false)} className="text-green-900 hover:text-green-700">✕</button>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-4">
                  {selectedLand.leaseRate === 0 ? (
                    <>Confirm sharing <strong>{selectedLand.title}</strong> with {selectedLand.sharingPercentage}% profit sharing.</>
                  ) : (
                    <>Confirm leasing <strong>{selectedLand.title}</strong> for <strong>${selectedLand.leaseRate}/month</strong>.</>
                  )}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={selectedLand.leaseRate === 0 ? handleLeaseProcess : handlePayment}
                    className="flex-1 bg-green-700 text-white py-2 rounded-md text-sm"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setShowLeaseModal(false)}
                    className="flex-1 border border-green-200 text-green-900 py-2 rounded-md text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Modal */}
      <AnimatePresence>
        {showContactModal && selectedLand && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowContactModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-lg max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-green-200 flex justify-between items-center">
                <h2 className="text-lg font-medium text-green-900">Contact Owner</h2>
                <button onClick={() => setShowContactModal(false)} className="text-green-900 hover:text-green-700">✕</button>
              </div>
              <div className="p-4">
                <div className="flex gap-2 mb-3">
                  {[
                    { id: 'message', label: 'Message' },
                    { id: 'email', label: 'Email' },
                    { id: 'phone', label: 'Phone' },
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setContactMethod(method.id)}
                      className={`flex-1 py-2 rounded-md text-sm ${
                        contactMethod === method.id ? 'bg-green-700 text-white' : 'bg-green-100 text-green-900'
                      }`}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>

                {contactMethod === 'message' && (
                  <textarea
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Your message..."
                    rows={3}
                    className="w-full p-2 border border-green-200 rounded-lg focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 resize-none text-sm"
                  />
                )}

                {contactMethod === 'email' && (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={emailData.subject}
                      onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                      placeholder="Subject"
                      className="w-full p-2 border border-green-200 rounded-lg focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-sm"
                    />
                    <textarea
                      value={emailData.message}
                      onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
                      placeholder="Your email message..."
                      rows={3}
                      className="w-full p-2 border border-green-200 rounded-lg focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 resize-none text-sm"
                    />
                  </div>
                )}

                {contactMethod === 'phone' && (
                  <div className="text-center py-3">
                    <p className="text-sm text-gray-600 mb-2">Owner's phone number:</p>
                    <p className="text-sm font-medium text-yellow-600">{ownerPhone || 'Not available'}</p>
                    {ownerPhone && (
                      <a href={`tel:${ownerPhone}`} className="mt-2 inline-block bg-green-700 text-white px-4 py-2 rounded-md text-sm">
                        Call Now
                      </a>
                    )}
                  </div>
                )}

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={handleContact}
                    className="flex-1 bg-green-700 text-white py-2 rounded-md text-sm"
                  >
                    {contactMethod === 'message' ? 'Send Message' : contactMethod === 'email' ? 'Send Email' : 'Close'}
                  </button>
                  <button
                    onClick={() => setShowContactModal(false)}
                    className="flex-1 border border-green-200 text-green-900 py-2 rounded-md text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Schedule Modal */}
      <AnimatePresence>
        {showScheduleModal && selectedLand && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowScheduleModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-lg max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-green-200 flex justify-between items-center">
                <h2 className="text-lg font-medium text-green-900">Schedule Visit</h2>
                <button onClick={() => setShowScheduleModal(false)} className="text-green-900 hover:text-green-700">✕</button>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  <input
                    type="date"
                    value={scheduleData.date}
                    onChange={(e) => setScheduleData({ ...scheduleData, date: e.target.value })}
                    className="w-full p-2 border border-green-200 rounded-lg focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-sm"
                  />
                  <input
                    type="time"
                    value={scheduleData.time}
                    onChange={(e) => setScheduleData({ ...scheduleData, time: e.target.value })}
                    className="w-full p-2 border border-green-200 rounded-lg focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-sm"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={scheduleData.phone}
                    onChange={(e) => setScheduleData({ ...scheduleData, phone: e.target.value })}
                    className="w-full p-2 border border-green-200 rounded-lg focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-sm"
                  />
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={handleScheduleVisit}
                    className="flex-1 bg-green-700 text-white py-2 rounded-md text-sm"
                  >
                    Schedule
                  </button>
                  <button
                    onClick={() => setShowScheduleModal(false)}
                    className="flex-1 border border-green-200 text-green-900 py-2 rounded-md text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
