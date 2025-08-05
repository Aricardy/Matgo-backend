import sequelize from '../config/db.js';

const seedPricing = async () => {
  try {
    console.log('Seeding pricing information...');

    // Create Pricing table if it doesn't exist
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS Pricing (
        id INT AUTO_INCREMENT PRIMARY KEY,
        route VARCHAR(255) NOT NULL,
        sacco VARCHAR(255) NOT NULL,
        fromLocation VARCHAR(255) NOT NULL,
        toLocation VARCHAR(255) NOT NULL,
        timeStart TIME,
        timeEnd TIME,
        price DECIMAL(10,2) NOT NULL,
        specialConditions TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);


    // Ngong Route Pricing - NTVRS
    const ntvrsNgongPricing = [
      // Ngong to Town (Agro House)
      { route: 'Ngong Route (111)', sacco: 'NTVRS', fromLocation: 'Ngong', toLocation: 'Town (Agro House)', timeStart: '04:00:00', timeEnd: '11:00:00', price: 100.00, specialConditions: 'Via Ngong Road' },
      { route: 'Ngong Route (111)', sacco: 'NTVRS', fromLocation: 'Ngong', toLocation: 'Town (Agro House)', timeStart: '11:01:00', timeEnd: '16:00:00', price: 70.00, specialConditions: 'Via Ngong Road' },
      { route: 'Ngong Route (111)', sacco: 'NTVRS', fromLocation: 'Ngong', toLocation: 'Town (Agro House)', timeStart: '23:00:00', timeEnd: '03:59:00', price: 0.00, specialConditions: 'No NTVRS service during this time' },
      
      // Town to Ngong - NTVRS
      { route: 'Ngong Route (111)', sacco: 'NTVRS', fromLocation: 'Town', toLocation: 'Ngong', timeStart: '04:00:00', timeEnd: '08:00:00', price: 100.00, specialConditions: 'Via Ngong Road' },
      { route: 'Ngong Route (111)', sacco: 'NTVRS', fromLocation: 'Town', toLocation: 'Ngong', timeStart: '08:01:00', timeEnd: '12:00:00', price: 80.00, specialConditions: 'Via Ngong Road' },
      { route: 'Ngong Route (111)', sacco: 'NTVRS', fromLocation: 'Town', toLocation: 'Ngong', timeStart: '13:00:00', timeEnd: '23:00:00', price: 100.00, specialConditions: 'Via Ngong Road' },
      { route: 'Ngong Route (111)', sacco: 'NTVRS', fromLocation: 'Town', toLocation: 'Ngong', timeStart: '12:00:00', timeEnd: '20:00:00', price: 150.00, specialConditions: 'Via Southern Bypass' },
      
      // Other Ngong destinations - NTVRS
      { route: 'Ngong Route (111)', sacco: 'NTVRS', fromLocation: 'Ngong', toLocation: 'Karen', timeStart: '00:00:00', timeEnd: '23:59:59', price: 50.00, specialConditions: 'Any road' },
      { route: 'Ngong Route (111)', sacco: 'NTVRS', fromLocation: 'Town', toLocation: 'Karen', timeStart: '00:00:00', timeEnd: '23:59:59', price: 50.00, specialConditions: 'Any road' },
      { route: 'Ngong Route (111)', sacco: 'NTVRS', fromLocation: 'Ngong', toLocation: 'Junction Mall', timeStart: '00:00:00', timeEnd: '23:59:59', price: 70.00, specialConditions: 'Any road' },
      { route: 'Ngong Route (111)', sacco: 'NTVRS', fromLocation: 'Town', toLocation: 'Junction Mall', timeStart: '00:00:00', timeEnd: '23:59:59', price: 50.00, specialConditions: 'Southern bypass does not apply' }
    ];

    // Ngong Route Pricing - SuperMetro
    const supermetroNgongPricing = [
      // Ngong to CBD Archives
      { route: 'Ngong Route (111)', sacco: 'SuperMetro', fromLocation: 'Ngong', toLocation: 'CBD Archives', timeStart: '04:00:00', timeEnd: '23:00:00', price: 100.00, specialConditions: 'Via Ngong Road' },
      { route: 'Ngong Route (111)', sacco: 'SuperMetro', fromLocation: 'Ngong', toLocation: 'CBD Archives', timeStart: '16:01:00', timeEnd: '19:30:00', price: 50.00, specialConditions: 'Via Ngong Road' },
      { route: 'Ngong Route (111)', sacco: 'SuperMetro', fromLocation: 'Ngong', toLocation: 'CBD Archives', timeStart: '19:30:00', timeEnd: '23:00:00', price: 100.00, specialConditions: 'Via Ngong Road' },
      
      // Town to Ngong - SuperMetro
      { route: 'Ngong Route (111)', sacco: 'SuperMetro', fromLocation: 'Town', toLocation: 'Ngong', timeStart: '04:00:00', timeEnd: '12:00:00', price: 100.00, specialConditions: 'Via Ngong Road' },
      { route: 'Ngong Route (111)', sacco: 'SuperMetro', fromLocation: 'Town', toLocation: 'Ngong', timeStart: '12:00:00', timeEnd: '17:00:00', price: 80.00, specialConditions: 'Via Ngong Road' },
      { route: 'Ngong Route (111)', sacco: 'SuperMetro', fromLocation: 'Town', toLocation: 'Ngong', timeStart: '17:00:00', timeEnd: '00:00:00', price: 100.00, specialConditions: 'Via Ngong Road' },
      
      // Other destinations - SuperMetro
      { route: 'Ngong Route (111)', sacco: 'SuperMetro', fromLocation: 'Ngong', toLocation: 'Karen', timeStart: '00:00:00', timeEnd: '23:59:59', price: 50.00, specialConditions: 'Any road' },
      { route: 'Ngong Route (111)', sacco: 'SuperMetro', fromLocation: 'Town', toLocation: 'Karen', timeStart: '00:00:00', timeEnd: '23:59:59', price: 50.00, specialConditions: 'Any road' },
      { route: 'Ngong Route (111)', sacco: 'SuperMetro', fromLocation: 'Ngong', toLocation: 'Junction Mall', timeStart: '00:00:00', timeEnd: '23:59:59', price: 70.00, specialConditions: 'Any road' },
      { route: 'Ngong Route (111)', sacco: 'SuperMetro', fromLocation: 'Town', toLocation: 'Junction Mall', timeStart: '00:00:00', timeEnd: '23:59:59', price: 50.00, specialConditions: 'Southern bypass does not apply' }
    ];

    // Rongai Route Pricing
    const rongaiPricing = [
      // Expresso - Rongai
      { route: 'Rongai Route (125)', sacco: 'Expresso', fromLocation: 'Rongai', toLocation: 'Town', timeStart: '00:00:00', timeEnd: '23:59:59', price: 100.00, specialConditions: 'Standard fare' },
      { route: 'Rongai Route (125)', sacco: 'Expresso', fromLocation: 'Town', toLocation: 'Rongai', timeStart: '00:00:00', timeEnd: '23:59:59', price: 100.00, specialConditions: 'Standard fare' },
      { route: 'Rongai Route (125)', sacco: 'Expresso', fromLocation: 'Rongai', toLocation: 'Town', timeStart: '14:00:00', timeEnd: '18:00:00', price: 150.00, specialConditions: 'Via Southern Bypass' },
      { route: 'Rongai Route (125)', sacco: 'Expresso', fromLocation: 'Town', toLocation: 'Rongai', timeStart: '14:00:00', timeEnd: '18:00:00', price: 150.00, specialConditions: 'Via Southern Bypass' },
      { route: 'Rongai Route (125)', sacco: 'Expresso', fromLocation: 'Rongai', toLocation: 'Karen', timeStart: '00:00:00', timeEnd: '23:59:59', price: 50.00, specialConditions: 'Standard fare' },
      { route: 'Rongai Route (125)', sacco: 'Expresso', fromLocation: 'Rongai', toLocation: 'Langata', timeStart: '00:00:00', timeEnd: '23:59:59', price: 50.00, specialConditions: 'Standard fare' },
      { route: 'Rongai Route (125)', sacco: 'Expresso', fromLocation: 'Town', toLocation: 'Karen', timeStart: '00:00:00', timeEnd: '23:59:59', price: 50.00, specialConditions: 'Southern bypass applies' },
      { route: 'Rongai Route (125)', sacco: 'Expresso', fromLocation: 'Town', toLocation: 'Langata', timeStart: '00:00:00', timeEnd: '23:59:59', price: 50.00, specialConditions: 'Southern bypass applies' },
      
      // SuperMetro - Rongai
      { route: 'Rongai Route (125)', sacco: 'SuperMetro', fromLocation: 'Rongai', toLocation: 'Town', timeStart: '00:00:00', timeEnd: '23:59:59', price: 100.00, specialConditions: 'Standard fare' },
      { route: 'Rongai Route (125)', sacco: 'SuperMetro', fromLocation: 'Town', toLocation: 'Rongai', timeStart: '00:00:00', timeEnd: '23:59:59', price: 100.00, specialConditions: 'Standard fare' },
      { route: 'Rongai Route (125)', sacco: 'SuperMetro', fromLocation: 'Rongai', toLocation: 'Karen', timeStart: '00:00:00', timeEnd: '23:59:59', price: 50.00, specialConditions: 'Standard fare' },
      { route: 'Rongai Route (125)', sacco: 'SuperMetro', fromLocation: 'Rongai', toLocation: 'Langata', timeStart: '00:00:00', timeEnd: '23:59:59', price: 50.00, specialConditions: 'Standard fare' },
      { route: 'Rongai Route (125)', sacco: 'SuperMetro', fromLocation: 'Town', toLocation: 'Karen', timeStart: '00:00:00', timeEnd: '23:59:59', price: 50.00, specialConditions: 'Standard fare' },
      { route: 'Rongai Route (125)', sacco: 'SuperMetro', fromLocation: 'Town', toLocation: 'Langata', timeStart: '00:00:00', timeEnd: '23:59:59', price: 50.00, specialConditions: 'Standard fare' }
    ];

    // Kasarani Route Pricing
    const kasaraniPricing = [
      { route: 'Kasarani Route (17b)', sacco: 'Expresso', fromLocation: 'Kasarani', toLocation: 'Town', timeStart: '00:00:00', timeEnd: '23:59:59', price: 60.00, specialConditions: 'All stages' },
      { route: 'Kasarani Route (17b)', sacco: 'Expresso', fromLocation: 'Town', toLocation: 'Kasarani', timeStart: '00:00:00', timeEnd: '23:59:59', price: 60.00, specialConditions: 'All stages' },
      { route: 'Kasarani Route (17b)', sacco: 'Expresso', fromLocation: 'Kasarani', toLocation: 'Thika Road Mall', timeStart: '00:00:00', timeEnd: '23:59:59', price: 60.00, specialConditions: 'All stages' },
      { route: 'Kasarani Route (17b)', sacco: 'Expresso', fromLocation: 'Town', toLocation: 'Thika Road Mall', timeStart: '00:00:00', timeEnd: '23:59:59', price: 60.00, specialConditions: 'All stages' }
    ];

    // Embakasi Route Pricing
    const embakasiPricing = [
      { route: 'Embakasi Route', sacco: 'Embasava', fromLocation: 'Embakasi', toLocation: 'Town', timeStart: '00:00:00', timeEnd: '23:59:59', price: 100.00, specialConditions: 'All stages' },
      { route: 'Embakasi Route', sacco: 'Embasava', fromLocation: 'Town', toLocation: 'Embakasi', timeStart: '00:00:00', timeEnd: '23:59:59', price: 100.00, specialConditions: 'All stages' },
      { route: 'Embakasi Route', sacco: 'Embasava', fromLocation: 'Embakasi', toLocation: 'Airport', timeStart: '00:00:00', timeEnd: '23:59:59', price: 100.00, specialConditions: 'All stages' },
      { route: 'Embakasi Route', sacco: 'Embasava', fromLocation: 'Town', toLocation: 'Airport', timeStart: '00:00:00', timeEnd: '23:59:59', price: 100.00, specialConditions: 'All stages' }
    ];

    // Combine all pricing data
    const allPricing = [
      ...ntvrsNgongPricing,
      ...supermetroNgongPricing,
      ...rongaiPricing,
      ...kasaraniPricing,
      ...embakasiPricing
    ];

    // Insert pricing data
    for (const pricing of allPricing) {
      await sequelize.query(`
        INSERT INTO Pricing (route, sacco, fromLocation, toLocation, timeStart, timeEnd, price, specialConditions)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, {
        replacements: [
          pricing.route,
          pricing.sacco,
          pricing.fromLocation,
          pricing.toLocation,
          pricing.timeStart,
          pricing.timeEnd,
          pricing.price,
          pricing.specialConditions
        ]
      });
    }

    console.log(`Pricing information seeded successfully! Added ${allPricing.length} pricing records.`);
    
  } catch (error) {
    console.error('Error seeding pricing information:', error);
    throw error;
  }
};

export default seedPricing;