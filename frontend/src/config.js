/**
 * Centralized API Configuration for ToxicBuddy 2.0 Frontend.
 * Reads base URL from import.meta.env.VITE_API_URL.
 */

const rawApiUrl = import.meta.env.VITE_API_URL || '';
export const API_BASE_URL = rawApiUrl.replace(/\/$/, '');

/**
 * Helper to construct full API endpoint URL.
 * Example: getApiUrl('/api/health') -> 'https://toxicbuddy.onrender.com/api/health'
 */
export const getApiUrl = (path) => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
};
