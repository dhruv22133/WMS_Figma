-- ============================================================================
-- Enhanced Sample/Seed Data for BLE-based Warehouse Management System v2.0
-- Includes realistic data with proper constraints and validation
-- ============================================================================

-- ============================================================================
-- USERS
-- ============================================================================

INSERT INTO users (id, username, email, full_name, role, department, employee_id, phone, is_active, assigned_zones, max_task_capacity) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin', 'admin@warehouse.com', 'Admin User', 'ADMIN', 'Management', 'EMP001', '+1-555-0101', true, ARRAY['A', 'B', 'C', 'R', 'S'], 20),
('550e8400-e29b-41d4-a716-446655440002', 'john.manager', 'john.manager@warehouse.com', 'John Manager', 'WAREHOUSE_MANAGER', 'Operations', 'EMP002', '+1-555-0102', true, ARRAY['A', 'B'], 15),
('550e8400-e29b-41d4-a716-446655440003', 'sarah.staff', 'sarah.staff@warehouse.com', 'Sarah Staff', 'WAREHOUSE_STAFF', 'Operations', 'EMP003', '+1-555-0103', true, ARRAY['A'], 10),
('550e8400-e29b-41d4-a716-446655440004', 'mike.qc', 'mike.qc@warehouse.com', 'Mike QC Inspector', 'QC_INSPECTOR', 'Quality Control', 'EMP004', '+1-555-0104', true, ARRAY['Q'], 8),
('550e8400-e29b-41d4-a716-446655440005', 'jane.picker', 'jane.picker@warehouse.com', 'Jane Picker', 'WAREHOUSE_STAFF', 'Operations', 'EMP005', '+1-555-0105', true, ARRAY['A', 'B', 'P'], 12),
('550e8400-e29b-41d4-a716-446655440006', 'tom.supervisor', 'tom.supervisor@warehouse.com', 'Tom Supervisor', 'SUPERVISOR', 'Operations', 'EMP006', '+1-555-0106', true, ARRAY['A', 'B', 'C'], 15);

-- ============================================================================
-- WAREHOUSE LOCATIONS
-- ============================================================================

-- Receiving Area
INSERT INTO warehouse_locations (id, location_code, location_type, zone, aisle, rack, shelf, capacity, current_occupancy, reserved_capacity, max_weight_capacity, is_available) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'RCV-01', 'RECEIVING', 'R', '00', '00', '00', 500, 80, 20, 2000.00, true),
('650e8400-e29b-41d4-a716-446655440002', 'RCV-02', 'RECEIVING', 'R', '00', '00', '00', 500, 45, 0, 2000.00, true),
('650e8400-e29b-41d4-a716-446655440003', 'RCV-03', 'RECEIVING', 'R', '00', '00', '00', 500, 0, 0, 2000.00, true);

-- Storage Area - Zone A (General Storage)
INSERT INTO warehouse_locations (id, location_code, location_type, zone, aisle, rack, shelf, capacity, current_occupancy, reserved_capacity, max_weight_capacity, current_weight, is_available) VALUES
('650e8400-e29b-41d4-a716-446655440010', 'A-01-01', 'STORAGE', 'A', '01', '01', '01', 100, 45, 5, 500.00, 112.50, true),
('650e8400-e29b-41d4-a716-446655440011', 'A-01-02', 'STORAGE', 'A', '01', '01', '02', 100, 80, 10, 500.00, 240.00, true),
('650e8400-e29b-41d4-a716-446655440012', 'A-01-03', 'STORAGE', 'A', '01', '01', '03', 100, 0, 0, 500.00, 0.00, true),
('650e8400-e29b-41d4-a716-446655440013', 'A-02-01', 'STORAGE', 'A', '02', '01', '01', 100, 100, 0, 500.00, 320.00, false),
('650e8400-e29b-41d4-a716-446655440014', 'A-02-02', 'STORAGE', 'A', '02', '01', '02', 100, 25, 0, 500.00, 62.50, true),
('650e8400-e29b-41d4-a716-446655440015', 'A-03-01', 'STORAGE', 'A', '03', '01', '01', 150, 60, 15, 750.00, 180.00, true),
('650e8400-e29b-41d4-a716-446655440016', 'A-03-02', 'STORAGE', 'A', '03', '01', '02', 150, 120, 0, 750.00, 360.00, true);

-- Storage Area - Zone B (Temperature Controlled)
INSERT INTO warehouse_locations (id, location_code, location_type, zone, aisle, rack, shelf, capacity, current_occupancy, reserved_capacity, max_weight_capacity, is_available, temperature_controlled, current_temperature) VALUES
('650e8400-e29b-41d4-a716-446655440020', 'B-01-01', 'STORAGE', 'B', '01', '01', '01', 50, 30, 5, 250.00, true, true, 4.5),
('650e8400-e29b-41d4-a716-446655440021', 'B-01-02', 'STORAGE', 'B', '01', '01', '02', 50, 20, 0, 250.00, true, true, 4.2),
('650e8400-e29b-41d4-a716-446655440022', 'B-02-01', 'STORAGE', 'B', '02', '01', '01', 50, 40, 10, 250.00, true, true, 3.8);

-- Storage Area - Zone C (Bulk Storage)
INSERT INTO warehouse_locations (id, location_code, location_type, zone, aisle, rack, shelf, capacity, current_occupancy, max_weight_capacity, is_available) VALUES
('650e8400-e29b-41d4-a716-446655440030', 'C-01-01', 'STORAGE', 'C', '01', '01', '01', 500, 200, 5000.00, true),
('650e8400-e29b-41d4-a716-446655440031', 'C-01-02', 'STORAGE', 'C', '01', '01', '02', 500, 350, 5000.00, true);

-- Picking Area
INSERT INTO warehouse_locations (id, location_code, location_type, zone, aisle, rack, shelf, capacity, is_available) VALUES
('650e8400-e29b-41d4-a716-446655440040', 'PICK-01', 'PICKING', 'P', '00', '00', '00', 200, true),
('650e8400-e29b-41d4-a716-446655440041', 'PICK-02', 'PICKING', 'P', '00', '00', '00', 200, true),
('650e8400-e29b-41d4-a716-446655440042', 'PICK-03', 'PICKING', 'P', '00', '00', '00', 200, true);

