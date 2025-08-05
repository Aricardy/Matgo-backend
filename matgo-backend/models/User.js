
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';


const User = sequelize.define('User', {
  fullName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  role: {
    type: DataTypes.ENUM('passenger', 'driver', 'conductor', 'sacco_admin', 'system_admin'),
    allowNull: false
  },
  avatar: { type: DataTypes.STRING },
  password: { type: DataTypes.STRING, allowNull: false },
  approved: { type: DataTypes.BOOLEAN, defaultValue: false }
});

export default User;
