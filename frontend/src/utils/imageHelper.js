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
  
  // Get backend base URL
  let backendUrl;
  
  if (process.env.REACT_APP_API_URL) {
    // Production: use environment variable
    backendUrl = process.env.REACT_APP_API_URL;
  } else if (process.env.NODE_ENV === 'development') {
    // Development: backend is on port 5000
    backendUrl = 'http://localhost:5000';
  } else {
    // Fallback: use current origin
    backendUrl = window.location.origin;
  }
  
  return `${backendUrl}${path.startsWith('/') ? path : '/' + path}`;
};
