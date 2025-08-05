import sequelize from './config/db.js';

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...');
    await sequelize.authenticate();
    console.log('✅ Database connection successful!');
    
    // Test a simple query
    const [results] = await sequelize.query('SELECT DATABASE() as db, USER() as user, VERSION() as version');
    console.log('📊 Database info:', results[0]);
    
    // List all tables
    const [tables] = await sequelize.query('SHOW TABLES');
    console.log('📋 Database tables:', tables);
    
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

async function testSync() {
  try {
    console.log('🔄 Testing database sync...');
    // Just sync the User model for testing
    const User = (await import('./models/User.js')).default;
    await User.sync({ alter: true });
    console.log('✅ User model synced successfully');
    return true;
  } catch (error) {
    console.error('❌ Database sync failed:', error);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting database tests...');
  
  const connectionOk = await testConnection();
  if (!connectionOk) {
    console.log('❌ Database connection test failed');
    process.exit(1);
  }
  
  const syncOk = await testSync();
  if (!syncOk) {
    console.log('❌ Database sync test failed');
    process.exit(1);
  }
  
  console.log('🎉 All tests completed successfully!');
  process.exit(0);
}

runTests();
