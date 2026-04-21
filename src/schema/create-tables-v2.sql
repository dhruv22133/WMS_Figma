-- ============================================================================
-- BLE-based Warehouse Management System - Database Schema v2.0
-- PostgreSQL/Supabase Compatible - Enhanced with Real-World Constraints
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy text search

-- ============================================================================
-- VALIDATION FUNCTIONS
-- ============================================================================

-- Function to validate MAC address format
CREATE OR REPLACE FUNCTION is_valid_mac_address(mac TEXT) RETURNS BOOLEAN AS $$
BEGIN
  RETURN mac ~ '^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to validate location code format (e.g., A-01-02 or RCV-01)
CREATE OR REPLACE FUNCTION is_valid_location_code(code TEXT) RETURNS BOOLEAN AS $$
BEGIN
  RETURN code ~ '^[A-Z]{1,4}-[0-9]{2}(-[0-9]{2})?$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to validate RSSI range (-100 to 0 dBm)
CREATE OR REPLACE FUNCTION is_valid_rssi(rssi INTEGER) RETURNS BOOLEAN AS $$
BEGIN
  RETURN rssi >= -100 AND rssi <= 0;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- Products Table (Enhanced)
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sku VARCHAR(100) UNIQUE NOT NULL,
  barcode VARCHAR(50), -- UPC/EAN barcode
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100),
  unit_of_measure VARCHAR(20) NOT NULL,
  weight DECIMAL(10, 3), -- More precision for weight
  dimensions JSONB,
  reorder_point INTEGER NOT NULL DEFAULT 0,
  reorder_quantity INTEGER NOT NULL DEFAULT 0,
  min_storage_temp DECIMAL(5, 2),
  max_storage_temp DECIMAL(5, 2),
  optimal_storage_temp DECIMAL(5, 2),
  shelf_life_days INTEGER,
  is_hazardous BOOLEAN DEFAULT false,
  is_fragile BOOLEAN DEFAULT false,
  requires_quality_check BOOLEAN DEFAULT false,
  abc_classification CHAR(1) CHECK (abc_classification IN ('A', 'B', 'C')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  deleted_at TIMESTAMPTZ, -- Soft delete
  
  -- Constraints
  CONSTRAINT check_reorder_point CHECK (reorder_point >= 0),
  CONSTRAINT check_reorder_quantity CHECK (reorder_quantity >= 0),
  CONSTRAINT check_weight CHECK (weight IS NULL OR weight > 0),
  CONSTRAINT check_shelf_life CHECK (shelf_life_days IS NULL OR shelf_life_days > 0),
  CONSTRAINT check_temp_range CHECK (
    (min_storage_temp IS NULL AND max_storage_temp IS NULL) OR
    (min_storage_temp IS NOT NULL AND max_storage_temp IS NOT NULL AND min_storage_temp <= max_storage_temp)
  ),
  CONSTRAINT check_optimal_temp CHECK (
    optimal_storage_temp IS NULL OR 
    (optimal_storage_temp >= min_storage_temp AND optimal_storage_temp <= max_storage_temp)
  )
);

-- Warehouse Locations Table (Enhanced)
CREATE TABLE warehouse_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location_code VARCHAR(50) UNIQUE NOT NULL,
  location_type VARCHAR(20) NOT NULL CHECK (location_type IN ('RECEIVING', 'STORAGE', 'PICKING', 'SHIPPING', 'HOLD', 'QC')),
  zone VARCHAR(10) NOT NULL,
  aisle VARCHAR(10) NOT NULL,
  rack VARCHAR(10) NOT NULL,
  shelf VARCHAR(10) NOT NULL,
  bin VARCHAR(10),
  capacity INTEGER NOT NULL DEFAULT 0,
  current_occupancy INTEGER NOT NULL DEFAULT 0,
  reserved_capacity INTEGER NOT NULL DEFAULT 0, -- Reserved but not yet occupied
  is_available BOOLEAN DEFAULT true,
  temperature_controlled BOOLEAN DEFAULT false,
  current_temperature DECIMAL(5, 2), -- Current temp reading
  requires_special_handling BOOLEAN DEFAULT false,
  max_weight_capacity DECIMAL(10, 2), -- Maximum weight in kg
  current_weight DECIMAL(10, 2) DEFAULT 0, -- Current weight
  coordinates JSONB,
  is_locked BOOLEAN DEFAULT false, -- Location locked for maintenance
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT check_occupancy CHECK (current_occupancy >= 0 AND current_occupancy <= capacity),
  CONSTRAINT check_reserved CHECK (reserved_capacity >= 0 AND reserved_capacity <= capacity),
  CONSTRAINT check_total_usage CHECK (current_occupancy + reserved_capacity <= capacity),
  CONSTRAINT check_capacity CHECK (capacity >= 0),
  CONSTRAINT check_location_code CHECK (is_valid_location_code(location_code)),
  CONSTRAINT check_max_weight CHECK (max_weight_capacity IS NULL OR max_weight_capacity > 0),
  CONSTRAINT check_current_weight CHECK (
    current_weight >= 0 AND 
    (max_weight_capacity IS NULL OR current_weight <= max_weight_capacity)
  )
);

