-- Table to track how many times each user scans each bus
CREATE TABLE IF NOT EXISTS BusScanCounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    busId VARCHAR(64) NOT NULL,
    scanCount INT DEFAULT 1,
    lastScanned TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_bus (userId, busId)
);
