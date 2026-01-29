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
/**
 * Ensure required PostgreSQL tables exist with retry logic.
 * 
 * - Uses the existing pg Pool
 * - Executes schema.sql which uses CREATE TABLE IF NOT EXISTS
 * - Safe to run on every startup (idempotent)
 * - Retries on connection errors (DB may start slightly after app)
 * - Fails fast if DATABASE_URL is missing
 */
async function ensureSchema(maxRetries = 3, retryDelay = 2000) {
  // Check if DATABASE_URL is configured
  if (!process.env.DATABASE_URL && !process.env.PGHOST) {
    throw new Error('DATABASE_URL or PGHOST environment variable is required');
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Ensuring PostgreSQL schema (attempt ${attempt}/${maxRetries})...`);

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
              // Silent skip for idempotent operations
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
      return; // Success - exit retry loop
    } catch (error) {
      const isConnectionError = 
        error.code === 'ECONNREFUSED' || 
        error.code === 'ENOTFOUND' ||
        error.message.includes('connect') ||
        error.message.includes('getaddrinfo');

      if (isConnectionError && attempt < maxRetries) {
        console.warn(`⚠️  Database connection failed (attempt ${attempt}/${maxRetries}), retrying in ${retryDelay}ms...`);
        console.warn(`   Error: ${error.message}`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        continue; // Retry
      }

      // Non-retryable error or max retries reached
      console.error('❌ CRITICAL: Failed to ensure PostgreSQL schema on startup:');
      console.error('   Error message:', error.message);
      console.error('   Error code:', error.code);
      console.error('   Error detail:', error.detail);
      throw new Error(`Database schema initialization failed after ${attempt} attempts: ${error.message}`);
    }
  }
}

module.exports = {
  ensureSchema,
};


