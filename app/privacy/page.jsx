'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-xl text-green-800 dark:text-green-400 max-w-3xl mx-auto">
            Your privacy is important to us. Learn how we collect, use, and protect your personal information.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8"
        >
          <div className="prose prose-lg max-w-none text-green-800 dark:text-green-400">
            <h2 className="text-2xl font-bold text-green-900 dark:text-green-300 mb-4">1. Information We Collect</h2>
            <p className="mb-4">
              We collect information you provide directly to us, such as when you create an account, make a purchase,
              book a service, or contact us for support. This may include your name, email address, phone number,
              billing and shipping addresses, and payment information.
            </p>

            <h2 className="text-2xl font-bold text-green-900 dark:text-green-300 mb-4">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>To process and fulfill your orders and service bookings</li>
              <li>To communicate with you about your account and purchases</li>
              <li>To provide customer support and respond to your inquiries</li>
              <li>To send you marketing communications (with your consent)</li>
              <li>To improve our services and develop new features</li>
              <li>To comply with legal obligations</li>
            </ul>

            <h2 className="text-2xl font-bold text-green-900 dark:text-green-300 mb-4">3. Information Sharing</h2>
            <p className="mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your
              consent, except as described in this policy. We may share your information with:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Service providers who assist us in operating our platform</li>
              <li>Payment processors for transaction processing</li>
              <li>Shipping partners for order delivery</li>
              <li>Legal authorities when required by law</li>
            </ul>

            <h2 className="text-2xl font-bold text-green-900 dark:text-green-300 mb-4">4. Data Security</h2>
            <p className="mb-4">
              We implement appropriate technical and organizational measures to protect your personal information
              against unauthorized access, alteration, disclosure, or destruction. This includes encryption of
              sensitive data and regular security audits.
            </p>

            <h2 className="text-2xl font-bold text-green-900 dark:text-green-300 mb-4">5. Cookies and Tracking</h2>
            <p className="mb-4">
              We use cookies and similar technologies to enhance your browsing experience, analyze site traffic,
              and personalize content. You can control cookie settings through your browser preferences.
            </p>

            <h2 className="text-2xl font-bold text-green-900 dark:text-green-300 mb-4">6. Your Rights</h2>
            <p className="mb-4">
              You have the right to access, update, or delete your personal information. You may also opt out
              of marketing communications at any time. To exercise these rights, please contact us using the
              information provided below.
            </p>

            <h2 className="text-2xl font-bold text-green-900 dark:text-green-300 mb-4">7. Data Retention</h2>
            <p className="mb-4">
              We retain your personal information for as long as necessary to provide our services and comply
              with legal obligations. Account information is retained while your account is active and for a
              reasonable period thereafter for tax, legal, and regulatory purposes.
            </p>

            <h2 className="text-2xl font-bold text-green-900 dark:text-green-300 mb-4">8. International Transfers</h2>
            <p className="mb-4">
              Your information may be transferred to and processed in countries other than your own. We ensure
              that such transfers comply with applicable data protection laws.
            </p>

            <h2 className="text-2xl font-bold text-green-900 dark:text-green-300 mb-4">9. Children's Privacy</h2>
            <p className="mb-4">
              Our services are not intended for children under 13. We do not knowingly collect personal information
              from children under 13. If we become aware of such collection, we will delete the information promptly.
            </p>

            <h2 className="text-2xl font-bold text-green-900 dark:text-green-300 mb-4">10. Changes to This Policy</h2>
            <p className="mb-4">
              We may update this privacy policy from time to time. We will notify you of any material changes
              by posting the new policy on this page and updating the "Last Updated" date.
            </p>

            <h2 className="text-2xl font-bold text-green-900 dark:text-green-300 mb-4">11. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this privacy policy or our data practices, please contact us at:
            </p>
            <div className="bg-green-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="font-semibold">Email: agriguard.services@gmail.com</p>
              <p className="font-semibold">Phone: +91-7388711487</p>
              <p className="font-semibold">Address: Gorakhpur ,CL-1,Sector-7 ,Uttar Pradesh,India</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <p className="text-sm text-green-600 dark:text-green-400">
            Last Updated: January 2025
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-block bg-gradient-to-r from-green-600 to-yellow-500 text-white px-8 py-3 rounded-full font-semibold hover:from-green-700 hover:to-yellow-600 transition-all duration-300"
            >
              Contact Us
            </Link>
            <Link
              href="/help"
              className="inline-block bg-white dark:bg-gray-800 text-green-900 dark:text-green-300 px-8 py-3 rounded-full font-semibold border-2 border-green-600 hover:bg-green-50 dark:hover:bg-gray-700 transition-all duration-300"
            >
              Help Center
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