-- BLE Beacons Table (Enhanced)
CREATE TABLE ble_beacons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mac_address VARCHAR(17) UNIQUE NOT NULL,
  uuid VARCHAR(36), -- iBeacon UUID
  major INTEGER, -- iBeacon major value
  minor INTEGER, -- iBeacon minor value
  beacon_name VARCHAR(100) NOT NULL,
  beacon_type VARCHAR(20) NOT NULL CHECK (beacon_type IN ('PRODUCT', 'LOCATION', 'EQUIPMENT', 'MOBILE')),
  battery_level INTEGER CHECK (battery_level >= 0 AND battery_level <= 100),
  signal_strength INTEGER, -- RSSI value
  tx_power INTEGER, -- Transmission power in dBm
  firmware_version VARCHAR(20),
  hardware_version VARCHAR(20),
  manufacturer VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  last_seen_at TIMESTAMPTZ,
  associated_location_id UUID REFERENCES warehouse_locations(id) ON DELETE SET NULL,
  calibration_distance DECIMAL(5, 2), -- Calibration distance in meters
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT check_mac_format CHECK (is_valid_mac_address(mac_address)),
  CONSTRAINT check_rssi CHECK (signal_strength IS NULL OR is_valid_rssi(signal_strength)),
  CONSTRAINT check_tx_power CHECK (tx_power IS NULL OR (tx_power >= -40 AND tx_power <= 4)),
  CONSTRAINT check_ibeacon_values CHECK (
    (uuid IS NULL AND major IS NULL AND minor IS NULL) OR
    (uuid IS NOT NULL AND major IS NOT NULL AND minor IS NOT NULL)
  ),
  CONSTRAINT check_major_minor CHECK (
    (major IS NULL OR (major >= 0 AND major <= 65535)) AND
    (minor IS NULL OR (minor >= 0 AND minor <= 65535))
  )
);

-- Inventory Table (Enhanced)
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  location_id UUID NOT NULL REFERENCES warehouse_locations(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL DEFAULT 0,
  reserved_quantity INTEGER NOT NULL DEFAULT 0, -- Reserved for orders
  available_quantity INTEGER GENERATED ALWAYS AS (quantity - reserved_quantity) STORED,
  status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'RESERVED', 'ON_HOLD', 'IN_TRANSIT', 'DAMAGED', 'EXPIRED', 'QUARANTINE')),
  lot_number VARCHAR(50),
  serial_number VARCHAR(100),
  batch_number VARCHAR(50),
  expiration_date DATE,
  manufacture_date DATE,
  received_date DATE NOT NULL,
  beacon_id UUID REFERENCES ble_beacons(id) ON DELETE SET NULL,
  last_counted_at TIMESTAMPTZ,
  cycle_count_variance INTEGER DEFAULT 0, -- Last count variance
  cost_per_unit DECIMAL(10, 2), -- Unit cost
  is_locked BOOLEAN DEFAULT false, -- Locked for counting
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT check_quantity CHECK (quantity >= 0),
  CONSTRAINT check_reserved_quantity CHECK (reserved_quantity >= 0 AND reserved_quantity <= quantity),
  CONSTRAINT check_dates CHECK (
    manufacture_date IS NULL OR expiration_date IS NULL OR manufacture_date <= expiration_date
  ),
  CONSTRAINT check_cost CHECK (cost_per_unit IS NULL OR cost_per_unit >= 0),
  CONSTRAINT unique_product_location_lot UNIQUE (product_id, location_id, lot_number, serial_number)
);

-- ============================================================================
-- OPERATIONAL TABLES
-- ============================================================================

-- Put-Away Tasks Table (Enhanced)
CREATE TABLE put_away_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_number VARCHAR(50) UNIQUE NOT NULL,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  source_location_id UUID NOT NULL REFERENCES warehouse_locations(id) ON DELETE RESTRICT,
  destination_location_id UUID REFERENCES warehouse_locations(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL,
  quantity_completed INTEGER DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ASSIGNED', 'SCANNING', 'MOVING', 'PLACING', 'COMPLETED', 'CANCELLED', 'FAILED')),
  priority VARCHAR(10) DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
  assigned_to UUID,
  beacon_scanned VARCHAR(17),
  location_verified BOOLEAN DEFAULT false,
  step_completed INTEGER DEFAULT 0 CHECK (step_completed >= 0 AND step_completed <= 4),
  notes TEXT,
  failure_reason TEXT,
  estimated_duration_minutes INTEGER,
  actual_duration_minutes INTEGER,
  due_at TIMESTAMPTZ, -- SLA deadline
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  
  -- Constraints
  CONSTRAINT check_quantity_positive CHECK (quantity > 0),
  CONSTRAINT check_quantity_completed CHECK (quantity_completed >= 0 AND quantity_completed <= quantity),
  CONSTRAINT check_beacon_scanned CHECK (beacon_scanned IS NULL OR is_valid_mac_address(beacon_scanned)),
  CONSTRAINT check_timestamps CHECK (
    (started_at IS NULL OR completed_at IS NULL OR started_at <= completed_at) AND
    (created_at <= started_at OR started_at IS NULL)
  ),
  CONSTRAINT check_status_completed CHECK (
    (status != 'COMPLETED' OR completed_at IS NOT NULL) AND
    (status != 'CANCELLED' OR cancelled_at IS NOT NULL)
  )
);

