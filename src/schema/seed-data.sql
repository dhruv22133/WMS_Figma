-- ============================================================================
-- Sample/Seed Data for BLE-based Warehouse Management System
-- Use this for development and testing
-- ============================================================================

-- ============================================================================
-- USERS
-- ============================================================================

INSERT INTO users (id, username, email, full_name, role, department, employee_id, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin', 'admin@warehouse.com', 'Admin User', 'ADMIN', 'Management', 'EMP001', true),
('550e8400-e29b-41d4-a716-446655440002', 'john.manager', 'john.manager@warehouse.com', 'John Manager', 'WAREHOUSE_MANAGER', 'Operations', 'EMP002', true),
('550e8400-e29b-41d4-a716-446655440003', 'sarah.staff', 'sarah.staff@warehouse.com', 'Sarah Staff', 'WAREHOUSE_STAFF', 'Operations', 'EMP003', true),
('550e8400-e29b-41d4-a716-446655440004', 'mike.qc', 'mike.qc@warehouse.com', 'Mike QC Inspector', 'QC_INSPECTOR', 'Quality Control', 'EMP004', true),
('550e8400-e29b-41d4-a716-446655440005', 'jane.picker', 'jane.picker@warehouse.com', 'Jane Picker', 'WAREHOUSE_STAFF', 'Operations', 'EMP005', true);

-- ============================================================================
-- WAREHOUSE LOCATIONS
-- ============================================================================

-- Receiving Area
INSERT INTO warehouse_locations (id, location_code, location_type, zone, aisle, rack, shelf, capacity, is_available) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'RCV-01', 'RECEIVING', 'R', '00', '00', '00', 500, true),
('650e8400-e29b-41d4-a716-446655440002', 'RCV-02', 'RECEIVING', 'R', '00', '00', '00', 500, true);

-- Storage Area - Zone A
INSERT INTO warehouse_locations (id, location_code, location_type, zone, aisle, rack, shelf, capacity, current_occupancy, is_available) VALUES
('650e8400-e29b-41d4-a716-446655440010', 'A-01-01', 'STORAGE', 'A', '01', '01', '01', 100, 45, true),
('650e8400-e29b-41d4-a716-446655440011', 'A-01-02', 'STORAGE', 'A', '01', '01', '02', 100, 80, true),
('650e8400-e29b-41d4-a716-446655440012', 'A-01-03', 'STORAGE', 'A', '01', '01', '03', 100, 0, true),
('650e8400-e29b-41d4-a716-446655440013', 'A-02-01', 'STORAGE', 'A', '02', '01', '01', 100, 100, false),
('650e8400-e29b-41d4-a716-446655440014', 'A-02-02', 'STORAGE', 'A', '02', '01', '02', 100, 25, true);

-- Storage Area - Zone B (Temperature Controlled)
INSERT INTO warehouse_locations (id, location_code, location_type, zone, aisle, rack, shelf, capacity, current_occupancy, is_available, temperature_controlled) VALUES
('650e8400-e29b-41d4-a716-446655440020', 'B-01-01', 'STORAGE', 'B', '01', '01', '01', 50, 30, true, true),
('650e8400-e29b-41d4-a716-446655440021', 'B-01-02', 'STORAGE', 'B', '01', '01', '02', 50, 20, true, true);

-- Picking Area
INSERT INTO warehouse_locations (id, location_code, location_type, zone, aisle, rack, shelf, capacity, is_available) VALUES
('650e8400-e29b-41d4-a716-446655440030', 'PICK-01', 'PICKING', 'P', '00', '00', '00', 200, true),
('650e8400-e29b-41d4-a716-446655440031', 'PICK-02', 'PICKING', 'P', '00', '00', '00', 200, true);

-- Shipping Area
INSERT INTO warehouse_locations (id, location_code, location_type, zone, aisle, rack, shelf, capacity, is_available) VALUES
('650e8400-e29b-41d4-a716-446655440040', 'SHIP-01', 'SHIPPING', 'S', '00', '00', '00', 300, true);

