import { Op } from 'sequelize';
import { RoutePrice } from '../models/index.js';

// Get all route prices (optionally filter by route, sacco, direction, road, time)
export const getRoutePrices = async (req, res) => {
  try {
    const { route_id, sacco_id, direction, road, time } = req.query;
    const where = {};
    if (route_id) where.route_id = route_id;
    if (sacco_id) where.sacco_id = sacco_id;
    if (direction) where.direction = direction;
    if (road) where.road = road;
    if (time) {
      // Find prices where the given time is between start_time and end_time
      where.start_time = { [Op.lte]: time };
      where.end_time = { [Op.gte]: time };
    }
    const prices = await RoutePrice.findAll({ where });
    res.json(prices);
  } catch (error) {
    console.error('Error fetching route prices:', error);
    res.status(500).json({ error: 'Failed to fetch route prices' });
  }
};

// Get best price for a given route, sacco, direction, road, and time
export const getBestRoutePrice = async (req, res) => {
  try {
    const { route_id, sacco_id, direction, road, time } = req.query;
    if (!route_id || !time) {
      return res.status(400).json({ error: 'route_id and time are required' });
    }
    const where = { route_id };
    if (sacco_id) where.sacco_id = sacco_id;
    if (direction) where.direction = direction;
    if (road) where.road = road;
    where.start_time = { [Op.lte]: time };
    where.end_time = { [Op.gte]: time };
    const price = await RoutePrice.findOne({ where, order: [['price', 'ASC']] });
    if (!price) return res.status(404).json({ error: 'No price found for given criteria' });
    res.json(price);
  } catch (error) {
    console.error('Error fetching best route price:', error);
    res.status(500).json({ error: 'Failed to fetch best route price' });
  }
};
