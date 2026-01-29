'use client';

interface Suggestion {
  id: string;
  content: string;
  confidence?: number;
}

interface AISuggestionPanelProps {
  suggestions: Suggestion[];
  onUse: (content: string) => void;
  onRefresh: () => void;
  loading?: boolean;
}

export default function AISuggestionPanel({ 
  suggestions, 
  onUse, 
  onRefresh,
  loading 
}: AISuggestionPanelProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-500 mx-auto mb-2"></div>
          <p className="text-sm">Generating suggestions...</p>
        </div>
      </div>
    );
  }
  
  if (suggestions.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm p-4 text-center">
        <div>
          <p className="mb-2">No suggestions available</p>
          <button
            onClick={onRefresh}
            className="text-gold-500 hover:text-gold-600 text-sm underline"
          >
            Generate suggestions
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm text-gray-700">AI Suggestions</h3>
        <button
          onClick={onRefresh}
          className="text-gold-500 hover:text-gold-600 text-sm"
          aria-label="Refresh suggestions"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
      
      {suggestions.map((suggestion, index) => (
        <div
          key={suggestion.id}
          className="p-3 border border-gray-200 rounded-lg hover:border-gold-400 transition-colors"
        >
          <p className="text-sm text-gray-700 mb-2">{suggestion.content}</p>
          <div className="flex space-x-2">
            <button
              onClick={() => onUse(suggestion.content)}
              className="text-xs text-gold-500 hover:text-gold-600 font-semibold"
            >
              Use this →
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