-- Quality Control Area
INSERT INTO warehouse_locations (id, location_code, location_type, zone, aisle, rack, shelf, capacity, is_available) VALUES
('650e8400-e29b-41d4-a716-446655440050', 'QC-01', 'QC', 'Q', '00', '00', '00', 100, true);

-- Hold Area
INSERT INTO warehouse_locations (id, location_code, location_type, zone, aisle, rack, shelf, capacity, current_occupancy, is_available) VALUES
('650e8400-e29b-41d4-a716-446655440060', 'HOLD-01', 'HOLD', 'H', '00', '00', '00', 100, 15, true);

-- ============================================================================
-- PRODUCTS
-- ============================================================================

INSERT INTO products (id, sku, name, description, category, unit_of_measure, weight, reorder_point, requires_quality_check, created_by) VALUES
('750e8400-e29b-41d4-a716-446655440001', 'SKU-001', 'Widget A', 'Standard widget for assembly', 'Electronics', 'EA', 2.5, 50, false, '550e8400-e29b-41d4-a716-446655440001'),
('750e8400-e29b-41d4-a716-446655440002', 'SKU-002', 'Component B', 'Electronic component - fragile', 'Electronics', 'BOX', 0.5, 100, true, '550e8400-e29b-41d4-a716-446655440001'),
('750e8400-e29b-41d4-a716-446655440003', 'SKU-003', 'Circuit Board C', 'Main circuit board assembly', 'Electronics', 'EA', 1.2, 25, true, '550e8400-e29b-41d4-a716-446655440001'),
('750e8400-e29b-41d4-a716-446655440004', 'SKU-004', 'Cable Assembly D', '5m cable assembly', 'Cables', 'EA', 0.8, 75, false, '550e8400-e29b-41d4-a716-446655440001'),
('750e8400-e29b-41d4-a716-446655440005', 'SKU-005', 'Power Supply E', '12V power supply unit', 'Electronics', 'EA', 3.5, 30, true, '550e8400-e29b-41d4-a716-446655440001'),
('750e8400-e29b-41d4-a716-446655440006', 'SKU-006', 'Sensor Module F', 'Temperature sensor module', 'Sensors', 'EA', 0.3, 40, true, '550e8400-e29b-41d4-a716-446655440001'),
('750e8400-e29b-41d4-a716-446655440007', 'SKU-007', 'Packaging Material', 'Anti-static packaging', 'Packaging', 'ROLL', 5.0, 20, false, '550e8400-e29b-41d4-a716-446655440001');

-- ============================================================================
-- BLE BEACONS
-- ============================================================================

INSERT INTO ble_beacons (id, mac_address, beacon_name, beacon_type, battery_level, signal_strength, firmware_version, is_active, last_seen_at, associated_location_id) VALUES
-- Location beacons
('850e8400-e29b-41d4-a716-446655440001', 'AA:BB:CC:DD:EE:01', 'Beacon-RCV-01', 'LOCATION', 85, -45, 'v2.1.0', true, NOW() - INTERVAL '5 minutes', '650e8400-e29b-41d4-a716-446655440001'),
('850e8400-e29b-41d4-a716-446655440002', 'AA:BB:CC:DD:EE:02', 'Beacon-A-01-01', 'LOCATION', 92, -42, 'v2.1.0', true, NOW() - INTERVAL '3 minutes', '650e8400-e29b-41d4-a716-446655440010'),
('850e8400-e29b-41d4-a716-446655440003', 'AA:BB:CC:DD:EE:03', 'Beacon-A-01-02', 'LOCATION', 78, -48, 'v2.1.0', true, NOW() - INTERVAL '10 minutes', '650e8400-e29b-41d4-a716-446655440011'),
('850e8400-e29b-41d4-a716-446655440004', 'AA:BB:CC:DD:EE:04', 'Beacon-QC-01', 'LOCATION', 88, -44, 'v2.1.0', true, NOW() - INTERVAL '2 minutes', '650e8400-e29b-41d4-a716-446655440050'),
-- Product beacons
('850e8400-e29b-41d4-a716-446655440010', 'AA:BB:CC:DD:EE:10', 'Beacon-Product-001', 'PRODUCT', 95, -40, 'v2.1.0', true, NOW() - INTERVAL '1 minute', NULL),
('850e8400-e29b-41d4-a716-446655440011', 'AA:BB:CC:DD:EE:11', 'Beacon-Product-002', 'PRODUCT', 72, -52, 'v2.1.0', true, NOW() - INTERVAL '15 minutes', NULL),
('850e8400-e29b-41d4-a716-446655440012', 'AA:BB:CC:DD:EE:12', 'Beacon-Product-003', 'PRODUCT', 90, -43, 'v2.1.0', true, NOW() - INTERVAL '8 minutes', NULL),
-- Mobile beacons
('850e8400-e29b-41d4-a716-446655440020', 'AA:BB:CC:DD:EE:20', 'Beacon-Mobile-01', 'MOBILE', 65, -55, 'v2.1.0', true, NOW() - INTERVAL '1 hour', NULL);

