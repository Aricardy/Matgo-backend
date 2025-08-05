
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';
import Matatu from './Matatu.js';


const Trip = sequelize.define('Trip', {
  origin: { type: DataTypes.STRING, allowNull: false },
  destination: { type: DataTypes.STRING, allowNull: false },
  departureTime: { type: DataTypes.DATE, allowNull: false },
  arrivalTime: { type: DataTypes.DATE },
  fare: { type: DataTypes.FLOAT, allowNull: false }
});


User.hasMany(Trip, { foreignKey: 'driverId' });
Trip.belongsTo(User, { foreignKey: 'driverId' });

Matatu.hasMany(Trip, { foreignKey: 'matatuId' });
Trip.belongsTo(Matatu, { foreignKey: 'matatuId' });

export default Trip;
