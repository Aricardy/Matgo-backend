
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';


const Booking = sequelize.define('Booking', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  passengerId: { type: DataTypes.INTEGER, allowNull: true },
  tripId: { type: DataTypes.INTEGER, allowNull: true },
  route: { type: DataTypes.STRING, allowNull: true },
  date: { type: DataTypes.STRING, allowNull: true },
  time: { type: DataTypes.STRING, allowNull: true },
  seats: { type: DataTypes.JSON, allowNull: true },
  totalPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
  passengers: { type: DataTypes.JSON, allowNull: true },
  paymentMethod: { type: DataTypes.STRING, allowNull: true },
  sacco: { type: DataTypes.STRING, allowNull: true },
  tripType: { type: DataTypes.STRING, allowNull: true },
  seatsBooked: { type: DataTypes.INTEGER, defaultValue: 1 },
  paid: { type: DataTypes.BOOLEAN, defaultValue: false },
  status: { type: DataTypes.STRING, defaultValue: 'pending' }
});

export default Booking;
