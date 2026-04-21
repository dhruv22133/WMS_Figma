-- ============================================================================
-- BLE-based Warehouse Management System - Database Schema
-- PostgreSQL/Supabase Compatible
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- Products Table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sku VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  unit_of_measure VARCHAR(20) NOT NULL,
  weight DECIMAL(10, 2),
  dimensions JSONB,
  reorder_point INTEGER NOT NULL DEFAULT 0,
  optimal_storage_temp DECIMAL(5, 2),
  requires_quality_check BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID
);

-- Warehouse Locations Table
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
  is_available BOOLEAN DEFAULT true,
  temperature_controlled BOOLEAN DEFAULT false,
  requires_special_handling BOOLEAN DEFAULT false,
  coordinates JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT check_occupancy CHECK (current_occupancy <= capacity)
);

-- BLE Beacons Table
CREATE TABLE ble_beacons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mac_address VARCHAR(17) UNIQUE NOT NULL,
  beacon_name VARCHAR(100) NOT NULL,
  beacon_type VARCHAR(20) NOT NULL CHECK (beacon_type IN ('PRODUCT', 'LOCATION', 'EQUIPMENT', 'MOBILE')),
  battery_level INTEGER CHECK (battery_level >= 0 AND battery_level <= 100),
  signal_strength INTEGER,
  firmware_version VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  last_seen_at TIMESTAMPTZ,
  associated_location_id UUID REFERENCES warehouse_locations(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inventory Table
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  location_id UUID NOT NULL REFERENCES warehouse_locations(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'RESERVED', 'ON_HOLD', 'IN_TRANSIT', 'DAMAGED', 'EXPIRED')),
  lot_number VARCHAR(50),
  serial_number VARCHAR(100),
  expiration_date DATE,
  received_date DATE NOT NULL,
  beacon_id UUID REFERENCES ble_beacons(id) ON DELETE SET NULL,
  last_counted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT check_quantity CHECK (quantity >= 0)
);

-- ============================================================================
-- OPERATIONAL TABLES
-- ============================================================================

-- Put-Away Tasks Table
CREATE TABLE put_away_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_number VARCHAR(50) UNIQUE NOT NULL,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  source_location_id UUID NOT NULL REFERENCES warehouse_locations(id) ON DELETE RESTRICT,
  destination_location_id UUID REFERENCES warehouse_locations(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SCANNING', 'MOVING', 'PLACING', 'COMPLETED', 'CANCELLED')),
  priority VARCHAR(10) DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
  assigned_to UUID,
  beacon_scanned VARCHAR(17),
  location_verified BOOLEAN DEFAULT false,
  step_completed INTEGER DEFAULT 0,
  notes TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  CONSTRAINT check_quantity_positive CHECK (quantity > 0)
);

-- Take-Away Orders Table
CREATE TABLE take_away_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  order_type VARCHAR(20) NOT NULL CHECK (order_type IN ('CUSTOMER', 'TRANSFER', 'RETURN', 'SCRAP')),
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PICKING', 'PACKING', 'SHIPPED', 'COMPLETED', 'CANCELLED')),
  priority VARCHAR(10) DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
  customer_name VARCHAR(255),
  customer_reference VARCHAR(100),
  shipping_address TEXT,
  assigned_to UUID,
  picking_started_at TIMESTAMPTZ,
  packed_at TIMESTAMPTZ,
  shipped_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID
);

-- Take-Away Order Items Table
CREATE TABLE take_away_order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES take_away_orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  inventory_id UUID REFERENCES inventory(id) ON DELETE SET NULL,
  quantity_ordered INTEGER NOT NULL,
  quantity_picked INTEGER DEFAULT 0,
  quantity_packed INTEGER DEFAULT 0,
  source_location_id UUID REFERENCES warehouse_locations(id) ON DELETE SET NULL,
  beacon_scanned VARCHAR(17),
  status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PICKING', 'PICKED', 'PACKED', 'SHIPPED')),
  picker_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT check_ordered_quantity CHECK (quantity_ordered > 0),
  CONSTRAINT check_picked_quantity CHECK (quantity_picked >= 0 AND quantity_picked <= quantity_ordered),
  CONSTRAINT check_packed_quantity CHECK (quantity_packed >= 0 AND quantity_packed <= quantity_picked)
);

