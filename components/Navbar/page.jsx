
"use client";

import { useState, useEffect } from "react";
import { Menu, X, Leaf, ChevronDown, Search, ShoppingCart, Heart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import orderpage from "@/app/orders/page";
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const { data: session } = useSession();
  const router = useRouter();

  // Dark mode persistence
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    setIsDarkMode(savedTheme === "dark");
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  // Close user menu when clicking outside
  const handleClickOutside = () => {
    if (showUserMenu) setShowUserMenu(false);
  };

  const navLinks = [
    { name: "Online Farming", href: "/Online-Farming" },
    { name: "Market Place", href: "/Marketplace" },
    { name: "Services", href: "/Services1" },
  ];

  return (
    <>
      {/* Overlay to close dropdown */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={handleClickOutside}
        ></div>
      )}
      
      <nav className="bg-gradient-to-r from-green-600 via-green-500 to-yellow-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 text-white shadow-2xl sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center gap-2 text-2xl font-bold group transition-all duration-300 hover:scale-105"
            >
              <div className="bg-yellow-400 p-2 rounded-lg shadow-lg group-hover:rotate-12 transition-transform duration-300">
                <Leaf className="w-6 h-6 text-green-800" />
              </div>
              <span className="bg-gradient-to-r from-green-300 to-yellow-400 bg-clip-text text-transparent">
                AgriGuard
              </span>
            </Link>

            {/* Desktop Search Bar */}
            <div className="hidden lg:flex flex-1 max-w-md mx-8 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-800 dark:text-green-200 w-5 h-5" />
              <input
                type="text"
                placeholder="Search farm products, services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-yellow-300 dark:border-gray-600 bg-green-100 dark:bg-gray-700 text-green-900 dark:text-green-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="relative text-white font-medium hover:text-yellow-200 dark:hover:text-yellow-300 transition-colors duration-300 group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-200 dark:bg-yellow-300 group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}

              {session?.user && (
                <Link
                  href="/Dashboard"
                  className="relative text-white font-medium hover:text-yellow-200 dark:hover:text-yellow-300 transition-colors duration-300 group"
                >
                  Dashboard
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-200 dark:bg-yellow-300 group-hover:w-full transition-all duration-300"></span>
                </Link>
              )}

              {/* Wishlist Icon */}
              <Link href="/wishlist" className="relative p-2 text-white hover:text-yellow-200 dark:hover:text-yellow-300">
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart Icon */}
              <Link href="/cart" className="relative p-2 text-white hover:text-yellow-200 dark:hover:text-yellow-300">
                <ShoppingCart className="w-5 h-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Link>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-full bg-green-500 dark:bg-gray-700 text-white dark:text-gray-300 hover:bg-green-600 dark:hover:bg-gray-600 transition-all duration-300"
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>

              {session?.user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-3 bg-green-500 bg-opacity-10 hover:bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full transition-all duration-300 border border-yellow-300 dark:border-gray-600 border-opacity-20 hover:border-opacity-40"
                  >
                    <img
                      src={session.user.image || "/default-avatar.png"}
                      alt="User Avatar"
                      className="w-9 h-9 rounded-full border-2 border-yellow-300 dark:border-gray-600 shadow-lg"
                    />
                    <span className="text-white dark:text-gray-200 font-medium">
                      {session.user.name || session.user.email?.split("@")[0]}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-600 z-50">
                      <div className="bg-gradient-to-r from-green-500 to-yellow-300 px-4 py-3">
                        <p className="text-white dark:text-gray-200 font-semibold">{session.user.name}</p>
                        <p className="text-green-100 dark:text-gray-400 text-sm truncate">{session.user.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        className="block px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-yellow-100 dark:hover:bg-gray-700 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200 font-medium"
                      >
                        Profile
                      </Link>
                      <Link
                        href="/orders"
                        className="block px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-yellow-100 dark:hover:bg-gray-700 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200 font-medium"
                      >orders</Link>
                      <Link
                        href="/wishlist"
                        className="block px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-yellow-100 dark:hover:bg-gray-700 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200 font-medium"
                      >
                        Wishlist
                      </Link>
                      <button
                        onClick={() => {
                          signOut({ callbackUrl: "/" });
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-yellow-100 dark:hover:bg-gray-700 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200 font-medium"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => router.push("/login")}
                    className="bg-gradient-to-r from-green-500 to-yellow-400 hover:from-green-600 hover:to-yellow-500 text-green-900 dark:text-gray-900 px-6 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => router.push("/signup")}
                    className="border-2 border-yellow-300 dark:border-gray-600 hover:bg-yellow-300 dark:hover:bg-gray-600 hover:text-green-900 dark:hover:text-gray-900 text-yellow-200 dark:text-gray-200 px-6 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden bg-green-800 dark:bg-gray-700 bg-opacity-10 hover:bg-opacity-20 p-2 rounded-lg transition-all duration-300"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden bg-gradient-to-b from-green-700 to-yellow-400 dark:from-gray-900 dark:to-gray-800 overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 py-4 space-y-2">
            {/* Mobile Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-800 dark:text-green-200 w-5 h-5" />
              <input
                type="text"
                placeholder="Search farm products, services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-yellow-300 dark:border-gray-600 bg-green-100 dark:bg-gray-700 text-green-900 dark:text-green-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {navLinks.map((link, index) => (
              <Link
                key={link.name}
                href={link.href}
                className="block px-4 py-3 hover:bg-yellow-300 dark:hover:bg-gray-700 hover:text-green-900 dark:hover:text-green-200 rounded-lg transition-all duration-200 hover:translate-x-2"
                onClick={() => setIsOpen(false)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {link.name}
              </Link>
            ))}

            {session?.user && (
              <Link
                href="/Dashboard"
                className="block px-4 py-3 hover:bg-yellow-300 dark:hover:bg-gray-700 hover:text-green-900 dark:hover:text-green-200 rounded-lg transition-all duration-200 hover:translate-x-2"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
            )}

            {/* Mobile Wishlist and Cart */}
            <Link
              href="/wishlist"
              className="block px-4 py-3 hover:bg-yellow-300 dark:hover:bg-gray-700 hover:text-green-900 dark:hover:text-green-200 rounded-lg transition-all duration-200 hover:translate-x-2 flex items-center gap-2"
              onClick={() => setIsOpen(false)}
            >
              <Heart className="w-5 h-5" />
              Wishlist {wishlist.length > 0 && `(${wishlist.length})`}
            </Link>
            <Link
              href="/cart"
              className="block px-4 py-3 hover:bg-yellow-300 dark:hover:bg-gray-700 hover:text-green-900 dark:hover:text-green-200 rounded-lg transition-all duration-200 hover:translate-x-2 flex items-center gap-2"
              onClick={() => setIsOpen(false)}
            >
              <ShoppingCart className="w-5 h-5" />
              Cart {cart.length > 0 && `(${cart.length})`}
            </Link>

            {/* Mobile Dark Mode Toggle */}
            <button
              onClick={() => {
                setIsDarkMode(!isDarkMode);
                setIsOpen(false);
              }}
              className="block w-full text-left px-4 py-3 hover:bg-yellow-300 dark:hover:bg-gray-700 hover:text-green-900 dark:hover:text-green-200 rounded-lg transition-all duration-200 hover:translate-x-2 flex items-center gap-2"
            >
              {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>

            {session?.user ? (
              <div className="pt-4 border-t border-yellow-300 dark:border-gray-600 border-opacity-20 mt-4">
                <div className="flex items-center gap-3 px-4 py-3 bg-green-800 dark:bg-gray-700 bg-opacity-10 rounded-lg mb-3">
                  <img
                    src={session.user.image || "/default-avatar.png"}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full border-2 border-yellow-300 dark:border-gray-600 shadow-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-yellow-200 dark:text-gray-200 font-semibold truncate">
                      {session.user.name}
                    </p>
                    <p className="text-green-200 dark:text-gray-400 text-sm truncate">
                      {session.user.email}
                    </p>
                  </div>
                </div>
                <Link
                  href="/profile"
                  className="block px-4 py-3 hover:bg-yellow-300 dark:hover:bg-gray-700 hover:text-green-900 dark:hover:text-green-200 rounded-lg transition-all duration-200 hover:translate-x-2"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  href="/orders"
                  className="block px-4 py-3 hover:bg-yellow-300 dark:hover:bg-gray-700 hover:text-green-900 dark:hover:text-green-200 rounded-lg transition-all duration-200 hover:translate-x-2"
                  onClick={() => setIsOpen(false)}
                >
                  Orders
                </Link>
                <Link
                  href="/wishlist"
                  className="block px-4 py-3 hover:bg-yellow-300 dark:hover:bg-gray-700 hover:text-green-900 dark:hover:text-green-200 rounded-lg transition-all duration-200 hover:translate-x-2"
                  onClick={() => setIsOpen(false)}
                >
                  Wishlist
                </Link>
                <button
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
                  onClick={() => {
                    signOut({ callbackUrl: "/" });
                    setIsOpen(false);
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 pt-4 border-t border-yellow-300 dark:border-gray-600 border-opacity-20 mt-4">
                <button
                  onClick={() => {
                    router.push("/login");
                    setIsOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-green-500 to-yellow-400 hover:from-green-600 hover:to-yellow-500 text-green-900 dark:text-gray-900 px-4 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    router.push("/signup");
                    setIsOpen(false);
                  }}
                  className="w-full border-2 border-yellow-300 dark:border-gray-600 hover:bg-yellow-300 dark:hover:bg-gray-600 hover:text-green-900 dark:hover:text-gray-900 text-yellow-200 dark:text-gray-200 px-4 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