-- Take-Away Orders Table (Enhanced)
CREATE TABLE take_away_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  order_type VARCHAR(20) NOT NULL CHECK (order_type IN ('CUSTOMER', 'TRANSFER', 'RETURN', 'SCRAP', 'SAMPLE')),
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ASSIGNED', 'PICKING', 'PACKING', 'READY', 'SHIPPED', 'COMPLETED', 'CANCELLED')),
  priority VARCHAR(10) DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
  customer_name VARCHAR(255),
  customer_reference VARCHAR(100),
  customer_po_number VARCHAR(100),
  shipping_address TEXT,
  shipping_method VARCHAR(50),
  tracking_number VARCHAR(100),
  assigned_to UUID,
  total_items INTEGER DEFAULT 0,
  total_quantity INTEGER DEFAULT 0,
  picked_items INTEGER DEFAULT 0,
  packed_items INTEGER DEFAULT 0,
  picking_started_at TIMESTAMPTZ,
  picking_completed_at TIMESTAMPTZ,
  packed_at TIMESTAMPTZ,
  shipped_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  due_at TIMESTAMPTZ, -- Delivery deadline
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  
  -- Constraints
  CONSTRAINT check_totals CHECK (
    total_items >= 0 AND total_quantity >= 0 AND
    picked_items >= 0 AND picked_items <= total_items AND
    packed_items >= 0 AND packed_items <= picked_items
  ),
  CONSTRAINT check_order_timestamps CHECK (
    (picking_started_at IS NULL OR picking_completed_at IS NULL OR picking_started_at <= picking_completed_at) AND
    (picking_completed_at IS NULL OR packed_at IS NULL OR picking_completed_at <= packed_at) AND
    (packed_at IS NULL OR shipped_at IS NULL OR packed_at <= shipped_at)
  )
);

-- Take-Away Order Items Table (Enhanced)
CREATE TABLE take_away_order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES take_away_orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  inventory_id UUID REFERENCES inventory(id) ON DELETE SET NULL,
  quantity_ordered INTEGER NOT NULL,
  quantity_picked INTEGER DEFAULT 0,
  quantity_packed INTEGER DEFAULT 0,
  quantity_shipped INTEGER DEFAULT 0,
  source_location_id UUID REFERENCES warehouse_locations(id) ON DELETE SET NULL,
  suggested_location_id UUID REFERENCES warehouse_locations(id) ON DELETE SET NULL, -- System suggestion
  beacon_scanned VARCHAR(17),
  lot_number VARCHAR(50),
  serial_number VARCHAR(100),
  status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PICKING', 'PICKED', 'PACKED', 'SHIPPED', 'CANCELLED')),
  picker_notes TEXT,
  picked_at TIMESTAMPTZ,
  packed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT check_ordered_quantity CHECK (quantity_ordered > 0),
  CONSTRAINT check_picked_quantity CHECK (quantity_picked >= 0 AND quantity_picked <= quantity_ordered),
  CONSTRAINT check_packed_quantity CHECK (quantity_packed >= 0 AND quantity_packed <= quantity_picked),
  CONSTRAINT check_shipped_quantity CHECK (quantity_shipped >= 0 AND quantity_shipped <= quantity_packed),
  CONSTRAINT check_beacon_format CHECK (beacon_scanned IS NULL OR is_valid_mac_address(beacon_scanned))
);

-- Quality Control Inspections Table (Enhanced)
CREATE TABLE qc_inspections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inspection_number VARCHAR(50) UNIQUE NOT NULL,
  inspection_type VARCHAR(20) NOT NULL CHECK (inspection_type IN ('RECEIVING', 'PERIODIC', 'DAMAGE', 'RETURN', 'PRE_SHIP', 'RANDOM', 'COMPLAINT')),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  inventory_id UUID REFERENCES inventory(id) ON DELETE SET NULL,
  location_id UUID NOT NULL REFERENCES warehouse_locations(id) ON DELETE RESTRICT,
  quantity_inspected INTEGER NOT NULL,
  quantity_passed INTEGER DEFAULT 0,
  quantity_failed INTEGER DEFAULT 0,
  quantity_on_hold INTEGER DEFAULT 0,
  sample_size INTEGER,
  status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_PROGRESS', 'PASSED', 'FAILED', 'ON_HOLD', 'CANCELLED')),
  inspector_id UUID NOT NULL,
  inspection_criteria JSONB,
  defects_found TEXT[],
  photos TEXT[],
  disposition VARCHAR(20) CHECK (disposition IN ('ACCEPT', 'REJECT', 'HOLD', 'REWORK', 'CONDITIONAL_ACCEPT')),
  beacon_scanned VARCHAR(17),
  lot_number VARCHAR(50),
  severity VARCHAR(10) CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  requires_followup BOOLEAN DEFAULT false,
  followup_inspection_id UUID REFERENCES qc_inspections(id) ON DELETE SET NULL,
  inspected_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  due_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT check_inspection_quantities CHECK (
    quantity_inspected > 0 AND
    quantity_passed >= 0 AND 
    quantity_failed >= 0 AND
    quantity_on_hold >= 0 AND
    (quantity_passed + quantity_failed + quantity_on_hold) <= quantity_inspected
  ),
  CONSTRAINT check_sample_size CHECK (sample_size IS NULL OR (sample_size > 0 AND sample_size <= quantity_inspected)),
  CONSTRAINT check_beacon_qc CHECK (beacon_scanned IS NULL OR is_valid_mac_address(beacon_scanned)),
  CONSTRAINT check_disposition_status CHECK (
    (status NOT IN ('PASSED', 'FAILED', 'ON_HOLD') OR disposition IS NOT NULL)
  )
);

