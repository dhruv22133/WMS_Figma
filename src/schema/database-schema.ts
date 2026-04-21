/**
 * Database Schema for BLE-based Warehouse Management System
 * This schema supports product registration, put-away/take-away processes,
 * quality control, and location tracking using BLE beacon technology.
 * 
 * Version: 2.0 - Enhanced with real-world constraints and validation
 */

// ============================================================================
// CORE TABLES
// ============================================================================

/**
 * Products Table
 * Stores master product information
 */
export interface Product {
  id: string; // UUID primary key
  sku: string; // Unique stock keeping unit
  barcode: string | null; // UPC/EAN barcode for scanning
  name: string;
  description: string | null;
  category: string;
  subcategory: string | null;
  unit_of_measure: string; // e.g., 'EA', 'BOX', 'PALLET', 'KG', 'LITER'
  weight: number | null; // in kg
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: string; // 'cm' or 'in'
  } | null;
  reorder_point: number; // Minimum quantity before reorder
  reorder_quantity: number; // Standard reorder amount
  min_storage_temp: number | null; // Minimum storage temperature in Celsius
  max_storage_temp: number | null; // Maximum storage temperature in Celsius
  optimal_storage_temp: number | null; // Optimal storage temperature in Celsius
  shelf_life_days: number | null; // Shelf life in days
  is_hazardous: boolean; // Hazardous material flag
  is_fragile: boolean; // Fragile handling required
  requires_quality_check: boolean;
  abc_classification: 'A' | 'B' | 'C' | null; // Inventory classification
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  created_by: string; // User ID
  is_active: boolean;
  deleted_at: string | null; // Soft delete timestamp
}

/**
 * Warehouse Locations Table
 * Defines physical storage locations in the warehouse
 */
export interface WarehouseLocation {
  id: string; // UUID primary key
  location_code: string; // Unique code like 'A-01-02' (Aisle-Rack-Shelf)
  location_type: 'RECEIVING' | 'STORAGE' | 'PICKING' | 'SHIPPING' | 'HOLD' | 'QC';
  zone: string; // Warehouse zone (e.g., 'A', 'B', 'C')
  aisle: string;
  rack: string;
  shelf: string;
  bin: string | null;
  capacity: number; // Maximum quantity
  current_occupancy: number; // Current quantity stored
  is_available: boolean;
  temperature_controlled: boolean;
  requires_special_handling: boolean;
  coordinates: {
    x: number;
    y: number;
    z: number; // floor level
  } | null;
  created_at: string;
  updated_at: string;
}

/**
 * BLE Beacons Table
 * Tracks BLE beacon devices used for location tracking
 */
export interface BLEBeacon {
  id: string; // UUID primary key
  mac_address: string; // Unique MAC address
  beacon_name: string;
  beacon_type: 'PRODUCT' | 'LOCATION' | 'EQUIPMENT' | 'MOBILE';
  battery_level: number; // 0-100
  signal_strength: number; // RSSI value
  firmware_version: string;
  is_active: boolean;
  last_seen_at: string; // ISO timestamp
  associated_location_id: string | null; // Foreign key to WarehouseLocation
  created_at: string;
  updated_at: string;
}

/**
 * Inventory Table
 * Tracks current inventory levels and locations
 */
export interface Inventory {
  id: string; // UUID primary key
  product_id: string; // Foreign key to Product
  location_id: string; // Foreign key to WarehouseLocation
  quantity: number;
  status: 'AVAILABLE' | 'RESERVED' | 'ON_HOLD' | 'IN_TRANSIT' | 'DAMAGED' | 'EXPIRED';
  lot_number: string | null;
  serial_number: string | null;
  expiration_date: string | null; // ISO date
  received_date: string; // ISO date
  beacon_id: string | null; // Foreign key to BLEBeacon
  last_counted_at: string | null; // Last physical count
  created_at: string;
  updated_at: string;
}

// ============================================================================
// OPERATIONAL TABLES
// ============================================================================

/**
 * Put-Away Tasks Table
 * Manages the put-away process workflow
 */
