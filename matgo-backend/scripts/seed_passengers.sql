-- Insert directly into Passengers table (since it's a standalone table)
INSERT INTO Passengers (fullName, email, phone, password, avatar, approved, createdAt, updatedAt)
VALUES 
('Laurine Onana', 'onanalaurine4@gmail.com', '0712345678', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'laurine.jpg', 1, NOW(), NOW()),
('Ariam Nyariana', 'ariamnyariana2@gmail.com', '0712345679', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Ariam.jpg', 1, NOW(), NOW()),
('Allan Kimani', 'allan.wachuka@strathmore.edu', '0712345680', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Allan.jpg', 1, NOW(), NOW()),
('Alice Wanjiru', 'alicewanjiru@gmail.com', '0712345681', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Alice.jpg', 1, NOW(), NOW()),
('Ariam Kimani', 'ariamkim1@gmail.com', '0712345682', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Ariamkim.jpg', 1, NOW(), NOW()),
('Kim Kimani', 'kimkimani@gmail.com', '0712345683', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Kim.jpg', 1, NOW(), NOW());