-- Shipping Area
INSERT INTO warehouse_locations (id, location_code, location_type, zone, aisle, rack, shelf, capacity, is_available) VALUES
('650e8400-e29b-41d4-a716-446655440050', 'SHIP-01', 'SHIPPING', 'S', '00', '00', '00', 300, true),
('650e8400-e29b-41d4-a716-446655440051', 'SHIP-02', 'SHIPPING', 'S', '00', '00', '00', 300, true);

-- Quality Control Area
INSERT INTO warehouse_locations (id, location_code, location_type, zone, aisle, rack, shelf, capacity, is_available) VALUES
('650e8400-e29b-41d4-a716-446655440060', 'QC-01', 'QC', 'Q', '00', '00', '00', 100, true),
('650e8400-e29b-41d4-a716-446655440061', 'QC-02', 'QC', 'Q', '00', '00', '00', 100, true);

-- Hold Area
INSERT INTO warehouse_locations (id, location_code, location_type, zone, aisle, rack, shelf, capacity, current_occupancy, is_available) VALUES
('650e8400-e29b-41d4-a716-446655440070', 'HOLD-01', 'HOLD', 'H', '00', '00', '00', 100, 15, true),
('650e8400-e29b-41d4-a716-446655440071', 'HOLD-02', 'HOLD', 'H', '00', '00', '00', 100, 8, true);

-- ============================================================================
-- PRODUCTS
-- ============================================================================

INSERT INTO products (id, sku, barcode, name, description, category, subcategory, unit_of_measure, weight, reorder_point, reorder_quantity, min_storage_temp, max_storage_temp, optimal_storage_temp, shelf_life_days, is_hazardous, is_fragile, requires_quality_check, abc_classification, created_by) VALUES
-- Class A products (high value/volume)
('750e8400-e29b-41d4-a716-446655440001', 'SKU-001', '1234567890123', 'Widget A Premium', 'Premium widget for assembly - high demand', 'Electronics', 'Components', 'EA', 2.500, 100, 500, null, null, null, null, false, false, true, 'A', '550e8400-e29b-41d4-a716-446655440001'),
('750e8400-e29b-41d4-a716-446655440002', 'SKU-002', '1234567890124', 'Component B Pro', 'Electronic component - fragile, ESD sensitive', 'Electronics', 'Semiconductors', 'BOX', 0.500, 200, 1000, 0, 30, 20, 730, false, true, true, 'A', '550e8400-e29b-41d4-a716-446655440001'),
('750e8400-e29b-41d4-a716-446655440003', 'SKU-003', '1234567890125', 'Circuit Board C', 'Main circuit board assembly PCB', 'Electronics', 'Boards', 'EA', 1.200, 50, 250, null, null, null, 1095, false, true, true, 'A', '550e8400-e29b-41d4-a716-446655440001'),

-- Class B products (medium value/volume)
('750e8400-e29b-41d4-a716-446655440004', 'SKU-004', '1234567890126', 'Cable Assembly D', '5m high-speed cable assembly', 'Cables', 'Data Cables', 'EA', 0.800, 150, 500, null, null, null, null, false, false, false, 'B', '550e8400-e29b-41d4-a716-446655440001'),
('750e8400-e29b-41d4-a716-446655440005', 'SKU-005', '1234567890127', 'Power Supply E', '12V 5A power supply unit - certified', 'Electronics', 'Power', 'EA', 3.500, 60, 200, null, null, null, null, false, false, true, 'B', '550e8400-e29b-41d4-a716-446655440001'),
('750e8400-e29b-41d4-a716-446655440006', 'SKU-006', '1234567890128', 'Sensor Module F', 'Temperature sensor module high precision', 'Sensors', 'Temperature', 'EA', 0.300, 80, 300, -20, 50, 20, 1825, false, true, true, 'B', '550e8400-e29b-41d4-a716-446655440001'),
('750e8400-e29b-41d4-a716-446655440007', 'SKU-007', '1234567890129', 'Connector Kit G', 'Universal connector kit 50pcs', 'Electronics', 'Connectors', 'KIT', 0.250, 100, 300, null, null, null, null, false, false, false, 'B', '550e8400-e29b-41d4-a716-446655440001'),

-- Class C products (low value/volume)
('750e8400-e29b-41d4-a716-446655440008', 'SKU-008', '1234567890130', 'Packaging Material', 'Anti-static packaging roll 100m', 'Packaging', 'ESD Protection', 'ROLL', 5.000, 20, 50, null, null, null, null, false, false, false, 'C', '550e8400-e29b-41d4-a716-446655440001'),
('750e8400-e29b-41d4-a716-446655440009', 'SKU-009', '1234567890131', 'Label Sheets', 'Thermal label sheets 1000/pack', 'Supplies', 'Labels', 'PACK', 0.500, 30, 100, null, null, null, null, false, false, false, 'C', '550e8400-e29b-41d4-a716-446655440001'),
('750e8400-e29b-41d4-a716-446655440010', 'SKU-010', '1234567890132', 'Screws Assortment', 'M3 screws assorted lengths 500pcs', 'Hardware', 'Fasteners', 'BOX', 1.200, 25, 75, null, null, null, null, false, false, false, 'C', '550e8400-e29b-41d4-a716-446655440001'),

-- Hazardous product
('750e8400-e29b-41d4-a716-446655440011', 'SKU-011', '1234567890133', 'Soldering Flux', 'Electronic soldering flux 500ml', 'Chemicals', 'Soldering', 'BOTTLE', 0.600, 15, 50, 5, 25, 15, 365, true, false, true, 'B', '550e8400-e29b-41d4-a716-446655440001');

-- ============================================================================
-- BLE BEACONS
-- ============================================================================

