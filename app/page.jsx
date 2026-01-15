
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import TeamPage from '@/components/Team/page.jsx';
import Services from './Services1/page.jsx';
import OnlineFarming from './Online-Farming/page.jsx';
import MarketPlace from './Marketplace/page.jsx';
export default function HomePage() {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const slides = [
    {
      title: "Harvest More with AgriGuard",
      subtitle: "Smart farming solutions for sustainable agriculture",
      image:"/Home.png",
      cta: "Shop Now",
      ctaLink: "/Marketplace"
    },
    {
      title: "Expert Services for Your Farm",
      subtitle: "Professional agricultural consulting and support",
      image:"/carsoul4.jpeg",
      cta: "Book Service",
      ctaLink: "/Services1"
    },
    {
      title: "Connect with the Marketplace",
      subtitle: "Buy and sell agricultural products easily",
      image:"/carsoul1.png",
      cta: "Explore Marketplace",
      ctaLink: "/Marketplace"
    }
  ];

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    setIsDarkMode(savedTheme === "dark");
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);
  const categories = [
    { name: "Seeds", href: "/Marketplace?category=seeds", icon: "🌱" },
    { name: "Fertilizers", href: "/Marketplace?category=fertilizers", icon: "🧪" },
    { name: "Tools", href: "/Marketplace?category=tools", icon: "🔧" },
    { name: "Pesticides", href: "/Marketplace?category=pesticides", icon: "🌿" },
    { name: "Irrigation", href: "/Marketplace?category=irrigation", icon: "💧" },
    { name: "Services", href: "/Services1", icon: "🛠️" }
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''} bg-gradient-to-br from-green-200 via-green-100 to-yellow-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700`}>
      {/* Add custom styles for hero animations */}
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      {/* Hero Carousel */}
      <section className="relative py-0 overflow-hidden">
        <div className="relative">
          {slides.map((slide, index) => (
            <motion.div
              key={index}
              className={`relative ${index === currentSlide ? 'block' : 'hidden'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: index === currentSlide ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <motion.h1
                  className="text-4xl md:text-6xl font-bold mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  {slide.title}
                </motion.h1>
                <motion.p
                  className="text-xl mb-6 max-w-2xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  {slide.subtitle}
                </motion.p>
                <Link
                  href={slide.ctaLink}
                  className="inline-block bg-gradient-to-r from-green-600 to-yellow-500 text-white px-8 py-3 rounded-full font-semibold hover:from-green-700 hover:to-yellow-600 transition-all duration-300"
                >
                  {slide.cta}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
        {/* Carousel Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full"
        >
          ‹
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full"
        >
          ›
        </button>
        {/* Dots */}
        <div className="carousel-dots absolute bottom-4 left-1/2 transform -translate-x-1/2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
            />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-gradient-to-r from-green-600 via-green-500 to-yellow-300 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-green-900 dark:text-green-300 mb-6">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="group flex flex-col items-center p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300"
              >
                <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">{category.icon}</span>
                <span className="text-sm font-medium text-center text-green-800 dark:text-green-200">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}

      {/* Why Choose AgriGuard Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-green-600 via-green-500 to-yellow-400 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-4xl font-bold text-center text-green-900 dark:text-green-300 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Why Choose AgriGuard?
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              className="text-center p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-800 bg-gradient-to-br from-green-100 to-yellow-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="w-16 h-16 bg-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-green-900 dark:text-green-300 mb-2">Smart Farming</h3>
              <p className="text-green-800 dark:text-green-400">Leverage cutting-edge technology for efficient and sustainable agriculture.</p>
            </motion.div>
            <motion.div
              className="text-center p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-800 bg-gradient-to-br from-green-100 to-yellow-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-green-900 dark:text-green-300 mb-2">Marketplace</h3>
              <p className="text-green-800 dark:text-green-400">Connect with buyers and sellers in our comprehensive agricultural marketplace.</p>
            </motion.div>
            <motion.div
              className="text-center p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-800 bg-gradient-to-br from-green-100 to-yellow-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="w-16 h-16 bg-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-green-900 dark:text-green-300 mb-2">Expert Services</h3>
              <p className="text-green-800 dark:text-green-400">Access professional agricultural consulting and support services.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <Services />

      {/* Online Farming Preview */}
      <OnlineFarming />

      {/* Marketplace Preview */}
      <MarketPlace />

      {/* Team Section */}
      <TeamPage />

      {/* Footer */}
      <footer className="bg-green-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">AgriGuard</h3>
            <p className="text-green-200 mb-4">Revolutionizing agriculture with smart solutions.</p>
            <div className="flex gap-4">
              <a href="#" className="text-green-300 hover:text-white">Facebook</a>
              <a href="#" className="text-green-300 hover:text-white">Twitter</a>
              <a href="#" className="text-green-300 hover:text-white">Instagram</a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-green-200">
              <li><Link href="/About" className="hover:text-white">About Us</Link></li>
              <li><Link href="/Services1" className="hover:text-white">Services</Link></li>
              <li><Link href="/Marketplace" className="hover:text-white">Marketplace</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-green-200">
              <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
              <li><Link href="/returns" className="hover:text-white">Returns</Link></li>
              <li><Link href="/shipping" className="hover:text-white">Shipping Info</Link></li>
              <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Stay Updated</h4>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 rounded-l-lg text-green-900 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button className="px-4 py-2 bg-yellow-500 text-green-900 rounded-r-lg font-medium hover:bg-yellow-600">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-green-800 mt-8 pt-8 text-center text-green-200">
          <p>&copy; 2025 AgriGuard. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
