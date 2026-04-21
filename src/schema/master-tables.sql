-- ============================================================================
-- MASTER / REFERENCE TABLES
-- Configuration and lookup tables for warehouse management system
-- ============================================================================

-- ============================================================================
-- GENERAL MASTER TABLES
-- ============================================================================

-- Product Categories Master
CREATE TABLE master_product_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES master_product_categories(id) ON DELETE SET NULL,
  level INTEGER DEFAULT 0, -- Hierarchy level (0 = top level)
  icon VARCHAR(50), -- Icon name for UI
  requires_quality_check BOOLEAN DEFAULT false,
  requires_temperature_control BOOLEAN DEFAULT false,
  default_shelf_life_days INTEGER,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT check_level CHECK (level >= 0)
);

-- Units of Measure Master
CREATE TABLE master_units_of_measure (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(20) UNIQUE NOT NULL, -- e.g., 'EA', 'BOX', 'KG'
  name VARCHAR(100) NOT NULL,
  description TEXT,
  unit_type VARCHAR(20) NOT NULL CHECK (unit_type IN ('QUANTITY', 'WEIGHT', 'VOLUME', 'LENGTH', 'AREA')),
  base_unit VARCHAR(20), -- Base unit for conversion
  conversion_factor DECIMAL(15, 6), -- Multiply by this to get base unit
  symbol VARCHAR(10), -- Display symbol
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Warehouse Zones Master
CREATE TABLE master_warehouse_zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  zone_type VARCHAR(30) NOT NULL CHECK (zone_type IN ('RECEIVING', 'STORAGE', 'PICKING', 'SHIPPING', 'QC', 'HOLD', 'STAGING', 'RETURNS')),
  temperature_controlled BOOLEAN DEFAULT false,
  min_temperature DECIMAL(5, 2),
  max_temperature DECIMAL(5, 2),
  requires_special_access BOOLEAN DEFAULT false,
  color_code VARCHAR(7), -- Hex color for UI (#RRGGBB)
  icon VARCHAR(50),
  manager_id UUID, -- Zone manager
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Location Types Master
CREATE TABLE master_location_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(30) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  default_capacity INTEGER,
  default_max_weight DECIMAL(10, 2),
  allows_mixed_products BOOLEAN DEFAULT true,
  requires_beacon BOOLEAN DEFAULT false,
  icon VARCHAR(50),
  color_code VARCHAR(7),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- WORKFLOW MASTER TABLES
-- ============================================================================

-- Task Priority Levels
CREATE TABLE master_priority_levels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(50) NOT NULL,
  description TEXT,
  level INTEGER UNIQUE NOT NULL, -- 1 = highest priority
  sla_hours INTEGER, -- Standard SLA in hours
  color_code VARCHAR(7), -- UI color
  icon VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT check_priority_level CHECK (level > 0)
);

-- Task/Order Status Master
CREATE TABLE master_statuses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(30) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  status_type VARCHAR(30) NOT NULL CHECK (status_type IN ('PUT_AWAY', 'TAKE_AWAY', 'QC_INSPECTION', 'HOLD', 'INVENTORY', 'GENERAL')),
  is_terminal BOOLEAN DEFAULT false, -- Cannot transition from this status
  is_successful BOOLEAN DEFAULT NULL, -- NULL = in-progress, true = success, false = failure
  color_code VARCHAR(7),
  icon VARCHAR(50),
  next_statuses TEXT[], -- Array of valid next status codes
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Types Master
CREATE TABLE master_order_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(30) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  requires_customer BOOLEAN DEFAULT true,
  requires_shipping_address BOOLEAN DEFAULT true,
  allows_partial_fulfillment BOOLEAN DEFAULT true,
  default_priority VARCHAR(20),
  icon VARCHAR(50),
  color_code VARCHAR(7),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Movement Types Master
CREATE TABLE master_movement_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(30) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  direction VARCHAR(10) CHECK (direction IN ('IN', 'OUT', 'INTERNAL')),
  affects_inventory BOOLEAN DEFAULT true,
  requires_approval BOOLEAN DEFAULT false,
  icon VARCHAR(50),
  color_code VARCHAR(7),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- QUALITY CONTROL MASTER TABLES
-- ============================================================================

-- Inspection Types Master
CREATE TABLE master_inspection_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(30) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  is_mandatory BOOLEAN DEFAULT false,
  default_sample_size_pct DECIMAL(5, 2), -- Default sample percentage
  min_sample_size INTEGER,
  requires_photos BOOLEAN DEFAULT false,
  default_criteria JSONB, -- Default inspection criteria
  sla_hours INTEGER,
  icon VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- QC Disposition Master
CREATE TABLE master_qc_dispositions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(30) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  action VARCHAR(30) CHECK (action IN ('ACCEPT', 'REJECT', 'HOLD', 'REWORK', 'RETURN', 'SCRAP')),
  requires_approval BOOLEAN DEFAULT false,
  approver_role VARCHAR(30),
  triggers_hold BOOLEAN DEFAULT false,
  color_code VARCHAR(7),
  icon VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Defect Types Master
CREATE TABLE master_defect_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  category VARCHAR(50), -- e.g., 'PHYSICAL', 'FUNCTIONAL', 'COSMETIC', 'PACKAGING'
  severity VARCHAR(20) CHECK (severity IN ('CRITICAL', 'MAJOR', 'MINOR', 'COSMETIC')),
  default_disposition VARCHAR(30),
  requires_photo BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inspection Criteria Templates
CREATE TABLE master_inspection_criteria (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  category_id UUID REFERENCES master_product_categories(id) ON DELETE SET NULL,
  inspection_type VARCHAR(30),
  criteria_data JSONB NOT NULL, -- Structured criteria definition
  is_mandatory BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- HOLD & ISSUE MASTER TABLES
-- ============================================================================

-- Hold Reasons Master
CREATE TABLE master_hold_reasons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  category VARCHAR(30) CHECK (category IN ('QUALITY', 'DAMAGE', 'REGULATORY', 'OPERATIONAL', 'CUSTOMER', 'OTHER')),
  default_severity VARCHAR(20),
  requires_qc_inspection BOOLEAN DEFAULT false,
  requires_manager_approval BOOLEAN DEFAULT false,
  default_hold_type VARCHAR(20) CHECK (default_hold_type IN ('TEMPORARY', 'PERMANENT')),
  auto_escalation_hours INTEGER,
  color_code VARCHAR(7),
  icon VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Resolution Types Master
CREATE TABLE master_resolution_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(30) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  action VARCHAR(30) CHECK (action IN ('RELEASE', 'SCRAP', 'RETURN', 'REWORK', 'DONATE', 'TRANSFER')),
  requires_approval BOOLEAN DEFAULT false,
  affects_inventory BOOLEAN DEFAULT true,
  requires_documentation BOOLEAN DEFAULT false,
  icon VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Severity Levels Master
CREATE TABLE master_severity_levels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(50) NOT NULL,
  description TEXT,
  level INTEGER UNIQUE NOT NULL, -- 1 = highest severity
  requires_immediate_action BOOLEAN DEFAULT false,
  escalation_hours INTEGER,
  color_code VARCHAR(7),
  icon VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- BEACON & EQUIPMENT MASTER TABLES
-- ============================================================================

-- Beacon Types Master
CREATE TABLE master_beacon_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(30) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  usage VARCHAR(30) CHECK (usage IN ('LOCATION', 'PRODUCT', 'EQUIPMENT', 'PERSONNEL', 'ASSET')),
  is_fixed BOOLEAN DEFAULT false, -- Fixed location or mobile
  default_tx_power INTEGER,
  battery_warning_threshold INTEGER DEFAULT 20,
  battery_critical_threshold INTEGER DEFAULT 10,
  icon VARCHAR(50),
  color_code VARCHAR(7),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Equipment Types Master
CREATE TABLE master_equipment_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  category VARCHAR(30) CHECK (category IN ('FORKLIFT', 'PALLET_JACK', 'CART', 'SCANNER', 'PRINTER', 'COMPUTER', 'OTHER')),
  requires_certification BOOLEAN DEFAULT false,
  requires_maintenance BOOLEAN DEFAULT false,
  maintenance_interval_days INTEGER,
  icon VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SHIPPING & CARRIER MASTER TABLES
-- ============================================================================

-- Shipping Methods Master
CREATE TABLE master_shipping_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  carrier VARCHAR(100), -- e.g., 'UPS', 'FedEx', 'USPS'
  service_level VARCHAR(50), -- e.g., 'Ground', 'Express', '2-Day'
  estimated_days INTEGER,
  is_expedited BOOLEAN DEFAULT false,
  requires_signature BOOLEAN DEFAULT false,
  max_weight DECIMAL(10, 2),
  base_cost DECIMAL(10, 2),
  icon VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Carriers Master
CREATE TABLE master_carriers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  contact_name VARCHAR(100),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(20),
  website VARCHAR(255),
  api_endpoint VARCHAR(255),
  api_key_required BOOLEAN DEFAULT false,
  tracking_url_template VARCHAR(500), -- e.g., 'https://track.carrier.com?tracking={TRACKING_NUMBER}'
  logo_url VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- USER & ROLE MASTER TABLES
-- ============================================================================

-- Roles Master
CREATE TABLE master_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  level INTEGER UNIQUE NOT NULL, -- 1 = highest authority
  permissions JSONB, -- Structured permissions object
  can_approve_holds BOOLEAN DEFAULT false,
  can_approve_adjustments BOOLEAN DEFAULT false,
  can_manage_users BOOLEAN DEFAULT false,
  max_task_capacity INTEGER DEFAULT 10,
  color_code VARCHAR(7),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Departments Master
CREATE TABLE master_departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  manager_id UUID,
  cost_center VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- REPORTING & ANALYTICS MASTER TABLES
-- ============================================================================

-- Activity Types Master
CREATE TABLE master_activity_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  category VARCHAR(30) CHECK (category IN ('OPERATIONAL', 'ADMINISTRATIVE', 'SYSTEM', 'SECURITY', 'AUDIT')),
  default_severity VARCHAR(20),
  retention_days INTEGER DEFAULT 90,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alert Types Master
CREATE TABLE master_alert_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  category VARCHAR(30) CHECK (category IN ('INVENTORY', 'QUALITY', 'EQUIPMENT', 'SAFETY', 'SYSTEM', 'PERFORMANCE')),
  severity VARCHAR(20),
  requires_acknowledgment BOOLEAN DEFAULT false,
  escalation_minutes INTEGER,
  notification_channels TEXT[], -- ['EMAIL', 'SMS', 'IN_APP']
  recipient_roles TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- CONFIGURATION TABLES
-- ============================================================================

-- System Configuration
CREATE TABLE master_system_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  config_key VARCHAR(100) UNIQUE NOT NULL,
  config_value TEXT,
  value_type VARCHAR(20) CHECK (value_type IN ('STRING', 'NUMBER', 'BOOLEAN', 'JSON')),
  category VARCHAR(50),
  description TEXT,
  is_editable BOOLEAN DEFAULT true,
  requires_restart BOOLEAN DEFAULT false,
  updated_by UUID,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Warehouse Settings
CREATE TABLE master_warehouse_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  warehouse_id VARCHAR(50) UNIQUE NOT NULL DEFAULT 'MAIN',
  warehouse_name VARCHAR(100) NOT NULL,
  address TEXT,
  timezone VARCHAR(50) DEFAULT 'UTC',
  operating_hours JSONB, -- {monday: {open: '08:00', close: '17:00'}, ...}
  default_currency VARCHAR(3) DEFAULT 'USD',
  auto_assign_tasks BOOLEAN DEFAULT true,
  require_beacon_scan BOOLEAN DEFAULT true,
  enable_quality_control BOOLEAN DEFAULT true,
  min_reorder_days INTEGER DEFAULT 7,
  max_cycle_count_variance_pct DECIMAL(5, 2) DEFAULT 2.0,
  settings JSONB, -- Additional custom settings
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Number Sequences (for generating task/order numbers)
CREATE TABLE master_number_sequences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sequence_type VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'PUT_AWAY_TASK', 'TAKE_AWAY_ORDER'
  prefix VARCHAR(20) NOT NULL, -- e.g., 'PUT-', 'ORD-'
  current_value INTEGER NOT NULL DEFAULT 0,
  increment_by INTEGER DEFAULT 1,
  min_length INTEGER DEFAULT 6, -- Minimum digits (zero-padded)
  reset_annually BOOLEAN DEFAULT true,
  last_reset_date DATE,
  format_template VARCHAR(100), -- e.g., '{PREFIX}{YEAR}-{NUMBER}'
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT check_current_value CHECK (current_value >= 0)
);

-- ============================================================================
-- INDEXES FOR MASTER TABLES
-- ============================================================================

CREATE INDEX idx_master_categories_parent ON master_product_categories(parent_id) WHERE parent_id IS NOT NULL;
CREATE INDEX idx_master_categories_active ON master_product_categories(is_active, display_order) WHERE is_active = true;

CREATE INDEX idx_master_uom_type ON master_units_of_measure(unit_type);
CREATE INDEX idx_master_uom_active ON master_units_of_measure(is_active) WHERE is_active = true;

CREATE INDEX idx_master_zones_type ON master_warehouse_zones(zone_type);
CREATE INDEX idx_master_zones_active ON master_warehouse_zones(is_active) WHERE is_active = true;

CREATE INDEX idx_master_statuses_type ON master_statuses(status_type, display_order);
CREATE INDEX idx_master_statuses_terminal ON master_statuses(is_terminal) WHERE is_terminal = true;

CREATE INDEX idx_master_priority_level ON master_priority_levels(level);

CREATE INDEX idx_master_defects_category ON master_defect_types(category);
CREATE INDEX idx_master_defects_severity ON master_defect_types(severity);

CREATE INDEX idx_master_inspection_category ON master_inspection_criteria(category_id) WHERE category_id IS NOT NULL;

CREATE INDEX idx_master_shipping_carrier ON master_shipping_methods(carrier);
CREATE INDEX idx_master_shipping_active ON master_shipping_methods(is_active, display_order) WHERE is_active = true;

CREATE INDEX idx_master_roles_level ON master_roles(level);

CREATE INDEX idx_master_alerts_category ON master_alert_types(category, severity);

CREATE INDEX idx_master_config_category ON master_system_config(category);

-- ============================================================================
-- TRIGGERS FOR MASTER TABLES
-- ============================================================================

CREATE TRIGGER update_master_product_categories_updated_at BEFORE UPDATE ON master_product_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_master_units_of_measure_updated_at BEFORE UPDATE ON master_units_of_measure
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_master_warehouse_zones_updated_at BEFORE UPDATE ON master_warehouse_zones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_master_location_types_updated_at BEFORE UPDATE ON master_location_types
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_master_priority_levels_updated_at BEFORE UPDATE ON master_priority_levels
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_master_statuses_updated_at BEFORE UPDATE ON master_statuses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_master_order_types_updated_at BEFORE UPDATE ON master_order_types
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_master_inspection_types_updated_at BEFORE UPDATE ON master_inspection_types
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_master_roles_updated_at BEFORE UPDATE ON master_roles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_master_warehouse_settings_updated_at BEFORE UPDATE ON master_warehouse_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to get next number in sequence
CREATE OR REPLACE FUNCTION get_next_sequence_number(seq_type VARCHAR)
RETURNS TEXT AS $$
DECLARE
  seq_record RECORD;
  next_num INTEGER;
  year_str VARCHAR(4);
  result TEXT;
BEGIN
  -- Lock the row for update
  SELECT * INTO seq_record 
  FROM master_number_sequences 
  WHERE sequence_type = seq_type 
  FOR UPDATE;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Sequence type % not found', seq_type;
  END IF;
  
  -- Check if reset is needed
  IF seq_record.reset_annually AND 
     (seq_record.last_reset_date IS NULL OR 
      EXTRACT(YEAR FROM seq_record.last_reset_date) < EXTRACT(YEAR FROM CURRENT_DATE)) THEN
    next_num := 1;
    UPDATE master_number_sequences 
    SET current_value = 1, last_reset_date = CURRENT_DATE 
    WHERE sequence_type = seq_type;
  ELSE
    next_num := seq_record.current_value + seq_record.increment_by;
    UPDATE master_number_sequences 
    SET current_value = next_num 
    WHERE sequence_type = seq_type;
  END IF;
  
  -- Format the number
  year_str := EXTRACT(YEAR FROM CURRENT_DATE)::TEXT;
  result := seq_record.format_template;
  result := REPLACE(result, '{PREFIX}', seq_record.prefix);
  result := REPLACE(result, '{YEAR}', year_str);
  result := REPLACE(result, '{NUMBER}', LPAD(next_num::TEXT, seq_record.min_length, '0'));
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- VIEWS FOR MASTER DATA
-- ============================================================================

-- Active lookup values view
CREATE OR REPLACE VIEW v_active_lookups AS
SELECT 'CATEGORY' as lookup_type, code, name, NULL::INTEGER as level FROM master_product_categories WHERE is_active = true
UNION ALL
SELECT 'UOM', code, name, NULL FROM master_units_of_measure WHERE is_active = true
UNION ALL
SELECT 'ZONE', code, name, NULL FROM master_warehouse_zones WHERE is_active = true
UNION ALL
SELECT 'PRIORITY', code, name, level FROM master_priority_levels WHERE is_active = true
UNION ALL
SELECT 'HOLD_REASON', code, name, NULL FROM master_hold_reasons WHERE is_active = true
UNION ALL
SELECT 'DEFECT_TYPE', code, name, NULL FROM master_defect_types WHERE is_active = true
ORDER BY lookup_type, level NULLS LAST, name;

-- Category hierarchy view
CREATE OR REPLACE VIEW v_category_hierarchy AS
WITH RECURSIVE category_tree AS (
  -- Root categories
  SELECT 
    id, code, name, parent_id, level, 
    ARRAY[name] as path,
    name as full_path
  FROM master_product_categories
  WHERE parent_id IS NULL AND is_active = true
  
  UNION ALL
  
  -- Child categories
  SELECT 
    c.id, c.code, c.name, c.parent_id, c.level,
    ct.path || c.name,
    ct.full_path || ' > ' || c.name
  FROM master_product_categories c
  JOIN category_tree ct ON c.parent_id = ct.id
  WHERE c.is_active = true
)
SELECT * FROM category_tree ORDER BY path;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE master_product_categories IS 'Product category hierarchy with configurable attributes';
COMMENT ON TABLE master_units_of_measure IS 'Units of measure with conversion factors';
COMMENT ON TABLE master_warehouse_zones IS 'Warehouse zone definitions with temperature settings';
COMMENT ON TABLE master_priority_levels IS 'Task/order priority levels with SLA configuration';
COMMENT ON TABLE master_statuses IS 'Workflow status definitions with valid transitions';
COMMENT ON TABLE master_inspection_types IS 'QC inspection type templates';
COMMENT ON TABLE master_hold_reasons IS 'Hold reason codes with escalation rules';
COMMENT ON TABLE master_shipping_methods IS 'Available shipping methods and carriers';
COMMENT ON TABLE master_roles IS 'User roles with permissions';
COMMENT ON TABLE master_system_config IS 'System-wide configuration key-value pairs';
COMMENT ON TABLE master_warehouse_settings IS 'Warehouse-specific settings and preferences';
COMMENT ON TABLE master_number_sequences IS 'Auto-incrementing number generators for entities';
