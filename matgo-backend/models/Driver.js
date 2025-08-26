import db from '../config/db.js';

class Driver {
  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM Drivers WHERE id = ?', [id]);
    return rows[0];
  }

  static async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM Drivers WHERE email = ?', [email]);
    return rows[0];
  }

  static async findByLicense(licenseNumber) {
    const [rows] = await db.query('SELECT * FROM Drivers WHERE licenseNumber = ?', [licenseNumber]);
    return rows[0];
  }

  static async create(driverData) {
    const {
      fullName,
      email,
      phone,
      password,
      licenseNumber,
      sacco,
      busIdentifier,
      busType = 'Matatu',
      avatar,
      busPic,
      licenseDoc,
      approved = true
    } = driverData;

    const [result] = await db.query(
      `INSERT INTO Drivers (
        fullName, email, phone, password, licenseNumber,
        sacco, busIdentifier, busType, avatar, busPic,
        licenseDoc, approved
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        fullName, email, phone, password, licenseNumber,
        sacco, busIdentifier, busType, avatar, busPic,
        licenseDoc, approved
      ]
    );
    return { id: result.insertId, ...driverData };
  }

  static async update(id, updateData) {
    const keys = Object.keys(updateData);
    const values = Object.values(updateData);
    
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const [result] = await db.query(
      `UPDATE Drivers SET ${setClause} WHERE id = ?`,
      [...values, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM Drivers WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async findAll(options = {}) {
    let query = 'SELECT * FROM Drivers';
    const values = [];
    const whereConditions = [];

    if (options.sacco) {
      whereConditions.push('sacco = ?');
      values.push(options.sacco);
    }

    if (options.approved !== undefined) {
      whereConditions.push('approved = ?');
      values.push(options.approved);
    }

    if (whereConditions.length > 0) {
      query += ' WHERE ' + whereConditions.join(' AND ');
    }

    const [rows] = await db.query(query, values);
    return rows;
  }

  static async findBySacco(sacco) {
    return this.findAll({ sacco });
  }
}

export default Driver;