-- Hold Area Management Table (Enhanced)
CREATE TABLE hold_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hold_number VARCHAR(50) UNIQUE NOT NULL,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  inventory_id UUID NOT NULL REFERENCES inventory(id) ON DELETE RESTRICT,
  location_id UUID NOT NULL REFERENCES warehouse_locations(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL,
  hold_reason VARCHAR(30) NOT NULL CHECK (hold_reason IN ('QUALITY_ISSUE', 'DAMAGE', 'EXPIRED', 'CUSTOMER_RETURN', 'INVESTIGATION', 'RECALL', 'REGULATORY', 'OTHER')),
  hold_type VARCHAR(20) DEFAULT 'TEMPORARY' CHECK (hold_type IN ('TEMPORARY', 'PERMANENT')),
  severity VARCHAR(10) DEFAULT 'MEDIUM' CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  description TEXT NOT NULL,
  root_cause TEXT,
  corrective_action TEXT,
  qc_inspection_id UUID REFERENCES qc_inspections(id) ON DELETE SET NULL,
  placed_by UUID NOT NULL,
  reviewed_by UUID,
  approved_by UUID, -- For release approval
  resolution VARCHAR(20) CHECK (resolution IN ('RELEASED', 'SCRAPPED', 'RETURNED', 'REWORKED', 'DONATED')),
  resolution_notes TEXT,
  estimated_cost DECIMAL(10, 2), -- Cost impact
  placed_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  released_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ, -- Auto-escalation if not resolved
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT check_hold_quantity CHECK (quantity > 0),
  CONSTRAINT check_hold_timestamps CHECK (
    (reviewed_at IS NULL OR reviewed_at >= placed_at) AND
    (released_at IS NULL OR released_at >= placed_at)
  ),
  CONSTRAINT check_hold_resolution CHECK (
    (resolution IS NULL OR (reviewed_by IS NOT NULL AND reviewed_at IS NOT NULL))
  )
);

-- ============================================================================
-- TRACKING & AUDIT TABLES
-- ============================================================================

-- Location History Table (Enhanced)
CREATE TABLE location_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inventory_id UUID NOT NULL REFERENCES inventory(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  from_location_id UUID REFERENCES warehouse_locations(id) ON DELETE SET NULL,
  to_location_id UUID NOT NULL REFERENCES warehouse_locations(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL,
  movement_type VARCHAR(20) NOT NULL CHECK (movement_type IN ('PUT_AWAY', 'PICK', 'TRANSFER', 'ADJUSTMENT', 'CYCLE_COUNT', 'RETURN', 'SCRAP')),
  reference_type VARCHAR(30) CHECK (reference_type IN ('PUT_AWAY_TASK', 'TAKE_AWAY_ORDER', 'QC_INSPECTION', 'MANUAL', 'SYSTEM')),
  reference_id UUID,
  beacon_id UUID REFERENCES ble_beacons(id) ON DELETE SET NULL,
  moved_by UUID NOT NULL,
  moved_at TIMESTAMPTZ DEFAULT NOW(),
  distance_meters DECIMAL(10, 2), -- Distance moved
  duration_seconds INTEGER, -- Duration of move
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- BLE Scan Events Table (Enhanced)
CREATE TABLE ble_scan_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  beacon_id UUID NOT NULL REFERENCES ble_beacons(id) ON DELETE CASCADE,
  mac_address VARCHAR(17) NOT NULL,
  signal_strength INTEGER NOT NULL, -- RSSI
  tx_power INTEGER, -- Transmitted power
  distance_estimate DECIMAL(5, 2), -- Estimated distance in meters
  scan_type VARCHAR(30) NOT NULL CHECK (scan_type IN ('PRODUCT_VERIFICATION', 'LOCATION_CHECK', 'INVENTORY_COUNT', 'GENERAL', 'PROXIMITY_ALERT')),
  scan_duration_ms INTEGER, -- Scan duration in milliseconds
  scanned_by UUID NOT NULL,
  scanned_at_location_id UUID REFERENCES warehouse_locations(id) ON DELETE SET NULL,
  related_task_type VARCHAR(20) CHECK (related_task_type IN ('PUT_AWAY', 'TAKE_AWAY', 'QC', 'CYCLE_COUNT')),
  related_task_id UUID,
  device_info JSONB,
  gps_coordinates JSONB, -- {lat, lng, accuracy}
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT check_scan_rssi CHECK (is_valid_rssi(signal_strength)),
  CONSTRAINT check_scan_mac CHECK (is_valid_mac_address(mac_address)),
  CONSTRAINT check_distance CHECK (distance_estimate IS NULL OR distance_estimate >= 0),
  CONSTRAINT check_scan_duration CHECK (scan_duration_ms IS NULL OR scan_duration_ms > 0)
);

-- Activity Log Table (Enhanced)
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  activity_type VARCHAR(30) NOT NULL CHECK (activity_type IN ('PUT_AWAY', 'TAKE_AWAY', 'QC_INSPECTION', 'HOLD', 'RELEASE', 'LOCATION_CHANGE', 'INVENTORY_ADJUSTMENT', 'USER_ACTION', 'SYSTEM_EVENT', 'BEACON_EVENT')),
  entity_type VARCHAR(20) NOT NULL CHECK (entity_type IN ('PRODUCT', 'INVENTORY', 'LOCATION', 'BEACON', 'ORDER', 'TASK', 'INSPECTION', 'USER')),
  entity_id UUID NOT NULL,
  action VARCHAR(255) NOT NULL,
  severity VARCHAR(10) DEFAULT 'INFO' CHECK (severity IN ('DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL')),
  user_id UUID,
  changes JSONB,
  metadata JSONB,
  ip_address INET,
  user_agent TEXT,
  session_id VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CREATE INDEX for efficient querying
CREATE INDEX idx_activity_logs_created_severity ON activity_logs(created_at DESC, severity);
CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id);