INSERT INTO ble_beacons (id, mac_address, uuid, major, minor, beacon_name, beacon_type, battery_level, signal_strength, tx_power, firmware_version, hardware_version, manufacturer, is_active, last_seen_at, associated_location_id, calibration_distance) VALUES
-- Location beacons (fixed positions)
('850e8400-e29b-41d4-a716-446655440001', 'AA:BB:CC:DD:EE:01', 'FDA50693-A4E2-4FB1-AFCF-C6EB07647825', 1, 1, 'Beacon-RCV-01', 'LOCATION', 85, -45, -12, 'v2.1.0', 'v1.0', 'EstimoteInc', true, NOW() - INTERVAL '5 minutes', '650e8400-e29b-41d4-a716-446655440001', 1.0),
('850e8400-e29b-41d4-a716-446655440002', 'AA:BB:CC:DD:EE:02', 'FDA50693-A4E2-4FB1-AFCF-C6EB07647825', 1, 2, 'Beacon-A-01-01', 'LOCATION', 92, -42, -12, 'v2.1.0', 'v1.0', 'EstimoteInc', true, NOW() - INTERVAL '3 minutes', '650e8400-e29b-41d4-a716-446655440010', 1.0),
('850e8400-e29b-41d4-a716-446655440003', 'AA:BB:CC:DD:EE:03', 'FDA50693-A4E2-4FB1-AFCF-C6EB07647825', 1, 3, 'Beacon-A-01-02', 'LOCATION', 78, -48, -12, 'v2.1.0', 'v1.0', 'EstimoteInc', true, NOW() - INTERVAL '10 minutes', '650e8400-e29b-41d4-a716-446655440011', 1.0),
('850e8400-e29b-41d4-a716-446655440004', 'AA:BB:CC:DD:EE:04', 'FDA50693-A4E2-4FB1-AFCF-C6EB07647825', 1, 4, 'Beacon-QC-01', 'LOCATION', 88, -44, -12, 'v2.1.0', 'v1.0', 'EstimoteInc', true, NOW() - INTERVAL '2 minutes', '650e8400-e29b-41d4-a716-446655440060', 1.0),
('850e8400-e29b-41d4-a716-446655440005', 'AA:BB:CC:DD:EE:05', 'FDA50693-A4E2-4FB1-AFCF-C6EB07647825', 1, 5, 'Beacon-PICK-01', 'LOCATION', 95, -40, -12, 'v2.1.0', 'v1.0', 'EstimoteInc', true, NOW() - INTERVAL '1 minute', '650e8400-e29b-41d4-a716-446655440040', 1.0),
('850e8400-e29b-41d4-a716-446655440006', 'AA:BB:CC:DD:EE:06', 'FDA50693-A4E2-4FB1-AFCF-C6EB07647825', 1, 6, 'Beacon-B-01-01', 'LOCATION', 82, -46, -12, 'v2.1.0', 'v1.0', 'EstimoteInc', true, NOW() - INTERVAL '8 minutes', '650e8400-e29b-41d4-a716-446655440020', 1.0),

-- Product beacons (attached to inventory)
('850e8400-e29b-41d4-a716-446655440010', 'AA:BB:CC:DD:EE:10', 'FDA50693-A4E2-4FB1-AFCF-C6EB07647825', 2, 10, 'Beacon-Product-001', 'PRODUCT', 95, -40, -12, 'v2.1.0', 'v1.0', 'EstimoteInc', true, NOW() - INTERVAL '1 minute', NULL, 0.5),
('850e8400-e29b-41d4-a716-446655440011', 'AA:BB:CC:DD:EE:11', 'FDA50693-A4E2-4FB1-AFCF-C6EB07647825', 2, 11, 'Beacon-Product-002', 'PRODUCT', 72, -52, -12, 'v2.1.0', 'v1.0', 'EstimoteInc', true, NOW() - INTERVAL '15 minutes', NULL, 0.5),
('850e8400-e29b-41d4-a716-446655440012', 'AA:BB:CC:DD:EE:12', 'FDA50693-A4E2-4FB1-AFCF-C6EB07647825', 2, 12, 'Beacon-Product-003', 'PRODUCT', 90, -43, -12, 'v2.1.0', 'v1.0', 'EstimoteInc', true, NOW() - INTERVAL '8 minutes', NULL, 0.5),
('850e8400-e29b-41d4-a716-446655440013', 'AA:BB:CC:DD:EE:13', 'FDA50693-A4E2-4FB1-AFCF-C6EB07647825', 2, 13, 'Beacon-Product-004', 'PRODUCT', 88, -45, -12, 'v2.1.0', 'v1.0', 'EstimoteInc', true, NOW() - INTERVAL '5 minutes', NULL, 0.5),

-- Mobile beacons (warehouse equipment)
('850e8400-e29b-41d4-a716-446655440020', 'AA:BB:CC:DD:EE:20', 'FDA50693-A4E2-4FB1-AFCF-C6EB07647825', 3, 20, 'Beacon-Forklift-01', 'EQUIPMENT', 65, -55, -12, 'v2.1.0', 'v1.0', 'EstimoteInc', true, NOW() - INTERVAL '30 minutes', NULL, 1.0),
('850e8400-e29b-41d4-a716-446655440021', 'AA:BB:CC:DD:EE:21', 'FDA50693-A4E2-4FB1-AFCF-C6EB07647825', 3, 21, 'Beacon-Cart-01', 'EQUIPMENT', 58, -58, -12, 'v2.1.0', 'v1.0', 'EstimoteInc', true, NOW() - INTERVAL '2 hours', NULL, 0.5),

-- Mobile scanner beacons
('850e8400-e29b-41d4-a716-446655440030', 'AA:BB:CC:DD:EE:30', 'FDA50693-A4E2-4FB1-AFCF-C6EB07647825', 4, 30, 'Beacon-Scanner-Sarah', 'MOBILE', 75, -50, -12, 'v2.1.0', 'v1.0', 'EstimoteInc', true, NOW() - INTERVAL '5 minutes', NULL, 0.3),
('850e8400-e29b-41d4-a716-446655440031', 'AA:BB:CC:DD:EE:31', 'FDA50693-A4E2-4FB1-AFCF-C6EB07647825', 4, 31, 'Beacon-Scanner-Jane', 'MOBILE', 82, -47, -12, 'v2.1.0', 'v1.0', 'EstimoteInc', true, NOW() - INTERVAL '10 minutes', NULL, 0.3);

-- ============================================================================
-- INVENTORY
-- ============================================================================

