/**
 * API Configuration Module
 * Handles environment-based API URL configuration for local, development, and production environments
 */

import { getApiBase } from './queryClient';

export const API_URL = getApiBase();

/**
 * Make API request with proper URL handling
 */
export async function apiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Export for debugging
if (import.meta.env.DEV) {
  console.log('🔌 API URL:', API_URL);
}
