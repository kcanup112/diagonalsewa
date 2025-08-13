// Image optimization utilities
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

export const preloadImages = async (urls) => {
  try {
    const promises = urls.map(url => preloadImage(url));
    await Promise.allSettled(promises);
  } catch (error) {
    console.warn('Some images failed to preload:', error);
  }
};

// Critical images that should load first
export const CRITICAL_IMAGES = [
  '/images/gallery/hero.jpg',
  '/images/gallery/living.jpg',
  '/images/gallery/white.jpg'
];

// Lazy load images below the fold
export const LAZY_IMAGES = [
  '/images/gallery/4.jpg',
  '/images/gallery/repair.jpg'
];
