
import db from '../config/db.js';

class SaccoAdmin {
  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM SaccoAdmins WHERE id = ?', [id]);
    return rows[0];
  }

  static async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM SaccoAdmins WHERE email = ?', [email]);
    return rows[0];
  }

  static async findBySacco(saccoName) {
    const [rows] = await db.query('SELECT * FROM SaccoAdmins WHERE saccoName = ?', [saccoName]);
    return rows[0];
  }

  static async create(adminData) {
    const {
      saccoName,
      fullName,
      email,
      phone,
      password,
      routes = '[]',
      approved = true,
      avatar
    } = adminData;

    const [result] = await db.query(
      `INSERT INTO SaccoAdmins (
        saccoName, fullName, email, phone,
        password, routes, approved, avatar
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        saccoName,
        fullName,
        email,
        phone,
        password,
        typeof routes === 'string' ? routes : JSON.stringify(routes),
        approved,
        avatar
      ]
    );
    return { id: result.insertId, ...adminData };
  }

  static async update(id, updateData) {
    // Handle routes if it's an object
    if (updateData.routes && typeof updateData.routes !== 'string') {
      updateData.routes = JSON.stringify(updateData.routes);
    }

    const keys = Object.keys(updateData);
    const values = Object.values(updateData);
    
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const [result] = await db.query(
      `UPDATE SaccoAdmins SET ${setClause} WHERE id = ?`,
      [...values, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM SaccoAdmins WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async findAll(options = {}) {
    let query = 'SELECT * FROM SaccoAdmins';
    const values = [];
    const whereConditions = [];

    if (options.approved !== undefined) {
      whereConditions.push('approved = ?');
      values.push(options.approved);
    }

    if (options.saccoName) {
      whereConditions.push('saccoName = ?');
      values.push(options.saccoName);
    }

    if (whereConditions.length > 0) {
      query += ' WHERE ' + whereConditions.join(' AND ');
    }

    const [rows] = await db.query(query, values);
    return rows;
  }

  static async updateRoutes(id, routes) {
    return this.update(id, { 
      routes: typeof routes === 'string' ? routes : JSON.stringify(routes) 
    });
  }
}

export default SaccoAdmin;
