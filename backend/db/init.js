const fs = require('fs');
const path = require('path');
const pool = require('./connection');

/**
 * Ensure required PostgreSQL tables exist.
 * 
 * - Uses the existing pg Pool
 * - Executes schema.sql which uses CREATE TABLE IF NOT EXISTS
 * - Safe to run on every startup (idempotent)
 * - Logs success/failure without crashing the app
 */
async function ensureSchema() {
  try {
    console.log('🔄 Ensuring PostgreSQL schema (conversations, messages, indexes)...');

    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    await pool.query(schema);

    console.log('✅ PostgreSQL schema is present and up to date');
  } catch (error) {
    console.error('❌ Failed to ensure PostgreSQL schema on startup:', error);
    // Do NOT throw here: app should still start, but queries may fail and log clearly
  }
}

module.exports = {
  ensureSchema,
};


