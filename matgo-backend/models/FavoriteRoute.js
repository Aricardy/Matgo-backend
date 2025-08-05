import { DataTypes } from 'sequelize';
import sequelize from './index.js';
import Route from './Route.js';
import User from './User.js';

const FavoriteRoute = sequelize.define('FavoriteRoute', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: User, key: 'id' },
  },
  routeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Route, key: 'id' },
  },
});

FavoriteRoute.belongsTo(User, { foreignKey: 'userId' });
FavoriteRoute.belongsTo(Route, { foreignKey: 'routeId' });

export default FavoriteRoute;
