// Helper function to get product images
export const getImageUrl = (image: string | undefined, index: number = 0): string => {
  // If image exists and is valid, return it
  if (image) {
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }
    if (image.startsWith('/')) {
      // Handle special characters in image paths (e.g., spaces, parentheses)
      if (image.includes(' ') || image.includes('(') || image.includes(')')) {
        const pathParts = image.split('/');
        const filename = pathParts.pop() || '';
        if (filename && (filename.includes(' ') || filename.includes('(') || filename.includes(')'))) {
          const encodedFilename = encodeURIComponent(filename);
          image = [...pathParts, encodedFilename].join('/');
        }
      }
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      const baseUrl = apiUrl.replace('/api', '');
      return `${baseUrl}${image}`;
    }
    return image;
  }
  
  // No fallback - return empty string
  return '';
};

export const getProductImage = (product: { images?: string[] }, index: number = 0): string => {
  if (product.images && product.images.length > 0 && product.images[0]) {
    return getImageUrl(product.images[0], index);
  }
  return getImageUrl(undefined, index);
};

