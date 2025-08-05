import FavoriteRoute from '../models/FavoriteRoute.js';
import Route from '../models/Route.js';
// Get favorite routes for a user
export const getFavoriteRoutes = async (req, res) => {
  try {
    const userId = req.user.id;
    const favorites = await FavoriteRoute.findAll({ where: { userId }, include: [Route] });
    res.json(favorites.map(fav => fav.Route));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch favorite routes' });
  }
};
const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
