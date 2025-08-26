
import db from '../config/db.js';

class Passenger {
  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM Passengers WHERE id = ?', [id]);
    return rows[0];
  }

  static async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM Passengers WHERE email = ?', [email]);
    return rows[0];
  }

  static async create(passengerData) {
    const {
      fullName,
      email,
      phone,
      password,
      avatar,
      approved = true
    } = passengerData;

    const [result] = await db.query(
      `INSERT INTO Passengers (
        fullName, email, phone, password, avatar, approved
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [fullName, email, phone, password, avatar, approved]
    );
    return { id: result.insertId, ...passengerData };
  }

  static async update(id, updateData) {
    const keys = Object.keys(updateData);
    const values = Object.values(updateData);
    
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const [result] = await db.query(
      `UPDATE Passengers SET ${setClause} WHERE id = ?`,
      [...values, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM Passengers WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async findAll() {
    const [rows] = await db.query('SELECT * FROM Passengers');
    return rows;
  }
}

export default Passenger;