-- Users Table (Enhanced)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(30) NOT NULL CHECK (role IN ('ADMIN', 'WAREHOUSE_MANAGER', 'WAREHOUSE_STAFF', 'QC_INSPECTOR', 'VIEWER', 'SUPERVISOR')),
  department VARCHAR(100),
  employee_id VARCHAR(50),
  phone VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMPTZ,
  login_count INTEGER DEFAULT 0,
  failed_login_attempts INTEGER DEFAULT 0,
  account_locked_until TIMESTAMPTZ,
  preferences JSONB,
  assigned_zones TEXT[], -- Warehouse zones assigned to this user
  max_task_capacity INTEGER DEFAULT 10, -- Max concurrent tasks
  current_task_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT check_email_format CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'),
  CONSTRAINT check_phone_format CHECK (phone IS NULL OR phone ~ '^\+?[0-9\s\-()]+$'),
  CONSTRAINT check_task_count CHECK (current_task_count >= 0 AND current_task_count <= max_task_capacity)
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Products indexes
CREATE INDEX idx_product_sku ON products(sku) WHERE deleted_at IS NULL;
CREATE INDEX idx_product_barcode ON products(barcode) WHERE barcode IS NOT NULL;
CREATE INDEX idx_product_category ON products(category, subcategory);
CREATE INDEX idx_product_active ON products(is_active) WHERE is_active = true;
CREATE INDEX idx_product_reorder ON products(reorder_point) WHERE is_active = true;
CREATE INDEX idx_product_abc ON products(abc_classification) WHERE abc_classification IS NOT NULL;

-- Warehouse Locations indexes
CREATE INDEX idx_location_code ON warehouse_locations(location_code);
CREATE INDEX idx_location_type ON warehouse_locations(location_type);
CREATE INDEX idx_location_zone ON warehouse_locations(zone);
CREATE INDEX idx_location_available ON warehouse_locations(is_available) WHERE is_available = true;
CREATE INDEX idx_location_capacity ON warehouse_locations(zone, location_type) 
  WHERE (capacity - current_occupancy - reserved_capacity) > 0;

-- BLE Beacons indexes
CREATE INDEX idx_beacon_mac ON ble_beacons(mac_address);
CREATE INDEX idx_beacon_type ON ble_beacons(beacon_type);
CREATE INDEX idx_beacon_active ON ble_beacons(is_active) WHERE is_active = true;
CREATE INDEX idx_beacon_location ON ble_beacons(associated_location_id) WHERE associated_location_id IS NOT NULL;
CREATE INDEX idx_beacon_last_seen ON ble_beacons(last_seen_at DESC);
CREATE INDEX idx_beacon_battery ON ble_beacons(battery_level) WHERE battery_level < 20;

-- Inventory indexes
CREATE INDEX idx_inventory_product ON inventory(product_id);
CREATE INDEX idx_inventory_location ON inventory(location_id);
CREATE INDEX idx_inventory_status ON inventory(status);
CREATE INDEX idx_inventory_beacon ON inventory(beacon_id) WHERE beacon_id IS NOT NULL;
CREATE INDEX idx_inventory_composite ON inventory(product_id, location_id, status);
CREATE INDEX idx_inventory_expiration ON inventory(expiration_date) WHERE expiration_date IS NOT NULL AND status = 'AVAILABLE';
CREATE INDEX idx_inventory_lot ON inventory(lot_number) WHERE lot_number IS NOT NULL;
CREATE INDEX idx_inventory_available ON inventory(available_quantity) WHERE available_quantity > 0;

