import db from '../config/db.js';

// Matatu model with mysql2
class Matatu {
  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM Matatus WHERE id = ?', [id]);
    return rows[0];
  }

  static async findByIdentifier(identifier) {
    const [rows] = await db.query('SELECT * FROM Matatus WHERE identifier = ?', [identifier]);
    return rows[0];
  }

  static async create(matatuData) {
    const {
      sacco,
      identifier,
      name,
      type = 'Regular',
      route,
      capacity = 14,
      featured = false,
      qrCode = null,
      status = 'Active',
      amenities = '{}',
      departureSchedule = '{}',
      price
    } = matatuData;

    // Validate type
    if (!['Regular', 'Long Distance', 'Express'].includes(type)) {
      throw new Error('Invalid matatu type');
    }

    // Validate status
    if (!['Active', 'Under Maintenance', 'Out of Service'].includes(status)) {
      throw new Error('Invalid status');
    }

    const [result] = await db.query(
      `INSERT INTO Matatus (
        sacco, identifier, name, type, route, capacity, 
        featured, qrCode, status, amenities, departureSchedule, price
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        sacco, identifier, name, type, route, capacity,
        featured, qrCode, status, 
        JSON.stringify(amenities), 
        JSON.stringify(departureSchedule),
        price
      ]
    );
    return { id: result.insertId, ...matatuData };
  }

  static async update(id, updateData) {
    // Validate type if it's being updated
    if (updateData.type && !['Regular', 'Long Distance', 'Express'].includes(updateData.type)) {
      throw new Error('Invalid matatu type');
    }

    // Validate status if it's being updated
    if (updateData.status && !['Active', 'Under Maintenance', 'Out of Service'].includes(updateData.status)) {
      throw new Error('Invalid status');
    }

    // Convert objects to JSON strings
    if (updateData.amenities) {
      updateData.amenities = JSON.stringify(updateData.amenities);
    }
    if (updateData.departureSchedule) {
      updateData.departureSchedule = JSON.stringify(updateData.departureSchedule);
    }

    const keys = Object.keys(updateData);
    const values = Object.values(updateData);
    
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const [result] = await db.query(
      `UPDATE Matatus SET ${setClause} WHERE id = ?`,
      [...values, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM Matatus WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async findAll(options = {}) {
    let query = 'SELECT * FROM Matatus';
    const values = [];

    if (options.sacco) {
      query += ' WHERE sacco = ?';
      values.push(options.sacco);
    }

    if (options.featured) {
      query += values.length ? ' AND' : ' WHERE';
      query += ' featured = true';
    }

    if (options.status) {
      query += values.length ? ' AND' : ' WHERE';
      query += ' status = ?';
      values.push(options.status);
    }

    const [rows] = await db.query(query, values);
    return rows;
  }
}

export default Matatu;
