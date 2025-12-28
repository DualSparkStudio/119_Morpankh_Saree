import HeroCarousel from '@/components/HomePage/HeroCarousel';
import CategorySection from '@/components/HomePage/CategorySection';
import PremiumPatterns from '@/components/HomePage/PremiumPatterns';
import TrendingPatterns from '@/components/HomePage/TrendingPatterns';

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroCarousel />
      <CategorySection />
      <PremiumPatterns />
      <TrendingPatterns />
    </div>
  );
}
