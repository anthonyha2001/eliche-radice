const { getDatabase, closeDatabase } = require('./connection');

/**
 * Test database connection and schema initialization
 */
async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Get database connection
    const db = await getDatabase();
    console.log('✓ Database connection established');
    
    // Test query: Check if tables exist
    const checkTables = () => {
      return new Promise((resolve, reject) => {
        db.all(
          "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name",
          [],
          (err, rows) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(rows);
          }
        );
      });
    };
    
    const tables = await checkTables();
    console.log('✓ Tables found:', tables.map(row => row.name).join(', '));
    
    // Verify required tables exist
    const tableNames = tables.map(row => row.name);
    const requiredTables = ['conversations', 'messages'];
    const missingTables = requiredTables.filter(table => !tableNames.includes(table));
    
    if (missingTables.length > 0) {
      throw new Error(`Missing required tables: ${missingTables.join(', ')}`);
    }
    
    console.log('✓ All required tables exist');
    
    // Test a simple query on conversations table
    const testQuery = () => {
      return new Promise((resolve, reject) => {
        db.get(
          'SELECT COUNT(*) as count FROM conversations',
          [],
          (err, row) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(row);
          }
        );
      });
    };
    
    const result = await testQuery();
    console.log(`✓ Test query successful. Conversations count: ${result.count}`);
    
    // Test indexes
    const checkIndexes = () => {
      return new Promise((resolve, reject) => {
        db.all(
          "SELECT name FROM sqlite_master WHERE type='index' AND name LIKE 'idx_%'",
          [],
          (err, rows) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(rows);
          }
        );
      });
    };
    
    const indexes = await checkIndexes();
    console.log('✓ Indexes found:', indexes.map(row => row.name).join(', '));
    
    console.log('\n✅ Database connection test passed!');
    
  } catch (error) {
    console.error('❌ Database connection test failed:', error.message);
    process.exit(1);
  } finally {
    // Close database connection
    await closeDatabase();
    console.log('Database connection closed');
  }
}

// Run test
testConnection();