-- ============================================================================
-- INVENTORY
-- ============================================================================

INSERT INTO inventory (id, product_id, location_id, quantity, status, lot_number, received_date, beacon_id) VALUES
-- Products in storage
('950e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440010', 45, 'AVAILABLE', 'LOT-2024-001', '2024-01-15', '850e8400-e29b-41d4-a716-446655440010'),
('950e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440011', 80, 'AVAILABLE', 'LOT-2024-002', '2024-01-20', NULL),
('950e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440013', 100, 'AVAILABLE', 'LOT-2024-003', '2024-01-25', '850e8400-e29b-41d4-a716-446655440011'),
('950e8400-e29b-41d4-a716-446655440004', '750e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440014', 25, 'AVAILABLE', 'LOT-2024-004', '2024-02-01', NULL),
-- Products in receiving
('950e8400-e29b-41d4-a716-446655440010', '750e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440001', 30, 'IN_TRANSIT', 'LOT-2024-010', CURRENT_DATE, '850e8400-e29b-41d4-a716-446655440012'),
-- Products on hold
('950e8400-e29b-41d4-a716-446655440020', '750e8400-e29b-41d4-a716-446655440006', '650e8400-e29b-41d4-a716-446655440060', 15, 'ON_HOLD', 'LOT-2024-020', '2024-01-10', NULL);

-- ============================================================================
-- PUT-AWAY TASKS
-- ============================================================================

INSERT INTO put_away_tasks (id, task_number, product_id, source_location_id, destination_location_id, quantity, status, priority, assigned_to, step_completed, created_by) VALUES
-- Completed tasks
('a50e8400-e29b-41d4-a716-446655440001', 'PUT-2024-001', '750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440010', 45, 'COMPLETED', 'MEDIUM', '550e8400-e29b-41d4-a716-446655440003', 4, '550e8400-e29b-41d4-a716-446655440002'),
-- Active tasks
('a50e8400-e29b-41d4-a716-446655440002', 'PUT-2024-002', '750e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440012', 30, 'MOVING', 'HIGH', '550e8400-e29b-41d4-a716-446655440003', 2, '550e8400-e29b-41d4-a716-446655440002'),
-- Pending tasks
('a50e8400-e29b-41d4-a716-446655440003', 'PUT-2024-003', '750e8400-e29b-41d4-a716-446655440007', '650e8400-e29b-41d4-a716-446655440002', NULL, 50, 'PENDING', 'LOW', NULL, 0, '550e8400-e29b-41d4-a716-446655440002');

-- ============================================================================
-- TAKE-AWAY ORDERS
-- ============================================================================

