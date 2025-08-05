import seedDatabase from './seedDatabase.js';
import seedDriversConductors from './seedDriversConductors.js';
import seedPricing from './seedPricing.js';
import sequelize from '../config/db.js';

const runSeeder = async () => {
  try {
    console.log('🌱 Starting database seeding process...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Sync database models
    await sequelize.sync(); // No alter or force, preserves all data
    console.log('✅ Database models synchronized.');

    // Run seeders in order
    console.log('\n📊 Step 1: Seeding basic data (passengers, sacco admins, routes, buses)...');
    await seedDatabase();
    
    console.log('\n👥 Step 2: Seeding drivers and conductors...');
    await seedDriversConductors();
    
    console.log('\n💰 Step 3: Seeding pricing information...');
    await seedPricing();

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📈 Summary:');
    console.log('- 6 passengers added');
    console.log('- 4 sacco admins added');
    console.log('- 4 routes added');
    console.log('- 37 buses added');
    console.log('- 74 drivers and conductors added');
    console.log('- Comprehensive pricing data added');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error during database seeding:', error);
    process.exit(1);
  }
};

// Run the seeder if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runSeeder();
}

export default runSeeder;