const CLOUDFRONT_BASE_URL = "https://newscrapperstest.s3.ap-south-1.amazonaws.com";

export const constructImageUrl = (imagePath: string | null | undefined): string | null => {
  if (!imagePath) return null;
  
  // If the path already starts with http/https, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Remove leading slash if present to avoid double slashes
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  
  return `${CLOUDFRONT_BASE_URL}/${cleanPath}`;
};

export const constructImageUrls = (imagePaths: string[] | null | undefined): string[] => {
  if (!imagePaths || !Array.isArray(imagePaths)) return [];
  
  return imagePaths
    .map(path => constructImageUrl(path))
    .filter((url): url is string => url !== null);
};

export const getPropertyImages = (property: any): string[] => {
  // First try to get images from noticeImageURLs array
  if (property?.noticeImageURLs && Array.isArray(property?.noticeImageURLs)) {
    const cloudFrontImages = constructImageUrls(property.noticeImageURLs);
    if (cloudFrontImages.length > 0) {
      return cloudFrontImages;
    }
  }
  
  // Fallback to single notice_image_url
  if (property?.noticeImageUrl) {
    const singleImage = constructImageUrl(property?.noticeImageUrl);
    if (singleImage) {
      return [singleImage];
    }
  }
  
  // Default fallback image
  return [];
};

// Safe value extraction with null/undefined handling
export const safeString = (value: any): string | null => {
    if (value === null || value === undefined || value === '') return null;
    return String(value);
  };
  
  export const safeNumber = (value: any): number | null => {
    if (value === null || value === undefined || value === '' || isNaN(value)) return null;
    return Number(value);
  };
  
  export const safeArray = (value: any): string[] | null => {
    if (!Array.isArray(value) || value.length === 0) return null;
    return value.filter(item => item !== null && item !== undefined && item !== '');
  };