INSERT INTO take_away_orders (id, order_number, order_type, status, priority, customer_name, customer_reference, assigned_to, created_by) VALUES
-- Completed orders
('b50e8400-e29b-41d4-a716-446655440001', 'ORD-2024-001', 'CUSTOMER', 'COMPLETED', 'MEDIUM', 'ABC Manufacturing', 'PO-12345', '550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002'),
-- Active orders
('b50e8400-e29b-41d4-a716-446655440002', 'ORD-2024-002', 'CUSTOMER', 'PICKING', 'HIGH', 'XYZ Industries', 'PO-67890', '550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002'),
-- Pending orders
('b50e8400-e29b-41d4-a716-446655440003', 'ORD-2024-003', 'TRANSFER', 'PENDING', 'URGENT', 'Warehouse B', 'TRF-001', NULL, '550e8400-e29b-41d4-a716-446655440002');

-- ============================================================================
-- TAKE-AWAY ORDER ITEMS
-- ============================================================================

INSERT INTO take_away_order_items (order_id, product_id, inventory_id, quantity_ordered, quantity_picked, quantity_packed, source_location_id, status) VALUES
-- Order 1 items (completed)
('b50e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', '950e8400-e29b-41d4-a716-446655440001', 10, 10, 10, '650e8400-e29b-41d4-a716-446655440010', 'SHIPPED'),
('b50e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440002', '950e8400-e29b-41d4-a716-446655440002', 20, 20, 20, '650e8400-e29b-41d4-a716-446655440011', 'SHIPPED'),
-- Order 2 items (in progress)
('b50e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440003', '950e8400-e29b-41d4-a716-446655440003', 15, 10, 0, '650e8400-e29b-41d4-a716-446655440013', 'PICKING'),
('b50e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440004', '950e8400-e29b-41d4-a716-446655440004', 5, 0, 0, '650e8400-e29b-41d4-a716-446655440014', 'PENDING'),
-- Order 3 items (pending)
('b50e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440001', NULL, 25, 0, 0, NULL, 'PENDING');

-- ============================================================================
-- QC INSPECTIONS
-- ============================================================================

INSERT INTO qc_inspections (id, inspection_number, inspection_type, product_id, inventory_id, location_id, quantity_inspected, quantity_passed, quantity_failed, status, inspector_id, disposition, inspected_at, created_by) VALUES
-- Completed inspections
('c50e8400-e29b-41d4-a716-446655440001', 'QC-2024-001', 'RECEIVING', '750e8400-e29b-41d4-a716-446655440002', '950e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440050', 80, 80, 0, 'PASSED', '550e8400-e29b-41d4-a716-446655440004', 'ACCEPT', NOW() - INTERVAL '2 days', '550e8400-e29b-41d4-a716-446655440004'),
-- Failed inspection
('c50e8400-e29b-41d4-a716-446655440002', 'QC-2024-002', 'RECEIVING', '750e8400-e29b-41d4-a716-446655440006', '950e8400-e29b-41d4-a716-446655440020', '650e8400-e29b-41d4-a716-446655440050', 20, 5, 15, 'FAILED', '550e8400-e29b-41d4-a716-446655440004', 'HOLD', NOW() - INTERVAL '1 day', '550e8400-e29b-41d4-a716-446655440004'),
-- Pending inspection
('c50e8400-e29b-41d4-a716-446655440003', 'QC-2024-003', 'PERIODIC', '750e8400-e29b-41d4-a716-446655440003', '950e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440050', 50, 0, 0, 'PENDING', '550e8400-e29b-41d4-a716-446655440004', NULL, NULL, '550e8400-e29b-41d4-a716-446655440004');

-- ============================================================================
-- HOLD ITEMS
-- ============================================================================

INSERT INTO hold_items (id, hold_number, product_id, inventory_id, location_id, quantity, hold_reason, hold_type, severity, description, qc_inspection_id, placed_by, placed_at) VALUES
('d50e8400-e29b-41d4-a716-446655440001', 'HOLD-2024-001', '750e8400-e29b-41d4-a716-446655440006', '950e8400-e29b-41d4-a716-446655440020', '650e8400-e29b-41d4-a716-446655440060', 15, 'QUALITY_ISSUE', 'TEMPORARY', 'HIGH', 'Failed quality inspection - sensor readings outside tolerance', 'c50e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', NOW() - INTERVAL '1 day');

