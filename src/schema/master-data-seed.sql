-- ============================================================================
-- MASTER DATA - Initial Seed Data
-- Reference data for warehouse management system
-- ============================================================================

-- ============================================================================
-- PRODUCT CATEGORIES
-- ============================================================================

INSERT INTO master_product_categories (id, code, name, description, parent_id, level, requires_quality_check, requires_temperature_control, default_shelf_life_days, display_order) VALUES
-- Level 0 (Root categories)
('m-cat-001', 'ELECTRONICS', 'Electronics', 'Electronic components and devices', NULL, 0, true, false, 1095, 1),
('m-cat-002', 'HARDWARE', 'Hardware', 'Mechanical hardware and fasteners', NULL, 0, false, false, NULL, 2),
('m-cat-003', 'SUPPLIES', 'Supplies', 'General warehouse supplies', NULL, 0, false, false, NULL, 3),
('m-cat-004', 'CHEMICALS', 'Chemicals', 'Chemical products requiring special handling', NULL, 0, true, true, 365, 4),
('m-cat-005', 'PACKAGING', 'Packaging', 'Packaging materials', NULL, 0, false, false, NULL, 5);

-- Level 1 (Sub-categories)
INSERT INTO master_product_categories (id, code, name, description, parent_id, level, requires_quality_check, display_order) VALUES
('m-cat-101', 'ELEC-COMP', 'Components', 'Electronic components', 'm-cat-001', 1, true, 1),
('m-cat-102', 'ELEC-PCB', 'Circuit Boards', 'PCBs and assemblies', 'm-cat-001', 1, true, 2),
('m-cat-103', 'ELEC-CABLE', 'Cables', 'Cables and connectors', 'm-cat-001', 1, false, 3),
('m-cat-104', 'ELEC-POWER', 'Power Supplies', 'Power supply units', 'm-cat-001', 1, true, 4),
('m-cat-105', 'ELEC-SENSOR', 'Sensors', 'Sensor modules', 'm-cat-001', 1, true, 5),
('m-cat-201', 'HARD-FAST', 'Fasteners', 'Screws, bolts, nuts', 'm-cat-002', 1, false, 1),
('m-cat-202', 'HARD-TOOL', 'Tools', 'Hand and power tools', 'm-cat-002', 1, false, 2),
('m-cat-301', 'SUPP-LABEL', 'Labels', 'Label stock and supplies', 'm-cat-003', 1, false, 1),
('m-cat-302', 'SUPP-CLEAN', 'Cleaning', 'Cleaning supplies', 'm-cat-003', 1, false, 2),
('m-cat-401', 'CHEM-SOLDER', 'Soldering', 'Soldering materials', 'm-cat-004', 1, true, 1),
('m-cat-501', 'PACK-ESD', 'ESD Protection', 'Anti-static packaging', 'm-cat-005', 1, false, 1),
('m-cat-502', 'PACK-BOX', 'Boxes', 'Shipping boxes', 'm-cat-005', 1, false, 2);

-- ============================================================================
-- UNITS OF MEASURE
-- ============================================================================

INSERT INTO master_units_of_measure (code, name, description, unit_type, base_unit, conversion_factor, symbol, display_order) VALUES
-- Quantity
('EA', 'Each', 'Individual unit', 'QUANTITY', 'EA', 1.0, 'ea', 1),
('PAIR', 'Pair', 'Set of two', 'QUANTITY', 'EA', 2.0, 'pr', 2),
('DOZEN', 'Dozen', 'Set of twelve', 'QUANTITY', 'EA', 12.0, 'dz', 3),
('BOX', 'Box', 'Boxed quantity', 'QUANTITY', 'EA', NULL, 'box', 4),
('CASE', 'Case', 'Case quantity', 'QUANTITY', 'EA', NULL, 'cs', 5),
('PALLET', 'Pallet', 'Full pallet', 'QUANTITY', 'EA', NULL, 'plt', 6),
('KIT', 'Kit', 'Complete kit', 'QUANTITY', 'EA', 1.0, 'kit', 7),
('SET', 'Set', 'Complete set', 'QUANTITY', 'EA', 1.0, 'set', 8),
('PACK', 'Pack', 'Package', 'QUANTITY', 'EA', NULL, 'pk', 9),

-- Weight
('KG', 'Kilogram', 'Metric weight', 'WEIGHT', 'KG', 1.0, 'kg', 10),
('G', 'Gram', 'Metric weight', 'WEIGHT', 'KG', 0.001, 'g', 11),
('LB', 'Pound', 'Imperial weight', 'WEIGHT', 'KG', 0.453592, 'lb', 12),
('OZ', 'Ounce', 'Imperial weight', 'WEIGHT', 'KG', 0.0283495, 'oz', 13),

-- Volume
('LITER', 'Liter', 'Metric volume', 'VOLUME', 'LITER', 1.0, 'L', 14),
('ML', 'Milliliter', 'Metric volume', 'VOLUME', 'LITER', 0.001, 'mL', 15),
('GAL', 'Gallon', 'US gallon', 'VOLUME', 'LITER', 3.78541, 'gal', 16),

