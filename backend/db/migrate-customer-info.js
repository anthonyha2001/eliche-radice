const { getDatabase, closeDatabase } = require('./connection');

/**
 * Migration script to add customer_name and customer_phone columns
 * Run with: node db/migrate-customer-info.js
 */
async function migrate() {
  try {
    console.log('🔄 Starting migration: Add customer info columns...');
    
    const db = await getDatabase();
    
    // Add customer_name column
    db.run(`ALTER TABLE conversations ADD COLUMN customer_name TEXT`, (err) => {
      if (err && !err.message.includes('duplicate column name')) {
        console.error('❌ Error adding customer_name:', err.message);
      } else if (err && err.message.includes('duplicate column name')) {
        console.log('ℹ️  customer_name column already exists');
      } else {
        console.log('✅ Added customer_name column');
      }
    });
    
    // Add customer_phone column
    db.run(`ALTER TABLE conversations ADD COLUMN customer_phone TEXT`, (err) => {
      if (err && !err.message.includes('duplicate column name')) {
        console.error('❌ Error adding customer_phone:', err.message);
      } else if (err && err.message.includes('duplicate column name')) {
        console.log('ℹ️  customer_phone column already exists');
      } else {
        console.log('✅ Added customer_phone column');
      }
    });
    
    // Wait a bit for async operations
    setTimeout(async () => {
      await closeDatabase();
      console.log('✅ Migration complete');
      process.exit(0);
    }, 500);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();

