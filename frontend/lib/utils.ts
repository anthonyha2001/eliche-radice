/**
 * URL utility functions to prevent double slashes and trailing slash issues
 */

/**
 * Ensures URL has no trailing slash
 */
export function cleanUrl(url: string): string {
  return url.replace(/\/$/, '');
}

/**
 * Safely join URL paths without double slashes
 * @param base - Base URL (e.g., 'https://api.example.com')
 * @param paths - Path segments to join (e.g., 'api', 'conversations')
 * @returns Joined URL without double slashes
 * 
 * @example
 * joinUrl('https://api.example.com/', '/api', '/conversations')
 * // Returns: 'https://api.example.com/api/conversations'
 */
export function joinUrl(base: string, ...paths: string[]): string {
  const cleanBase = base.replace(/\/$/, '');
  const cleanPaths = paths
    .map(p => p.replace(/^\/|\/$/g, '')) // Remove leading and trailing slashes from each path
    .filter(p => p.length > 0); // Remove empty strings
  
  return [cleanBase, ...cleanPaths].join('/');
}

