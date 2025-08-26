// Model for BusScanCounts (plain MySQL, not Sequelize)
import db from '../config/db.js';

export async function incrementBusScanCount(userId, busId) {
  // Try to update existing row
  const [result] = await db.execute(
    `INSERT INTO BusScanCounts (userId, busId, scanCount) VALUES (?, ?, 1)
     ON DUPLICATE KEY UPDATE scanCount = scanCount + 1, lastScanned = CURRENT_TIMESTAMP`,
    [userId, busId]
  );
  return result;
}

export async function getBusScanCount(userId, busId) {
  const [rows] = await db.execute(
    'SELECT scanCount FROM BusScanCounts WHERE userId = ? AND busId = ?',
    [userId, busId]
  );
  return rows[0]?.scanCount || 0;
}