-- Quality Control Inspections Table
CREATE TABLE qc_inspections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inspection_number VARCHAR(50) UNIQUE NOT NULL,
  inspection_type VARCHAR(20) NOT NULL CHECK (inspection_type IN ('RECEIVING', 'PERIODIC', 'DAMAGE', 'RETURN', 'PRE_SHIP')),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  inventory_id UUID REFERENCES inventory(id) ON DELETE SET NULL,
  location_id UUID NOT NULL REFERENCES warehouse_locations(id) ON DELETE RESTRICT,
  quantity_inspected INTEGER NOT NULL,
  quantity_passed INTEGER DEFAULT 0,
  quantity_failed INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_PROGRESS', 'PASSED', 'FAILED', 'ON_HOLD')),
  inspector_id UUID NOT NULL,
  inspection_criteria JSONB,
  defects_found TEXT[],
  photos TEXT[],
  disposition VARCHAR(20) CHECK (disposition IN ('ACCEPT', 'REJECT', 'HOLD', 'REWORK')),
  beacon_scanned VARCHAR(17),
  inspected_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT check_inspection_quantities CHECK (
    quantity_passed >= 0 AND 
    quantity_failed >= 0 AND 
    (quantity_passed + quantity_failed) <= quantity_inspected
  )
);

-- Hold Area Management Table
CREATE TABLE hold_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hold_number VARCHAR(50) UNIQUE NOT NULL,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  inventory_id UUID NOT NULL REFERENCES inventory(id) ON DELETE RESTRICT,
  location_id UUID NOT NULL REFERENCES warehouse_locations(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL,
  hold_reason VARCHAR(30) NOT NULL CHECK (hold_reason IN ('QUALITY_ISSUE', 'DAMAGE', 'EXPIRED', 'CUSTOMER_RETURN', 'INVESTIGATION', 'OTHER')),
  hold_type VARCHAR(20) DEFAULT 'TEMPORARY' CHECK (hold_type IN ('TEMPORARY', 'PERMANENT')),
  severity VARCHAR(10) DEFAULT 'MEDIUM' CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  description TEXT NOT NULL,
  qc_inspection_id UUID REFERENCES qc_inspections(id) ON DELETE SET NULL,
  placed_by UUID NOT NULL,
  reviewed_by UUID,
  resolution VARCHAR(20) CHECK (resolution IN ('RELEASED', 'SCRAPPED', 'RETURNED', 'REWORKED')),
  resolution_notes TEXT,
  placed_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  released_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT check_hold_quantity CHECK (quantity > 0)
);

-- ============================================================================
-- TRACKING & AUDIT TABLES
-- ============================================================================

