import { Conductor } from '../models/index.js';
import bcrypt from 'bcrypt';

const addAllConductors = async () => {
  try {
    console.log('Starting conductor seeding process...');
    
    const defaultPassword = await bcrypt.hash('Conductor@123', 10);
    
    // Complete list of all 38 conductors from the original data
    const allConductors = [
      // NTVRS - Ngong Route (12 conductors)
      { bus: 'X-Rated', conductor: 'Theo', sacco: 'NTVRS' },
      { bus: 'Phenomenal', conductor: 'Deni', sacco: 'NTVRS' },
      { bus: 'CyberPunk', conductor: 'Ivor', sacco: 'NTVRS' },
      { bus: 'Harukaze', conductor: 'Matt', sacco: 'NTVRS' },
      { bus: 'Ikigai', conductor: 'Tman', sacco: 'NTVRS' },
      { bus: 'Mellows', conductor: 'Ellie', sacco: 'NTVRS' },
      { bus: 'Stormzy', conductor: 'Renee', sacco: 'NTVRS' },
      { bus: 'Monalisa', conductor: 'Nachi', sacco: 'NTVRS' },
      { bus: 'Spice', conductor: 'JVB', sacco: 'NTVRS' },
      { bus: 'Spurs', conductor: 'Slim', sacco: 'NTVRS' },
      { bus: 'Explicit', conductor: 'Maverick', sacco: 'NTVRS' },
      { bus: 'SCrilla', conductor: 'Drakoo', sacco: 'NTVRS' },
      
      // Expresso - Rongai Route (4 conductors)
      { bus: 'Baba Yaga', conductor: 'Ben', sacco: 'Expresso' },
      { bus: 'Moxie', conductor: 'Kim', sacco: 'Expresso' },
      { bus: 'Ferari', conductor: 'Mwari', sacco: 'Expresso' },
      { bus: 'Detroit', conductor: 'Mwas', sacco: 'Expresso' },
      
      // Expresso - Kasarani Route (4 conductors)
      { bus: 'Gamer', conductor: 'Davi', sacco: 'Expresso' },
      { bus: 'Funka Delica', conductor: 'Smith', sacco: 'Expresso' },
      { bus: 'Malkia', conductor: 'Hypr', sacco: 'Expresso' },
      { bus: 'Jabari', conductor: 'Capi', sacco: 'Expresso' },
      
      // Embasava - Embakasi Route (7 conductors)
      { bus: 'Brawlout', conductor: 'Moses', sacco: 'Embasava' },
      { bus: 'MoneyFest', conductor: 'Qodo', sacco: 'Embasava' },
      { bus: 'Heartless', conductor: 'Gemmi', sacco: 'Embasava' },
      { bus: 'Matrix', conductor: 'Kilo', sacco: 'Embasava' },
      { bus: 'Mood', conductor: 'Mkuu', sacco: 'Embasava' },
      { bus: 'Genesis', conductor: 'Jade', sacco: 'Embasava' },
      { bus: 'Restoration', conductor: 'Resto', sacco: 'Embasava' },
      
      // SuperMetro - Ngong Route (6 conductors)
      { bus: 'fleet 1456', conductor: 'John', sacco: 'Supermetro' },
      { bus: 'fleet 3743', conductor: 'Kelvin', sacco: 'Supermetro' },
      { bus: 'fleet 8643', conductor: 'Steve', sacco: 'Supermetro' },
      { bus: 'fleet 3737', conductor: 'Ryan', sacco: 'Supermetro' },
      { bus: 'fleet 1234', conductor: 'Maina', sacco: 'Supermetro' },
      { bus: 'fleet 0001', conductor: 'James', sacco: 'Supermetro' },
      
      // SuperMetro - Rongai Route (5 conductors)
      { bus: 'fleet 19373', conductor: 'KelvinR', sacco: 'Supermetro' },
      { bus: 'fleet 12349', conductor: 'Charles', sacco: 'Supermetro' },
      { bus: 'fleet 23456', conductor: 'JohnR', sacco: 'Supermetro' },
      { bus: 'fleet 32456', conductor: 'MainaR', sacco: 'Supermetro' },
      { bus: 'fleet 78902', conductor: 'Evans', sacco: 'Supermetro' }
    ];

    console.log(`Total conductors to add: ${allConductors.length}`);
    
    // Prepare conductor data with proper formatting
    const conductorsData = allConductors.map((team, index) => {
      // Handle duplicate names by adding suffix for SuperMetro Rongai route
      let email = `${team.conductor.toLowerCase()}@${team.sacco.toLowerCase()}.co.ke`;
      
      // Fix email conflicts for duplicate names
      if (team.conductor.includes('R')) {
        email = `${team.conductor.toLowerCase()}@${team.sacco.toLowerCase()}.co.ke`;
      }
      
      return {
        fullName: team.conductor.replace('R', ''), // Remove R suffix from display name
        email: email,
        phone: `+254702${(index + 1).toString().padStart(6, '0')}`,
        password: defaultPassword,
        nationalId: `${(12345000 + index + 1).toString()}`,
        sacco: team.sacco,
        busIdentifier: team.bus,
        busType: 'Matatu',
        avatar: `${team.conductor.replace('R', '')}.svg`,
        approved: true
      };
    });

    // Insert all conductors in one batch
    const result = await Conductor.bulkCreate(conductorsData, {
      validate: true,
      ignoreDuplicates: false
    });

    console.log(`Successfully added ${result.length} conductors to the database`);
    
    // Verify the count
    const count = await Conductor.count();
    console.log(`Total conductors in database: ${count}`);
    
    if (count === 38) {
      console.log('✅ All 38 conductors have been successfully added!');
    } else {
      console.log(`⚠️  Expected 38 conductors but found ${count}`);
    }
    
    return result;
  } catch (error) {
    console.error('Error adding conductors:', error.message);
    if (error.errors) {
      error.errors.forEach(err => {
        console.error(`Validation error: ${err.message} for field: ${err.path}`);
      });
    }
    throw error;
  }
};

export default addAllConductors;