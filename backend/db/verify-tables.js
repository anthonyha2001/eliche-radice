const { getDatabase, closeDatabase } = require('./connection');

async function verifyTables() {
  try {
    const db = await getDatabase();
    
    return new Promise((resolve, reject) => {
      db.all(
        "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name",
        [],
        (err, rows) => {
          if (err) {
            reject(err);
            return;
          }
          
          console.log('Tables in database:');
          rows.forEach(row => console.log(`  ✓ ${row.name}`));
          
          const tableNames = rows.map(r => r.name);
          const required = ['conversations', 'messages'];
          const missing = required.filter(t => !tableNames.includes(t));
          
          if (missing.length > 0) {
            console.error('Missing tables:', missing);
            reject(new Error('Missing required tables'));
          } else {
            console.log('\n✅ All required tables exist');
            resolve();
          }
        }
      );
    });
  } catch (error) {
    console.error('Verification failed:', error);
    throw error;
  } finally {
    await closeDatabase();
  }
}

verifyTables().catch(() => process.exit(1));

