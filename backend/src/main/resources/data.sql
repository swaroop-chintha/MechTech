-- Seeding Categories
INSERT IGNORE INTO categories (id, name, slug, icon, description, is_active) VALUES
(1, 'Automobiles', 'automobiles', 'car', 'Automobile repairs, washing & servicing', true),
(2, 'Home Appliances', 'appliances', 'tv', 'AC, Refrigerator, TV, Washing Machine repair', true),
(3, 'Mobiles & Electronics', 'electronics', 'smartphone', 'Mobile phone, tablet, laptop repair', true),
(4, 'Plumbing', 'plumbing', 'droplet', 'Leakages, pipe fittings, tap installations', true),
(5, 'Electrical', 'electrical', 'zap', 'Wiring, switchboards, fan & light installation', true),
(6, 'General Maintenance', 'maintenance', 'wrench', 'Carpentry, locks, painting, home cleaning', true);

-- Seeding Cities
INSERT IGNORE INTO cities (id, name, state, is_active) VALUES
(1, 'Hyderabad', 'Telangana', true),
(2, 'Bangalore', 'Karnataka', true),
(3, 'Chennai', 'Tamil Nadu', true);

-- Seeding Areas
INSERT IGNORE INTO areas (id, city_id, name, pincode) VALUES
-- Hyderabad (city_id = 1)
(1, 1, 'Gachibowli', '500032'),
(2, 1, 'Madhapur', '500081'),
(3, 1, 'Jubilee Hills', '500033'),
(4, 1, 'Banjara Hills', '500034'),
(5, 1, 'Kondapur', '500084'),
-- Bangalore (city_id = 2)
(6, 2, 'Indiranagar', '560038'),
(7, 2, 'Koramangala', '560034'),
(8, 2, 'Whitefield', '560066'),
(9, 2, 'HSR Layout', '560102'),
(10, 2, 'Jayanagar', '560041'),
-- Chennai (city_id = 3)
(11, 3, 'Adyar', '600020'),
(12, 3, 'Velachery', '600042'),
(13, 3, 'T-Nagar', '600017'),
(14, 3, 'Mylapore', '600004'),
(15, 3, 'Nungambakkam', '600034');

-- Seeding Provider Users (password is 'password' - BCrypt hash)
INSERT IGNORE INTO users (id, name, email, phone, password_hash, role, is_verified, created_at) VALUES
(2, 'Rajesh Kumar', 'rajesh@gmail.com', '9876543210', '$2a$10$fV3.R.3XyA79LszK7H0G.O46Ff8dC7q1Qy/1z/p4kM1q59t83xYfS', 'mechanic', true, NOW()),
(3, 'Ramesh Babu', 'ramesh@gmail.com', '9876543211', '$2a$10$fV3.R.3XyA79LszK7H0G.O46Ff8dC7q1Qy/1z/p4kM1q59t83xYfS', 'mechanic', true, NOW()),
(4, 'Suresh Raina', 'suresh@gmail.com', '9876543212', '$2a$10$fV3.R.3XyA79LszK7H0G.O46Ff8dC7q1Qy/1z/p4kM1q59t83xYfS', 'mechanic', true, NOW()),
(5, 'Amit Patel', 'amit@gmail.com', '9876543213', '$2a$10$fV3.R.3XyA79LszK7H0G.O46Ff8dC7q1Qy/1z/p4kM1q59t83xYfS', 'mechanic', true, NOW()),
(6, 'Vijay Mallya', 'vijay@gmail.com', '9876543214', '$2a$10$fV3.R.3XyA79LszK7H0G.O46Ff8dC7q1Qy/1z/p4kM1q59t83xYfS', 'mechanic', true, NOW()),
(7, 'Karthik Raja', 'karthik@gmail.com', '9876543215', '$2a$10$fV3.R.3XyA79LszK7H0G.O46Ff8dC7q1Qy/1z/p4kM1q59t83xYfS', 'mechanic', true, NOW()),
(8, 'Mohan Dass', 'mohan@gmail.com', '9876543216', '$2a$10$fV3.R.3XyA79LszK7H0G.O46Ff8dC7q1Qy/1z/p4kM1q59t83xYfS', 'mechanic', true, NOW()),
(9, 'Srinivasan R', 'srini@gmail.com', '9876543217', '$2a$10$fV3.R.3XyA79LszK7H0G.O46Ff8dC7q1Qy/1z/p4kM1q59t83xYfS', 'mechanic', true, NOW()),
(10, 'Ram Charan', 'ram@gmail.com', '9876543218', '$2a$10$fV3.R.3XyA79LszK7H0G.O46Ff8dC7q1Qy/1z/p4kM1q59t83xYfS', 'mechanic', true, NOW()),
(11, 'Anand Krishnan', 'anand@gmail.com', '9876543219', '$2a$10$fV3.R.3XyA79LszK7H0G.O46Ff8dC7q1Qy/1z/p4kM1q59t83xYfS', 'mechanic', true, NOW());

