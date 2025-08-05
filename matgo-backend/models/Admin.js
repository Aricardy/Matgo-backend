
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';


const Admin = sequelize.define('Admin', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  fullName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING }
});

export default Admin;