export interface PutAwayTask {
  id: string; // UUID primary key
  task_number: string; // Unique task identifier
  product_id: string; // Foreign key to Product
  source_location_id: string; // Foreign key to WarehouseLocation (receiving area)
  destination_location_id: string | null; // Foreign key to WarehouseLocation (storage)
  quantity: number;
  status: 'PENDING' | 'SCANNING' | 'MOVING' | 'PLACING' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assigned_to: string | null; // User ID
  beacon_scanned: string | null; // MAC address from scan
  location_verified: boolean;
  step_completed: number; // Current step (1-4)
  notes: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  created_by: string;
}

/**
 * Take-Away Orders Table
 * Manages order fulfillment and take-away processes
 */
export interface TakeAwayOrder {
  id: string; // UUID primary key
  order_number: string; // Unique order identifier
  order_type: 'CUSTOMER' | 'TRANSFER' | 'RETURN' | 'SCRAP';
  status: 'PENDING' | 'PICKING' | 'PACKING' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  customer_name: string | null;
  customer_reference: string | null;
  shipping_address: string | null;
  assigned_to: string | null; // User ID
  picking_started_at: string | null;
  packed_at: string | null;
  shipped_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  created_by: string;
}

/**
 * Take-Away Order Items Table
 * Line items for each take-away order
 */
