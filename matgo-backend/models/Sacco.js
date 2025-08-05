import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Sacco = sequelize.define('Sacco', {
  name: DataTypes.STRING,
});

export default Sacco;
