import db from '../config/db.js';

class Route {
  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM Routes WHERE id = ?', [id]);
    return rows[0];
  }

  static async findByName(name) {
    const [rows] = await db.query('SELECT * FROM Routes WHERE name = ?', [name]);
    return rows[0];
  }

  static async create(routeData) {
    const {
      name,
      description,
      active = true
    } = routeData;

    const [result] = await db.query(
      `INSERT INTO Routes (
        name, description, active
      ) VALUES (?, ?, ?)`,
      [name, description, active]
    );
    return { id: result.insertId, ...routeData };
  }

  static async update(id, updateData) {
    const keys = Object.keys(updateData);
    const values = Object.values(updateData);
    
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const [result] = await db.query(
      `UPDATE Routes SET ${setClause} WHERE id = ?`,
      [...values, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM Routes WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async findAll(includeInactive = false) {
    let query = 'SELECT * FROM Routes';
    if (!includeInactive) {
      query += ' WHERE active = true';
    }
    const [rows] = await db.query(query);
    return rows;
  }

  static async toggleActive(id) {
    const [rows] = await db.query('SELECT active FROM Routes WHERE id = ?', [id]);
    if (rows.length === 0) return false;
    
    return this.update(id, { active: !rows[0].active });
  }
}

export default Route;
