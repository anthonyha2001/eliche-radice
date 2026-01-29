const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Database file path
const DB_PATH = path.join(__dirname, 'database.sqlite');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

// Singleton database instance
let db = null;
let isInitialized = false;

/**
 * Initialize the database connection and execute schema
 * @returns {Promise<sqlite3.Database>} Database instance
 */
async function initializeDatabase() {
  return new Promise((resolve, reject) => {
    // Check if database file exists
    const dbExists = fs.existsSync(DB_PATH);
    
    // Create or open database
    const database = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Failed to connect to database:', err.message);
        reject(err);
        return;
      }
      
      console.log(`Database ${dbExists ? 'opened' : 'created'}: ${DB_PATH}`);
      
      // Read and execute schema
      fs.readFile(SCHEMA_PATH, 'utf8', (err, schema) => {
        if (err) {
          console.error('Failed to read schema file:', err.message);
          database.close();
          reject(err);
          return;
        }
        
        // Execute schema
        database.exec(schema, (err) => {
          if (err) {
            console.error('Failed to execute schema:', err.message);
            database.close();
            reject(err);
            return;
          }
          
          console.log('Database schema initialized successfully');
          resolve(database);
        });
      });
    });
  });
}

/**
 * Get database connection singleton
 * @returns {Promise<sqlite3.Database>} Database instance
 */
async function getDatabase() {
  if (!db || !isInitialized) {
    try {
      db = await initializeDatabase();
      isInitialized = true;
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error;
    }
  }
  return db;
}

/**
 * Close database connection
 * @returns {Promise<void>}
 */
function closeDatabase() {
  return new Promise((resolve, reject) => {
    if (db) {
      db.close((err) => {
        if (err) {
          console.error('Error closing database:', err.message);
          reject(err);
        } else {
          console.log('Database connection closed');
          db = null;
          isInitialized = false;
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
}

// Export singleton database connection
module.exports = {
  getDatabase,
  closeDatabase,
};
