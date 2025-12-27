'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import SmoothScroll from './SmoothScroll';
import Header from './Header';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  useEffect(() => {
    console.log('🟡 LayoutWrapper - pathname:', pathname);
    console.log('🟡 LayoutWrapper - is admin route:', pathname?.startsWith('/admin'));
  }, [pathname]);
  
  // Admin pages have their own layout, don't wrap with Header/Footer
  if (pathname?.startsWith('/admin')) {
    console.log('🟡 LayoutWrapper - returning children only (admin route)');
    return <>{children}</>;
  }

  // Regular pages get Header and Footer
  console.log('🟡 LayoutWrapper - returning with Header/Footer');
  return (
    <SmoothScroll>
      <Header />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </SmoothScroll>
  );
}

