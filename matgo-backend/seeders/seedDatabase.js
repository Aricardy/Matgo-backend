import bcrypt from 'bcrypt';
import { User, Passenger, Driver, Conductor, Matatu, SaccoAdmin, Route } from '../models/index.js';
import sequelize from '../config/db.js';

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Hash password function
    const hashPassword = async (password) => {
      return await bcrypt.hash(password, 10);
    };

    // Clear existing data (optional - uncomment if needed)
    // await sequelize.sync({ force: true });

    // 1. Seed Passengers
    console.log('Seeding passengers...');
    const passengers = [
      {
        username: 'laurine_onana',
        fullName: 'Laurine Onana',
        email: 'onanalaurine4@gmail.com',
        phone: '+254700000001',
        role: 'passenger',
        avatar: 'laurine.jpg',
        password: await hashPassword('Onana@12345'),
        approved: true
      },
      {
        username: 'ariam_nyariana',
        fullName: 'Ariam Nyariana',
        email: 'ariamnyariana2@gmail.com',
        phone: '+254700000002',
        role: 'passenger',
        avatar: 'Ariam.jpg',
        password: await hashPassword('Ariam@12345'),
        approved: true
      },
      {
        username: 'allan_kimani',
        fullName: 'Allan Kimani',
        email: 'allan.wachuka@strathmore.edu',
        phone: '+254700000003',
        role: 'passenger',
        avatar: 'Allan.jpg',
        password: await hashPassword('Ariamkim@12345'),
        approved: true
      },
      {
        username: 'alice_wanjiru',
        fullName: 'Alice Wanjiru',
        email: 'alicewanjiru@gmail.com',
        phone: '+254700000004',
        role: 'passenger',
        avatar: 'Alice.jpg',
        password: await hashPassword('Alice@12345'),
        approved: true
      },
      {
        username: 'ariam_kimani',
        fullName: 'Ariam Kimani',
        email: 'ariamkim1@gmail.com',
        phone: '+254700000005',
        role: 'passenger',
        avatar: 'Ariamkim.jpg',
        password: await hashPassword('kimanikim@123'),
        approved: true
      },
      {
        username: 'kim_kimani',
        fullName: 'Kim Kimani',
        email: 'kimkimani@gmail.com',
        phone: '+254700000006',
        role: 'passenger',
        avatar: 'Kim.jpg',
        password: await hashPassword('Ariam@12345'),
        approved: true
      }
    ];

    for (const passengerData of passengers) {
      await User.create(passengerData);
    }

    // 2. Seed Sacco Admins
    console.log('Seeding sacco admins...');
    const saccoAdmins = [
      {
        username: 'ntvrs_admin',
        fullName: 'Ntvrs Kajiado',
        email: 'ntvrs@sacco.co.ke',
        phone: '+254700001001',
        role: 'sacco_admin',
        avatar: 'NTVRS.png',
        password: await hashPassword('NTVRS@12345'),
        approved: true
      },
      {
        username: 'supermetro_admin',
        fullName: 'Super Metro',
        email: 'supermetro@sacco.co.ke',
        phone: '+254700001002',
        role: 'sacco_admin',
        avatar: 'Super Metro.png',
        password: await hashPassword('Supermetro@12345'),
        approved: true
      },
      {
        username: 'expresso_admin',
        fullName: 'Expresso Limited',
        email: 'expresso@sacco.co.ke',
        phone: '+254700001003',
        role: 'sacco_admin',
        avatar: 'Expresso.png',
        password: await hashPassword('Expresso@12345'),
        approved: true
      },
      {
        username: 'embasava_admin',
        fullName: 'Emba Pesa',
        email: 'embasava@sacco.co.ke',
        phone: '+254700001004',
        role: 'sacco_admin',
        avatar: 'Embasava.png',
        password: await hashPassword('Embasava@12345'),
        approved: true
      }
    ];

    for (const saccoData of saccoAdmins) {
      await User.create(saccoData);
    }

    // 3. Seed Routes
    console.log('Seeding routes...');
    const routes = [
      { name: 'Ngong Route (111)', description: 'Ngong to Town via Ngong Road', active: true },
      { name: 'Rongai Route (125)', description: 'Rongai to Town', active: true },
      { name: 'Kasarani Route (17b)', description: 'Kasarani to Town', active: true },
      { name: 'Embakasi Route', description: 'Embakasi to Town', active: true }
    ];

    for (const routeData of routes) {
      await Route.create(routeData);
    }

    // 4. Seed Buses (Matatus)
    console.log('Seeding buses...');
    const buses = [
      // NTVRS - Ngong Route
      { sacco: 'NTVRS', identifier: 'X-Rated', busType: 'Matatu', route: 'Ngong Route (111)', featured: true },
      { sacco: 'NTVRS', identifier: 'Phenomenal', busType: 'Matatu', route: 'Ngong Route (111)', featured: false },
      { sacco: 'NTVRS', identifier: 'CyberPunk', busType: 'Matatu', route: 'Ngong Route (111)', featured: false },
      { sacco: 'NTVRS', identifier: 'Harukaze', busType: 'Matatu', route: 'Ngong Route (111)', featured: false },
      { sacco: 'NTVRS', identifier: 'Ikigai', busType: 'Matatu', route: 'Ngong Route (111)', featured: false },
      { sacco: 'NTVRS', identifier: 'Mellows', busType: 'Matatu', route: 'Ngong Route (111)', featured: false },
      { sacco: 'NTVRS', identifier: 'Stormzy', busType: 'Matatu', route: 'Ngong Route (111)', featured: false },
      { sacco: 'NTVRS', identifier: 'Monalisa', busType: 'Matatu', route: 'Ngong Route (111)', featured: false },
      { sacco: 'NTVRS', identifier: 'Spice', busType: 'Matatu', route: 'Ngong Route (111)', featured: false },
      { sacco: 'NTVRS', identifier: 'Spurs', busType: 'Matatu', route: 'Ngong Route (111)', featured: false },
      { sacco: 'NTVRS', identifier: 'Explicit', busType: 'Matatu', route: 'Ngong Route (111)', featured: false },
      { sacco: 'NTVRS', identifier: 'SCrilla', busType: 'Matatu', route: 'Ngong Route (111)', featured: false },
      
      // Expresso - Rongai Route
      { sacco: 'Expresso', identifier: 'Baba Yaga', busType: 'Matatu', route: 'Rongai Route (125)', featured: true },
      { sacco: 'Expresso', identifier: 'Moxie', busType: 'Matatu', route: 'Rongai Route (125)', featured: false },
      { sacco: 'Expresso', identifier: 'Ferari', busType: 'Matatu', route: 'Rongai Route (125)', featured: false },
      { sacco: 'Expresso', identifier: 'Detroit', busType: 'Matatu', route: 'Rongai Route (125)', featured: false },
      
      // Expresso - Kasarani Route
      { sacco: 'Expresso', identifier: 'Gamer', busType: 'Matatu', route: 'Kasarani Route (17b)', featured: false },
      { sacco: 'Expresso', identifier: 'Funka Delica', busType: 'Matatu', route: 'Kasarani Route (17b)', featured: false },
      { sacco: 'Expresso', identifier: 'Malkia', busType: 'Matatu', route: 'Kasarani Route (17b)', featured: false },
      { sacco: 'Expresso', identifier: 'Jabari', busType: 'Matatu', route: 'Kasarani Route (17b)', featured: false },
      
      // Embasava - Embakasi Route
      { sacco: 'Embasava', identifier: 'Brawlout', busType: 'Matatu', route: 'Embakasi Route', featured: false },
      { sacco: 'Embasava', identifier: 'MoneyFest', busType: 'Matatu', route: 'Embakasi Route', featured: false },
      { sacco: 'Embasava', identifier: 'Heartless', busType: 'Matatu', route: 'Embakasi Route', featured: false },
      { sacco: 'Embasava', identifier: 'Matrix', busType: 'Matatu', route: 'Embakasi Route', featured: false },
      { sacco: 'Embasava', identifier: 'Mood', busType: 'Matatu', route: 'Embakasi Route', featured: false },
      { sacco: 'Embasava', identifier: 'Genesis', busType: 'Matatu', route: 'Embakasi Route', featured: false },
      { sacco: 'Embasava', identifier: 'Restoration', busType: 'Matatu', route: 'Embakasi Route', featured: false },
      
      // SuperMetro - Ngong Route
      { sacco: 'SuperMetro', identifier: 'fleet 1456', busType: 'Matatu', route: 'Ngong Route (111)', featured: false },
      { sacco: 'SuperMetro', identifier: 'fleet 3743', busType: 'Matatu', route: 'Ngong Route (111)', featured: false },
      { sacco: 'SuperMetro', identifier: 'fleet 8643', busType: 'Matatu', route: 'Ngong Route (111)', featured: false },
      { sacco: 'SuperMetro', identifier: 'fleet 3737', busType: 'Matatu', route: 'Ngong Route (111)', featured: false },
      { sacco: 'SuperMetro', identifier: 'fleet 1234', busType: 'Matatu', route: 'Ngong Route (111)', featured: false },
      { sacco: 'SuperMetro', identifier: 'fleet 0001', busType: 'Matatu', route: 'Ngong Route (111)', featured: false },
      
      // SuperMetro - Rongai Route
      { sacco: 'SuperMetro', identifier: 'fleet 19373', busType: 'Matatu', route: 'Rongai Route (125)', featured: false },
      { sacco: 'SuperMetro', identifier: 'fleet 12349', busType: 'Matatu', route: 'Rongai Route (125)', featured: false },
      { sacco: 'SuperMetro', identifier: 'fleet 23456', busType: 'Matatu', route: 'Rongai Route (125)', featured: false },
      { sacco: 'SuperMetro', identifier: 'fleet 32456', busType: 'Matatu', route: 'Rongai Route (125)', featured: false },
      { sacco: 'SuperMetro', identifier: 'fleet 78902', busType: 'Matatu', route: 'Rongai Route (125)', featured: false }
    ];

    for (const busData of buses) {
      await Matatu.create(busData);
    }

    console.log('Database seeding completed successfully!');
    
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

export default seedDatabase;