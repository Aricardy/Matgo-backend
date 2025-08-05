-- Insert admin user directly into Admins table
INSERT INTO Admins (fullName, email, password, createdAt, updatedAt)
VALUES 
('System Admin', 'admin@matgo.co.ke', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    fullName = 'System Admin',
    password = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    updatedAt = NOW();
