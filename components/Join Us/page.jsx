'use client';
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function JoinUs() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-20 text-center">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">
        Want to be part of our journey?
      </h3>
      <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
        Join <span className="font-semibold text-green-700">Agriguard</span> and contribute to
        building a sustainable future with technology-driven agriculture.
      </p>

      {/* Join Us Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-6 py-3 bg-green-600 text-white font-medium rounded-full shadow-md hover:bg-green-700 transition"
      >
        Join Us
      </button>

      {/* Features */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
    
      </div>

      {/* Modal Form */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white w-full max-w-lg rounded-2xl shadow-lg p-8 relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              >
                ✖
              </button>

              <h4 className="text-xl font-bold text-green-700 mb-6">Apply Now</h4>
              <form className="space-y-5">
                <div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
                <div>
                  <select
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  >
                    <option>Choose Role</option>
                    <option>Developer</option>
                    <option>Designer</option>
                    <option>Data Analyst</option>
                    <option>Researcher</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <textarea
                    placeholder="Why do you want to join?"
                    rows="4"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition"
                >
                  Submit Application
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
