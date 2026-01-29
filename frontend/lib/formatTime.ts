/**
 * Format timestamp for message display
 */
export function formatMessageTime(timestamp: number | string | undefined): string {
  if (!timestamp) return '';
  
  try {
    const date = new Date(Number(timestamp));
    if (isNaN(date.getTime())) return '';
    
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  } catch {
    return '';
  }
}

/**
 * Format timestamp for conversation list (relative time)
 */
export function formatConversationTime(timestamp: number | string | undefined): string {
  if (!timestamp) return 'No messages';
  
  try {
    const date = new Date(Number(timestamp));
    if (isNaN(date.getTime())) return 'Unknown';
    
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric' 
    });
  } catch {
    return 'Unknown';
  }
}

/**
 * Format full date and time
 */
export function formatFullDateTime(timestamp: number | string | undefined): string {
  if (!timestamp) return '';
  
  try {
    const date = new Date(Number(timestamp));
    if (isNaN(date.getTime())) return '';
    
    return date.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return '';
  }
}