-- Put-Away Tasks indexes
CREATE INDEX idx_putaway_number ON put_away_tasks(task_number);
CREATE INDEX idx_putaway_status ON put_away_tasks(status) WHERE status NOT IN ('COMPLETED', 'CANCELLED');
CREATE INDEX idx_putaway_assigned ON put_away_tasks(assigned_to) WHERE assigned_to IS NOT NULL;
CREATE INDEX idx_putaway_product ON put_away_tasks(product_id);
CREATE INDEX idx_putaway_priority ON put_away_tasks(priority, created_at) WHERE status = 'PENDING';
CREATE INDEX idx_putaway_due ON put_away_tasks(due_at) WHERE due_at IS NOT NULL AND status NOT IN ('COMPLETED', 'CANCELLED');

-- Take-Away Orders indexes
CREATE INDEX idx_takeaway_number ON take_away_orders(order_number);
CREATE INDEX idx_takeaway_status ON take_away_orders(status) WHERE status NOT IN ('COMPLETED', 'CANCELLED');
CREATE INDEX idx_takeaway_assigned ON take_away_orders(assigned_to) WHERE assigned_to IS NOT NULL;
CREATE INDEX idx_takeaway_priority ON take_away_orders(priority, created_at) WHERE status IN ('PENDING', 'PICKING');
CREATE INDEX idx_takeaway_customer ON take_away_orders(customer_name) WHERE customer_name IS NOT NULL;
CREATE INDEX idx_takeaway_due ON take_away_orders(due_at) WHERE due_at IS NOT NULL;

-- Take-Away Order Items indexes
CREATE INDEX idx_takeaway_items_order ON take_away_order_items(order_id);
CREATE INDEX idx_takeaway_items_product ON take_away_order_items(product_id);
CREATE INDEX idx_takeaway_items_status ON take_away_order_items(status) WHERE status != 'SHIPPED';
CREATE INDEX idx_takeaway_items_location ON take_away_order_items(source_location_id) WHERE source_location_id IS NOT NULL;

-- QC Inspections indexes
CREATE INDEX idx_qc_number ON qc_inspections(inspection_number);
CREATE INDEX idx_qc_status ON qc_inspections(status) WHERE status NOT IN ('PASSED', 'CANCELLED');
CREATE INDEX idx_qc_product ON qc_inspections(product_id);
CREATE INDEX idx_qc_inspector ON qc_inspections(inspector_id);
CREATE INDEX idx_qc_type ON qc_inspections(inspection_type, status);
CREATE INDEX idx_qc_failed ON qc_inspections(product_id, created_at DESC) WHERE status = 'FAILED';
CREATE INDEX idx_qc_due ON qc_inspections(due_at) WHERE due_at IS NOT NULL AND status = 'PENDING';

-- Hold Items indexes
CREATE INDEX idx_hold_number ON hold_items(hold_number);
CREATE INDEX idx_hold_product ON hold_items(product_id);
CREATE INDEX idx_hold_inventory ON hold_items(inventory_id);
CREATE INDEX idx_hold_location ON hold_items(location_id);
CREATE INDEX idx_hold_reason ON hold_items(hold_reason, severity);
CREATE INDEX idx_hold_active ON hold_items(resolution) WHERE resolution IS NULL;
CREATE INDEX idx_hold_expires ON hold_items(expires_at) WHERE expires_at IS NOT NULL AND resolution IS NULL;

-- Location History indexes
CREATE INDEX idx_location_history_inventory ON location_history(inventory_id);
CREATE INDEX idx_location_history_product ON location_history(product_id);
CREATE INDEX idx_location_history_moved_at ON location_history(moved_at DESC);
CREATE INDEX idx_location_history_movement_type ON location_history(movement_type, moved_at DESC);
CREATE INDEX idx_location_history_from_to ON location_history(from_location_id, to_location_id);

-- BLE Scan Events indexes (with partitioning consideration)
CREATE INDEX idx_scan_beacon ON ble_scan_events(beacon_id, created_at DESC);
CREATE INDEX idx_scan_created ON ble_scan_events(created_at DESC);
CREATE INDEX idx_scan_type ON ble_scan_events(scan_type, created_at DESC);
CREATE INDEX idx_scan_scanned_by ON ble_scan_events(scanned_by, created_at DESC);
CREATE INDEX idx_scan_location ON ble_scan_events(scanned_at_location_id) WHERE scanned_at_location_id IS NOT NULL;

-- Users indexes
CREATE INDEX idx_user_username ON users(username) WHERE is_active = true;
CREATE INDEX idx_user_email ON users(email) WHERE is_active = true;
CREATE INDEX idx_user_role ON users(role) WHERE is_active = true;
CREATE INDEX idx_user_department ON users(department) WHERE department IS NOT NULL;

-- Full-text search indexes
CREATE INDEX idx_product_name_search ON products USING gin(to_tsvector('english', name));
CREATE INDEX idx_product_description_search ON products USING gin(to_tsvector('english', coalesce(description, '')));

