import db from '../config/db.js';

/**
 * Get the best fare for a route, sacco, direction, road, and time from RoutePrices table
 * @param {Object} params - { route_id, sacco_id, direction, road, time }
 * @returns {Promise<number|null>} - The best price or null if not found
 */
export async function getBestFare({ route_id, sacco_id, direction, road, time }) {
  let query = `SELECT price FROM RoutePrices WHERE route_id = ? AND start_time <= ? AND end_time >= ?`;
  const values = [route_id, time, time];
  if (sacco_id) {
    query += ' AND sacco_id = ?';
    values.push(sacco_id);
  }
  if (direction) {
    query += ' AND direction = ?';
    values.push(direction);
  }
  if (road) {
    query += ' AND road = ?';
    values.push(road);
  }
  query += ' ORDER BY price ASC LIMIT 1';
  const [rows] = await db.query(query, values);
  return rows.length > 0 ? rows[0].price : null;
}
