-- Migration: Create RoutePrices table for time-based, sacco-based, and route-based pricing
CREATE TABLE IF NOT EXISTS RoutePrices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    route_id INT NOT NULL,
    sacco_id INT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    price INT NOT NULL,
    direction ENUM('TO_TOWN', 'FROM_TOWN') NULL,
    road ENUM('NGONG_RD', 'BYPASS', 'ANY') NULL,
    notes VARCHAR(255) NULL,
    CONSTRAINT fk_route FOREIGN KEY (route_id) REFERENCES Routes(id),
    CONSTRAINT fk_sacco FOREIGN KEY (sacco_id) REFERENCES SaccoAdmins(id)
);

-- Example data for Ngong, Rongai, Kasarani, Embakasi
-- (You should adjust route_id and sacco_id to match your actual IDs)

-- Ngong to Town (NTVRS)
INSERT INTO RoutePrices (route_id, sacco_id, start_time, end_time, price, direction, road, notes) VALUES
(1, 1, '04:00:00', '11:00:00', 100, 'TO_TOWN', 'NGONG_RD', NULL),
(1, 1, '11:01:00', '15:59:00', NULL, 'TO_TOWN', 'NGONG_RD', 'No buses operating');

-- Ngong to Town (Supermetro)
INSERT INTO RoutePrices (route_id, sacco_id, start_time, end_time, price, direction, road) VALUES
(1, 2, '04:00:00', '11:00:00', 100, 'TO_TOWN', 'NGONG_RD'),
(1, 2, '11:00:00', '16:00:00', 70, 'TO_TOWN', 'NGONG_RD'),
(1, 2, '16:01:00', '19:30:00', 50, 'TO_TOWN', 'NGONG_RD'),
(1, 2, '19:30:00', '23:00:00', 100, 'TO_TOWN', 'NGONG_RD');

-- Kasarani (flat rate)
INSERT INTO RoutePrices (route_id, sacco_id, start_time, end_time, price, direction, road) VALUES
(5, NULL, '00:00:00', '23:59:59', 60, NULL, 'ANY');

-- Embakasi (flat rate)
INSERT INTO RoutePrices (route_id, sacco_id, start_time, end_time, price, direction, road) VALUES
(6, NULL, '00:00:00', '23:59:59', 100, NULL, 'ANY');

-- Add more as needed for all routes and saccos
