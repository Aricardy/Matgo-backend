

import sequelize from '../config/db.js';
import User from './User.js';
import Passenger from './Passenger.js';
import Driver from './Driver.js';
import Conductor from './Conductor.js';
import Matatu from './Matatu.js';
import Trip from './Trip.js';
import Admin from './Admin.js';
import SaccoAdmin from './SaccoAdmin.js';
import Booking from './Booking.js';
import Route from './Route.js';

// Sync all models

export const syncAll = async () => {
  try {
    // First, try to authenticate to the database
    await sequelize.authenticate();
    console.log('✅ Database connection has been established successfully.');
    
    // Sync all models without force or alter to preserve data
    await sequelize.sync();
    console.log('✅ All models synced successfully');
    return true;
  } catch (error) {
    console.error('❌ Unable to sync database:', error);
    throw error; // Re-throw to be handled by the caller
  }
};

export {
  User,
  Passenger,
  Driver,
  Conductor,
  Matatu,
  Trip,
  Admin,
  SaccoAdmin,
  Booking,
  Route
};
