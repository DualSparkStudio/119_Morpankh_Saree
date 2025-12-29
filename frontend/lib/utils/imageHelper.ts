// Helper function to get product images with fallback to images2 folder
const images2Fallbacks = [
  '/images2/WhatsApp Image 2025-12-26 at 1.50.01 PM.jpeg',
  '/images2/WhatsApp Image 2025-12-26 at 1.50.01 PM (1).jpeg',
  '/images2/WhatsApp Image 2025-12-26 at 1.50.02 PM.jpeg',
  '/images2/WhatsApp Image 2025-12-26 at 1.50.02 PM (1).jpeg',
  '/images2/WhatsApp Image 2025-12-26 at 1.50.03 PM.jpeg',
  '/images2/WhatsApp Image 2025-12-26 at 1.50.03 PM (1).jpeg',
  '/images2/WhatsApp Image 2025-12-26 at 1.50.03 PM (2).jpeg',
  '/images2/WhatsApp Image 2025-12-26 at 1.50.04 PM.jpeg',
  '/images2/WhatsApp Image 2025-12-26 at 1.50.04 PM (1).jpeg',
];

export const getImageUrl = (image: string | undefined, index: number = 0): string => {
  // If image exists and is valid, return it
  if (image) {
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }
    if (image.startsWith('/')) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      const baseUrl = apiUrl.replace('/api', '');
      return `${baseUrl}${image}`;
    }
    return image;
  }
  
  // Fallback to images2 folder based on index
  const fallbackIndex = index % images2Fallbacks.length;
  return images2Fallbacks[fallbackIndex];
};

export const getProductImage = (product: { images?: string[] }, index: number = 0): string => {
  if (product.images && product.images.length > 0 && product.images[0]) {
    return getImageUrl(product.images[0], index);
  }
  return getImageUrl(undefined, index);
};

