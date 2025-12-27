'use client';

import { usePathname } from 'next/navigation';
import SmoothScroll from './SmoothScroll';
import Header from './Header';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Admin pages have their own layout, don't wrap with Header/Footer
  if (pathname?.startsWith('/admin')) {
    return <>{children}</>;
  }

  // Regular pages get Header and Footer
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

