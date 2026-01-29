/**
 * Shared TypeScript types for Eliche Radiche MVP
 * These types are used across both frontend and backend to ensure type safety
 */

/**
 * Priority level for conversations and messages
 * - critical: Urgent issues requiring immediate attention (e.g., safety concerns, emergencies)
 * - high: Important matters that should be addressed soon
 * - normal: Standard inquiries and routine communications
 */
export type Priority = 'critical' | 'high' | 'normal';

/**
 * Status of a conversation
 * - active: Currently being handled by an operator
 * - resolved: Conversation has been completed and closed
 * - waiting: Awaiting operator response or customer reply
 */
export type ConversationStatus = 'active' | 'resolved' | 'waiting';

/**
 * Sender type for messages
 * - customer: Message sent by the yacht owner/customer
 * - operator: Message sent by the Eliche Radiche team member
 */
export type MessageSender = 'customer' | 'operator';

/**
 * Message interface representing a single message in a conversation
 */
export interface Message {
  /** Unique identifier for the message */
  id: string;
  /** ID of the conversation this message belongs to */
  conversationId: string;
  /** Who sent the message (customer or operator) */
  sender: MessageSender;
  /** The message content/text */
  content: string;
  /** Unix timestamp (milliseconds) when the message was sent */
  timestamp: number;
  /** Whether the message has been read by the recipient */
  read: boolean;
}

/**
 * Conversation interface representing a communication thread between customer and operator
 */
export interface Conversation {
  /** Unique identifier for the conversation */
  id: string;
  /** ID of the customer who initiated the conversation */
  customerId: string;
  /** Current status of the conversation */
  status: ConversationStatus;
  /** Priority level assigned to this conversation */
  priority: Priority;
  /** Unix timestamp (milliseconds) when the conversation was created */
  createdAt: number;
  /** Unix timestamp (milliseconds) of the most recent message */
  lastMessageAt: number;
  /** Optional ID of the operator assigned to handle this conversation */
  assignedOperator?: string;
}

/**
 * AI-generated suggestion for operator responses
 */
export interface AISuggestion {
  /** Unique identifier for the suggestion */
  id: string;
  /** The suggested response text */
  content: string;
  /** Confidence score between 0 and 1 indicating how confident the AI is in this suggestion */
  confidence: number;
}

/**
 * Operator action interface for tracking operator interactions
 */
export interface OperatorAction {
  /** Type of action performed (e.g., "message_sent", "conversation_resolved", "priority_changed") */
  action: string;
  /** Unix timestamp (milliseconds) when the action occurred */
  timestamp: number;
  /** ID of the conversation the action relates to */
  conversationId: string;
}
