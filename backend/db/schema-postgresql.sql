-- Eliche Radiche Database Schema (PostgreSQL)
-- Migration from SQLite to PostgreSQL for production deployment

-- Conversations table
-- Stores conversation metadata and status
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id TEXT NOT NULL,
    status TEXT NOT NULL,
    priority TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_message_at TIMESTAMP NOT NULL DEFAULT NOW(),
    assigned_operator TEXT
);

-- Messages table
-- Stores individual messages within conversations
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender TEXT NOT NULL,
    content TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    read BOOLEAN DEFAULT FALSE
);

-- Indexes for performance optimization

-- Index on conversation_id in messages table
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);

-- Index on timestamp in messages table
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp);

-- Index on priority in conversations table
CREATE INDEX IF NOT EXISTS idx_conversations_priority ON conversations(priority);

-- Index on status in conversations table
CREATE INDEX IF NOT EXISTS idx_conversations_status ON conversations(status);

-- Index on last_message_at in conversations table
CREATE INDEX IF NOT EXISTS idx_conversations_last_message_at ON conversations(last_message_at);

-- Add constraints
ALTER TABLE conversations ADD CONSTRAINT check_status 
    CHECK (status IN ('active', 'resolved', 'waiting'));

ALTER TABLE conversations ADD CONSTRAINT check_priority 
    CHECK (priority IN ('critical', 'high', 'normal'));

ALTER TABLE messages ADD CONSTRAINT check_sender 
    CHECK (sender IN ('customer', 'operator'));