export interface TakeAwayOrderItem {
  id: string; // UUID primary key
  order_id: string; // Foreign key to TakeAwayOrder
  product_id: string; // Foreign key to Product
  inventory_id: string | null; // Foreign key to specific Inventory record
  quantity_ordered: number;
  quantity_picked: number;
  quantity_packed: number;
  source_location_id: string | null; // Foreign key to WarehouseLocation
  beacon_scanned: string | null; // MAC address from scan
  status: 'PENDING' | 'PICKING' | 'PICKED' | 'PACKED' | 'SHIPPED';
  picker_notes: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Quality Control Inspections Table
 * Manages QC workflow and inspection records
 */
export interface QCInspection {
  id: string; // UUID primary key
  inspection_number: string; // Unique identifier
  inspection_type: 'RECEIVING' | 'PERIODIC' | 'DAMAGE' | 'RETURN' | 'PRE_SHIP';
  product_id: string; // Foreign key to Product
  inventory_id: string | null; // Foreign key to Inventory
  location_id: string; // Foreign key to WarehouseLocation
  quantity_inspected: number;
  quantity_passed: number;
  quantity_failed: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'PASSED' | 'FAILED' | 'ON_HOLD';
  inspector_id: string; // User ID
  inspection_criteria: {
    criterion: string;
    result: 'PASS' | 'FAIL' | 'N/A';
    notes: string | null;
  }[];
  defects_found: string[] | null;
  photos: string[] | null; // URLs to inspection photos
  disposition: 'ACCEPT' | 'REJECT' | 'HOLD' | 'REWORK' | null;
  beacon_scanned: string | null;
  inspected_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Hold Area Management Table
 * Tracks items placed on hold with reasons
 */
export interface HoldItem {
  id: string; // UUID primary key
  hold_number: string; // Unique hold identifier
  product_id: string; // Foreign key to Product
  inventory_id: string; // Foreign key to Inventory
  location_id: string; // Foreign key to WarehouseLocation (hold area)
  quantity: number;
  hold_reason: 'QUALITY_ISSUE' | 'DAMAGE' | 'EXPIRED' | 'CUSTOMER_RETURN' | 'INVESTIGATION' | 'OTHER';
  hold_type: 'TEMPORARY' | 'PERMANENT';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  qc_inspection_id: string | null; // Foreign key to QCInspection if QC related
  placed_by: string; // User ID
  reviewed_by: string | null; // User ID
  resolution: 'RELEASED' | 'SCRAPPED' | 'RETURNED' | 'REWORKED' | null;
  resolution_notes: string | null;
  placed_at: string;
  reviewed_at: string | null;
  released_at: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// TRACKING & AUDIT TABLES
// ============================================================================

/**
 * Location History Table
 * Tracks movement of inventory through warehouse
 */
export interface LocationHistory {
  id: string; // UUID primary key
  inventory_id: string; // Foreign key to Inventory
  product_id: string; // Foreign key to Product
  from_location_id: string | null; // Foreign key to WarehouseLocation
  to_location_id: string; // Foreign key to WarehouseLocation
  quantity: number;
  movement_type: 'PUT_AWAY' | 'PICK' | 'TRANSFER' | 'ADJUSTMENT' | 'CYCLE_COUNT';
  reference_type: 'PUT_AWAY_TASK' | 'TAKE_AWAY_ORDER' | 'QC_INSPECTION' | 'MANUAL';
  reference_id: string | null; // ID of related task/order
  beacon_id: string | null; // Foreign key to BLEBeacon
  moved_by: string; // User ID
  moved_at: string; // ISO timestamp
  notes: string | null;
  created_at: string;
}

/**
 * BLE Scan Events Table
 * Logs all BLE beacon scans for audit trail
 */
export interface BLEScanEvent {
  id: string; // UUID primary key
  beacon_id: string; // Foreign key to BLEBeacon
  mac_address: string;
  signal_strength: number; // RSSI
  scan_type: 'PRODUCT_VERIFICATION' | 'LOCATION_CHECK' | 'INVENTORY_COUNT' | 'GENERAL';
  scanned_by: string; // User ID
  scanned_at_location_id: string | null; // Foreign key to WarehouseLocation
  related_task_type: 'PUT_AWAY' | 'TAKE_AWAY' | 'QC' | 'CYCLE_COUNT' | null;
  related_task_id: string | null;
  device_info: {
    device_id: string;
    device_type: string;
    os: string;
  } | null;
  created_at: string;
}

/**
 * Activity Log Table
 * General audit trail for all system activities
 */
export interface ActivityLog {
  id: string; // UUID primary key
  activity_type: 'PUT_AWAY' | 'TAKE_AWAY' | 'QC_INSPECTION' | 'HOLD' | 'RELEASE' | 
                 'LOCATION_CHANGE' | 'INVENTORY_ADJUSTMENT' | 'USER_ACTION' | 'SYSTEM_EVENT';
  entity_type: 'PRODUCT' | 'INVENTORY' | 'LOCATION' | 'BEACON' | 'ORDER' | 'TASK' | 'INSPECTION';
  entity_id: string; // ID of affected entity
  action: string; // Description of action
  user_id: string | null; // User who performed action
  changes: {
    field: string;
    old_value: any;
    new_value: any;
  }[] | null;
  metadata: Record<string, any> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

/**
 * Users Table
 * System users and warehouse staff
 */
export interface User {
  id: string; // UUID primary key
  username: string; // Unique
  email: string; // Unique
  full_name: string;
  role: 'ADMIN' | 'WAREHOUSE_MANAGER' | 'WAREHOUSE_STAFF' | 'QC_INSPECTOR' | 'VIEWER';
  department: string | null;
  employee_id: string | null;
  is_active: boolean;
  last_login_at: string | null;
  preferences: {
    theme: 'light' | 'dark';
    notifications_enabled: boolean;
    default_zone: string | null;
  } | null;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// INDEXES (for reference)
// ============================================================================

/**
 * Recommended database indexes for optimal performance:
 * 
 * Products:
 *   - idx_product_sku (sku) UNIQUE
 *   - idx_product_category (category)
 *   - idx_product_active (is_active)
 * 
 * WarehouseLocation:
 *   - idx_location_code (location_code) UNIQUE
 *   - idx_location_type (location_type)
 *   - idx_location_zone (zone)
 *   - idx_location_available (is_available)
 * 
 * BLEBeacon:
 *   - idx_beacon_mac (mac_address) UNIQUE
 *   - idx_beacon_type (beacon_type)
 *   - idx_beacon_active (is_active)
 *   - idx_beacon_location (associated_location_id)
 * 
 * Inventory:
 *   - idx_inventory_product (product_id)
 *   - idx_inventory_location (location_id)
 *   - idx_inventory_status (status)
 *   - idx_inventory_beacon (beacon_id)
 *   - idx_inventory_composite (product_id, location_id)
 * 
 * PutAwayTask:
 *   - idx_putaway_number (task_number) UNIQUE
 *   - idx_putaway_status (status)
 *   - idx_putaway_assigned (assigned_to)
 *   - idx_putaway_product (product_id)
 * 
 * TakeAwayOrder:
 *   - idx_takeaway_number (order_number) UNIQUE
 *   - idx_takeaway_status (status)
 *   - idx_takeaway_assigned (assigned_to)
 * 
 * QCInspection:
 *   - idx_qc_number (inspection_number) UNIQUE
 *   - idx_qc_status (status)
 *   - idx_qc_product (product_id)
 *   - idx_qc_inspector (inspector_id)
 * 
 * LocationHistory:
 *   - idx_location_history_inventory (inventory_id)
 *   - idx_location_history_product (product_id)
 *   - idx_location_history_moved_at (moved_at)
 * 
 * BLEScanEvent:
 *   - idx_scan_beacon (beacon_id)
 *   - idx_scan_created (created_at)
 *   - idx_scan_type (scan_type)
 * 
 * ActivityLog:
 *   - idx_activity_type (activity_type)
 *   - idx_activity_entity (entity_type, entity_id)
 *   - idx_activity_created (created_at)
 */

// ============================================================================
// FOREIGN KEY CONSTRAINTS (for reference)
// ============================================================================

/**
 * Foreign Key Relationships:
 * 
 * Inventory:
 *   - product_id -> Product.id (ON DELETE RESTRICT)
 *   - location_id -> WarehouseLocation.id (ON DELETE RESTRICT)
 *   - beacon_id -> BLEBeacon.id (ON DELETE SET NULL)
 * 
 * BLEBeacon:
 *   - associated_location_id -> WarehouseLocation.id (ON DELETE SET NULL)
 * 
 * PutAwayTask:
 *   - product_id -> Product.id (ON DELETE RESTRICT)
 *   - source_location_id -> WarehouseLocation.id (ON DELETE RESTRICT)
 *   - destination_location_id -> WarehouseLocation.id (ON DELETE RESTRICT)
 *   - assigned_to -> User.id (ON DELETE SET NULL)
 * 
 * TakeAwayOrder:
 *   - assigned_to -> User.id (ON DELETE SET NULL)
 * 
 * TakeAwayOrderItem:
 *   - order_id -> TakeAwayOrder.id (ON DELETE CASCADE)
 *   - product_id -> Product.id (ON DELETE RESTRICT)
 *   - inventory_id -> Inventory.id (ON DELETE SET NULL)
 *   - source_location_id -> WarehouseLocation.id (ON DELETE SET NULL)
 * 
 * QCInspection:
 *   - product_id -> Product.id (ON DELETE RESTRICT)
 *   - inventory_id -> Inventory.id (ON DELETE SET NULL)
 *   - location_id -> WarehouseLocation.id (ON DELETE RESTRICT)
 *   - inspector_id -> User.id (ON DELETE RESTRICT)
 * 
 * HoldItem:
 *   - product_id -> Product.id (ON DELETE RESTRICT)
 *   - inventory_id -> Inventory.id (ON DELETE RESTRICT)
 *   - location_id -> WarehouseLocation.id (ON DELETE RESTRICT)
 *   - qc_inspection_id -> QCInspection.id (ON DELETE SET NULL)
 *   - placed_by -> User.id (ON DELETE RESTRICT)
 *   - reviewed_by -> User.id (ON DELETE SET NULL)
 * 
 * LocationHistory:
 *   - inventory_id -> Inventory.id (ON DELETE CASCADE)
 *   - product_id -> Product.id (ON DELETE RESTRICT)
 *   - from_location_id -> WarehouseLocation.id (ON DELETE SET NULL)
 *   - to_location_id -> WarehouseLocation.id (ON DELETE RESTRICT)
 *   - beacon_id -> BLEBeacon.id (ON DELETE SET NULL)
 *   - moved_by -> User.id (ON DELETE RESTRICT)
 * 
 * BLEScanEvent:
 *   - beacon_id -> BLEBeacon.id (ON DELETE CASCADE)
 *   - scanned_at_location_id -> WarehouseLocation.id (ON DELETE SET NULL)
 * 
 * ActivityLog:
 *   - user_id -> User.id (ON DELETE SET NULL)
 */