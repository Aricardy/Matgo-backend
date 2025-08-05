import { Driver, Conductor } from '../models/index.js';
import bcrypt from 'bcrypt';

const seedDriversConductorsSimple = async () => {
  try {
    console.log('Seeding drivers and conductors (simplified)...');

    // Hash password function
    const hashPassword = async (password) => {
      return await bcrypt.hash(password, 10);
    };

    // Default password for all drivers and conductors
    const defaultPassword = await hashPassword('Driver@123');

    // All driver-conductor teams from the data
    const teams = [
      // NTVRS - Ngong Route
      { bus: 'X-Rated', driver: 'Ochila', conductor: 'Theo', sacco: 'NTVRS' },
      { bus: 'Phenomenal', driver: 'Dan', conductor: 'Deni', sacco: 'NTVRS' },
      { bus: 'CyberPunk', driver: 'Steven', conductor: 'Ivor', sacco: 'NTVRS' },
      { bus: 'Harukaze', driver: 'Brian', conductor: 'Matt', sacco: 'NTVRS' },
      { bus: 'Ikigai', driver: 'Otieno', conductor: 'Tman', sacco: 'NTVRS' },
      { bus: 'Mellows', driver: 'Dante', conductor: 'Ellie', sacco: 'NTVRS' },
      { bus: 'Stormzy', driver: 'Alex', conductor: 'Renee', sacco: 'NTVRS' },
      { bus: 'Monalisa', driver: 'Dave', conductor: 'Nachi', sacco: 'NTVRS' },
      { bus: 'Spice', driver: 'Benjamin', conductor: 'JVB', sacco: 'NTVRS' },
      { bus: 'Spurs', driver: 'Martin', conductor: 'Slim', sacco: 'NTVRS' },
      { bus: 'Explicit', driver: 'John', conductor: 'Maverick', sacco: 'NTVRS' },
      { bus: 'SCrilla', driver: 'Roy', conductor: 'Drakoo', sacco: 'NTVRS' },
      
      // Expresso - Rongai Route
      { bus: 'Baba Yaga', driver: 'Allan', conductor: 'Ben', sacco: 'Expresso' },
      { bus: 'Moxie', driver: 'Jeff', conductor: 'Kim', sacco: 'Expresso' },
      { bus: 'Ferari', driver: 'Moses', conductor: 'Mwari', sacco: 'Expresso' },
      { bus: 'Detroit', driver: 'Andrew', conductor: 'Mwas', sacco: 'Expresso' },
      
      // Expresso - Kasarani Route
      { bus: 'Gamer', driver: 'Dante', conductor: 'Davi', sacco: 'Expresso' },
      { bus: 'Funka Delica', driver: 'Kibe', conductor: 'Smith', sacco: 'Expresso' },
      { bus: 'Malkia', driver: 'Abra', conductor: 'Hypr', sacco: 'Expresso' },
      { bus: 'Jabari', driver: 'Kim', conductor: 'Capi', sacco: 'Expresso' },
      
      // Embasava - Embakasi Route
      { bus: 'Brawlout', driver: 'Badder', conductor: 'Moses', sacco: 'Embasava' },
      { bus: 'MoneyFest', driver: 'Ostoo', conductor: 'Qodo', sacco: 'Embasava' },
      { bus: 'Heartless', driver: 'Huan', conductor: 'Gemmi', sacco: 'Embasava' },
      { bus: 'Matrix', driver: 'Evans', conductor: 'Kilo', sacco: 'Embasava' },
      { bus: 'Mood', driver: 'Lenny', conductor: 'Mkuu', sacco: 'Embasava' },
      { bus: 'Genesis', driver: 'Dan', conductor: 'Jade', sacco: 'Embasava' },
      { bus: 'Restoration', driver: 'Kelvin', conductor: 'Resto', sacco: 'Embasava' },
      
      // SuperMetro - Ngong Route
      { bus: 'fleet 1456', driver: 'Evans', conductor: 'John', sacco: 'Supermetro' },
      { bus: 'fleet 3743', driver: 'John', conductor: 'Kelvin', sacco: 'Supermetro' },
      { bus: 'fleet 8643', driver: 'Maina', conductor: 'Steve', sacco: 'Supermetro' },
      { bus: 'fleet 3737', driver: 'Charles', conductor: 'Ryan', sacco: 'Supermetro' },
      { bus: 'fleet 1234', driver: 'Nahbeel', conductor: 'Maina', sacco: 'Supermetro' },
      { bus: 'fleet 0001', driver: 'Kelvin', conductor: 'James', sacco: 'Supermetro' },
      
      // SuperMetro - Rongai Route
      { bus: 'fleet 19373', driver: 'James', conductor: 'Kelvin', sacco: 'Supermetro' },
      { bus: 'fleet 12349', driver: 'Steve', conductor: 'Charles', sacco: 'Supermetro' },
      { bus: 'fleet 23456', driver: 'Ryan', conductor: 'John', sacco: 'Supermetro' },
      { bus: 'fleet 32456', driver: 'Adri', conductor: 'Maina', sacco: 'Supermetro' },
      { bus: 'fleet 78902', driver: 'Soshi', conductor: 'Evans', sacco: 'Supermetro' }
    ];

    // Create drivers
    console.log('Creating drivers...');
    const driversData = teams.map((team, index) => ({
      fullName: team.driver,
      email: `${team.driver.toLowerCase()}@${team.sacco.toLowerCase()}.co.ke`,
      phone: `+254701${(index + 1).toString().padStart(6, '0')}`,
      password: defaultPassword,
      licenseNumber: `DL${(index + 1).toString().padStart(6, '0')}`,
      sacco: team.sacco,
      busIdentifier: team.bus,
      busType: 'Matatu',
      avatar: `${team.driver}.svg`,
      approved: true
    }));

    await Driver.bulkCreate(driversData);
    console.log(`${driversData.length} drivers created successfully`);

    // Create conductors
    console.log('Creating conductors...');
    const conductorsData = teams.map((team, index) => ({
      fullName: team.conductor,
      email: `${team.conductor.toLowerCase()}@${team.sacco.toLowerCase()}.co.ke`,
      phone: `+254702${(index + 1).toString().padStart(6, '0')}`,
      password: defaultPassword,
      nationalId: `${(12345000 + index + 1).toString()}`,
      sacco: team.sacco,
      busIdentifier: team.bus,
      busType: 'Matatu',
      avatar: `${team.conductor}.svg`,
      approved: true
    }));

    await Conductor.bulkCreate(conductorsData);
    console.log(`${conductorsData.length} conductors created successfully`);

    console.log('Drivers and conductors seeded successfully!');
    
  } catch (error) {
    console.error('Error seeding drivers and conductors:', error);
    throw error;
  }
};

export default seedDriversConductorsSimple;