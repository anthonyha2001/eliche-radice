require('dotenv').config();

const fs = require('fs');
const path = require('path');
const pool = require('./connection');

async function runMigrations() {
  try {
    console.log('🔄 Running PostgreSQL migrations from schema.sql...');

    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    await pool.query(schema);

    console.log('✅ Database schema applied successfully');
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exitCode = 1;
  } finally {
    // Ensure the pool exits cleanly so Railway build can finish
    await pool.end().catch(() => {
      // ignore
    });
  }
}

runMigrations();


