// ...existing imports and code...
// Only one Matatu model definition and one export default should exist in this file.

import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';


const Matatu = sequelize.define('Matatu', {
  sacco: { type: DataTypes.STRING, allowNull: false },
  identifier: { type: DataTypes.STRING, allowNull: false },
  busType: { type: DataTypes.STRING, allowNull: false },
  route: { type: DataTypes.STRING },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

export default Matatu;