INSERT INTO inventory (id, product_id, location_id, quantity, reserved_quantity, status, lot_number, batch_number, manufacture_date, expiration_date, received_date, beacon_id, cost_per_unit, last_counted_at) VALUES
-- Products in storage Zone A
('950e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440010', 50, 5, 'AVAILABLE', 'LOT-2026-001', 'BATCH-A-001', '2025-12-15', null, '2026-01-15', '850e8400-e29b-41d4-a716-446655440010', 25.50, '2026-02-01'),
('950e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440011', 90, 10, 'AVAILABLE', 'LOT-2026-002', 'BATCH-A-002', '2025-11-20', '2027-11-20', '2026-01-20', NULL, 15.75, '2026-01-25'),
('950e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440013', 100, 0, 'AVAILABLE', 'LOT-2026-003', 'BATCH-A-003', '2025-10-25', '2028-10-25', '2026-01-25', '850e8400-e29b-41d4-a716-446655440011', 42.00, '2026-02-05'),
('950e8400-e29b-41d4-a716-446655440004', '750e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440014', 25, 0, 'AVAILABLE', 'LOT-2026-004', 'BATCH-A-004', '2026-01-01', null, '2026-02-01', NULL, 8.25, null),
('950e8400-e29b-41d4-a716-446655440005', '750e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440015', 75, 15, 'AVAILABLE', 'LOT-2026-005', 'BATCH-A-005', '2025-12-10', null, '2026-01-10', '850e8400-e29b-41d4-a716-446655440012', 35.00, '2026-01-30'),
('950e8400-e29b-41d4-a716-446655440006', '750e8400-e29b-41d4-a716-446655440007', '650e8400-e29b-41d4-a716-446655440016', 120, 0, 'AVAILABLE', 'LOT-2026-006', 'BATCH-A-006', '2026-01-05', null, '2026-01-28', NULL, 12.50, null),

-- Products in Zone B (temp controlled)
('950e8400-e29b-41d4-a716-446655440010', '750e8400-e29b-41d4-a716-446655440006', '650e8400-e29b-41d4-a716-446655440020', 35, 5, 'AVAILABLE', 'LOT-2026-010', 'BATCH-B-001', '2025-06-15', '2030-06-15', '2026-01-10', '850e8400-e29b-41d4-a716-446655440013', 28.00, '2026-02-01'),
('950e8400-e29b-41d4-a716-446655440011', '750e8400-e29b-41d4-a716-446655440011', '650e8400-e29b-41d4-a716-446655440021', 20, 0, 'AVAILABLE', 'LOT-2026-011', 'BATCH-B-002', '2026-01-20', '2027-01-20', '2026-02-01', NULL, 18.50, null),
('950e8400-e29b-41d4-a716-446655440012', '750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440022', 50, 10, 'AVAILABLE', 'LOT-2026-012', 'BATCH-B-003', '2025-08-01', '2027-08-01', '2026-01-15', NULL, 15.75, '2026-01-28'),

-- Products in Zone C (bulk)
('950e8400-e29b-41d4-a716-446655440020', '750e8400-e29b-41d4-a716-446655440008', '650e8400-e29b-41d4-a716-446655440030', 200, 0, 'AVAILABLE', 'LOT-2026-020', 'BATCH-C-001', '2026-01-05', null, '2026-01-15', NULL, 45.00, null),
('950e8400-e29b-41d4-a716-446655440021', '750e8400-e29b-41d4-a716-446655440009', '650e8400-e29b-41d4-a716-446655440030', 150, 0, 'AVAILABLE', 'LOT-2026-021', 'BATCH-C-002', '2026-01-10', null, '2026-01-20', NULL, 5.50, null),
('950e8400-e29b-41d4-a716-446655440022', '750e8400-e29b-41d4-a716-446655440010', '650e8400-e29b-41d4-a716-446655440031', 350, 0, 'AVAILABLE', 'LOT-2026-022', 'BATCH-C-003', '2026-01-12', null, '2026-01-25', NULL, 3.25, null),

-- Products in receiving (new arrivals)
('950e8400-e29b-41d4-a716-446655440030', '750e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440001', 80, 0, 'IN_TRANSIT', 'LOT-2026-030', 'BATCH-R-001', '2026-02-01', null, '2026-02-11', NULL, 35.00, null),
('950e8400-e29b-41d4-a716-446655440031', '750e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440002', 45, 0, 'IN_TRANSIT', 'LOT-2026-031', 'BATCH-R-002', '2026-02-05', '2029-02-05', '2026-02-11', NULL, 42.00, null),

-- Products on hold
('950e8400-e29b-41d4-a716-446655440040', '750e8400-e29b-41d4-a716-446655440006', '650e8400-e29b-41d4-a716-446655440070', 15, 0, 'ON_HOLD', 'LOT-2026-040', 'BATCH-H-001', '2025-12-01', '2030-12-01', '2026-01-10', NULL, 28.00, null),
('950e8400-e29b-41d4-a716-446655440041', '750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440071', 8, 0, 'DAMAGED', 'LOT-2026-041', 'BATCH-H-002', '2025-11-15', '2027-11-15', '2026-01-25', NULL, 15.75, null);

-- ============================================================================
-- PUT-AWAY TASKS
-- ============================================================================

INSERT INTO put_away_tasks (id, task_number, product_id, source_location_id, destination_location_id, quantity, quantity_completed, status, priority, assigned_to, beacon_scanned, location_verified, step_completed, started_at, completed_at, estimated_duration_minutes, actual_duration_minutes, due_at, created_by) VALUES
-- Completed tasks
('a50e8400-e29b-41d4-a716-446655440001', 'PUT-2026-001', '750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440010', 50, 50, 'COMPLETED', 'MEDIUM', '550e8400-e29b-41d4-a716-446655440003', 'AA:BB:CC:DD:EE:10', true, 4, '2026-01-15 09:00:00', '2026-01-15 09:25:00', 30, 25, '2026-01-15 12:00:00', '550e8400-e29b-41d4-a716-446655440002'),
('a50e8400-e29b-41d4-a716-446655440002', 'PUT-2026-002', '750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440011', 90, 90, 'COMPLETED', 'HIGH', '550e8400-e29b-41d4-a716-446655440003', 'AA:BB:CC:DD:EE:03', true, 4, '2026-01-20 10:15:00', '2026-01-20 10:42:00', 30, 27, '2026-01-20 14:00:00', '550e8400-e29b-41d4-a716-446655440002'),

