
import db from '../config/db.js';

// User model with mysql2
class User {
  static async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM Users WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(userData) {
    const { fullName, email, phone, role, password, avatar } = userData;
    const [result] = await db.query(
      'INSERT INTO Users (fullName, email, phone, role, password, avatar, approved) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [fullName, email, phone, role, password, avatar || null, false]
    );
    return { id: result.insertId, ...userData };
  }

  static async update(id, updateData) {
    const keys = Object.keys(updateData);
    const values = Object.values(updateData);
    
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const [result] = await db.query(
      `UPDATE Users SET ${setClause} WHERE id = ?`,
      [...values, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM Users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async findAll() {
    const [rows] = await db.query('SELECT * FROM Users');
    return rows;
  }
}

export default User;
