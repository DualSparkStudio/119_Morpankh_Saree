'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Check if page is already loaded
    if (document.readyState === 'complete') {
      const timer = setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => {
          setIsLoading(false);
        }, 600);
      }, 1500);
      return () => clearTimeout(timer);
    }

    // Wait for page load
    const handleLoad = () => {
      setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => {
          setIsLoading(false);
        }, 600);
      }, 1500);
    };

    window.addEventListener('load', handleLoad);
    
    // Fallback timeout
    const fallback = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 600);
    }, 3000);

    return () => {
      window.removeEventListener('load', handleLoad);
      clearTimeout(fallback);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center transition-opacity duration-600 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ transition: 'opacity 0.6s ease-out' }}
    >
      <div className="flex flex-col items-center justify-center space-y-8 px-4">
        {/* Logo with elegant animation */}
        <div className="relative">
          {/* Glowing background effect */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-purple-500/30 via-blue-500/30 to-green-500/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-pink-500/20 via-orange-500/20 to-yellow-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          </div>
          
          {/* Logo with scale animation */}
          <div className="relative transform transition-transform duration-300 hover:scale-105">
            <Image
              src="/images/Moprpankh-Sarees-Logo.png"
              alt="Morpankh Saree Logo"
              width={320}
              height={320}
              className="w-56 h-56 md:w-72 md:h-72 object-contain drop-shadow-2xl"
              style={{ animation: 'logoFloat 3s ease-in-out infinite' }}
              priority
            />
          </div>
        </div>

        {/* Loading text with elegant styling */}
        <div className="text-center space-y-4">
          <h2 className="text-white text-xl md:text-2xl font-heading font-light tracking-wide">
            Welcome to Morpankh Saree
          </h2>
          <p className="text-gray-300 text-sm md:text-base font-light">
            Premium Indian Fashion
          </p>
          
          {/* Animated loading dots */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s] shadow-lg shadow-purple-400/50"></div>
            <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s] shadow-lg shadow-blue-400/50"></div>
            <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-bounce shadow-lg shadow-green-400/50"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

