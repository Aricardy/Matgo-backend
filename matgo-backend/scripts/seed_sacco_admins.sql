-- Insert Sacco Admins into SaccoAdmins table
INSERT INTO SaccoAdmins (saccoName, fullName, email, phone, password, routes, approved, avatar, createdAt, updatedAt)
VALUES 
('NTVRS', 'Ntvrs Kajiado', 'ntvrs@sacco.co.ke', '0700000001', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Ngong, Rongai', 1, 'NTVRS.png', NOW(), NOW()),
('Super Metro', 'Super Metro', 'supermetero@sacco.co.ke', '0700000002', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Ngong, Rongai', 1, 'Super Metro.png', NOW(), NOW()),
('Expresso Limited', 'Expresso Limited', 'expresso@sacco.co.ke', '0700000003', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Kasarani, Ngong, Rongai', 1, 'Expresso.png', NOW(), NOW()),
('Emba Pesa', 'Emba Pesa', 'embasava@sacco.co.ke', '0700000004', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Embakasi', 1, 'Embasava.png', NOW(), NOW());

-- Insert Routes (assuming Routes table exists and has these columns)
INSERT INTO Routes (name, description, saccoId, createdAt, updatedAt)
VALUES 
('Ngong Route', 'Ngong to Town via Ngong Road and Southern Bypass', 1, NOW(), NOW()),
('Rongai Route', 'Rongai to Town via Ngong Road', 1, NOW(), NOW()),
('Ngong Route', 'Ngong to CBD Archives', 2, NOW(), NOW()),
('Rongai Route', 'Rongai to Town via Ngong Road', 2, NOW(), NOW()),
('Kasarani Route', '17b Kasarani to Town', 3, NOW(), NOW()),
('Embakasi Route', 'Embakasi to Town', 4, NOW(), NOW());

-- Insert Route Stops (assuming RouteStops table exists)
INSERT INTO RouteStops (routeId, name, sequence, latitude, longitude, createdAt, updatedAt)
VALUES 
(1, 'Ngong Town', 1, -1.3616, 36.6581, NOW(), NOW()),
(1, 'Karen', 2, -1.3192, 36.7077, NOW(), NOW()),
(1, 'Junction Mall', 3, -1.3185, 36.8174, NOW(), NOW()),
(1, 'CBD', 4, -1.2921, 36.8219, NOW(), NOW());

-- Insert Fares (assuming Fares table exists)
INSERT INTO Fares (routeId, fromStopId, toStopId, amount, createdAt, updatedAt)
VALUES 
(1, 1, 2, 50, NOW(), NOW()),
(1, 1, 3, 70, NOW(), NOW()),
(1, 1, 4, 100, NOW(), NOW()),
(1, 2, 3, 50, NOW(), NOW()),
(1, 2, 4, 100, NOW(), NOW()),
(1, 3, 4, 50, NOW(), NOW());
