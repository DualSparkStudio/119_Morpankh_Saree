import HeroCarousel from '../components/Home/HeroCarousel'
import CategorySection from '../components/Home/CategorySection'
import PremiumPatterns from '../components/Home/PremiumPatterns'
import TrendingPatterns from '../components/Home/TrendingPatterns'

const Home = () => {
  return (
    <div className="min-h-screen">
      <HeroCarousel />
      <CategorySection />
      <PremiumPatterns />
      <TrendingPatterns />
    </div>
  )
}

export default Home