-- JSONB indexes
CREATE INDEX idx_product_dimensions ON products USING gin(dimensions) WHERE dimensions IS NOT NULL;
CREATE INDEX idx_qc_criteria ON qc_inspections USING gin(inspection_criteria) WHERE inspection_criteria IS NOT NULL;
CREATE INDEX idx_scan_device_info ON ble_scan_events USING gin(device_info) WHERE device_info IS NOT NULL;

-- ============================================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- ============================================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for all tables with updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_warehouse_locations_updated_at BEFORE UPDATE ON warehouse_locations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ble_beacons_updated_at BEFORE UPDATE ON ble_beacons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON inventory
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_put_away_tasks_updated_at BEFORE UPDATE ON put_away_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_take_away_orders_updated_at BEFORE UPDATE ON take_away_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_take_away_order_items_updated_at BEFORE UPDATE ON take_away_order_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_qc_inspections_updated_at BEFORE UPDATE ON qc_inspections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hold_items_updated_at BEFORE UPDATE ON hold_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-update location occupancy when inventory changes
CREATE OR REPLACE FUNCTION update_location_occupancy()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE warehouse_locations 
    SET current_occupancy = current_occupancy + NEW.quantity
    WHERE id = NEW.location_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.location_id != NEW.location_id THEN
      -- Moving between locations
      UPDATE warehouse_locations 
      SET current_occupancy = current_occupancy - OLD.quantity
      WHERE id = OLD.location_id;
      
      UPDATE warehouse_locations 
      SET current_occupancy = current_occupancy + NEW.quantity
      WHERE id = NEW.location_id;
    ELSIF OLD.quantity != NEW.quantity THEN
      -- Quantity changed in same location
      UPDATE warehouse_locations 
      SET current_occupancy = current_occupancy + (NEW.quantity - OLD.quantity)
      WHERE id = NEW.location_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE warehouse_locations 
    SET current_occupancy = current_occupancy - OLD.quantity
    WHERE id = OLD.location_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_location_occupancy
  AFTER INSERT OR UPDATE OR DELETE ON inventory
  FOR EACH ROW EXECUTE FUNCTION update_location_occupancy();

-- Auto-log activity on important changes
CREATE OR REPLACE FUNCTION log_inventory_changes()
RETURNS TRIGGER AS $$
DECLARE
  change_record JSONB;