-- Length
('METER', 'Meter', 'Metric length', 'LENGTH', 'METER', 1.0, 'm', 17),
('CM', 'Centimeter', 'Metric length', 'LENGTH', 'METER', 0.01, 'cm', 18),
('INCH', 'Inch', 'Imperial length', 'LENGTH', 'METER', 0.0254, 'in', 19),
('FOOT', 'Foot', 'Imperial length', 'LENGTH', 'METER', 0.3048, 'ft', 20),

-- Specialized
('ROLL', 'Roll', 'Roll of material', 'QUANTITY', 'EA', 1.0, 'roll', 21),
('SHEET', 'Sheet', 'Sheet of material', 'QUANTITY', 'EA', 1.0, 'sht', 22),
('BOTTLE', 'Bottle', 'Bottled quantity', 'QUANTITY', 'EA', 1.0, 'btl', 23),
('TUBE', 'Tube', 'Tube quantity', 'QUANTITY', 'EA', 1.0, 'tube', 24);

-- ============================================================================
-- WAREHOUSE ZONES
-- ============================================================================

INSERT INTO master_warehouse_zones (code, name, description, zone_type, temperature_controlled, min_temperature, max_temperature, color_code, display_order) VALUES
('R', 'Receiving', 'Receiving and intake area', 'RECEIVING', false, NULL, NULL, '#3B82F6', 1),
('A', 'Storage Zone A', 'General storage - electronics', 'STORAGE', false, NULL, NULL, '#10B981', 2),
('B', 'Storage Zone B', 'Temperature controlled storage', 'STORAGE', true, 2.0, 8.0, '#06B6D4', 3),
('C', 'Storage Zone C', 'Bulk storage', 'STORAGE', false, NULL, NULL, '#8B5CF6', 4),
('P', 'Picking', 'Order picking area', 'PICKING', false, NULL, NULL, '#F59E0B', 5),
('S', 'Shipping', 'Outbound shipping area', 'SHIPPING', false, NULL, NULL, '#EF4444', 6),
('Q', 'Quality Control', 'QC inspection area', 'QC', false, NULL, NULL, '#EC4899', 7),
('H', 'Hold', 'Hold and quarantine area', 'HOLD', false, NULL, NULL, '#6B7280', 8),
('ST', 'Staging', 'Staging area for transfers', 'STAGING', false, NULL, NULL, '#14B8A6', 9),
('RT', 'Returns', 'Customer returns processing', 'RETURNS', false, NULL, NULL, '#F97316', 10);

-- ============================================================================
-- LOCATION TYPES
-- ============================================================================

INSERT INTO master_location_types (code, name, description, default_capacity, default_max_weight, allows_mixed_products, requires_beacon, color_code) VALUES
('RECEIVING', 'Receiving Area', 'Incoming goods receiving', 500, 2000.00, true, true, '#3B82F6'),
('STORAGE', 'Storage Location', 'Standard storage rack', 100, 500.00, false, true, '#10B981'),
('BULK', 'Bulk Storage', 'High-capacity bulk storage', 1000, 5000.00, true, true, '#8B5CF6'),
('PICKING', 'Pick Location', 'Order picking location', 200, 300.00, true, false, '#F59E0B'),
('SHIPPING', 'Shipping Dock', 'Outbound shipping dock', 300, 1500.00, true, true, '#EF4444'),
('QC', 'QC Station', 'Quality control inspection', 100, 200.00, true, true, '#EC4899'),
('HOLD', 'Hold Area', 'Quarantine/hold location', 100, 500.00, true, true, '#6B7280'),
('STAGING', 'Staging Area', 'Transfer staging', 200, 800.00, true, false, '#14B8A6'),
('RETURNS', 'Returns Area', 'Returns processing', 150, 400.00, true, true, '#F97316'),
('TEMP_CTRL', 'Temperature Controlled', 'Refrigerated storage', 50, 250.00, false, true, '#06B6D4');

-- ============================================================================
-- PRIORITY LEVELS
-- ============================================================================

INSERT INTO master_priority_levels (code, name, description, level, sla_hours, color_code) VALUES
('URGENT', 'Urgent', 'Immediate attention required - SLA 2 hours', 1, 2, '#DC2626'),
('HIGH', 'High', 'High priority - SLA 4 hours', 2, 4, '#F97316'),
('MEDIUM', 'Medium', 'Standard priority - SLA 8 hours', 3, 8, '#F59E0B'),
('LOW', 'Low', 'Low priority - SLA 24 hours', 4, 24, '#10B981'),
('ROUTINE', 'Routine', 'Routine work - SLA 48 hours', 5, 48, '#6B7280');

-- ============================================================================
-- STATUSES
-- ============================================================================

-- Put-Away Statuses
INSERT INTO master_statuses (code, name, description, status_type, is_terminal, is_successful, color_code, next_statuses, display_order) VALUES
('PA_PENDING', 'Pending', 'Task created, awaiting assignment', 'PUT_AWAY', false, NULL, '#6B7280', ARRAY['PA_ASSIGNED', 'PA_CANCELLED'], 1),
('PA_ASSIGNED', 'Assigned', 'Task assigned to worker', 'PUT_AWAY', false, NULL, '#3B82F6', ARRAY['PA_SCANNING', 'PA_CANCELLED'], 2),
('PA_SCANNING', 'Scanning', 'Scanning items and location', 'PUT_AWAY', false, NULL, '#8B5CF6', ARRAY['PA_MOVING', 'PA_FAILED'], 3),
('PA_MOVING', 'Moving', 'Transporting to destination', 'PUT_AWAY', false, NULL, '#F59E0B', ARRAY['PA_PLACING', 'PA_FAILED'], 4),
('PA_PLACING', 'Placing', 'Placing in final location', 'PUT_AWAY', false, NULL, '#F97316', ARRAY['PA_COMPLETED', 'PA_FAILED'], 5),
('PA_COMPLETED', 'Completed', 'Put-away completed successfully', 'PUT_AWAY', true, true, '#10B981', ARRAY[]::TEXT[], 6),
('PA_CANCELLED', 'Cancelled', 'Task cancelled', 'PUT_AWAY', true, false, '#EF4444', ARRAY[]::TEXT[], 7),
('PA_FAILED', 'Failed', 'Task failed', 'PUT_AWAY', true, false, '#DC2626', ARRAY[]::TEXT[], 8);