-- Active tasks - In Progress
('a50e8400-e29b-41d4-a716-446655440003', 'PUT-2026-003', '750e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440015', 80, 35, 'MOVING', 'HIGH', '550e8400-e29b-41d4-a716-446655440003', 'AA:BB:CC:DD:EE:12', true, 2, '2026-02-11 08:30:00', null, 40, null, '2026-02-11 12:00:00', '550e8400-e29b-41d4-a716-446655440002'),
('a50e8400-e29b-41d4-a716-446655440004', 'PUT-2026-004', '750e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440012', 45, 0, 'SCANNING', 'URGENT', '550e8400-e29b-41d4-a716-446655440005', null, false, 1, '2026-02-11 09:00:00', null, 35, null, '2026-02-11 11:00:00', '550e8400-e29b-41d4-a716-446655440002'),

-- Pending tasks
('a50e8400-e29b-41d4-a716-446655440005', 'PUT-2026-005', '750e8400-e29b-41d4-a716-446655440007', '650e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440016', 50, 0, 'PENDING', 'LOW', null, null, false, 0, null, null, 30, null, '2026-02-12 16:00:00', '550e8400-e29b-41d4-a716-446655440002'),
('a50e8400-e29b-41d4-a716-446655440006', 'PUT-2026-006', '750e8400-e29b-41d4-a716-446655440008', '650e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440030', 100, 0, 'PENDING', 'MEDIUM', null, null, false, 0, null, null, 45, null, '2026-02-13 10:00:00', '550e8400-e29b-41d4-a716-446655440002');

-- ============================================================================
-- TAKE-AWAY ORDERS
-- ============================================================================

INSERT INTO take_away_orders (id, order_number, order_type, status, priority, customer_name, customer_reference, customer_po_number, shipping_address, shipping_method, tracking_number, assigned_to, total_items, total_quantity, picked_items, packed_items, picking_started_at, picking_completed_at, packed_at, shipped_at, completed_at, due_at, created_by) VALUES
-- Completed orders
('b50e8400-e29b-41d4-a716-446655440001', 'ORD-2026-001', 'CUSTOMER', 'COMPLETED', 'MEDIUM', 'ABC Manufacturing Inc', 'PO-12345', 'CUST-PO-98765', '123 Industrial Blvd, Manufacturing City, MC 12345', 'UPS Ground', '1Z999AA10123456784', '550e8400-e29b-41d4-a716-446655440005', 3, 55, 3, 3, '2026-02-08 09:00:00', '2026-02-08 10:30:00', '2026-02-08 11:00:00', '2026-02-08 14:00:00', '2026-02-08 14:00:00', '2026-02-10 17:00:00', '550e8400-e29b-41d4-a716-446655440002'),

-- Active orders - Picking
('b50e8400-e29b-41d4-a716-446655440002', 'ORD-2026-002', 'CUSTOMER', 'PICKING', 'HIGH', 'XYZ Industries LLC', 'PO-67890', 'CUST-PO-54321', '456 Tech Park Dr, Innovation City, IC 67890', 'FedEx Express', null, '550e8400-e29b-41d4-a716-446655440005', 4, 135, 2, 0, '2026-02-11 08:00:00', null, null, null, null, '2026-02-11 16:00:00', '550e8400-e29b-41d4-a716-446655440002'),

-- Active orders - Assigned but not started
('b50e8400-e29b-41d4-a716-446655440003', 'ORD-2026-003', 'TRANSFER', 'ASSIGNED', 'URGENT', 'Warehouse B - West Coast', 'TRF-001', 'WH-B-REQ-001', 'Warehouse B, 789 Distribution Way, Logistics City, LC 34567', 'Internal Transfer', null, '550e8400-e29b-41d4-a716-446655440005', 2, 75, 0, 0, null, null, null, null, null, '2026-02-11 12:00:00', '550e8400-e29b-41d4-a716-446655440002'),

-- Pending orders
('b50e8400-e29b-41d4-a716-446655440004', 'ORD-2026-004', 'CUSTOMER', 'PENDING', 'LOW', 'Tech Solutions Corp', 'PO-11111', 'CUST-PO-22222', '321 Commerce St, Business City, BC 98765', 'USPS Priority', null, null, 2, 45, 0, 0, null, null, null, null, null, '2026-02-13 17:00:00', '550e8400-e29b-41d4-a716-446655440002'),

-- Sample order
('b50e8400-e29b-41d4-a716-446655440005', 'ORD-2026-005', 'SAMPLE', 'PENDING', 'MEDIUM', 'Potential Customer Demo', 'SAMPLE-001', null, '555 Prospect Ave, Sales City, SC 11111', 'FedEx 2Day', null, null, 3, 15, 0, 0, null, null, null, null, null, '2026-02-12 12:00:00', '550e8400-e29b-41d4-a716-446655440002');

-- ============================================================================
-- TAKE-AWAY ORDER ITEMS
-- ============================================================================

INSERT INTO take_away_order_items (order_id, product_id, inventory_id, quantity_ordered, quantity_picked, quantity_packed, quantity_shipped, source_location_id, suggested_location_id, beacon_scanned, lot_number, status, picked_at, packed_at) VALUES
-- Order 1 items (completed)
('b50e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', '950e8400-e29b-41d4-a716-446655440001', 20, 20, 20, 20, '650e8400-e29b-41d4-a716-446655440010', '650e8400-e29b-41d4-a716-446655440010', 'AA:BB:CC:DD:EE:10', 'LOT-2026-001', 'SHIPPED', '2026-02-08 09:30:00', '2026-02-08 11:00:00'),
('b50e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440002', '950e8400-e29b-41d4-a716-446655440002', 30, 30, 30, 30, '650e8400-e29b-41d4-a716-446655440011', '650e8400-e29b-41d4-a716-446655440011', 'AA:BB:CC:DD:EE:03', 'LOT-2026-002', 'SHIPPED', '2026-02-08 10:00:00', '2026-02-08 11:00:00'),
('b50e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440004', '950e8400-e29b-41d4-a716-446655440004', 5, 5, 5, 5, '650e8400-e29b-41d4-a716-446655440014', '650e8400-e29b-41d4-a716-446655440014', null, 'LOT-2026-004', 'SHIPPED', '2026-02-08 10:20:00', '2026-02-08 11:00:00'),

