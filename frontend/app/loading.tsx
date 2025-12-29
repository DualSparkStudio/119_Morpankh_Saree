'use client';

import Image from 'next/image';

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black z-[9999] flex items-center justify-center">
      <div className="flex flex-col items-center justify-center space-y-8">
        {/* Logo with animation */}
        <div className="relative">
          {/* Glowing background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-blue-500/30 rounded-full blur-3xl animate-pulse scale-150"></div>
          
          {/* Logo with bounce animation */}
          <div className="relative animate-bounce-slow">
            <Image
              src="/images/Moprpankh-Sarees-Logo.png"
              alt="Morpankh Saree Logo"
              width={300}
              height={100}
              className="w-auto h-24 md:h-32 lg:h-40 object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </div>

        {/* Loading spinner with colorful dots */}
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s] shadow-lg shadow-purple-500/50"></div>
          <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce [animation-delay:-0.15s] shadow-lg shadow-pink-500/50"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce shadow-lg shadow-blue-500/50"></div>
        </div>

        {/* Loading text with gradient */}
        <p className="text-white/90 text-sm md:text-base font-light tracking-wider">
          <span className="inline-block animate-pulse">Loading</span>
          <span className="inline-block animate-pulse [animation-delay:0.2s]">.</span>
          <span className="inline-block animate-pulse [animation-delay:0.4s]">.</span>
          <span className="inline-block animate-pulse [animation-delay:0.6s]">.</span>
        </p>
      </div>
    </div>
  );
}