-- Take-Away Statuses
INSERT INTO master_statuses (code, name, description, status_type, is_terminal, is_successful, color_code, next_statuses, display_order) VALUES
('TA_PENDING', 'Pending', 'Order created, not yet assigned', 'TAKE_AWAY', false, NULL, '#6B7280', ARRAY['TA_ASSIGNED', 'TA_CANCELLED'], 1),
('TA_ASSIGNED', 'Assigned', 'Order assigned to picker', 'TAKE_AWAY', false, NULL, '#3B82F6', ARRAY['TA_PICKING', 'TA_CANCELLED'], 2),
('TA_PICKING', 'Picking', 'Picking items from locations', 'TAKE_AWAY', false, NULL, '#F59E0B', ARRAY['TA_PACKING'], 3),
('TA_PACKING', 'Packing', 'Packing items for shipment', 'TAKE_AWAY', false, NULL, '#F97316', ARRAY['TA_READY'], 4),
('TA_READY', 'Ready to Ship', 'Packed and ready for pickup', 'TAKE_AWAY', false, NULL, '#8B5CF6', ARRAY['TA_SHIPPED'], 5),
('TA_SHIPPED', 'Shipped', 'Order shipped', 'TAKE_AWAY', false, true, '#06B6D4', ARRAY['TA_COMPLETED'], 6),
('TA_COMPLETED', 'Completed', 'Order delivered and completed', 'TAKE_AWAY', true, true, '#10B981', ARRAY[]::TEXT[], 7),
('TA_CANCELLED', 'Cancelled', 'Order cancelled', 'TAKE_AWAY', true, false, '#EF4444', ARRAY[]::TEXT[], 8);

-- QC Inspection Statuses
INSERT INTO master_statuses (code, name, description, status_type, is_terminal, is_successful, color_code, next_statuses, display_order) VALUES
('QC_PENDING', 'Pending', 'Inspection scheduled', 'QC_INSPECTION', false, NULL, '#6B7280', ARRAY['QC_IN_PROGRESS', 'QC_CANCELLED'], 1),
('QC_IN_PROGRESS', 'In Progress', 'Inspection underway', 'QC_INSPECTION', false, NULL, '#F59E0B', ARRAY['QC_PASSED', 'QC_FAILED', 'QC_ON_HOLD'], 2),
('QC_PASSED', 'Passed', 'Inspection passed', 'QC_INSPECTION', true, true, '#10B981', ARRAY[]::TEXT[], 3),
('QC_FAILED', 'Failed', 'Inspection failed', 'QC_INSPECTION', true, false, '#EF4444', ARRAY[]::TEXT[], 4),
('QC_ON_HOLD', 'On Hold', 'Items placed on hold', 'QC_INSPECTION', true, NULL, '#F97316', ARRAY[]::TEXT[], 5),
('QC_CANCELLED', 'Cancelled', 'Inspection cancelled', 'QC_INSPECTION', true, false, '#6B7280', ARRAY[]::TEXT[], 6);

-- Hold Statuses
INSERT INTO master_statuses (code, name, description, status_type, is_terminal, is_successful, color_code, next_statuses, display_order) VALUES
('HOLD_ACTIVE', 'Active', 'Hold active, under review', 'HOLD', false, NULL, '#F97316', ARRAY['HOLD_RESOLVED', 'HOLD_ESCALATED'], 1),
('HOLD_ESCALATED', 'Escalated', 'Hold escalated for decision', 'HOLD', false, NULL, '#DC2626', ARRAY['HOLD_RESOLVED'], 2),
('HOLD_RESOLVED', 'Resolved', 'Hold resolved and closed', 'HOLD', true, true, '#10B981', ARRAY[]::TEXT[], 3);

-- Inventory Statuses
INSERT INTO master_statuses (code, name, description, status_type, is_terminal, is_successful, color_code, display_order) VALUES
('INV_AVAILABLE', 'Available', 'Available for use', 'INVENTORY', false, true, '#10B981', 1),
('INV_RESERVED', 'Reserved', 'Reserved for order', 'INVENTORY', false, true, '#3B82F6', 2),
('INV_ON_HOLD', 'On Hold', 'On hold, not available', 'INVENTORY', false, NULL, '#F97316', 3),
('INV_IN_TRANSIT', 'In Transit', 'Being moved', 'INVENTORY', false, NULL, '#F59E0B', 4),
('INV_DAMAGED', 'Damaged', 'Damaged goods', 'INVENTORY', false, false, '#EF4444', 5),
('INV_EXPIRED', 'Expired', 'Expired product', 'INVENTORY', false, false, '#DC2626', 6),
('INV_QUARANTINE', 'Quarantine', 'Under investigation', 'INVENTORY', false, NULL, '#6B7280', 7);

