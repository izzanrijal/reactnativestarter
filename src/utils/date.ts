/**
 * @description
 * Utility functions for date formatting and manipulation
 */

/**
 * Formats a date into a relative time string (e.g., "2 hours ago", "3 days ago")
 * @param date The date to format
 * @returns A string representing the relative time
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days} hari yang lalu`;
  }
  if (hours > 0) {
    return `${hours} jam yang lalu`;
  }
  if (minutes > 0) {
    return `${minutes} menit yang lalu`;
  }
  return 'Baru saja';
} 