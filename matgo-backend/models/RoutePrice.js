import db from '../config/db.js';

class RoutePrice {
  static async findAll(where = {}) {
    let query = 'SELECT * FROM RoutePrices';
    const values = [];
    const conditions = [];
    for (const key in where) {
      conditions.push(`${key} = ?`);
      values.push(where[key]);
    }
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    const [rows] = await db.query(query, values);
    return rows;
  }

  static async findOne(where = {}) {
    const results = await this.findAll(where);
    return results[0] || null;
  }
}

export default RoutePrice;
