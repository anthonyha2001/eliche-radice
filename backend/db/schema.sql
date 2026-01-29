-- Eliche Radiche Database Schema
-- SQLite database schema for conversations and messages

-- Conversations table
-- Stores conversation metadata and status
CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL,
    status TEXT NOT NULL,
    priority TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    last_message_at INTEGER NOT NULL,
    assigned_operator TEXT
);

-- Messages table
-- Stores individual messages within conversations
CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    conversation_id TEXT NOT NULL,
    sender TEXT NOT NULL,
    content TEXT NOT NULL,
    timestamp INTEGER NOT NULL,
    read INTEGER DEFAULT 0,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
);

-- Indexes for performance optimization

-- Index on conversation_id in messages table
-- Speeds up queries to fetch all messages for a conversation
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);

-- Index on priority in conversations table
-- Speeds up queries filtering by priority (e.g., showing critical conversations first)
CREATE INDEX IF NOT EXISTS idx_conversations_priority ON conversations(priority);

-- Index on timestamp in messages table
-- Speeds up queries ordering messages by time (e.g., chronological display)
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp);

-- Additional useful indexes

-- Index on status in conversations table
-- Speeds up queries filtering by conversation status
CREATE INDEX IF NOT EXISTS idx_conversations_status ON conversations(status);

-- Index on last_message_at in conversations table
-- Speeds up queries sorting conversations by most recent activity
CREATE INDEX IF NOT EXISTS idx_conversations_last_message_at ON conversations(last_message_at);
