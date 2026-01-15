'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 via-green-100 to-yellow-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-green-900 dark:text-green-300 mb-4">
            Shipping Information
          </h1>
          <p className="text-xl text-green-800 dark:text-green-400 max-w-3xl mx-auto">
            Learn about our shipping options, delivery times, and costs.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center"
          >
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-green-900 dark:text-green-300 mb-2">Standard Shipping</h3>
            <p className="text-green-800 dark:text-green-400 mb-4">5-7 business days</p>
            <p className="text-2xl font-bold text-green-600">₹99</p>
            <p className="text-sm text-green-600">Free on orders over ₹500</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center"
          >
            <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-green-900 dark:text-green-300 mb-2">Express Shipping</h3>
            <p className="text-green-800 dark:text-green-400 mb-4">2-3 business days</p>
            <p className="text-2xl font-bold text-green-600">₹199</p>
            <p className="text-sm text-green-600">Free on orders over ₹1000</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center"
          >
            <div className="w-16 h-16 bg-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-green-900 dark:text-green-300 mb-2">Premium Shipping</h3>
            <p className="text-green-800 dark:text-green-400 mb-4">Next business day</p>
            <p className="text-2xl font-bold text-green-600">₹299</p>
            <p className="text-sm text-green-600">Free on orders over ₹2000</p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold text-green-900 dark:text-green-300 mb-6">Shipping Zones</h2>
            <div className="space-y-4 text-green-800 dark:text-green-400">
              <div className="flex justify-between items-center border-b border-green-200 dark:border-green-700 pb-2">
                <span>Local Delivery (Same City)</span>
                <span className="font-semibold">₹50</span>
              </div>
              <div className="flex justify-between items-center border-b border-green-200 dark:border-green-700 pb-2">
                <span>Within State</span>
                <span className="font-semibold">₹99</span>
              </div>
              <div className="flex justify-between items-center border-b border-green-200 dark:border-green-700 pb-2">
                <span>Inter-State</span>
                <span className="font-semibold">₹149</span>
              </div>
              <div className="flex justify-between items-center">
                <span>North East / Remote Areas</span>
                <span className="font-semibold">₹199</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold text-green-900 dark:text-green-300 mb-6">Important Information</h2>
            <ul className="space-y-3 text-green-800 dark:text-green-400">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                Orders are processed within 1-2 business days
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                Tracking information is sent via email and SMS
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                Delivery attempts are made during business hours
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                Signature may be required for high-value orders
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                International shipping available on request
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-green-900 dark:text-green-300 mb-8">Track Your Order</h2>
          <p className="text-green-800 dark:text-green-400 mb-8 max-w-2xl mx-auto">
            Enter your order number to track your shipment in real-time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="text"
              placeholder="Enter order number"
              className="flex-1 px-4 py-3 rounded-l-lg border-2 border-green-300 focus:border-green-500 focus:outline-none text-green-900 dark:text-green-300 bg-white dark:bg-gray-800"
            />
            <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-yellow-500 text-white rounded-r-lg font-semibold hover:from-green-700 hover:to-yellow-600 transition-all duration-300">
              Track
            </button>
          </div>
          <p className="text-sm text-green-600 mt-4">
            Need help? <Link href="/contact" className="underline hover:text-green-700">Contact us</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
