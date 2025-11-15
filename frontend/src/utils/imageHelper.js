/**
 * Helper function to get full image URL
 * Converts relative paths to absolute URLs pointing to backend
 */
export const getImageUrl = (path) => {
  if (!path) return '';
  
  // If path is already a full URL, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // In production, use relative URLs so nginx can proxy them
  // In development, use localhost:5000
  if (process.env.NODE_ENV === 'production') {
    // Return relative path - nginx will handle routing
    return path.startsWith('/') ? path : '/' + path;
  }
  
  // Development: use localhost
  const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  return `${backendUrl}${path.startsWith('/') ? path : '/' + path}`;
};
