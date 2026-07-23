-- Reset fake provider data on startup while preserving system lookup tables
SET FOREIGN_KEY_CHECKS = 0;
DELETE FROM provider_services;
DELETE FROM mechanics;
DELETE FROM users WHERE role = 'mechanic';
SET FOREIGN_KEY_CHECKS = 1;

-- Seeding Categories (System Metadata)
INSERT IGNORE INTO categories (id, name, slug, icon, description, is_active) VALUES
(1, 'Automobiles', 'automobiles', 'car', 'Automobile repairs, washing & servicing', true),
(2, 'Home Appliances', 'appliances', 'tv', 'AC, Refrigerator, TV, Washing Machine repair', true),
(3, 'Mobiles & Electronics', 'electronics', 'smartphone', 'Mobile phone, tablet, laptop repair', true),
(4, 'Plumbing', 'plumbing', 'droplet', 'Leakages, pipe fittings, tap installations', true),
(5, 'Electrical', 'electrical', 'zap', 'Wiring, switchboards, fan & light installation', true),
(6, 'General Maintenance', 'maintenance', 'wrench', 'Carpentry, locks, painting, home cleaning', true);

-- Seeding Cities (System Metadata)
INSERT IGNORE INTO cities (id, name, state, is_active) VALUES
(1, 'Hyderabad', 'Telangana', true),
(2, 'Bangalore', 'Karnataka', true),
(3, 'Chennai', 'Tamil Nadu', true);

-- Seeding Areas (System Metadata)
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
