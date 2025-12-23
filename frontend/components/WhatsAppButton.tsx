'use client';

import { MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
}

export default function WhatsAppButton({ 
  phoneNumber = '+911234567890', 
  message = 'Hello, I need help with my order.' 
}: WhatsAppButtonProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20BA5A] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all animate-bounce hover:animate-none"
      aria-label="Contact via WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
    </button>
  );
}