-- Order 2 items (in progress)
('b50e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440003', '950e8400-e29b-41d4-a716-446655440003', 25, 25, 0, 0, '650e8400-e29b-41d4-a716-446655440013', '650e8400-e29b-41d4-a716-446655440013', 'AA:BB:CC:DD:EE:11', 'LOT-2026-003', 'PICKED', '2026-02-11 08:30:00', null),
('b50e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440005', '950e8400-e29b-41d4-a716-446655440005', 40, 40, 0, 0, '650e8400-e29b-41d4-a716-446655440015', '650e8400-e29b-41d4-a716-446655440015', 'AA:BB:CC:DD:EE:12', 'LOT-2026-005', 'PICKED', '2026-02-11 09:00:00', null),
('b50e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440007', '950e8400-e29b-41d4-a716-446655440006', 50, 0, 0, 0, NULL, '650e8400-e29b-41d4-a716-446655440016', null, null, 'PICKING', null, null),
('b50e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440006', '950e8400-e29b-41d4-a716-446655440010', 20, 0, 0, 0, NULL, '650e8400-e29b-41d4-a716-446655440020', null, null, 'PENDING', null, null),

-- Order 3 items (assigned)
('b50e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440001', NULL, 50, 0, 0, 0, NULL, '650e8400-e29b-41d4-a716-446655440010', null, null, 'PENDING', null, null),
('b50e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440002', NULL, 25, 0, 0, 0, NULL, '650e8400-e29b-41d4-a716-446655440011', null, null, 'PENDING', null, null),

-- Order 4 items (pending)
('b50e8400-e29b-41d4-a716-446655440004', '750e8400-e29b-41d4-a716-446655440004', NULL, 30, 0, 0, 0, NULL, '650e8400-e29b-41d4-a716-446655440014', null, null, 'PENDING', null, null),
('b50e8400-e29b-41d4-a716-446655440004', '750e8400-e29b-41d4-a716-446655440008', NULL, 15, 0, 0, 0, NULL, '650e8400-e29b-41d4-a716-446655440030', null, null, 'PENDING', null, null),

-- Order 5 items (sample)
('b50e8400-e29b-41d4-a716-446655440005', '750e8400-e29b-41d4-a716-446655440001', NULL, 5, 0, 0, 0, NULL, '650e8400-e29b-41d4-a716-446655440010', null, null, 'PENDING', null, null),
('b50e8400-e29b-41d4-a716-446655440005', '750e8400-e29b-41d4-a716-446655440003', NULL, 5, 0, 0, 0, NULL, '650e8400-e29b-41d4-a716-446655440013', null, null, 'PENDING', null, null),
('b50e8400-e29b-41d4-a716-446655440005', '750e8400-e29b-41d4-a716-446655440006', NULL, 5, 0, 0, 0, NULL, '650e8400-e29b-41d4-a716-446655440020', null, null, 'PENDING', null, null);

-- ============================================================================
-- QC INSPECTIONS
-- ============================================================================

INSERT INTO qc_inspections (id, inspection_number, inspection_type, product_id, inventory_id, location_id, quantity_inspected, quantity_passed, quantity_failed, quantity_on_hold, sample_size, status, inspector_id, disposition, lot_number, severity, beacon_scanned, inspected_at, completed_at, due_at) VALUES
-- Completed inspections - Passed
('c50e8400-e29b-41d4-a716-446655440001', 'QC-2026-001', 'RECEIVING', '750e8400-e29b-41d4-a716-446655440002', '950e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440060', 90, 90, 0, 0, 10, 'PASSED', '550e8400-e29b-41d4-a716-446655440004', 'ACCEPT', 'LOT-2026-002', 'LOW', 'AA:BB:CC:DD:EE:04', '2026-01-20 11:00:00', '2026-01-20 11:45:00', '2026-01-20 16:00:00'),
('c50e8400-e29b-41d4-a716-446655440002', 'QC-2026-002', 'RECEIVING', '750e8400-e29b-41d4-a716-446655440003', '950e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440060', 100, 100, 0, 0, 10, 'PASSED', '550e8400-e29b-41d4-a716-446655440004', 'ACCEPT', 'LOT-2026-003', 'LOW', 'AA:BB:CC:DD:EE:11', '2026-01-25 14:00:00', '2026-01-25 15:00:00', '2026-01-26 12:00:00'),

-- Failed inspection (led to hold)
('c50e8400-e29b-41d4-a716-446655440003', 'QC-2026-003', 'RECEIVING', '750e8400-e29b-41d4-a716-446655440006', '950e8400-e29b-41d4-a716-446655440040', '650e8400-e29b-41d4-a716-446655440060', 20, 5, 0, 15, 5, 'ON_HOLD', '550e8400-e29b-41d4-a716-446655440004', 'HOLD', 'LOT-2026-040', 'HIGH', 'AA:BB:CC:DD:EE:04', '2026-01-10 10:00:00', '2026-01-10 11:30:00', '2026-01-11 12:00:00'),

-- Damaged product inspection
('c50e8400-e29b-41d4-a716-446655440004', 'QC-2026-004', 'DAMAGE', '750e8400-e29b-41d4-a716-446655440002', '950e8400-e29b-41d4-a716-446655440041', '650e8400-e29b-41d4-a716-446655440060', 10, 0, 8, 2, 10, 'FAILED', '550e8400-e29b-41d4-a716-446655440004', 'REJECT', 'LOT-2026-041', 'CRITICAL', null, '2026-01-25 16:00:00', '2026-01-25 16:45:00', '2026-01-26 09:00:00'),

-- Pending inspection
('c50e8400-e29b-41d4-a716-446655440005', 'QC-2026-005', 'RECEIVING', '750e8400-e29b-41d4-a716-446655440005', '950e8400-e29b-41d4-a716-446655440030', '650e8400-e29b-41d4-a716-446655440060', 80, 0, 0, 0, 8, 'PENDING', '550e8400-e29b-41d4-a716-446655440004', NULL, 'LOT-2026-030', NULL, null, NULL, NULL, '2026-02-12 10:00:00'),

-- In Progress inspection
('c50e8400-e29b-41d4-a716-446655440006', 'QC-2026-006', 'PERIODIC', '750e8400-e29b-41d4-a716-446655440001', '950e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440060', 50, 35, 0, 0, 10, 'IN_PROGRESS', '550e8400-e29b-41d4-a716-446655440004', NULL, 'LOT-2026-001', NULL, 'AA:BB:CC:DD:EE:10', '2026-02-11 09:30:00', NULL, '2026-02-11 12:00:00');

