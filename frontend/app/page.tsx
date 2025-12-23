import Hero from '@/components/HomePage/Hero';
import FlashSale from '@/components/HomePage/FlashSale';
import Buy2Get1 from '@/components/HomePage/Buy2Get1';
import FeaturedProducts from '@/components/HomePage/FeaturedProducts';
import CategoryShowcase from '@/components/HomePage/CategoryShowcase';
import { bannersApi } from '@/lib/api/banners';
import { productsApi } from '@/lib/api/products';
import { categoriesApi } from '@/lib/api/categories';

export const revalidate = 60; // Revalidate every 60 seconds

async function getHomePageData() {
  try {
    const [banners, featuredProducts, categories] = await Promise.all([
      bannersApi.getAll('homepage_hero').catch(() => []),
      productsApi.getFeatured(8).catch(() => []),
      categoriesApi.getAll().catch(() => []),
    ]);

    // Create flash sale end time (24 hours from now)
    const flashSaleEndTime = new Date();
    flashSaleEndTime.setHours(flashSaleEndTime.getHours() + 24);

    // For demo purposes, mark some products as flash sale
    const flashSaleProducts = featuredProducts.slice(0, 5).map(product => ({
      ...product,
      compareAtPrice: product.compareAtPrice || product.basePrice * 1.3,
      discount: product.compareAtPrice ? Math.round(((product.compareAtPrice - product.basePrice) / product.compareAtPrice) * 100) : 30,
    }));

    // Buy 2 Get 1 products (same as featured for demo)
    const buy2Get1Products = featuredProducts.slice(0, 8);

    return {
      banners,
      flashSaleProducts,
      flashSaleEndTime: flashSaleEndTime.toISOString(),
      buy2Get1Products,
      featuredProducts,
      categories: categories.slice(0, 8),
    };
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    return {
      banners: [],
      flashSaleProducts: [],
      flashSaleEndTime: null,
      buy2Get1Products: [],
      featuredProducts: [],
      categories: [],
    };
  }
}

export default async function Home() {
  const {
    banners,
    flashSaleProducts,
    flashSaleEndTime,
    buy2Get1Products,
    featuredProducts,
    categories,
  } = await getHomePageData();

  return (
    <div className="min-h-screen">
      <Hero banners={banners} />
      <FlashSale products={flashSaleProducts} endTime={flashSaleEndTime || undefined} />
      <Buy2Get1 products={buy2Get1Products} />
      <FeaturedProducts products={featuredProducts} />
      <CategoryShowcase categories={categories} />
    </div>
  );
}
