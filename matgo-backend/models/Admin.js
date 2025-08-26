
import db from '../config/db.js';

class Admin {
  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM Admins WHERE id = ?', [id]);
    return rows[0];
  }

  static async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM Admins WHERE email = ?', [email]);
    return rows[0];
  }

  static async create(adminData) {
    const {
      fullName,
      email,
      password
    } = adminData;

    const [result] = await db.query(
      `INSERT INTO Admins (
        fullName, email, password
      ) VALUES (?, ?, ?)`,
      [fullName, email, password]
    );
    return { id: result.insertId, ...adminData };
  }

  static async update(id, updateData) {
    const keys = Object.keys(updateData);
    const values = Object.values(updateData);
    
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const [result] = await db.query(
      `UPDATE Admins SET ${setClause} WHERE id = ?`,
      [...values, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM Admins WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async findAll() {
    const [rows] = await db.query('SELECT * FROM Admins');
    return rows;
  }

  static async changePassword(id, newPassword) {
    return this.update(id, { password: newPassword });
  }
}

export default Admin;
