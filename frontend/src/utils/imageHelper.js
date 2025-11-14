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
  
  // In production, use the API base URL from environment or current domain
  const apiBase = process.env.REACT_APP_API_URL || window.location.origin;
  return `${apiBase}${path.startsWith('/') ? path : '/' + path}`;
};