-- Location History Table
CREATE TABLE location_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inventory_id UUID NOT NULL REFERENCES inventory(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  from_location_id UUID REFERENCES warehouse_locations(id) ON DELETE SET NULL,
  to_location_id UUID NOT NULL REFERENCES warehouse_locations(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL,
  movement_type VARCHAR(20) NOT NULL CHECK (movement_type IN ('PUT_AWAY', 'PICK', 'TRANSFER', 'ADJUSTMENT', 'CYCLE_COUNT')),
  reference_type VARCHAR(30) CHECK (reference_type IN ('PUT_AWAY_TASK', 'TAKE_AWAY_ORDER', 'QC_INSPECTION', 'MANUAL')),
  reference_id UUID,
  beacon_id UUID REFERENCES ble_beacons(id) ON DELETE SET NULL,
  moved_by UUID NOT NULL,
  moved_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- BLE Scan Events Table
CREATE TABLE ble_scan_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  beacon_id UUID NOT NULL REFERENCES ble_beacons(id) ON DELETE CASCADE,
  mac_address VARCHAR(17) NOT NULL,
  signal_strength INTEGER NOT NULL,
  scan_type VARCHAR(30) NOT NULL CHECK (scan_type IN ('PRODUCT_VERIFICATION', 'LOCATION_CHECK', 'INVENTORY_COUNT', 'GENERAL')),
  scanned_by UUID NOT NULL,
  scanned_at_location_id UUID REFERENCES warehouse_locations(id) ON DELETE SET NULL,
  related_task_type VARCHAR(20) CHECK (related_task_type IN ('PUT_AWAY', 'TAKE_AWAY', 'QC', 'CYCLE_COUNT')),
  related_task_id UUID,
  device_info JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity Log Table
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  activity_type VARCHAR(30) NOT NULL CHECK (activity_type IN ('PUT_AWAY', 'TAKE_AWAY', 'QC_INSPECTION', 'HOLD', 'RELEASE', 'LOCATION_CHANGE', 'INVENTORY_ADJUSTMENT', 'USER_ACTION', 'SYSTEM_EVENT')),
  entity_type VARCHAR(20) NOT NULL CHECK (entity_type IN ('PRODUCT', 'INVENTORY', 'LOCATION', 'BEACON', 'ORDER', 'TASK', 'INSPECTION')),
  entity_id UUID NOT NULL,
  action VARCHAR(255) NOT NULL,
  user_id UUID,
  changes JSONB,
  metadata JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(30) NOT NULL CHECK (role IN ('ADMIN', 'WAREHOUSE_MANAGER', 'WAREHOUSE_STAFF', 'QC_INSPECTOR', 'VIEWER')),
  department VARCHAR(100),
  employee_id VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMPTZ,
  preferences JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Products indexes
CREATE INDEX idx_product_sku ON products(sku);
CREATE INDEX idx_product_category ON products(category);
CREATE INDEX idx_product_active ON products(is_active);
CREATE INDEX idx_product_created_at ON products(created_at);

-- Warehouse Locations indexes
CREATE INDEX idx_location_code ON warehouse_locations(location_code);
CREATE INDEX idx_location_type ON warehouse_locations(location_type);
CREATE INDEX idx_location_zone ON warehouse_locations(zone);
CREATE INDEX idx_location_available ON warehouse_locations(is_available);

-- BLE Beacons indexes
CREATE INDEX idx_beacon_mac ON ble_beacons(mac_address);
CREATE INDEX idx_beacon_type ON ble_beacons(beacon_type);
CREATE INDEX idx_beacon_active ON ble_beacons(is_active);
CREATE INDEX idx_beacon_location ON ble_beacons(associated_location_id);
CREATE INDEX idx_beacon_last_seen ON ble_beacons(last_seen_at);

-- Inventory indexes
CREATE INDEX idx_inventory_product ON inventory(product_id);
CREATE INDEX idx_inventory_location ON inventory(location_id);
CREATE INDEX idx_inventory_status ON inventory(status);
CREATE INDEX idx_inventory_beacon ON inventory(beacon_id);
CREATE INDEX idx_inventory_composite ON inventory(product_id, location_id);
CREATE INDEX idx_inventory_expiration ON inventory(expiration_date) WHERE expiration_date IS NOT NULL;

-- Put-Away Tasks indexes
CREATE INDEX idx_putaway_number ON put_away_tasks(task_number);
CREATE INDEX idx_putaway_status ON put_away_tasks(status);
CREATE INDEX idx_putaway_assigned ON put_away_tasks(assigned_to);
CREATE INDEX idx_putaway_product ON put_away_tasks(product_id);
CREATE INDEX idx_putaway_created ON put_away_tasks(created_at);

-- Take-Away Orders indexes
CREATE INDEX idx_takeaway_number ON take_away_orders(order_number);
CREATE INDEX idx_takeaway_status ON take_away_orders(status);
CREATE INDEX idx_takeaway_assigned ON take_away_orders(assigned_to);
CREATE INDEX idx_takeaway_created ON take_away_orders(created_at);

-- Take-Away Order Items indexes
CREATE INDEX idx_takeaway_items_order ON take_away_order_items(order_id);
CREATE INDEX idx_takeaway_items_product ON take_away_order_items(product_id);
CREATE INDEX idx_takeaway_items_status ON take_away_order_items(status);

-- QC Inspections indexes
CREATE INDEX idx_qc_number ON qc_inspections(inspection_number);
CREATE INDEX idx_qc_status ON qc_inspections(status);
CREATE INDEX idx_qc_product ON qc_inspections(product_id);
CREATE INDEX idx_qc_inspector ON qc_inspections(inspector_id);
CREATE INDEX idx_qc_created ON qc_inspections(created_at);

-- Hold Items indexes
CREATE INDEX idx_hold_number ON hold_items(hold_number);
CREATE INDEX idx_hold_product ON hold_items(product_id);
CREATE INDEX idx_hold_inventory ON hold_items(inventory_id);
CREATE INDEX idx_hold_location ON hold_items(location_id);
CREATE INDEX idx_hold_reason ON hold_items(hold_reason);

-- Location History indexes
CREATE INDEX idx_location_history_inventory ON location_history(inventory_id);
CREATE INDEX idx_location_history_product ON location_history(product_id);
CREATE INDEX idx_location_history_moved_at ON location_history(moved_at);
CREATE INDEX idx_location_history_movement_type ON location_history(movement_type);

-- BLE Scan Events indexes
CREATE INDEX idx_scan_beacon ON ble_scan_events(beacon_id);
CREATE INDEX idx_scan_created ON ble_scan_events(created_at);
CREATE INDEX idx_scan_type ON ble_scan_events(scan_type);
CREATE INDEX idx_scan_scanned_by ON ble_scan_events(scanned_by);

-- Activity Logs indexes
CREATE INDEX idx_activity_type ON activity_logs(activity_type);
CREATE INDEX idx_activity_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX idx_activity_created ON activity_logs(created_at);
CREATE INDEX idx_activity_user ON activity_logs(user_id);

-- Users indexes
CREATE INDEX idx_user_username ON users(username);
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_user_role ON users(role);
CREATE INDEX idx_user_active ON users(is_active);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
-- Note: Uncomment and customize these policies when implementing with Supabase

-- Enable RLS on all tables
-- ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE warehouse_locations ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE ble_beacons ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE put_away_tasks ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE take_away_orders ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE take_away_order_items ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE qc_inspections ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE hold_items ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE location_history ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE ble_scan_events ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Example policies (customize based on your auth requirements):
-- CREATE POLICY "Users can view all products" ON products FOR SELECT USING (true);
-- CREATE POLICY "Only admins can modify products" ON products FOR ALL USING (auth.jwt() ->> 'role' = 'ADMIN');
