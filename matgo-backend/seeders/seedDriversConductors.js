import { User, Driver, Conductor } from '../models/index.js';
import bcrypt from 'bcrypt';

const seedDriversConductors = async () => {
  try {
    console.log('Seeding drivers and conductors...');

    // Hash password function
    const hashPassword = async (password) => {
      return await bcrypt.hash(password, 10);
    };

    // Default password for all drivers and conductors
    const defaultPassword = await hashPassword('Driver@123');

    // NTVRS - Ngong Route drivers and conductors
    const ntvrsTeams = [
      { bus: 'X-Rated', driver: 'Ochila', conductor: 'Theo' },
      { bus: 'Phenomenal', driver: 'Dan', conductor: 'Deni' },
      { bus: 'CyberPunk', driver: 'Steven', conductor: 'Ivor' },
      { bus: 'Harukaze', driver: 'Brian', conductor: 'Matt' },
      { bus: 'Ikigai', driver: 'Otieno', conductor: 'Tman' },
      { bus: 'Mellows', driver: 'Dante', conductor: 'Ellie' },
      { bus: 'Stormzy', driver: 'Alex', conductor: 'Renee' },
      { bus: 'Monalisa', driver: 'Dave', conductor: 'Nachi' },
      { bus: 'Spice', driver: 'Benjamin', conductor: 'JVB' },
      { bus: 'Spurs', driver: 'Martin', conductor: 'Slim' },
      { bus: 'Explicit', driver: 'John', conductor: 'Maverick' },
      { bus: 'SCrilla', driver: 'Roy', conductor: 'Drakoo' }
    ];

    // Expresso - Rongai Route teams
    const expressoRongaiTeams = [
      { bus: 'Baba Yaga', driver: 'Allan', conductor: 'Ben' },
      { bus: 'Moxie', driver: 'Jeff', conductor: 'Kim' },
      { bus: 'Ferari', driver: 'Moses', conductor: 'Mwari' },
      { bus: 'Detroit', driver: 'Andrew', conductor: 'Mwas' }
    ];

    // Expresso - Kasarani Route teams
    const expressoKasaraniTeams = [
      { bus: 'Gamer', driver: 'Dante', conductor: 'Davi' },
      { bus: 'Funka Delica', driver: 'Kibe', conductor: 'Smith' },
      { bus: 'Malkia', driver: 'Abra', conductor: 'Hypr' },
      { bus: 'Jabari', driver: 'Kim', conductor: 'Capi' }
    ];

    // Embasava - Embakasi Route teams
    const embasavaTeams = [
      { bus: 'Brawlout', driver: 'Badder', conductor: 'Moses' },
      { bus: 'MoneyFest', driver: 'Ostoo', conductor: 'Qodo' },
      { bus: 'Heartless', driver: 'Huan', conductor: 'Gemmi' },
      { bus: 'Matrix', driver: 'Evans', conductor: 'Kilo' },
      { bus: 'Mood', driver: 'Lenny', conductor: 'Mkuu' },
      { bus: 'Genesis', driver: 'Dan', conductor: 'Jade' },
      { bus: 'Restoration', driver: 'Kelvin', conductor: 'Resto' }
    ];

    // SuperMetro - Ngong Route teams
    const supermetroNgongTeams = [
      { bus: 'fleet 1456', driver: 'Evans', conductor: 'John' },
      { bus: 'fleet 3743', driver: 'John', conductor: 'Kelvin' },
      { bus: 'fleet 8643', driver: 'Maina', conductor: 'Steve' },
      { bus: 'fleet 3737', driver: 'Charles', conductor: 'Ryan' },
      { bus: 'fleet 1234', driver: 'Nahbeel', conductor: 'Maina' },
      { bus: 'fleet 0001', driver: 'Kelvin', conductor: 'James' }
    ];

    // SuperMetro - Rongai Route teams
    const supermetroRongaiTeams = [
      { bus: 'fleet 19373', driver: 'James', conductor: 'Kelvin' },
      { bus: 'fleet 12349', driver: 'Steve', conductor: 'Charles' },
      { bus: 'fleet 23456', driver: 'Ryan', conductor: 'John' },
      { bus: 'fleet 32456', driver: 'Adri', conductor: 'Maina' },
      { bus: 'fleet 78902', driver: 'Soshi', conductor: 'Evans' }
    ];

    // Function to create driver and conductor for a team
    const createTeam = async (team, sacco, route) => {
      // Create driver user
      const driverUser = await User.create({
        username: `${team.driver.toLowerCase()}_${team.bus.toLowerCase().replace(/\s+/g, '_')}`,
        fullName: team.driver,
        email: `${team.driver.toLowerCase()}@${sacco.toLowerCase()}.co.ke`,
        phone: `+2547${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
        role: 'driver',
        avatar: `${team.driver}.jpg`,
        password: defaultPassword,
        approved: true
      });

      // Create conductor user
      const conductorUser = await User.create({
        username: `${team.conductor.toLowerCase()}_${team.bus.toLowerCase().replace(/\s+/g, '_')}`,
        fullName: team.conductor,
        email: `${team.conductor.toLowerCase()}@${sacco.toLowerCase()}.co.ke`,
        phone: `+2547${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
        role: 'conductor',
        avatar: `${team.conductor}.jpg`,
        password: defaultPassword,
        approved: true
      });

      // Create driver record
      await Driver.create({
        fullName: team.driver,
        licenseNumber: `DL${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
        phone: driverUser.phone,
        email: driverUser.email,
        password: defaultPassword,
        sacco: sacco,
        busIdentifier: team.bus,
        busType: 'Matatu',
        avatar: `${team.driver}.svg`,
        busPic: `${team.bus}.jpg`,
        licenseDoc: `${team.driver}_license.jpg`
      });

      // Create conductor record
      await Conductor.create({
        fullName: team.conductor,
        nationalId: `${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
        phone: conductorUser.phone,
        email: conductorUser.email,
        password: defaultPassword,
        sacco: sacco,
        busIdentifier: team.bus,
        busType: 'Matatu',
        avatar: `${team.conductor}.svg`,
        busPic: `${team.bus}.jpg`,
        nationalIdImage: `${team.conductor}_id.jpg`
      });
    };

    // Create all teams
    console.log('Creating NTVRS teams...');
    for (const team of ntvrsTeams) {
      await createTeam(team, 'NTVRS', 'Ngong Route (111)');
    }

    console.log('Creating Expresso Rongai teams...');
    for (const team of expressoRongaiTeams) {
      await createTeam(team, 'Expresso', 'Rongai Route (125)');
    }

    console.log('Creating Expresso Kasarani teams...');
    for (const team of expressoKasaraniTeams) {
      await createTeam(team, 'Expresso', 'Kasarani Route (17b)');
    }

    console.log('Creating Embasava teams...');
    for (const team of embasavaTeams) {
      await createTeam(team, 'Embasava', 'Embakasi Route');
    }

    console.log('Creating SuperMetro Ngong teams...');
    for (const team of supermetroNgongTeams) {
      await createTeam(team, 'SuperMetro', 'Ngong Route (111)');
    }

    console.log('Creating SuperMetro Rongai teams...');
    for (const team of supermetroRongaiTeams) {
      await createTeam(team, 'SuperMetro', 'Rongai Route (125)');
    }

    console.log('Drivers and conductors seeded successfully!');
    
  } catch (error) {
    console.error('Error seeding drivers and conductors:', error);
    throw error;
  }
};

export default seedDriversConductors;