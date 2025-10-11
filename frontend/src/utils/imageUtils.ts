/**
 * Converts relative image path from backend to full URL
 * Backend serves images directly via localhost:8080
 * @param imageUrl Relative path from backend (e.g., "/images/app_images/...")
 * @returns Full URL (e.g., "http://localhost:8080/images/app_images/...")
 */
export const getFullImageUrl = (imageUrl: string | null | undefined): string | null => {
  
  if (!imageUrl) {
    return null;
  }
  
  // If already a full URL, return as is
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // For Blob URLs (newly uploaded images)
  if (imageUrl.startsWith('blob:')) {
    return imageUrl;
  }
  
  // For Data URLs (base64 encoded)
  if (imageUrl.startsWith('data:')) {
    return imageUrl;
  }
  
  // Dynamically determine backend URL
  const currentHost = window.location.hostname;
  const currentPort = window.location.port;
  const protocol = window.location.protocol;
  
  let baseUrl;
  
  // For Docker deployment: Frontend runs on port 8090, backend also accessible on same port
  // For development: Frontend runs on port 5173, backend on port 8080
  if (currentPort === '8090') {
    // Docker mode: Both frontend and backend on same port
    baseUrl = `${protocol}//${currentHost}:8090`;
  } else if (currentPort === '5173' || currentPort === '4173') {
    // Development mode: Frontend on 5173, backend on 8080
    baseUrl = `${protocol}//${currentHost}:8080`;
  } else {
    // Production/Staging: Use same host and port as frontend
    baseUrl = `${protocol}//${currentHost}:${currentPort}`;
  }
  
  
  let fullUrl;
  
  // If imageUrl already starts with /api, add directly
  if (imageUrl.startsWith('/api/')) {
    fullUrl = `${baseUrl}${imageUrl}`;
  }
  // If starts with /images, add directly (don't add /api!)
  else if (imageUrl.startsWith('/images/')) {
    fullUrl = `${baseUrl}${imageUrl}`;
  }
  // For other cases, add directly
  else {
    fullUrl = `${baseUrl}${imageUrl}`;
  }
  
  // Debug logging (only in development)
  if (import.meta.env.DEV) {
    console.log('🖼️ Image URL Debug:', {
      originalImageUrl: imageUrl,
      currentPort: currentPort,
      baseUrl: baseUrl,
      fullUrl: fullUrl
    });
  }
  
  return fullUrl;
};

/**
 * Returns the restaurant logo URL
 * Logo is stored in React app's public/images/ folder
 * @returns Restaurant logo URL
 */
export const getRestaurantLogoUrl = (): string => {
  return '/images/logo.png';
};

/**
 * Checks if image URL is valid
 * @param imageUrl URL to check
 * @returns Promise<boolean>
 */
export const isImageUrlValid = async (imageUrl: string): Promise<boolean> => {
  try {
    const response = await fetch(imageUrl, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};