BEGIN
  IF TG_OP = 'UPDATE' THEN
    change_record := jsonb_build_array(
      jsonb_build_object(
        'field', 'quantity',
        'old_value', OLD.quantity,
        'new_value', NEW.quantity
      ),
      jsonb_build_object(
        'field', 'status',
        'old_value', OLD.status,
        'new_value', NEW.status
      )
    );
    
    IF OLD.quantity != NEW.quantity OR OLD.status != NEW.status THEN
      INSERT INTO activity_logs (activity_type, entity_type, entity_id, action, changes, metadata)
      VALUES (
        'INVENTORY_ADJUSTMENT',
        'INVENTORY',
        NEW.id,
        'Inventory updated',
        change_record,
        jsonb_build_object('product_id', NEW.product_id, 'location_id', NEW.location_id)
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_log_inventory_changes
  AFTER UPDATE ON inventory
  FOR EACH ROW EXECUTE FUNCTION log_inventory_changes();

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE products IS 'Master product catalog with SKU, barcodes, and product attributes';
COMMENT ON TABLE warehouse_locations IS 'Physical warehouse locations with capacity tracking and temperature monitoring';
COMMENT ON TABLE ble_beacons IS 'BLE beacon devices for real-time tracking (supports iBeacon protocol)';
COMMENT ON TABLE inventory IS 'Current inventory records linking products to locations with quantity tracking';
COMMENT ON TABLE put_away_tasks IS 'Put-away workflow tasks for receiving and storing products';
COMMENT ON TABLE take_away_orders IS 'Order fulfillment and picking workflow management';
COMMENT ON TABLE qc_inspections IS 'Quality control inspection records and dispositions';
COMMENT ON TABLE hold_items IS 'Items placed on hold due to quality, damage, or other issues';
COMMENT ON TABLE location_history IS 'Complete audit trail of all inventory movements';
COMMENT ON TABLE ble_scan_events IS 'Log of all BLE beacon scans with RSSI and distance estimates';
COMMENT ON TABLE activity_logs IS 'System-wide activity and audit log';
COMMENT ON TABLE users IS 'System users with role-based access and task capacity management';

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- Available inventory view
CREATE OR REPLACE VIEW v_available_inventory AS
SELECT 
  i.id,
  p.sku,
  p.name AS product_name,
  p.category,
  wl.location_code,
  wl.zone,
  i.quantity,
  i.reserved_quantity,
  i.available_quantity,
  i.lot_number,
  i.expiration_date,
  i.status,
  bb.mac_address AS beacon_mac,
  bb.signal_strength AS beacon_rssi
FROM inventory i
JOIN products p ON i.product_id = p.id
JOIN warehouse_locations wl ON i.location_id = wl.id
LEFT JOIN ble_beacons bb ON i.beacon_id = bb.id
WHERE i.available_quantity > 0 AND i.status = 'AVAILABLE' AND p.is_active = true;

-- Active tasks view
CREATE OR REPLACE VIEW v_active_tasks AS
SELECT 
  'PUT_AWAY' AS task_type,
  pat.id,
  pat.task_number AS number,
  p.sku,
  p.name AS product_name,
  wl_src.location_code AS source_location,
  wl_dst.location_code AS destination_location,
  pat.quantity,
  pat.status,
  pat.priority,
  u.full_name AS assigned_to,
  pat.created_at,
  pat.due_at
FROM put_away_tasks pat
JOIN products p ON pat.product_id = p.id
JOIN warehouse_locations wl_src ON pat.source_location_id = wl_src.id
LEFT JOIN warehouse_locations wl_dst ON pat.destination_location_id = wl_dst.id
LEFT JOIN users u ON pat.assigned_to = u.id
WHERE pat.status NOT IN ('COMPLETED', 'CANCELLED')

UNION ALL

SELECT 
  'TAKE_AWAY' AS task_type,
  tao.id,
  tao.order_number AS number,
  NULL AS sku,
  tao.customer_name AS product_name,
  NULL AS source_location,
  NULL AS destination_location,
  tao.total_quantity AS quantity,
  tao.status,
  tao.priority,
  u.full_name AS assigned_to,
  tao.created_at,
  tao.due_at
FROM take_away_orders tao
LEFT JOIN users u ON tao.assigned_to = u.id
WHERE tao.status NOT IN ('COMPLETED', 'CANCELLED');

-- Low battery beacons view
CREATE OR REPLACE VIEW v_low_battery_beacons AS
SELECT 
  bb.beacon_name,
  bb.mac_address,
  bb.beacon_type,
  bb.battery_level,
  bb.last_seen_at,
  wl.location_code,
  wl.zone
FROM ble_beacons bb
LEFT JOIN warehouse_locations wl ON bb.associated_location_id = wl.id
WHERE bb.battery_level < 20 AND bb.is_active = true
ORDER BY bb.battery_level ASC;

-- Location capacity utilization view
CREATE OR REPLACE VIEW v_location_capacity AS
SELECT 
  location_code,
  zone,
  location_type,
  capacity,
  current_occupancy,
  reserved_capacity,
  (capacity - current_occupancy - reserved_capacity) AS available_capacity,
  ROUND((current_occupancy::DECIMAL / NULLIF(capacity, 0) * 100), 2) AS occupancy_pct,
  ROUND(((current_occupancy + reserved_capacity)::DECIMAL / NULLIF(capacity, 0) * 100), 2) AS total_utilization_pct,
  is_available,
  is_locked
FROM warehouse_locations
WHERE capacity > 0
ORDER BY total_utilization_pct DESC;

-- Products needing reorder view
CREATE OR REPLACE VIEW v_reorder_needed AS
SELECT 
  p.sku,
  p.name,
  p.category,
  p.reorder_point,
  p.reorder_quantity,
  COALESCE(SUM(i.available_quantity), 0) AS current_stock,
  p.reorder_quantity AS suggested_order_qty
FROM products p
LEFT JOIN inventory i ON p.id = i.product_id AND i.status = 'AVAILABLE'
WHERE p.is_active = true AND p.deleted_at IS NULL
GROUP BY p.id, p.sku, p.name, p.category, p.reorder_point, p.reorder_quantity
HAVING COALESCE(SUM(i.available_quantity), 0) <= p.reorder_point
ORDER BY (p.reorder_point - COALESCE(SUM(i.available_quantity), 0)) DESC;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES - Template
-- ============================================================================
-- Uncomment and customize based on your authentication system

/*
-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouse_locations ENABLE ROW LEVEL SECURITY;

-- Example policies
CREATE POLICY "Users can view all products" 
  ON products FOR SELECT 
  USING (deleted_at IS NULL);

CREATE POLICY "Only admins can modify products" 
  ON products FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

CREATE POLICY "Staff can view inventory" 
  ON inventory FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Staff can update assigned tasks"
  ON put_away_tasks FOR UPDATE
  USING (assigned_to = auth.uid())
  WITH CHECK (assigned_to = auth.uid());
*/

-- ============================================================================
-- PERFORMANCE MAINTENANCE
-- ============================================================================

-- Function to archive old scan events (call periodically)
CREATE OR REPLACE FUNCTION archive_old_scan_events(days_to_keep INTEGER DEFAULT 30)
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM ble_scan_events 
  WHERE created_at < NOW() - (days_to_keep || ' days')::INTERVAL;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to clean up old activity logs
CREATE OR REPLACE FUNCTION archive_old_activity_logs(days_to_keep INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM activity_logs 
  WHERE created_at < NOW() - (days_to_keep || ' days')::INTERVAL
  AND severity NOT IN ('ERROR', 'CRITICAL');
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- INITIAL DATA VALIDATION
-- ============================================================================

-- Ensure we have at least one admin user (run after initial setup)
-- INSERT INTO users (username, email, full_name, role) 
-- VALUES ('admin', 'admin@warehouse.com', 'System Administrator', 'ADMIN')
-- ON CONFLICT (username) DO NOTHING;
