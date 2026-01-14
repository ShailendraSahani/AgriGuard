"use client";
import { useState } from "react";

export default function OwnerDashboard({ userId }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    size: "",
    soilType: "",
    facilities: "",
    leaseRate: "",
    agreeTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agreeTerms) return alert("Please agree to terms!");
    try {
      const res = await fetch("/api/lands", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId
        },
        body: JSON.stringify({
          ...formData,
          facilities: formData.facilities.split(",").map(f => f.trim())
        })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Land listed successfully! Generating legal document...");
        // call API to generate owner signed PDF
        await fetch(`/api/lands/${data._id}/owner-sign`, { method: "POST" });
        alert("Owner document signed successfully!");
        setShowForm(false);
      } else alert(data.error);
    } catch (err) {
      console.error(err);
      alert("Error submitting land form!");
    }
  };

  return (
    <div className="p-6">
      <button onClick={() => setShowForm(!showForm)} className="bg-green-600 text-white px-4 py-2 rounded-lg">
        {showForm ? "Close Form" : "List Your Land"}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-4 p-4 border rounded-lg bg-white shadow">
          <input name="title" placeholder="Land Title" onChange={handleChange} className="w-full mb-2 p-2 border rounded"/>
          <textarea name="description" placeholder="Description" onChange={handleChange} className="w-full mb-2 p-2 border rounded"/>
          <input name="location" placeholder="Location" onChange={handleChange} className="w-full mb-2 p-2 border rounded"/>
          <input name="size" placeholder="Size (e.g. 2 acres)" onChange={handleChange} className="w-full mb-2 p-2 border rounded"/>
          <input name="soilType" placeholder="Soil Type" onChange={handleChange} className="w-full mb-2 p-2 border rounded"/>
          <input name="facilities" placeholder="Facilities (comma separated)" onChange={handleChange} className="w-full mb-2 p-2 border rounded"/>
          <input name="leaseRate" placeholder="Lease Rate" type="number" onChange={handleChange} className="w-full mb-2 p-2 border rounded"/>
          
          <div className="mb-2">
            <input type="checkbox" name="agreeTerms" onChange={handleChange} /> I agree to the terms and conditions
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">Submit & Sign</button>
        </form>
      )}
    </div>
  );
}