-- ============================================================================
-- ORDER TYPES
-- ============================================================================

INSERT INTO master_order_types (code, name, description, requires_customer, requires_shipping_address, allows_partial_fulfillment, default_priority, color_code) VALUES
('CUSTOMER', 'Customer Order', 'Standard customer order', true, true, true, 'MEDIUM', '#10B981'),
('TRANSFER', 'Warehouse Transfer', 'Inter-warehouse transfer', false, true, true, 'MEDIUM', '#3B82F6'),
('RETURN', 'Customer Return', 'Return from customer', true, false, false, 'HIGH', '#F97316'),
('SCRAP', 'Scrap/Disposal', 'Dispose of damaged/expired items', false, false, false, 'LOW', '#6B7280'),
('SAMPLE', 'Sample Order', 'Sample/demo order', true, true, false, 'HIGH', '#8B5CF6'),
('INTERNAL', 'Internal Use', 'For internal department use', false, false, true, 'LOW', '#06B6D4'),
('REWORK', 'Rework Order', 'Items for rework/repair', false, false, true, 'MEDIUM', '#F59E0B');

-- ============================================================================
-- MOVEMENT TYPES
-- ============================================================================

INSERT INTO master_movement_types (code, name, description, direction, affects_inventory, requires_approval, color_code) VALUES
('PUT_AWAY', 'Put-Away', 'Move from receiving to storage', 'IN', true, false, '#10B981'),
('PICK', 'Pick', 'Pick for order fulfillment', 'OUT', true, false, '#F59E0B'),
('TRANSFER', 'Transfer', 'Transfer between locations', 'INTERNAL', false, false, '#3B82F6'),
('ADJUSTMENT', 'Adjustment', 'Inventory adjustment', 'INTERNAL', true, true, '#F97316'),
('CYCLE_COUNT', 'Cycle Count', 'Physical count verification', 'INTERNAL', true, false, '#8B5CF6'),
('RETURN', 'Return', 'Return to inventory', 'IN', true, false, '#06B6D4'),
('SCRAP', 'Scrap', 'Remove as scrap', 'OUT', true, true, '#EF4444'),
('RECEIVE', 'Receive', 'Receive new inventory', 'IN', true, false, '#10B981'),
('SHIP', 'Ship', 'Ship out of warehouse', 'OUT', true, false, '#EF4444');

-- ============================================================================
-- INSPECTION TYPES
-- ============================================================================

INSERT INTO master_inspection_types (code, name, description, is_mandatory, default_sample_size_pct, min_sample_size, requires_photos, sla_hours) VALUES
('RECEIVING', 'Receiving Inspection', 'Inspect incoming goods', true, 10.0, 5, true, 4),
('PERIODIC', 'Periodic Inspection', 'Scheduled periodic check', false, 5.0, 3, false, 24),
('DAMAGE', 'Damage Assessment', 'Inspect damaged items', true, 100.0, 1, true, 2),
('RETURN', 'Return Inspection', 'Inspect customer returns', true, 100.0, 1, true, 4),
('PRE_SHIP', 'Pre-Ship Inspection', 'Final inspection before shipping', false, 5.0, 2, false, 2),
('RANDOM', 'Random Sampling', 'Random quality audit', false, 2.0, 1, false, 48),
('COMPLAINT', 'Complaint Investigation', 'Investigate customer complaint', true, 100.0, 1, true, 8);

-- ============================================================================
-- QC DISPOSITIONS
-- ============================================================================

INSERT INTO master_qc_dispositions (code, name, description, action, requires_approval, approver_role, triggers_hold, color_code) VALUES
('ACCEPT', 'Accept', 'Accept to stock', 'ACCEPT', false, NULL, false, '#10B981'),
('REJECT', 'Reject', 'Reject and return to vendor', 'REJECT', true, 'WAREHOUSE_MANAGER', false, '#EF4444'),
('HOLD', 'Hold', 'Place on hold for review', 'HOLD', false, NULL, true, '#F97316'),
('REWORK', 'Rework', 'Send for rework/repair', 'REWORK', true, 'QC_INSPECTOR', false, '#F59E0B'),
('COND_ACCEPT', 'Conditional Accept', 'Accept with restrictions', 'ACCEPT', true, 'WAREHOUSE_MANAGER', false, '#06B6D4'),
('RETURN', 'Return to Vendor', 'Return for credit/replacement', 'RETURN', true, 'WAREHOUSE_MANAGER', false, '#8B5CF6'),
('SCRAP', 'Scrap', 'Dispose as scrap', 'SCRAP', true, 'WAREHOUSE_MANAGER', false, '#DC2626');

-- ============================================================================
-- DEFECT TYPES
-- ============================================================================

