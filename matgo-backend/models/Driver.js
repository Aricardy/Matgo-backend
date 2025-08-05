// ...existing imports and code...
// Only one Driver model definition and one export default should exist in this file.

import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';


const Driver = sequelize.define('Driver', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  fullName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  licenseNumber: { type: DataTypes.STRING, allowNull: false },
  sacco: { type: DataTypes.STRING, allowNull: false },
  busIdentifier: { type: DataTypes.STRING, allowNull: false },
  busType: { type: DataTypes.STRING, defaultValue: 'Matatu' },
  avatar: { type: DataTypes.STRING },
  busPic: { type: DataTypes.STRING },
  licenseDoc: { type: DataTypes.STRING },
  approved: { type: DataTypes.BOOLEAN, defaultValue: true }
});

export default Driver;
