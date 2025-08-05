// ...existing imports and code...
// Only one Route model definition and one export default should exist in this file.
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Route = sequelize.define('Route', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: DataTypes.STRING,
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

export default Route;
