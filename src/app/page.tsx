'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Heart, ShoppingBag, User, MessageCircle, Sun, Moon } from "lucide-react";
import ChatContainer from './components/ChatContainer';

const products = [
  {
    id: 1,
    name: "Charlotte Tilbury Magic Cream",
    brand: "Charlotte Tilbury",
    price: 100,
    match: 88,
    image: "https://images.unsplash.com/photo-1598452963314-b09f397a5c48?q=80&w=300&h=300&auto=format&fit=crop",
    savings: 75,
    rating: 4.8,
    reviews: 128
  },
  {
    id: 2,
    name: "NARS Radiant Creamy Concealer",
    brand: "NARS",
    price: 32,
    match: 92,
    image: "https://images.unsplash.com/photo-1526758097130-bab247274f58?q=80&w=300&h=300&auto=format&fit=crop",
    savings: 60,
    rating: 4.9,
    reviews: 256
  },
  {
    id: 3,
    name: "MAC Ruby Woo Lipstick",
    brand: "MAC",
    price: 19,
    match: 95,
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=300&h=300&auto=format&fit=crop",
    savings: 80,
    rating: 4.7,
    reviews: 189
  }
];

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Force light mode on initial load
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
    setIsDarkMode(false);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 min-h-screen transition-colors duration-200">
      {/* Navbar */}
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm py-4 px-6 sticky top-0 z-50 transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 dark:from-pink-400 dark:to-purple-400 bg-clip-text text-transparent">
              StealthDupe
            </h1>
            <span className="text-xs bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300 px-2 py-1 rounded-full">Beta</span>
          </div>
          <ul className="flex gap-8 text-sm font-medium text-gray-600 dark:text-gray-300">
            <li className="hover:text-pink-600 dark:hover:text-pink-400 cursor-pointer transition-colors">Home</li>
            <li className="hover:text-pink-600 dark:hover:text-pink-400 cursor-pointer transition-colors">How it works</li>
            <li className="hover:text-pink-600 dark:hover:text-pink-400 cursor-pointer transition-colors">About</li>
            <li className="hover:text-pink-600 dark:hover:text-pink-400 cursor-pointer transition-colors">Contact</li>
          </ul>
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleDarkMode}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
              <Heart className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
              <ShoppingBag className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <main className="px-6 py-12 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Find Your Perfect Beauty Dupe</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover affordable alternatives to luxury beauty products. Save money without compromising on quality.
          </p>
        </div>

        {/* Chat Interface */}
        <div className="w-full max-w-4xl mx-auto mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-200">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                <h3 className="font-semibold">Chat with StealthDupe</h3>
              </div>
            </div>
            <div className="h-[400px]">
              <ChatContainer />
            </div>
          </div>
        </div>

        {/* Dupe Results */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Suggested Dupes</h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Sort by Match
              </button>
              <button className="px-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Filter
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="group rounded-2xl shadow-sm bg-white dark:bg-gray-800 p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
              >
                <div className="relative mb-4">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-48 object-cover rounded-xl mb-4 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-pink-600 dark:bg-pink-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Save ${product.savings}
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-1">{product.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{product.brand}</p>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.363 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">({product.reviews})</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-pink-600 dark:text-pink-400 font-semibold text-lg">${product.price.toFixed(2)}</p>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                      <Heart className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                      <ShoppingBag className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-pink-500 to-purple-500 dark:from-pink-400 dark:to-purple-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${product.match}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Match Score: {product.match}%</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">StealthDupe</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Find affordable beauty dupes without compromising on quality.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="hover:text-pink-600 dark:hover:text-pink-400 cursor-pointer">About Us</li>
                <li className="hover:text-pink-600 dark:hover:text-pink-400 cursor-pointer">How It Works</li>
                <li className="hover:text-pink-600 dark:hover:text-pink-400 cursor-pointer">Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="hover:text-pink-600 dark:hover:text-pink-400 cursor-pointer">Blog</li>
                <li className="hover:text-pink-600 dark:hover:text-pink-400 cursor-pointer">FAQs</li>
                <li className="hover:text-pink-600 dark:hover:text-pink-400 cursor-pointer">Privacy Policy</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="hover:text-pink-600 dark:hover:text-pink-400 cursor-pointer">Instagram</li>
                <li className="hover:text-pink-600 dark:hover:text-pink-400 cursor-pointer">Twitter</li>
                <li className="hover:text-pink-600 dark:hover:text-pink-400 cursor-pointer">Facebook</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>© 2025 StealthDupe. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