INSERT INTO master_defect_types (code, name, description, category, severity, default_disposition, requires_photo) VALUES
('PHY_DAMAGE', 'Physical Damage', 'Visible physical damage', 'PHYSICAL', 'CRITICAL', 'REJECT', true),
('PHY_SCRATCH', 'Scratches', 'Surface scratches', 'PHYSICAL', 'MINOR', 'COND_ACCEPT', true),
('PHY_DENT', 'Dent/Deformation', 'Dented or deformed', 'PHYSICAL', 'MAJOR', 'REJECT', true),
('FUNC_FAIL', 'Functional Failure', 'Does not function correctly', 'FUNCTIONAL', 'CRITICAL', 'REJECT', false),
('FUNC_PARTIAL', 'Partial Function', 'Limited functionality', 'FUNCTIONAL', 'MAJOR', 'REWORK', false),
('COS_DISCOLOR', 'Discoloration', 'Color inconsistency', 'COSMETIC', 'MINOR', 'COND_ACCEPT', true),
('COS_FINISH', 'Finish Defect', 'Surface finish issue', 'COSMETIC', 'MINOR', 'COND_ACCEPT', true),
('PACK_DAMAGE', 'Packaging Damage', 'Damaged packaging', 'PACKAGING', 'MINOR', 'COND_ACCEPT', true),
('PACK_MISSING', 'Missing Components', 'Package incomplete', 'PACKAGING', 'CRITICAL', 'REJECT', true),
('PACK_LABEL', 'Incorrect Label', 'Wrong or missing label', 'PACKAGING', 'MAJOR', 'HOLD', true),
('DIM_OUT_SPEC', 'Out of Spec', 'Dimensions out of tolerance', 'PHYSICAL', 'MAJOR', 'REJECT', false),
('CONT_FOREIGN', 'Contamination', 'Foreign material present', 'PHYSICAL', 'CRITICAL', 'REJECT', true);

-- ============================================================================
-- HOLD REASONS
-- ============================================================================

INSERT INTO master_hold_reasons (code, name, description, category, default_severity, requires_qc_inspection, requires_manager_approval, default_hold_type, auto_escalation_hours, color_code) VALUES
('QUALITY_ISSUE', 'Quality Issue', 'Failed quality standards', 'QUALITY', 'HIGH', true, true, 'TEMPORARY', 48, '#F97316'),
('DAMAGE', 'Damage', 'Physical damage detected', 'DAMAGE', 'HIGH', true, true, 'TEMPORARY', 24, '#EF4444'),
('EXPIRED', 'Expired', 'Product past expiration date', 'QUALITY', 'CRITICAL', false, false, 'PERMANENT', NULL, '#DC2626'),
('CUSTOMER_RETURN', 'Customer Return', 'Returned by customer', 'CUSTOMER', 'MEDIUM', true, false, 'TEMPORARY', 72, '#06B6D4'),
('INVESTIGATION', 'Under Investigation', 'Investigation in progress', 'OPERATIONAL', 'MEDIUM', false, true, 'TEMPORARY', 96, '#8B5CF6'),
('RECALL', 'Product Recall', 'Manufacturer recall', 'REGULATORY', 'CRITICAL', false, true, 'PERMANENT', NULL, '#DC2626'),
('REGULATORY', 'Regulatory Hold', 'Regulatory compliance issue', 'REGULATORY', 'CRITICAL', true, true, 'TEMPORARY', 24, '#F97316'),
('SHORT_DATED', 'Short-Dated', 'Near expiration', 'QUALITY', 'LOW', false, false, 'TEMPORARY', 168, '#F59E0B'),
('MISLABELED', 'Mislabeled', 'Incorrect labeling', 'OPERATIONAL', 'MEDIUM', false, true, 'TEMPORARY', 48, '#F59E0B'),
('COUNT_VARIANCE', 'Count Variance', 'Inventory discrepancy', 'OPERATIONAL', 'MEDIUM', false, true, 'TEMPORARY', 72, '#3B82F6');

-- ============================================================================
-- RESOLUTION TYPES
-- ============================================================================

INSERT INTO master_resolution_types (code, name, description, action, requires_approval, affects_inventory, requires_documentation) VALUES
('RELEASED', 'Release to Stock', 'Release back to available inventory', 'RELEASE', true, true, true),
('SCRAPPED', 'Scrap', 'Dispose as scrap/waste', 'SCRAP', true, true, true),
('RETURNED', 'Return to Vendor', 'Return to supplier', 'RETURN', true, true, true),
('REWORKED', 'Rework', 'Rework and return to stock', 'REWORK', true, true, true),
('DONATED', 'Donate', 'Donate to charity', 'DONATE', true, true, true),
('TRANSFERRED', 'Transfer', 'Transfer to another facility', 'TRANSFER', true, true, true),
('SOLD_AS_IS', 'Sell As-Is', 'Sell at discount', 'RELEASE', true, true, true);

-- ============================================================================
-- SEVERITY LEVELS
-- ============================================================================

INSERT INTO master_severity_levels (code, name, description, level, requires_immediate_action, escalation_hours, color_code) VALUES
('CRITICAL', 'Critical', 'Immediate action required', 1, true, 2, '#DC2626'),
('HIGH', 'High', 'High priority issue', 2, true, 8, '#F97316'),
('MEDIUM', 'Medium', 'Medium priority', 3, false, 24, '#F59E0B'),
('LOW', 'Low', 'Low priority', 4, false, 72, '#10B981'),
('INFO', 'Informational', 'For information only', 5, false, NULL, '#6B7280');

-- ============================================================================
-- BEACON TYPES
-- ============================================================================

