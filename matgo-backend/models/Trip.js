
import db from '../config/db.js';

class Trip {
  static async findById(id) {
    const [rows] = await db.query(
      `SELECT t.*, 
        u.fullName as driverName, 
        m.identifier as matatuIdentifier,
        m.sacco as matatuSacco
      FROM Trips t
      LEFT JOIN Users u ON t.driverId = u.id
      LEFT JOIN Matatus m ON t.matatuId = m.id
      WHERE t.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async create(tripData) {
    const {
      origin,
      destination,
      departureTime,
      arrivalTime,
      fare,
      driverId,
      matatuId
    } = tripData;

    const [result] = await db.query(
      `INSERT INTO Trips (
        origin, destination, departureTime, arrivalTime,
        fare, driverId, matatuId
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        origin,
        destination,
        departureTime,
        arrivalTime,
        fare,
        driverId,
        matatuId
      ]
    );
    return { id: result.insertId, ...tripData };
  }

  static async update(id, updateData) {
    const keys = Object.keys(updateData);
    const values = Object.values(updateData);
    
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const [result] = await db.query(
      `UPDATE Trips SET ${setClause} WHERE id = ?`,
      [...values, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM Trips WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async findAll(options = {}) {
    let query = `
      SELECT t.*, 
        u.fullName as driverName, 
        m.identifier as matatuIdentifier,
        m.sacco as matatuSacco
      FROM Trips t
      LEFT JOIN Users u ON t.driverId = u.id
      LEFT JOIN Matatus m ON t.matatuId = m.id
    `;
    const values = [];

    const whereConditions = [];
    
    if (options.driverId) {
      whereConditions.push('t.driverId = ?');
      values.push(options.driverId);
    }

    if (options.matatuId) {
      whereConditions.push('t.matatuId = ?');
      values.push(options.matatuId);
    }

    if (options.origin) {
      whereConditions.push('t.origin LIKE ?');
      values.push(`%${options.origin}%`);
    }

    if (options.destination) {
      whereConditions.push('t.destination LIKE ?');
      values.push(`%${options.destination}%`);
    }

    if (options.date) {
      whereConditions.push('DATE(t.departureTime) = DATE(?)');
      values.push(options.date);
    }

    if (whereConditions.length > 0) {
      query += ' WHERE ' + whereConditions.join(' AND ');
    }

    query += ' ORDER BY t.departureTime ASC';

    const [rows] = await db.query(query, values);
    return rows;
  }

  static async findByDriver(driverId) {
    return this.findAll({ driverId });
  }

  static async findByMatatu(matatuId) {
    return this.findAll({ matatuId });
  }
}

export default Trip;
