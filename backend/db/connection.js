const { Pool } = require('pg');

// PostgreSQL connection configuration
// Railway provides DATABASE_URL automatically when Postgres is attached
// For local dev, use DATABASE_URL or fall back to individual env vars
let poolConfig;

if (process.env.DATABASE_URL) {
  // Use DATABASE_URL (Railway production or local with full connection string)
  poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? {
      rejectUnauthorized: false
    } : false
  };
  console.log('📊 Using DATABASE_URL for PostgreSQL connection');
} else {
  // Fallback to individual env vars (local development only)
  poolConfig = {
    host: process.env.PGHOST || 'localhost',
    port: process.env.PGPORT || 5432,
    database: process.env.PGDATABASE || 'eliche_radice',
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || '',
    ssl: false
  };
  console.log(`📊 Using individual env vars for PostgreSQL (host: ${poolConfig.host})`);
}

const pool = new Pool(poolConfig);

// Test connection
pool.on('connect', () => {
  console.log('✅ PostgreSQL database connected');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL connection error:', err.message);
});

module.exports = pool;