INSERT INTO master_beacon_types (code, name, description, usage, is_fixed, default_tx_power, battery_warning_threshold, battery_critical_threshold, color_code) VALUES
('LOC_FIXED', 'Fixed Location', 'Fixed location beacon', 'LOCATION', true, -12, 20, 10, '#10B981'),
('PROD_TRACK', 'Product Tracking', 'Attached to products', 'PRODUCT', false, -12, 25, 15, '#3B82F6'),
('EQUIP_TRACK', 'Equipment Tracking', 'Attached to equipment', 'EQUIPMENT', false, -12, 20, 10, '#F59E0B'),
('PERSONNEL', 'Personnel', 'Personnel badge beacon', 'PERSONNEL', false, -12, 30, 20, '#8B5CF6'),
('ASSET_TAG', 'Asset Tag', 'Fixed asset tracking', 'ASSET', false, -12, 20, 10, '#06B6D4');

-- ============================================================================
-- EQUIPMENT TYPES
-- ============================================================================

INSERT INTO master_equipment_types (code, name, description, category, requires_certification, requires_maintenance, maintenance_interval_days) VALUES
('FORKLIFT', 'Forklift', 'Industrial forklift', 'FORKLIFT', true, true, 90),
('PALLET_JACK', 'Pallet Jack', 'Manual/electric pallet jack', 'PALLET_JACK', false, true, 180),
('ORDER_PICKER', 'Order Picker', 'Order picking equipment', 'FORKLIFT', true, true, 90),
('CART_STD', 'Standard Cart', 'Standard warehouse cart', 'CART', false, false, NULL),
('CART_ELECTRIC', 'Electric Cart', 'Electric-powered cart', 'CART', false, true, 180),
('SCANNER_HH', 'Handheld Scanner', 'Handheld barcode scanner', 'SCANNER', false, false, NULL),
('SCANNER_MOBILE', 'Mobile Computer', 'Mobile computing device', 'SCANNER', false, false, NULL),
('PRINTER_LABEL', 'Label Printer', 'Label printing station', 'PRINTER', false, true, 365),
('WORKSTATION', 'Workstation', 'Desktop workstation', 'COMPUTER', false, false, NULL),
('SCALE', 'Scale', 'Weighing scale', 'OTHER', false, true, 365);

-- ============================================================================
-- SHIPPING METHODS
-- ============================================================================

INSERT INTO master_shipping_methods (code, name, description, carrier, service_level, estimated_days, is_expedited, requires_signature, max_weight, base_cost, display_order) VALUES
('UPS_GROUND', 'UPS Ground', 'UPS ground delivery', 'UPS', 'Ground', 5, false, false, 68.00, 12.50, 1),
('UPS_2DAY', 'UPS 2nd Day Air', 'UPS 2-day delivery', 'UPS', '2nd Day Air', 2, true, false, 68.00, 35.00, 2),
('UPS_NEXT', 'UPS Next Day Air', 'UPS next day delivery', 'UPS', 'Next Day Air', 1, true, true, 68.00, 75.00, 3),
('FEDEX_GROUND', 'FedEx Ground', 'FedEx ground delivery', 'FedEx', 'Ground', 5, false, false, 68.00, 13.00, 4),
('FEDEX_2DAY', 'FedEx 2Day', 'FedEx 2-day delivery', 'FedEx', '2Day', 2, true, false, 68.00, 36.00, 5),
('FEDEX_EXPRESS', 'FedEx Express', 'FedEx overnight', 'FedEx', 'Overnight', 1, true, true, 68.00, 77.00, 6),
('USPS_PRIORITY', 'USPS Priority', 'USPS priority mail', 'USPS', 'Priority', 3, false, false, 31.50, 9.50, 7),
('USPS_EXPRESS', 'USPS Express', 'USPS express mail', 'USPS', 'Express', 1, true, true, 31.50, 45.00, 8),
('FREIGHT_LTL', 'LTL Freight', 'Less than truckload freight', 'Freight', 'LTL', 7, false, true, NULL, 150.00, 9),
('INTERNAL', 'Internal Transfer', 'Internal warehouse transfer', 'Internal', 'Same Day', 0, false, false, NULL, 0.00, 10);

-- ============================================================================
-- CARRIERS
-- ============================================================================

INSERT INTO master_carriers (code, name, description, contact_email, contact_phone, website, tracking_url_template) VALUES
('UPS', 'United Parcel Service', 'UPS shipping services', 'support@ups.com', '1-800-742-5877', 'https://www.ups.com', 'https://www.ups.com/track?tracknum={TRACKING_NUMBER}'),
('FEDEX', 'FedEx', 'FedEx shipping services', 'support@fedex.com', '1-800-463-3339', 'https://www.fedex.com', 'https://www.fedex.com/apps/fedextrack/?tracknumbers={TRACKING_NUMBER}'),
('USPS', 'United States Postal Service', 'USPS mail services', 'support@usps.com', '1-800-275-8777', 'https://www.usps.com', 'https://tools.usps.com/go/TrackConfirmAction?tLabels={TRACKING_NUMBER}'),
('FREIGHT', 'LTL Freight Carriers', 'Various freight carriers', NULL, NULL, NULL, NULL),
('INTERNAL', 'Internal Transport', 'In-house delivery', NULL, NULL, NULL, NULL);

-- ============================================================================
-- ROLES
-- ============================================================================

