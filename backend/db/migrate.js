require('dotenv').config();

const pool = require('./connection');
const { ensureSchema } = require('./init');

/**
 * One-off migration script for CI / Railway builds.
 * 
 * - Reuses ensureSchema() logic
 * - Closes the pool when finished so builds can exit cleanly
 */
async function runMigrations() {
  try {
    console.log('🔄 Running PostgreSQL migrations from schema.sql (db/migrate.js)...');

    await ensureSchema();

    console.log('✅ Database schema applied successfully (db/migrate.js)');
  } catch (error) {
    console.error('❌ Migration error (db/migrate.js):', error);
    process.exitCode = 1;
  } finally {
    // Ensure the pool exits cleanly so Railway build can finish
    await pool.end().catch(() => {
      // ignore
    });
  }
}

runMigrations();

