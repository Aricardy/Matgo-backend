import db from '../config/db.js';

export const getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users');
    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Database error' });
  }
};