INSERT INTO master_roles (code, name, description, level, can_approve_holds, can_approve_adjustments, can_manage_users, max_task_capacity, color_code) VALUES
('ADMIN', 'Administrator', 'System administrator with full access', 1, true, true, true, 20, '#DC2626'),
('WAREHOUSE_MANAGER', 'Warehouse Manager', 'Warehouse operations manager', 2, true, true, true, 15, '#F97316'),
('SUPERVISOR', 'Supervisor', 'Team supervisor', 3, true, true, false, 15, '#F59E0B'),
('QC_INSPECTOR', 'QC Inspector', 'Quality control inspector', 4, true, false, false, 8, '#8B5CF6'),
('WAREHOUSE_STAFF', 'Warehouse Staff', 'General warehouse worker', 5, false, false, false, 10, '#10B981'),
('VIEWER', 'Viewer', 'Read-only access', 6, false, false, false, 0, '#6B7280');

-- ============================================================================
-- DEPARTMENTS
-- ============================================================================

INSERT INTO master_departments (code, name, description, cost_center) VALUES
('MGMT', 'Management', 'Executive and warehouse management', 'CC-1000'),
('OPS', 'Operations', 'Warehouse operations and logistics', 'CC-2000'),
('QC', 'Quality Control', 'Quality assurance and inspection', 'CC-3000'),
('MAINT', 'Maintenance', 'Facility and equipment maintenance', 'CC-4000'),
('ADMIN', 'Administration', 'Administrative support', 'CC-5000'),
('IT', 'Information Technology', 'IT support and systems', 'CC-6000');

-- ============================================================================
-- ACTIVITY TYPES
-- ============================================================================

INSERT INTO master_activity_types (code, name, description, category, default_severity, retention_days) VALUES
('PUT_AWAY', 'Put-Away', 'Put-away operation', 'OPERATIONAL', 'INFO', 90),
('TAKE_AWAY', 'Take-Away', 'Order fulfillment', 'OPERATIONAL', 'INFO', 90),
('QC_INSPECTION', 'QC Inspection', 'Quality inspection', 'OPERATIONAL', 'INFO', 365),
('HOLD', 'Hold Placed', 'Item placed on hold', 'OPERATIONAL', 'WARNING', 365),
('RELEASE', 'Hold Released', 'Item released from hold', 'OPERATIONAL', 'INFO', 365),
('LOCATION_CHANGE', 'Location Change', 'Inventory moved', 'OPERATIONAL', 'INFO', 90),
('INVENTORY_ADJUSTMENT', 'Inventory Adjustment', 'Inventory quantity adjusted', 'OPERATIONAL', 'WARNING', 365),
('USER_LOGIN', 'User Login', 'User logged in', 'SECURITY', 'INFO', 30),
('USER_LOGOUT', 'User Logout', 'User logged out', 'SECURITY', 'INFO', 30),
('CONFIG_CHANGE', 'Configuration Change', 'System config modified', 'ADMINISTRATIVE', 'WARNING', 365),
('BEACON_EVENT', 'Beacon Event', 'Beacon activity', 'SYSTEM', 'INFO', 30),
('ERROR', 'System Error', 'System error occurred', 'SYSTEM', 'ERROR', 365);

-- ============================================================================
-- ALERT TYPES
-- ============================================================================

INSERT INTO master_alert_types (code, name, description, category, severity, requires_acknowledgment, escalation_minutes, notification_channels, recipient_roles) VALUES
('LOW_STOCK', 'Low Stock Alert', 'Product below reorder point', 'INVENTORY', 'MEDIUM', false, NULL, ARRAY['EMAIL', 'IN_APP'], ARRAY['WAREHOUSE_MANAGER', 'SUPERVISOR']),
('EXPIRED_SOON', 'Expiring Soon', 'Product expiring within 30 days', 'INVENTORY', 'HIGH', false, NULL, ARRAY['EMAIL', 'IN_APP'], ARRAY['WAREHOUSE_MANAGER', 'QC_INSPECTOR']),
('ALREADY_EXPIRED', 'Expired Product', 'Product has expired', 'INVENTORY', 'CRITICAL', true, 60, ARRAY['EMAIL', 'SMS', 'IN_APP'], ARRAY['WAREHOUSE_MANAGER']),
('LOW_BATTERY', 'Low Battery', 'Beacon battery below threshold', 'EQUIPMENT', 'MEDIUM', false, NULL, ARRAY['IN_APP'], ARRAY['WAREHOUSE_STAFF', 'SUPERVISOR']),
('BEACON_OFFLINE', 'Beacon Offline', 'Beacon not seen for 24 hours', 'EQUIPMENT', 'HIGH', false, NULL, ARRAY['EMAIL', 'IN_APP'], ARRAY['SUPERVISOR']),
('QC_FAILED', 'QC Failed', 'Quality inspection failed', 'QUALITY', 'CRITICAL', true, 30, ARRAY['EMAIL', 'SMS', 'IN_APP'], ARRAY['WAREHOUSE_MANAGER', 'QC_INSPECTOR']),
('HOLD_EXPIRING', 'Hold Expiring', 'Hold requires resolution', 'QUALITY', 'HIGH', true, 120, ARRAY['EMAIL', 'IN_APP'], ARRAY['WAREHOUSE_MANAGER']),
('SLA_BREACH', 'SLA Breach', 'Task exceeded SLA deadline', 'PERFORMANCE', 'HIGH', true, 60, ARRAY['EMAIL', 'IN_APP'], ARRAY['WAREHOUSE_MANAGER', 'SUPERVISOR']),
('CAPACITY_WARNING', 'Capacity Warning', 'Location >90% capacity', 'INVENTORY', 'MEDIUM', false, NULL, ARRAY['IN_APP'], ARRAY['WAREHOUSE_MANAGER']),
('TEMP_OUT_RANGE', 'Temperature Alert', 'Temperature out of range', 'SAFETY', 'CRITICAL', true, 15, ARRAY['EMAIL', 'SMS', 'IN_APP'], ARRAY['WAREHOUSE_MANAGER', 'SUPERVISOR']);

