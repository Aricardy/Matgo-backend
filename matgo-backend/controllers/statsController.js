import Matatu from '../models/Matatu.js';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Route from '../models/Route.js';

export const getStats = async (req, res) => {
  try {
    const totalMatatus = await Matatu.count();
    const totalUsers = await User.count();
    const totalBookings = await Booking.count();
    const activeRoutes = await Route.count({ where: { active: true } });
    res.json({ totalMatatus, totalUsers, totalBookings, activeRoutes });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};
