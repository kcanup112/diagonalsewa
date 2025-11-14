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
  
  // Get backend base URL based on current environment
  // In production build, REACT_APP_API_URL will be set to http://diagonalsewa.com
  // In development, it will be undefined and we'll use localhost:5000
  const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  
  return `${backendUrl}${path.startsWith('/') ? path : '/' + path}`;
};