-- ============================================================================
-- SYSTEM CONFIGURATION
-- ============================================================================

INSERT INTO master_system_config (config_key, config_value, value_type, category, description, is_editable) VALUES
('WAREHOUSE_NAME', 'Main Warehouse', 'STRING', 'GENERAL', 'Warehouse name', true),
('TIMEZONE', 'America/New_York', 'STRING', 'GENERAL', 'System timezone', true),
('DEFAULT_CURRENCY', 'USD', 'STRING', 'GENERAL', 'Default currency code', true),
('AUTO_ASSIGN_TASKS', 'true', 'BOOLEAN', 'OPERATIONS', 'Automatically assign tasks to workers', true),
('REQUIRE_BEACON_SCAN', 'true', 'BOOLEAN', 'OPERATIONS', 'Require BLE beacon scanning', true),
('ENABLE_QUALITY_CONTROL', 'true', 'BOOLEAN', 'QUALITY', 'Enable QC workflows', true),
('MIN_REORDER_DAYS', '7', 'NUMBER', 'INVENTORY', 'Minimum days before reorder', true),
('MAX_CYCLE_COUNT_VARIANCE', '2.0', 'NUMBER', 'INVENTORY', 'Maximum acceptable variance %', true),
('BEACON_BATTERY_WARNING', '20', 'NUMBER', 'EQUIPMENT', 'Battery warning threshold %', true),
('BEACON_BATTERY_CRITICAL', '10', 'NUMBER', 'EQUIPMENT', 'Battery critical threshold %', true),
('BEACON_OFFLINE_HOURS', '24', 'NUMBER', 'EQUIPMENT', 'Hours before beacon marked offline', true),
('SESSION_TIMEOUT_MINUTES', '60', 'NUMBER', 'SECURITY', 'User session timeout', true),
('MAX_LOGIN_ATTEMPTS', '5', 'NUMBER', 'SECURITY', 'Maximum failed login attempts', true),
('PASSWORD_MIN_LENGTH', '8', 'NUMBER', 'SECURITY', 'Minimum password length', false),
('ENABLE_2FA', 'false', 'BOOLEAN', 'SECURITY', 'Enable two-factor authentication', true),
('ACTIVITY_LOG_RETENTION_DAYS', '90', 'NUMBER', 'SYSTEM', 'Activity log retention period', true),
('SCAN_EVENT_RETENTION_DAYS', '30', 'NUMBER', 'SYSTEM', 'Scan event retention period', true),
('BACKUP_ENABLED', 'true', 'BOOLEAN', 'SYSTEM', 'Enable automated backups', false),
('BACKUP_RETENTION_DAYS', '30', 'NUMBER', 'SYSTEM', 'Backup retention period', true);

-- ============================================================================
-- WAREHOUSE SETTINGS
-- ============================================================================

INSERT INTO master_warehouse_settings (warehouse_id, warehouse_name, address, timezone, default_currency, auto_assign_tasks, require_beacon_scan, enable_quality_control) VALUES
('MAIN', 'Main Distribution Center', '123 Warehouse Blvd, Industrial Park, State 12345', 'America/New_York', 'USD', true, true, true);

-- ============================================================================
-- NUMBER SEQUENCES
-- ============================================================================

INSERT INTO master_number_sequences (sequence_type, prefix, current_value, increment_by, min_length, reset_annually, format_template) VALUES
('PUT_AWAY_TASK', 'PUT-', 6, 1, 6, true, '{PREFIX}{YEAR}-{NUMBER}'),
('TAKE_AWAY_ORDER', 'ORD-', 5, 1, 6, true, '{PREFIX}{YEAR}-{NUMBER}'),
('QC_INSPECTION', 'QC-', 6, 1, 6, true, '{PREFIX}{YEAR}-{NUMBER}'),
('HOLD_ITEM', 'HOLD-', 3, 1, 6, true, '{PREFIX}{YEAR}-{NUMBER}'),
('PRODUCT_SKU', 'SKU-', 11, 1, 3, false, '{PREFIX}{NUMBER}'),
('LOCATION_CODE', 'LOC-', 100, 1, 3, false, '{PREFIX}{NUMBER}');

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE master_product_categories IS 'Sample product categories - customize for your inventory';
COMMENT ON TABLE master_priority_levels IS 'Standard priority levels with SLA hours';
COMMENT ON TABLE master_statuses IS 'Workflow statuses with valid state transitions';
COMMENT ON TABLE master_shipping_methods IS 'Common US shipping methods - add international as needed';
COMMENT ON TABLE master_system_config IS 'System configuration - edit values as needed';