-- ============================================================================
-- LOCATION HISTORY
-- ============================================================================

INSERT INTO location_history (inventory_id, product_id, from_location_id, to_location_id, quantity, movement_type, reference_type, reference_id, moved_by, moved_at) VALUES
-- Product movements
('950e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440010', 45, 'PUT_AWAY', 'PUT_AWAY_TASK', 'a50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', NOW() - INTERVAL '3 days'),
('950e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440011', 80, 'PUT_AWAY', 'PUT_AWAY_TASK', NULL, '550e8400-e29b-41d4-a716-446655440003', NOW() - INTERVAL '5 days'),
('950e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440010', '650e8400-e29b-41d4-a716-446655440030', 10, 'PICK', 'TAKE_AWAY_ORDER', 'b50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440005', NOW() - INTERVAL '1 day'),
('950e8400-e29b-41d4-a716-446655440020', '750e8400-e29b-41d4-a716-446655440006', '650e8400-e29b-41d4-a716-446655440050', '650e8400-e29b-41d4-a716-446655440060', 15, 'TRANSFER', 'QC_INSPECTION', 'c50e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', NOW() - INTERVAL '1 day');

-- ============================================================================
-- BLE SCAN EVENTS
-- ============================================================================

INSERT INTO ble_scan_events (beacon_id, mac_address, signal_strength, scan_type, scanned_by, scanned_at_location_id, related_task_type, related_task_id) VALUES
-- Recent scans
('850e8400-e29b-41d4-a716-446655440001', 'AA:BB:CC:DD:EE:01', -45, 'LOCATION_CHECK', '550e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440001', 'PUT_AWAY', 'a50e8400-e29b-41d4-a716-446655440002'),
('850e8400-e29b-41d4-a716-446655440010', 'AA:BB:CC:DD:EE:10', -40, 'PRODUCT_VERIFICATION', '550e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440010', 'PUT_AWAY', 'a50e8400-e29b-41d4-a716-446655440001'),
('850e8400-e29b-41d4-a716-446655440011', 'AA:BB:CC:DD:EE:11', -52, 'PRODUCT_VERIFICATION', '550e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440013', 'TAKE_AWAY', 'b50e8400-e29b-41d4-a716-446655440002'),
('850e8400-e29b-41d4-a716-446655440004', 'AA:BB:CC:DD:EE:04', -44, 'LOCATION_CHECK', '550e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440050', 'QC', 'c50e8400-e29b-41d4-a716-446655440003');

-- ============================================================================
-- ACTIVITY LOGS
-- ============================================================================

INSERT INTO activity_logs (activity_type, entity_type, entity_id, action, user_id) VALUES
('PUT_AWAY', 'TASK', 'a50e8400-e29b-41d4-a716-446655440001', 'Put-away task PUT-2024-001 completed', '550e8400-e29b-41d4-a716-446655440003'),
('TAKE_AWAY', 'ORDER', 'b50e8400-e29b-41d4-a716-446655440002', 'Order ORD-2024-002 picking started', '550e8400-e29b-41d4-a716-446655440005'),
('QC_INSPECTION', 'INSPECTION', 'c50e8400-e29b-41d4-a716-446655440002', 'QC inspection failed for 15 units of SKU-006', '550e8400-e29b-41d4-a716-446655440004'),
('HOLD', 'PRODUCT', '750e8400-e29b-41d4-a716-446655440006', '15 units placed on hold due to quality issue', '550e8400-e29b-41d4-a716-446655440004'),
('LOCATION_CHANGE', 'INVENTORY', '950e8400-e29b-41d4-a716-446655440001', 'Moved 45 units from RCV-01 to A-01-01', '550e8400-e29b-41d4-a716-446655440003');
