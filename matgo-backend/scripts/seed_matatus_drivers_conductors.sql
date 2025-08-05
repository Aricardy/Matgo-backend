-- NTVRS Matatus
INSERT INTO Matatus (sacco, identifier, busType, route, featured, createdAt, updatedAt)
VALUES 
('NTVRS', 'KAA 111A', 'Nissan Civilian', 'Ngong Route', 1, NOW(), NOW()),
('NTVRS', 'KAA 112B', 'Nissan Civilian', 'Rongai Route', 1, NOW(), NOW()),
('NTVRS', 'KAA 113C', 'Nissan Civilian', 'Ngong Route', 0, NOW(), NOW()),
('Super Metro', 'KBB 111A', 'Isuzu NPR', 'Ngong Route', 1, NOW(), NOW()),
('Expresso', 'KCC 111A', 'Toyota Hiace', 'Kasarani Route', 1, NOW(), NOW()),
('Emba Pesa', 'KDD 111A', 'Toyota Hiace', 'Embakasi Route', 1, NOW(), NOW());

-- Insert Drivers directly into Drivers table
INSERT INTO Drivers (fullName, email, phone, password, licenseNumber, sacco, busIdentifier, busType, avatar, busPic, licenseDoc, approved, createdAt, updatedAt)
VALUES 
-- NTVRS Drivers
('John Kamau', 'driver1@ntvrs.co.ke', '0712345678', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DL12345678', 'NTVRS', 'KAA 111A', 'Nissan Civilian', 'driver1.jpg', 'X-Rated.jpg', 'license1.jpg', 1, NOW(), NOW()),
('Peter Mwangi', 'driver2@ntvrs.co.ke', '0712345679', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DL12345679', 'NTVRS', 'KAA 112B', 'Nissan Civilian', 'driver2.jpg', 'Phenomenal.jpg', 'license2.jpg', 1, NOW(), NOW()),
-- Super Metro Drivers
('James Omondi', 'driver3@supermetero.co.ke', '0712345680', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DL12345680', 'Super Metro', 'KBB 111A', 'Isuzu NPR', 'driver3.jpg', 'fleet 1456.jpg', 'license3.jpg', 1, NOW(), NOW()),
-- Expresso Drivers
('David Otieno', 'driver4@expresso.co.ke', '0712345681', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DL12345681', 'Expresso', 'KCC 111A', 'Toyota Hiace', 'driver4.jpg', 'Baba Yaga.jpg', 'license4.jpg', 1, NOW(), NOW()),
-- Emba Pesa Drivers
('Robert Mutua', 'driver5@embapesa.co.ke', '0712345682', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DL12345682', 'Emba Pesa', 'KDD 111A', 'Toyota Hiace', 'driver5.jpg', 'Brawlout.jpg', 'license5.jpg', 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE updatedAt = NOW();

-- Insert Conductors directly into Conductors table
INSERT INTO Conductors (fullName, email, phone, password, nationalId, sacco, busIdentifier, busType, avatar, busPic, nationalIdImage, approved, createdAt, updatedAt)
VALUES 
-- NTVRS Conductors
('Michael Njoroge', 'conductor1@ntvrs.co.ke', '0712345683', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '12345678', 'NTVRS', 'KAA 111A', 'Nissan Civilian', 'conductor1.jpg', 'X-Rated.jpg', 'national1.jpg', 1, NOW(), NOW()),
('Paul Gitau', 'conductor2@ntvrs.co.ke', '0712345684', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '12345679', 'NTVRS', 'KAA 112B', 'Nissan Civilian', 'conductor2.jpg', 'Phenomenal.jpg', 'national2.jpg', 1, NOW(), NOW()),
-- Super Metro Conductors
('conductor3@supermetero.co.ke', 'simonk', 'Simon Kariuki', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'conductor', 'conductor3.jpg', '0712345685', NOW(), NOW(), 1),
-- Expresso Conductors
('conductor4@expresso.co.ke', 'erico', 'Eric Ochieng', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'conductor', 'conductor4.jpg', '0712345686', NOW(), NOW(), 1),
-- Embasava Conductors
('conductor5@embapesa.co.ke', 'brianm', 'Brian Musyoki', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'conductor', 'conductor5.jpg', '0712345687', NOW(), NOW(), 1);

-- Insert into Drivers table
INSERT INTO Drivers (user_id, license_number, phone, status, created_at, updated_at)
SELECT id, CONCAT('DL', LPAD(id, 6, '0')), '0712345678', 'active', NOW(), NOW()
FROM Users 
WHERE email IN ('driver1@ntvrs.co.ke', 'driver2@ntvrs.co.ke', 'driver3@supermetero.co.ke', 'driver4@expresso.co.ke', 'driver5@embapesa.co.ke');

-- Insert into Conductors table
INSERT INTO Conductors (user_id, phone, status, created_at, updated_at)
SELECT id, '0712345678', 'active', NOW(), NOW()
FROM Users 
WHERE email IN ('theo@ntvrs.co.ke', 'deni@ntvrs.co.ke');
-- Add more conductors...

-- Assign drivers and conductors to matatus
UPDATE Matatus 
SET driver_id = (SELECT id FROM Drivers WHERE user_id = (SELECT id FROM Users WHERE email = 'ochila@ntvrs.co.ke')),
    conductor_id = (SELECT id FROM Conductors WHERE user_id = (SELECT id FROM Users WHERE email = 'theo@ntvrs.co.ke'))
WHERE registration_number = 'KAA 111A';

-- Add more assignments as needed...

-- Insert Trips
INSERT INTO Trips (matatu_id, route_id, departure_time, arrival_time, status, created_at, updated_at)
VALUES 
(1, 1, CONCAT(CURDATE(), ' 06:00:00'), CONCAT(CURDATE(), ' 07:30:00'), 'scheduled', NOW(), NOW()),
(2, 1, CONCAT(CURDATE(), ' 06:15:00'), CONCAT(CURDATE(), ' 07:45:00'), 'scheduled', NOW(), NOW());
-- Add more trips...
