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

    // Execute schema - PostgreSQL can handle multiple statements separated by semicolons
    // But we'll execute in parts for better error reporting
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      if (statement.length > 0) {
        try {
          await pool.query(statement);
        } catch (error) {
          // If it's a "already exists" error, that's fine (idempotent)
          if (error.code === '42P07' || error.message.includes('already exists')) {
            console.log('   ℹ️  Table/index already exists (skipping)');
          } else {
            throw error;
          }
        }
      }
    }

    // Verify tables exist
    const tablesCheck = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('conversations', 'messages')
    `);
    
    if (tablesCheck.rows.length < 2) {
      throw new Error(`Schema incomplete: only ${tablesCheck.rows.length}/2 tables found`);
    }

    console.log('✅ PostgreSQL schema is present and up to date');
    console.log(`   Verified tables: ${tablesCheck.rows.map(r => r.table_name).join(', ')}`);
  } catch (error) {
    console.error('❌ CRITICAL: Failed to ensure PostgreSQL schema on startup:');
    console.error('   Error message:', error.message);
    console.error('   Error code:', error.code);
    console.error('   Error detail:', error.detail);
    console.error('   Full error:', error);
    // Throw to prevent app from starting with broken schema
    throw new Error(`Database schema initialization failed: ${error.message}`);
  }
}

module.exports = {
  ensureSchema,
};


