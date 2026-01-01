// Helper function to get product images
export const getImageUrl = (image: string | undefined, index: number = 0): string => {
  // If image exists and is valid, return it
  if (image && image.trim() !== '') {
    // Clean up the image string - remove trailing backslashes, whitespace, etc.
    image = image.trim().replace(/\\+$/, '').trim();
    
    // Convert old Google Drive format to thumbnail format for better reliability
    // Google Drive's uc?export=view URLs don't work reliably for direct embedding
    if (image.includes('drive.google.com/uc?export=view&id=') || image.includes('drive.google.com/uc?export=view&amp;id=')) {
      const fileIdMatch = image.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (fileIdMatch && fileIdMatch[1]) {
        // Convert to thumbnail API which is more reliable for direct embedding
        image = `https://drive.google.com/thumbnail?id=${fileIdMatch[1]}&sz=w1920`;
      }
    }
    
    // Also handle other Google Drive URL formats
    if (image.includes('drive.google.com/file/d/')) {
      // Extract file ID from /file/d/{ID}/view format
      const fileIdMatch = image.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (fileIdMatch && fileIdMatch[1]) {
        image = `https://drive.google.com/thumbnail?id=${fileIdMatch[1]}&sz=w1920`;
      }
    }
    
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }
    
    if (image.startsWith('/uploads')) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      let url = '';
      if (apiUrl.startsWith('http')) {
        const baseUrl = apiUrl.replace('/api', '');
        url = `${baseUrl}${image}`;
      } else {
        url = image;
      }
      return url;
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