-- Seeding Mechanics (Providers)
INSERT IGNORE INTO mechanics (id, user_id, shop_name, bio, rating, review_count, is_verified, is_available, location, city_id, area_id, address, profile_photo_url) VALUES
(1, 2, 'Rajesh Auto Care', 'Expert car repairs, bodyworks, and wheel alignment in Gachibowli.', 4.80, 42, true, true, ST_GeomFromText('POINT(17.4483 78.3741)'), 1, 1, 'Plot 42, Gachibowli Road, Hyderabad', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150'),
(2, 3, 'Ramesh Appliance Repair', 'AC servicing, washing machine, and microwave oven repairs.', 4.50, 28, true, true, ST_GeomFromText('POINT(17.4436 78.3891)'), 1, 2, 'Shop 12, Madhapur Main Road, Hyderabad', 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150'),
(3, 4, 'Suresh Mobile Solutions', 'Quick smartphone, laptop repair and screen replacement services.', 4.20, 15, false, true, ST_GeomFromText('POINT(17.4300 78.4100)'), 1, 3, 'Jubilee Hills Road No. 36, Hyderabad', 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150'),
(4, 5, 'Patel Plumbers', 'Professional plumbing repairs, leakages and piping installations.', 4.60, 50, true, true, ST_GeomFromText('POINT(12.9784 77.6408)'), 2, 6, '100 Feet Rd, Indiranagar, Bangalore', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'),
(5, 6, 'Vijay Electricals', 'Complete home wiring, electrical fixtures, and geyser installation.', 4.90, 65, true, true, ST_GeomFromText('POINT(12.9352 77.6244)'), 2, 7, '80 Feet Rd, Koramangala, Bangalore', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'),
(6, 7, 'Raja Auto Works', 'Two-wheeler and four-wheeler multi-brand repair shop.', 4.70, 34, true, true, ST_GeomFromText('POINT(12.9698 77.7499)'), 2, 8, 'ITPL Main Rd, Whitefield, Bangalore', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150'),
(7, 8, 'Mohan Maintenance', 'Local carpentry, home repair services, painting and deep cleaning.', 4.40, 22, false, true, ST_GeomFromText('POINT(13.0063 80.2575)'), 3, 11, 'Adyar Depot, Chennai', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'),
(8, 9, 'Srini Electronics', 'LED TV, sound system and home theater repairs.', 4.30, 19, true, true, ST_GeomFromText('POINT(12.9796 80.2223)'), 3, 12, '100 Feet Bypass Rd, Velachery, Chennai', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150'),
(9, 10, 'Ram Plumbing & Taps', '24/7 emergency water pump repairs and sanitary installations.', 4.10, 8, false, true, ST_GeomFromText('POINT(13.0405 80.2337)'), 3, 13, 'Usman Rd, T-Nagar, Chennai', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
(10, 11, 'Anand Home Services', 'Sofa cleaning, pest control, lock replacement and minor repairs.', 4.70, 55, true, true, ST_GeomFromText('POINT(13.0424 80.2565)'), 3, 14, 'Kutchery Rd, Mylapore, Chennai', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150');


-- Seeding Provider Services
INSERT IGNORE INTO provider_services (id, provider_id, category_id, name, description, base_price, duration_mins, is_active) VALUES
-- Rajesh (provider_id = 1, Automobiles)
(1, 1, 1, 'Car Engine Tuning', 'Comprehensive engine checkup, spark plug cleaning, and sensor calibration.', 1500.00, 60, true),
(2, 1, 1, 'Wheel Balancing & Alignment', 'Precision wheel alignment and 3D balancing for smooth driving.', 800.00, 45, true),
-- Ramesh (provider_id = 2, Home Appliances)
(3, 2, 2, 'Split AC Gas Charging', 'AC gas pressure test and gas refilling with leakage fixing.', 2500.00, 90, true),
(4, 2, 2, 'Washing Machine Drum Repair', 'Fixing drum alignment, replacing bearings and noise dampening.', 1800.00, 120, true),
-- Suresh (provider_id = 3, Electronics)
(5, 3, 3, 'iPhone Screen Replacement', 'OEM screen replacement with multi-touch and color calibration.', 4999.00, 30, true),
(6, 3, 3, 'Laptop Thermal Paste Application', 'Internal cleaning and changing processor thermal paste for cooling.', 1200.00, 60, true),
-- Patel Plumbers (provider_id = 4, Plumbing)
(7, 4, 4, 'Kitchen Sink Clog Removal', 'Unblocking pipelines using advanced drain snakes and high-pressure cleaning.', 450.00, 40, true),
(8, 4, 4, 'Bathroom Faucet Installation', 'Installing designer premium taps and checking for pressure leaks.', 600.00, 30, true),
-- Vijay Electricals (provider_id = 5, Electrical)
(9, 5, 5, 'Ceiling Fan Installation', 'Mounting, regulator setup, and checking wiring safety.', 300.00, 30, true),
(10, 5, 5, 'Complete Room Rewiring', 'Fusing safety switches, copper wiring, and replacing sockets.', 3500.00, 180, true),
-- Raja Auto Works (provider_id = 6, Automobiles)
(11, 6, 1, 'Two-Wheeler Brake Shoe Repair', 'Replacing front and rear brake shoes and cable adjustment.', 350.00, 30, true),
(12, 6, 1, 'Car Periodic Service (10k Km)', 'Engine oil replacement, filter cleaning, and multi-point check.', 2999.00, 150, true),
-- Mohan Maintenance (provider_id = 7, Maintenance)
(13, 7, 6, 'Wooden Door Latches Repair', 'Fixing door alignment and installing new premium brass handles/locks.', 500.00, 45, true),
(14, 7, 6, 'Full Bedroom Wall Painting', 'Double coat plastic emulsion painting with smooth texture.', 4500.00, 240, true),
-- Srini Electronics (provider_id = 8, Electronics)
(15, 8, 3, 'LED TV Backlight Repair', 'Replacing failed LED strips in TV panel to restore brightness.', 3200.00, 120, true),
(16, 8, 3, 'Home Theater Audio Tuning', 'Speaker configuration, wire routing and equalizer setup.', 1500.00, 90, true),
-- Ram Plumbing & Taps (provider_id = 9, Plumbing)
(17, 9, 4, 'Water Pump Motor Repair', 'Rewinding pump motor coil and capacitor replacement.', 2200.00, 120, true),
(18, 9, 4, 'Sanitary Commode Fixing', 'Replacing flush valves, seat covers, and leak sealing.', 1200.00, 60, true),
-- Anand Home Services (provider_id = 10, Maintenance)
(19, 10, 6, '3-Seater Sofa Dry Cleaning', 'Deep vacuuming, organic shampoo washing, and hot air drying.', 1200.00, 90, true),
(20, 10, 6, 'Whole House Pest Control', 'Gel application for cockroaches and spraying for termites & bugs.', 1800.00, 120, true);

-- Enable spatial index on location column
ALTER TABLE mechanics ADD SPATIAL INDEX(location);
