'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AboutPage() {
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
            About AgriGuard
          </h1>
          <p className="text-xl text-green-800 dark:text-green-400 max-w-3xl mx-auto">
            Revolutionizing agriculture with smart solutions for sustainable farming and better livelihoods.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-green-900 dark:text-green-300 mb-6">Our Mission</h2>
            <p className="text-green-800 dark:text-green-400 mb-6">
              At AgriGuard, we are committed to empowering farmers and agricultural communities with cutting-edge technology,
              expert services, and a comprehensive marketplace. Our goal is to make agriculture more efficient, sustainable,
              and profitable for everyone involved.
            </p>
            <p className="text-green-800 dark:text-green-400">
              We believe in the power of innovation to transform traditional farming practices, ensuring food security
              and environmental sustainability for future generations.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8"
          >
            <h3 className="text-2xl font-bold text-green-900 dark:text-green-300 mb-4">Key Features</h3>
            <ul className="space-y-3 text-green-800 dark:text-green-400">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                Smart farming solutions
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                Expert agricultural consulting
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                Comprehensive marketplace
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                Online farming communities
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-green-900 dark:text-green-300 mb-8">Get Started Today</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/Services1"
              className="inline-block bg-gradient-to-r from-green-600 to-yellow-500 text-white px-8 py-3 rounded-full font-semibold hover:from-green-700 hover:to-yellow-600 transition-all duration-300"
            >
              Explore Services
            </Link>
            <Link
              href="/Marketplace"
              className="inline-block bg-white dark:bg-gray-800 text-green-900 dark:text-green-300 px-8 py-3 rounded-full font-semibold border-2 border-green-600 hover:bg-green-50 dark:hover:bg-gray-700 transition-all duration-300"
            >
              Visit Marketplace
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
