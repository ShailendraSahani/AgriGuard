'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ReturnsPage() {
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
            Returns & Refunds
          </h1>
          <p className="text-xl text-green-800 dark:text-green-400 max-w-3xl mx-auto">
            Our hassle-free returns policy ensures your satisfaction with every purchase.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold text-green-900 dark:text-green-300 mb-6">Return Eligibility</h2>
            <ul className="space-y-4 text-green-800 dark:text-green-400">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                Items must be returned within 30 days of delivery
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                Products must be in original condition and packaging
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                All tags, labels, and accessories must be intact
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                Proof of purchase (order number or receipt) required
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                Perishable items (seeds, fertilizers) are not returnable
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold text-green-900 dark:text-green-300 mb-6">Return Process</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mr-4 flex-shrink-0">1</div>
                <div>
                  <h3 className="font-semibold text-green-900 dark:text-green-300 mb-1">Contact Us</h3>
                  <p className="text-green-800 dark:text-green-400 text-sm">Email us at returns@agriguard.com or call our support line</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mr-4 flex-shrink-0">2</div>
                <div>
                  <h3 className="font-semibold text-green-900 dark:text-green-300 mb-1">Package Item</h3>
                  <p className="text-green-800 dark:text-green-400 text-sm">Securely pack the item in its original packaging</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mr-4 flex-shrink-0">3</div>
                <div>
                  <h3 className="font-semibold text-green-900 dark:text-green-300 mb-1">Ship Back</h3>
                  <p className="text-green-800 dark:text-green-400 text-sm">Use the prepaid return label provided or ship to our warehouse</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mr-4 flex-shrink-0">4</div>
                <div>
                  <h3 className="font-semibold text-green-900 dark:text-green-300 mb-1">Refund</h3>
                  <p className="text-green-800 dark:text-green-400 text-sm">Receive your refund within 5-7 business days after inspection</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-16"
        >
          <h2 className="text-2xl font-bold text-green-900 dark:text-green-300 mb-6 text-center">Refund Methods</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="font-semibold text-green-900 dark:text-green-300 mb-2">Original Payment Method</h3>
              <p className="text-green-800 dark:text-green-400 text-sm">Refunds processed to the same card or account used for purchase</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="font-semibold text-green-900 dark:text-green-300 mb-2">Store Credit</h3>
              <p className="text-green-800 dark:text-green-400 text-sm">Option to receive credit for future purchases on our platform</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-green-900 dark:text-green-300 mb-2">Exchange</h3>
              <p className="text-green-800 dark:text-green-400 text-sm">Exchange for a different product or size at no additional cost</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-green-900 dark:text-green-300 mb-8">Need Help with a Return?</h2>
          <p className="text-green-800 dark:text-green-400 mb-8 max-w-2xl mx-auto">
            Our customer service team is here to assist you with any questions about returns or exchanges.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-block bg-gradient-to-r from-green-600 to-yellow-500 text-white px-8 py-3 rounded-full font-semibold hover:from-green-700 hover:to-yellow-600 transition-all duration-300"
            >
              Contact Support
            </Link>
            <a
              href="mailto:returns@agriguard.com"
              className="inline-block bg-white dark:bg-gray-800 text-green-900 dark:text-green-300 px-8 py-3 rounded-full font-semibold border-2 border-green-600 hover:bg-green-50 dark:hover:bg-gray-700 transition-all duration-300"
            >
              Email Returns Team
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
