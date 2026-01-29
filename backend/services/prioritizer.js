/**
 * Message prioritization service
 * Analyzes message content to determine priority level
 */

// Critical keywords that indicate urgent issues requiring immediate attention
const CRITICAL_KEYWORDS = [
  'urgent',
  'emergency',
  'sinking',
  'fire',
  'leak',
  'not working',
  'broken',
  'help',
  'mayday',
];

// High priority keywords that indicate important matters
const HIGH_KEYWORDS = [
  'soon',
  'today',
  'asap',
  'quickly',
  'important',
];

/**
 * Analyze message content to determine priority level
 * @param {string} messageContent - The message content to analyze
 * @returns {Object} Priority analysis result with priority and confidence
 * @returns {string} returns.priority - Priority level: 'critical', 'high', or 'normal'
 * @returns {number} returns.confidence - Confidence score between 0 and 1
 */
function analyzePriority(messageContent) {
  if (!messageContent || typeof messageContent !== 'string') {
    return { priority: 'normal', confidence: 0.5 };
  }

  const lowerContent = messageContent.toLowerCase();

  // Check for critical keywords
  for (const keyword of CRITICAL_KEYWORDS) {
    if (lowerContent.includes(keyword)) {
      return { priority: 'critical', confidence: 0.9 };
    }
  }

  // Check for high priority keywords
  for (const keyword of HIGH_KEYWORDS) {
    if (lowerContent.includes(keyword)) {
      return { priority: 'high', confidence: 0.7 };
    }
  }

  // Default to normal priority
  return { priority: 'normal', confidence: 0.5 };
}

module.exports = {
  analyzePriority,
};
