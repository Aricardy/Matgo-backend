
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';


const Passenger = sequelize.define('Passenger', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  fullName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  avatar: { type: DataTypes.STRING },
  approved: { type: DataTypes.BOOLEAN, defaultValue: true }
});

export default Passenger;