-- ============================================================================
-- HOLD ITEMS
-- ============================================================================

INSERT INTO hold_items (id, hold_number, product_id, inventory_id, location_id, quantity, hold_reason, hold_type, severity, description, root_cause, qc_inspection_id, placed_by, reviewed_by, placed_at, reviewed_at, expires_at) VALUES
-- Active holds
('d50e8400-e29b-41d4-a716-446655440001', 'HOLD-2026-001', '750e8400-e29b-41d4-a716-446655440006', '950e8400-e29b-41d4-a716-446655440040', '650e8400-e29b-41d4-a716-446655440070', 15, 'QUALITY_ISSUE', 'TEMPORARY', 'HIGH', 'Sensor readings outside specified tolerance range. Multiple units showing calibration drift.', 'Possible calibration issue during manufacturing. Awaiting vendor response.', 'c50e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', NULL, '2026-01-10 11:30:00', NULL, '2026-02-10 11:30:00'),
('d50e8400-e29b-41d4-a716-446655440002', 'HOLD-2026-002', '750e8400-e29b-41d4-a716-446655440002', '950e8400-e29b-41d4-a716-446655440041', '650e8400-e29b-41d4-a716-446655440071', 8, 'DAMAGE', 'TEMPORARY', 'CRITICAL', 'Physical damage to packaging during transport. 8 units with crushed boxes, internal inspection required.', 'Shipping damage - improper securing during transit.', 'c50e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', '2026-01-25 16:45:00', '2026-01-26 09:00:00', '2026-02-25 16:45:00'),

