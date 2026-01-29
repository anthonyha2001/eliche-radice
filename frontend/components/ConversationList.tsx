'use client';

import PriorityBadge from './PriorityBadge';

interface Conversation {
  id: string;
  customerId: string;
  status: string;
  priority: 'critical' | 'high' | 'normal';
  createdAt: number;
  lastMessageAt: number;
  lastMessage?: string;
  unreadCount?: number;
  customerName?: string;
  customerPhone?: string;
}

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function ConversationList({ conversations, selectedId, onSelect }: ConversationListProps) {
  // Sort: active/waiting/resolved, then by lastMessageAt DESC, then by priority
  const sorted = [...conversations].sort((a, b) => {
    const statusOrder: Record<string, number> = { active: 0, waiting: 1, resolved: 2 };
    const priorityOrder = { critical: 0, high: 1, normal: 2 };

    const aStatusRank = statusOrder[a.status] ?? 3;
    const bStatusRank = statusOrder[b.status] ?? 3;

    if (aStatusRank !== bStatusRank) {
      return aStatusRank - bStatusRank;
    }

    if (a.lastMessageAt !== b.lastMessageAt) {
      return b.lastMessageAt - a.lastMessageAt;
    }

    if (a.priority !== b.priority) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }

    return 0;
  });
  
  if (sorted.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm p-4 text-center">
        <p>No active conversations.<br/>Waiting for customers...</p>
      </div>
    );
  }
  
  return (
    <div className="overflow-y-auto h-full">
      {sorted.map((conv) => (
        <button
          key={conv.id}
          onClick={() => onSelect(conv.id)}
          className={`w-full text-left p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors ${
            selectedId === conv.id ? 'bg-gold-100 border-l-4 border-l-gold-500' : ''
          } ${conv.status === 'resolved' ? 'opacity-60' : ''}`}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-sm text-gray-900 truncate">
                  {conv.customerName || `Customer ${conv.customerId.substring(0, 8)}...`}
                </p>
                {conv.status === 'resolved' && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                    ✓ Resolved
                  </span>
                )}
              </div>
              {conv.customerPhone && (
                <p className="text-xs text-gray-500">{conv.customerPhone}</p>
              )}
              <p className="text-xs text-gray-500">
                {conv.lastMessageAt 
                  ? new Date(Number(conv.lastMessageAt)).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  : 'No messages'
                }
              </p>
            </div>
            <PriorityBadge priority={conv.priority} />
          </div>
          {conv.lastMessage && (
            <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
          )}
          {(conv.unreadCount ?? 0) > 0 && (
            <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold bg-gold-500 text-white rounded-full">
              {conv.unreadCount} new
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

