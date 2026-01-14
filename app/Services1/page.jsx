"use client";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Droplets, FlaskConical, ShieldCheck, Tractor, UserCheck, Wheat, Sprout, Microscope, Shield, CheckCircle2, Printer, Share2, Search, Heart } from "lucide-react";
import { QRCodeCanvas as QRCode } from "qrcode.react";

function InputField({ name, type, placeholder, value, onChange }) {
  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required
      className="w-full border border-green-300 rounded-xl p-3 bg-white text-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
    />
  );
}

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ serviceId: "", name: "", email: "", phone: "", date: "", time: "" });
  const [openBooking, setOpenBooking] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bookedDetails, setBookedDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCrop, setSelectedCrop] = useState("All");
  const servicesPerPage = 6;

  useEffect(() => {
    fetch("/api/services2")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setServices(data);
        else setServices([]);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading services:", err);
        setServices([]);
        setLoading(false);
      });

    const savedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(savedFavorites);
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const icons = {
    "droplets": <Droplets className="w-12 h-12 text-green-600" />,
    "flask-conical": <FlaskConical className="w-12 h-12 text-brown-600" />,
    "shield-check": <ShieldCheck className="w-12 h-12 text-green-600" />,
    "tractor": <Tractor className="w-12 h-12 text-yellow-600" />,
    "user-check": <UserCheck className="w-12 h-12 text-teal-600" />,
    "wheat": <Wheat className="w-12 h-12 text-yellow-600" />,
    "sprout": <Sprout className="w-12 h-12 text-green-600" />,
    "microscope": <Microscope className="w-12 h-12 text-brown-600" />,
    "shield": <Shield className="w-12 h-12 text-green-600" />,
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const generateBookingId = () => {
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `AGR-${new Date().toISOString().slice(0,10).replace(/-/g,"")}-${random}`;
  };

  const handleBookNow = (serviceId) => {
    setForm({ ...form, serviceId });
    setOpenBooking(true);
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) { alert("Please enter a valid email."); return false; }
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(form.phone)) { alert("Please enter a valid 10-digit phone."); return false; }
    return true;
  };

  const handleBooking = async e => {
    e.preventDefault();
    if (!validateForm()) return;

    const service = services.find(s => s._id === form.serviceId);
    if (!service) return alert("Select a service");

    const bookingId = generateBookingId();

    const res = await fetch("/api/Bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, serviceName: service.name, bookingId })
    });
    const data = await res.json();

    if (!data.error) {
      const bookedData = {
        bookingId,
        serviceName: service.name,
        date: form.date,
        time: form.time,
        name: form.name,
        email: form.email,
        phone: form.phone,
        price: service.price
      };
      setBookedDetails(bookedData);
      setSuccess(true);
      setOpenBooking(false);
      setForm({ serviceId: "", name: "", email: "", phone: "", date: "", time: "" });

      await fetch("/api/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookedData)
      });
    } else alert(data.error);
  };

  const handlePrint = () => window.print();
  const handleShare = () => {
    if (navigator.share && bookedDetails) {
      navigator.share({
        title: "Booking Confirmation",
        text: `Booking confirmed for ${bookedDetails.serviceName} on ${bookedDetails.date} at ${bookedDetails.time}\nBooking ID: ${bookedDetails.bookingId}`,
      }).catch(() => {});
    } else {
      alert("Sharing not supported.");
    }
  };

  const toggleFavorite = (serviceId) => {
    setFavorites(prev => prev.includes(serviceId) ? prev.filter(id => id !== serviceId) : [...prev, serviceId]);
  };

  const cropCategories = ["All", "Wheat", "Rice", "Corn", "General"];

  const filteredServices = useMemo(() => {
    return services.filter(service =>
      (selectedCrop === "All" || service.cropCategory === selectedCrop) &&
      (service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       service.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [services, searchTerm, selectedCrop]);

  const paginatedServices = useMemo(() => {
    const startIndex = (currentPage - 1) * servicesPerPage;
    return filteredServices.slice(startIndex, startIndex + servicesPerPage);
  }, [filteredServices, currentPage]);

  const totalPages = Math.ceil(filteredServices.length / servicesPerPage);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-green-100">
      <p className="text-center text-lg font-semibold animate-pulse text-green-800">Loading services...</p>
    </div>
  );

  return (
    <div className="p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-extrabold text-center text-green-800 mb-12">🌾 Farm Services</h1>

        {/* Search and filter */}
        <div className="mb-8 flex gap-4 flex-wrap items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600" />
            <input
              type="text"
              placeholder="Search farm services..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-green-300 bg-white text-green-800 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <select
            value={selectedCrop}
            onChange={e => setSelectedCrop(e.target.value)}
            className="w-[200px] px-4 py-2 rounded-xl border border-green-300 bg-white text-green-800 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {cropCategories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button onClick={() => { setSearchTerm(""); setSelectedCrop("All"); }} className="bg-green-200 text-green-800 px-4 py-2 rounded-xl">Clear</button>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {paginatedServices.map((s, i) => (
            <motion.div key={s._id} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i*0.1, type:"spring", stiffness:100 }} whileHover={{ scale:1.05 }}>
              <div className="bg-white rounded-3xl shadow-xl p-6 text-center border border-green-200 hover:shadow-2xl transition duration-300 relative">
                <button onClick={() => toggleFavorite(s._id)} className="absolute top-4 right-4 text-green-400 hover:text-red-500">
                  <Heart className={`w-6 h-6 ${favorites.includes(s._id) ? "fill-red-500 text-red-500" : ""}`} />
                </button>
                {icons[s.icon] || <Sprout className="w-12 h-12 text-green-600" />}
                <h2 className="text-2xl font-bold text-green-800 mt-4">{s.name}</h2>
                <p className="text-gray-600 mt-2">{s.description}</p>
                <p className="text-sm text-green-600 mt-1">Crop: {s.cropCategory || "General"}</p>
                <p className="text-sm text-green-600 mt-1">Category: {s.category || "Other"}</p>
                <p className="mt-2 font-semibold text-green-600 text-lg">₹{s.price}</p>
                {s.duration && <p className="text-sm text-gray-500 mt-1">⏱ {s.duration}</p>}
                <button onClick={() => handleBookNow(s._id)} className="mt-4 bg-gradient-to-r from-green-600 to-yellow-600 text-white px-6 py-2 rounded-xl hover:scale-105 transition">Book Now</button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-4 mb-12">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i+1)}
                className={`px-4 py-2 rounded-xl ${currentPage === i+1 ? "bg-green-600 text-white" : "bg-green-100 text-green-800"}`}
              >{i+1}</button>
            ))}
          </div>
        )}

        {/* Booking Modal */}
        {openBooking && (
          <motion.div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.div className="bg-white rounded-3xl p-6 w-full max-w-md relative shadow-2xl" initial={{ y: -100, opacity: 0 }} animate={{ y:0, opacity:1 }} transition={{ type:"spring", stiffness:120 }}>
              <h2 className="text-2xl font-bold text-green-800 mb-4 text-center">🌱 Book Your Farm Service</h2>
              <form onSubmit={handleBooking} className="space-y-4">
                <InputField name="name" type="text" placeholder="Your Name" value={form.name} onChange={handleChange} />
                <InputField name="email" type="email" placeholder="Your Email" value={form.email} onChange={handleChange} />
                <InputField name="phone" type="tel" placeholder="Your Phone" value={form.phone} onChange={handleChange} />
                <InputField name="date" type="date" value={form.date} onChange={handleChange} />
                <InputField name="time" type="time" value={form.time} onChange={handleChange} />
                <button type="submit" className="w-full bg-gradient-to-r from-green-600 to-yellow-600 text-white font-semibold rounded-2xl py-2 shadow-lg transition-all duration-300">
                  Confirm Booking
                </button>
              </form>
              <button onClick={() => setOpenBooking(false)} className="absolute top-3 right-3 text-gray-500 font-bold text-xl">✕</button>
            </motion.div>
          </motion.div>
        )}

        {/* Success Modal */}
        {success && bookedDetails && (
          <motion.div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" initial={{ opacity:0 }} animate={{ opacity:1 }}>
            <motion.div className="bg-white rounded-3xl p-6 w-full max-w-md relative shadow-2xl" initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:"spring", stiffness:120 }}>
              <div className="flex flex-col items-center">
                <CheckCircle2 className="w-16 h-16 text-green-600 animate-bounce" />
                <h3 className="text-xl font-bold text-green-800 my-4 text-center">🌾 Booking Confirmed</h3>
                <div className="w-full rounded-xl border border-dashed border-green-400 p-4 shadow-inner text-green-800">
                  <p><span className="font-semibold">Booking ID:</span> {bookedDetails.bookingId}</p>
                  <p><span className="font-semibold">Service:</span> {bookedDetails.serviceName}</p>
                  <p><span className="font-semibold">Price:</span> ₹{bookedDetails.price}</p>
                  <p><span className="font-semibold">Date:</span> {bookedDetails.date}</p>
                  <p><span className="font-semibold">Time:</span> {bookedDetails.time}</p>
                  <p><span className="font-semibold">Name:</span> {bookedDetails.name}</p>
                  <p><span className="font-semibold">Email:</span> {bookedDetails.email}</p>
                  <p><span className="font-semibold">Phone:</span> {bookedDetails.phone}</p>
                  <div className="flex justify-center mt-4">
                    <QRCode value={JSON.stringify(bookedDetails)} size={128} />
                  </div>
                </div>
                <div className="flex gap-4 mt-4">
                  <button onClick={handlePrint} className="flex items-center gap-2 bg-green-600 text-white rounded-2xl px-4 py-2 shadow-lg"> <Printer className="w-4 h-4" /> Print </button>
                  <button onClick={handleShare} className="flex items-center gap-2 bg-yellow-600 text-white rounded-2xl px-4 py-2 shadow-lg"> <Share2 className="w-4 h-4" /> Share </button>
                  <button onClick={() => setSuccess(false)} className="bg-green-600 text-white rounded-2xl px-4 py-2 shadow-lg">Close</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