-- Resolved hold
('d50e8400-e29b-41d4-a716-446655440003', 'HOLD-2026-003', '750e8400-e29b-41d4-a716-446655440003', '950e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440070', 10, 'INVESTIGATION', 'TEMPORARY', 'MEDIUM', 'Customer complaint investigation - product from same lot', 'False alarm - customer error in installation, not product defect', NULL, '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '2026-02-01 10:00:00', '2026-02-05 14:00:00', NULL);

-- Update the resolved hold with resolution
UPDATE hold_items SET 
  resolution = 'RELEASED',
  resolution_notes = 'Investigation completed. Product verified as meeting all specifications. Released back to available inventory.',
  approved_by = '550e8400-e29b-41d4-a716-446655440002',
  released_at = '2026-02-05 14:30:00'
WHERE id = 'd50e8400-e29b-41d4-a716-446655440003';

-- ============================================================================
-- LOCATION HISTORY
-- ============================================================================

INSERT INTO location_history (inventory_id, product_id, from_location_id, to_location_id, quantity, movement_type, reference_type, reference_id, beacon_id, moved_by, moved_at, distance_meters, duration_seconds, notes) VALUES
-- Historical movements
('950e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440010', 50, 'PUT_AWAY', 'PUT_AWAY_TASK', 'a50e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440003', '2026-01-15 09:25:00', 45.5, 1500, 'Put-away completed successfully'),
('950e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440011', 90, 'PUT_AWAY', 'PUT_AWAY_TASK', 'a50e8400-e29b-41d4-a716-446655440002', NULL, '550e8400-e29b-41d4-a716-446655440003', '2026-01-20 10:42:00', 52.3, 1620, 'Put-away completed successfully'),
('950e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440010', '650e8400-e29b-41d4-a716-446655440040', 20, 'PICK', 'TAKE_AWAY_ORDER', 'b50e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440005', '2026-02-08 09:30:00', 38.2, 900, 'Picked for order ORD-2026-001'),
('950e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440011', '650e8400-e29b-41d4-a716-446655440040', 30, 'PICK', 'TAKE_AWAY_ORDER', 'b50e8400-e29b-41d4-a716-446655440001', NULL, '550e8400-e29b-41d4-a716-446655440005', '2026-02-08 10:00:00', 42.8, 1080, 'Picked for order ORD-2026-001'),
('950e8400-e29b-41d4-a716-446655440040', '750e8400-e29b-41d4-a716-446655440006', '650e8400-e29b-41d4-a716-446655440060', '650e8400-e29b-41d4-a716-446655440070', 15, 'TRANSFER', 'QC_INSPECTION', 'c50e8400-e29b-41d4-a716-446655440003', NULL, '550e8400-e29b-41d4-a716-446655440004', '2026-01-10 11:30:00', 18.5, 480, 'Moved to hold area after QC failure');

-- ============================================================================
-- BLE SCAN EVENTS
-- ============================================================================

INSERT INTO ble_scan_events (beacon_id, mac_address, signal_strength, tx_power, distance_estimate, scan_type, scan_duration_ms, scanned_by, scanned_at_location_id, related_task_type, related_task_id, device_info, created_at) VALUES
-- Recent scans for active operations
('850e8400-e29b-41d4-a716-446655440001', 'AA:BB:CC:DD:EE:01', -45, -12, 1.2, 'LOCATION_CHECK', 250, '550e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440001', 'PUT_AWAY', 'a50e8400-e29b-41d4-a716-446655440003', '{"device_id": "SCANNER-003", "device_type": "Handheld", "os": "Android 12"}', NOW() - INTERVAL '15 minutes'),
('850e8400-e29b-41d4-a716-446655440012', 'AA:BB:CC:DD:EE:12', -43, -12, 0.8, 'PRODUCT_VERIFICATION', 180, '550e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440015', 'PUT_AWAY', 'a50e8400-e29b-41d4-a716-446655440003', '{"device_id": "SCANNER-003", "device_type": "Handheld", "os": "Android 12"}', NOW() - INTERVAL '10 minutes'),
('850e8400-e29b-41d4-a716-446655440011', 'AA:BB:CC:DD:EE:11', -48, -12, 1.8, 'PRODUCT_VERIFICATION', 200, '550e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440013', 'TAKE_AWAY', 'b50e8400-e29b-41d4-a716-446655440002', '{"device_id": "SCANNER-005", "device_type": "Handheld", "os": "Android 12"}', NOW() - INTERVAL '2 hours'),
('850e8400-e29b-41d4-a716-446655440012', 'AA:BB:CC:DD:EE:12', -40, -12, 0.6, 'PRODUCT_VERIFICATION', 175, '550e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440015', 'TAKE_AWAY', 'b50e8400-e29b-41d4-a716-446655440002', '{"device_id": "SCANNER-005", "device_type": "Handheld", "os": "Android 12"}', NOW() - INTERVAL '1 hour'),
('850e8400-e29b-41d4-a716-446655440010', 'AA:BB:CC:DD:EE:10', -42, -12, 0.9, 'PRODUCT_VERIFICATION', 195, '550e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440060', 'QC', 'c50e8400-e29b-41d4-a716-446655440006', '{"device_id": "SCANNER-QC-001", "device_type": "Handheld", "os": "iOS 16"}', NOW() - INTERVAL '30 minutes'),
('850e8400-e29b-41d4-a716-446655440004', 'AA:BB:CC:DD:EE:04', -44, -12, 1.1, 'LOCATION_CHECK', 220, '550e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440060', 'QC', 'c50e8400-e29b-41d4-a716-446655440006', '{"device_id": "SCANNER-QC-001", "device_type": "Handheld", "os": "iOS 16"}', NOW() - INTERVAL '25 minutes');

-- ============================================================================
-- ACTIVITY LOGS
-- ============================================================================

INSERT INTO activity_logs (activity_type, entity_type, entity_id, action, severity, user_id, metadata) VALUES
('PUT_AWAY', 'TASK', 'a50e8400-e29b-41d4-a716-446655440001', 'Put-away task PUT-2026-001 completed successfully', 'INFO', '550e8400-e29b-41d4-a716-446655440003', '{"duration_minutes": 25, "efficiency": "high"}'),
('PUT_AWAY', 'TASK', 'a50e8400-e29b-41d4-a716-446655440002', 'Put-away task PUT-2026-002 completed successfully', 'INFO', '550e8400-e29b-41d4-a716-446655440003', '{"duration_minutes": 27, "efficiency": "medium"}'),
('TAKE_AWAY', 'ORDER', 'b50e8400-e29b-41d4-a716-446655440002', 'Order ORD-2026-002 picking started', 'INFO', '550e8400-e29b-41d4-a716-446655440005', '{"total_items": 4, "priority": "HIGH"}'),
('QC_INSPECTION', 'INSPECTION', 'c50e8400-e29b-41d4-a716-446655440003', 'QC inspection QC-2026-003 failed - 15 units placed on hold', 'WARNING', '550e8400-e29b-41d4-a716-446655440004', '{"reason": "Out of tolerance", "severity": "HIGH"}'),
('HOLD', 'PRODUCT', '750e8400-e29b-41d4-a716-446655440006', '15 units of SKU-006 placed on hold due to quality issue', 'WARNING', '550e8400-e29b-41d4-a716-446655440004', '{"hold_number": "HOLD-2026-001", "lot": "LOT-2026-040"}'),
('LOCATION_CHANGE', 'INVENTORY', '950e8400-e29b-41d4-a716-446655440001', 'Moved 50 units from RCV-01 to A-01-01', 'INFO', '550e8400-e29b-41d4-a716-446655440003', '{"movement_type": "PUT_AWAY", "distance_m": 45.5}'),
('BEACON_EVENT', 'BEACON', '850e8400-e29b-41d4-a716-446655440020', 'Low battery warning - Beacon-Forklift-01 at 65%', 'WARNING', NULL, '{"battery_level": 65, "threshold": 70}'),
('SYSTEM_EVENT', 'LOCATION', '650e8400-e29b-41d4-a716-446655440013', 'Location A-02-01 reached full capacity', 'INFO', NULL, '{"capacity": 100, "occupancy": 100, "zone": "A"}'),
('USER_ACTION', 'USER', '550e8400-e29b-41d4-a716-446655440005', 'User jane.picker logged in', 'INFO', '550e8400-e29b-41d4-a716-446655440005', '{"login_time": "2026-02-11 08:00:00", "device": "SCANNER-005"}');

-- ============================================================================
-- UPDATE USER LOGIN STATS
-- ============================================================================

UPDATE users SET 
  last_login_at = NOW() - INTERVAL '2 hours',
  login_count = 245
WHERE id = '550e8400-e29b-41d4-a716-446655440003';

UPDATE users SET 
  last_login_at = NOW() - INTERVAL '10 minutes',
  login_count = 189,
  current_task_count = 2
WHERE id = '550e8400-e29b-41d4-a716-446655440005';

UPDATE users SET 
  last_login_at = NOW() - INTERVAL '30 minutes',
  login_count = 312,
  current_task_count = 1
WHERE id = '550e8400-e29b-41d4-a716-446655440004';

-- ============================================================================
-- SUMMARY STATISTICS
-- ============================================================================
-- Run these queries to see current state:

-- SELECT 'Total Products' as metric, COUNT(*) as value FROM products WHERE is_active = true AND deleted_at IS NULL
-- UNION ALL
-- SELECT 'Total Locations', COUNT(*) FROM warehouse_locations WHERE is_available = true
-- UNION ALL
-- SELECT 'Active Beacons', COUNT(*) FROM ble_beacons WHERE is_active = true
-- UNION ALL
-- SELECT 'Total Inventory Records', COUNT(*) FROM inventory
-- UNION ALL
-- SELECT 'Available Inventory Units', SUM(available_quantity) FROM inventory WHERE status = 'AVAILABLE'
-- UNION ALL
-- SELECT 'Active Put-Away Tasks', COUNT(*) FROM put_away_tasks WHERE status NOT IN ('COMPLETED', 'CANCELLED')
-- UNION ALL
-- SELECT 'Active Orders', COUNT(*) FROM take_away_orders WHERE status NOT IN ('COMPLETED', 'CANCELLED')
-- UNION ALL
-- SELECT 'Items on Hold', SUM(quantity) FROM hold_items WHERE resolution IS NULL
-- UNION ALL
-- SELECT 'Pending QC Inspections', COUNT(*) FROM qc_inspections WHERE status IN ('PENDING', 'IN_PROGRESS')
-- UNION ALL
-- SELECT 'Low Battery Beacons', COUNT(*) FROM ble_beacons WHERE battery_level < 20 AND is_active = true;
