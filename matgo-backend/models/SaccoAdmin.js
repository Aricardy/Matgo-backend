
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';


const SaccoAdmin = sequelize.define('SaccoAdmin', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  saccoName: { type: DataTypes.STRING, allowNull: false },
  fullName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  routes: { type: DataTypes.TEXT }, // JSON string of operated routes
  approved: { type: DataTypes.BOOLEAN, defaultValue: true },
  avatar: { type: DataTypes.STRING }
});

export default SaccoAdmin;
