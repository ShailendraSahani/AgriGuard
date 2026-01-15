'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const faqs = [
    {
      question: "How do I create an account?",
      answer: "Click on the 'Sign Up' button in the top right corner and fill in your details. You'll receive a confirmation email to verify your account."
    },
    {
      question: "How do I place an order?",
      answer: "Browse our marketplace, add items to your cart, and proceed to checkout. You'll need to provide shipping information and payment details."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept credit/debit cards, UPI, net banking, and digital wallets through our secure payment gateway."
    },
    {
      question: "How do I book a service?",
      answer: "Go to the Services section, select the service you need, choose a date and time, and complete the booking process."
    },
    {
      question: "Can I cancel or modify my order?",
      answer: "Orders can be cancelled within 24 hours of placement. Contact our support team for modifications or cancellations."
    },
    {
      question: "How do I contact customer support?",
      answer: "You can reach us through the Contact page, email us at support@agriguard.com, or call our helpline."
    }
  ];

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            Help Center
          </h1>
          <p className="text-xl text-green-800 dark:text-green-400 max-w-3xl mx-auto">
            Find answers to common questions and get the support you need.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 rounded-full border-2 border-green-300 focus:border-green-500 focus:outline-none text-green-900 dark:text-green-300 bg-white dark:bg-gray-800 placeholder-green-600 dark:placeholder-green-400"
            />
            <svg className="absolute right-4 top-4 w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-bold text-green-900 dark:text-green-300 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-green-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="font-semibold text-green-900 dark:text-green-300">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 text-green-600 transform transition-transform ${expandedFAQ === index ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedFAQ === index && (
                  <div className="px-6 pb-4 text-green-800 dark:text-green-400">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-green-900 dark:text-green-300 mb-8">Still Need Help?</h2>
          <p className="text-green-800 dark:text-green-400 mb-8 max-w-2xl mx-auto">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-block bg-gradient-to-r from-green-600 to-yellow-500 text-white px-8 py-3 rounded-full font-semibold hover:from-green-700 hover:to-yellow-600 transition-all duration-300"
            >
              Contact Support
            </Link>
            <a
              href="mailto:support@agriguard.com"
              className="inline-block bg-white dark:bg-gray-800 text-green-900 dark:text-green-300 px-8 py-3 rounded-full font-semibold border-2 border-green-600 hover:bg-green-50 dark:hover:bg-gray-700 transition-all duration-300"
            >
              Email Us
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
