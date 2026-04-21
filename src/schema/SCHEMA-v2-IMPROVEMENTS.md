# Database Schema v2.0 - Improvements & Enhancements

## 🎯 Overview

Version 2.0 of the warehouse management database schema includes significant improvements based on real-world warehouse operations, BLE technology constraints, and production database best practices.

---

## 🔧 Key Improvements

### 1. **Enhanced Data Validation**

#### Custom Validation Functions
```sql
is_valid_mac_address(mac TEXT) → validates XX:XX:XX:XX:XX:XX format
is_valid_location_code(code TEXT) → validates A-01-02 or RCV-01 formats
is_valid_rssi(rssi INTEGER) → validates -100 to 0 dBm range
```

#### Improved CHECK Constraints
- **Temperature ranges**: Min ≤ Optimal ≤ Max validation
- **Quantity consistency**: Reserved ≤ Total, Picked ≤ Ordered, etc.
- **Timestamp logic**: Start ≤ Complete, proper workflow sequence
- **Status-dependent rules**: Completed tasks must have completion timestamp
- **Weight limits**: Current weight ≤ Max capacity
- **Location capacity**: Occupancy + Reserved ≤ Capacity

### 2. **Product Enhancements**

#### New Fields
- `barcode` - UPC/EAN scanning support
- `subcategory` - Finer product classification
- `reorder_quantity` - Standard reorder amount
- `min_storage_temp` / `max_storage_temp` - Temperature range
- `shelf_life_days` - Expiration tracking
- `is_hazardous` - Hazmat flag
- `is_fragile` - Handling requirements
- `abc_classification` - Inventory classification (A/B/C)
- `deleted_at` - Soft delete support

#### Validation
- Temperature range consistency checks
- Positive weight and shelf life
- Valid ABC classification values

### 3. **BLE Beacon Improvements**

#### iBeacon Protocol Support
```typescript
{
  uuid: string;        // iBeacon UUID
  major: number;       // Major value (0-65535)
  minor: number;       // Minor value (0-65535)
  tx_power: number;    // Transmission power (-40 to +4 dBm)
}
```

#### Additional Fields
- `hardware_version` - Hardware tracking
- `manufacturer` - Beacon manufacturer
- `calibration_distance` - Calibration reference (meters)

#### Validation
- MAC address format: `XX:XX:XX:XX:XX:XX`
- RSSI range: `-100` to `0` dBm
- TX power range: `-40` to `+4` dBm
- Battery level: `0` to `100`
- iBeacon consistency: UUID/major/minor all present or all null

### 4. **Warehouse Location Enhancements**

#### Capacity Management
- `reserved_capacity` - Reserved but not occupied
- `max_weight_capacity` - Maximum weight limit (kg)
- `current_weight` - Current weight tracking
- `is_locked` - Maintenance lock flag

#### Temperature Monitoring
- `current_temperature` - Real-time temperature (°C)
- Better for temperature-controlled zones

#### Advanced Constraints
```sql
CHECK (current_occupancy + reserved_capacity <= capacity)
CHECK (current_weight <= max_weight_capacity)
CHECK (is_valid_location_code(location_code))
```

### 5. **Inventory System Improvements**

#### Computed Column
```sql
available_quantity GENERATED ALWAYS AS (quantity - reserved_quantity) STORED
```

#### Enhanced Tracking
- `reserved_quantity` - Separate from total
- `batch_number` - Additional lot tracking
- `manufacture_date` - Production date
- `cycle_count_variance` - Count accuracy
- `cost_per_unit` - Financial tracking
- `is_locked` - Lock during counting

#### Additional Status
- `QUARANTINE` - For investigation

#### Unique Constraint
```sql
UNIQUE (product_id, location_id, lot_number, serial_number)
```

### 6. **Put-Away Task Enhancements**

#### Progress Tracking
- `quantity_completed` - Partial completion support
- `estimated_duration_minutes` - Planning
- `actual_duration_minutes` - Actual time taken

#### SLA Management
- `due_at` - Deadline tracking
- Better performance monitoring

#### Enhanced Statuses
- `ASSIGNED` - Task assigned to user
- `FAILED` - Failed attempts
- `failure_reason` - Root cause tracking

### 7. **Take-Away Order Enhancements**

#### Customer Information
- `customer_po_number` - PO reference
- `shipping_method` - Carrier selection
- `tracking_number` - Shipment tracking

#### Progress Metrics
- `total_items` - Line item count
- `total_quantity` - Total units
- `picked_items` / `packed_items` - Progress counters

#### Multi-stage Timestamps
- `picking_started_at`
- `picking_completed_at`
- `packed_at`
- `shipped_at`

#### Order Types
- Added `SAMPLE` order type

#### Order Statuses
- Added `ASSIGNED` and `READY` states

### 8. **Order Items Improvements**

#### Location Suggestions
- `suggested_location_id` - System optimization
- Guides picker to optimal location

#### Detailed Tracking
- `quantity_shipped` - Final shipped amount
- `lot_number` / `serial_number` - Traceability

### 9. **QC Inspection Enhancements**

#### Sample-based Inspection
- `sample_size` - Sample quantity
- `quantity_on_hold` - Separate from passed/failed

#### Severity Classification
- `severity` - LOW/MEDIUM/HIGH/CRITICAL

#### Follow-up Tracking
- `requires_followup` - Flag for re-inspection
- `followup_inspection_id` - Link to follow-up
- `due_at` - Inspection deadline

#### Additional Types
- `RANDOM` - Random sampling
- `COMPLAINT` - Customer complaint investigation

#### Enhanced Disposition
- `CONDITIONAL_ACCEPT` - Accept with conditions

### 10. **Hold Item Enhancements**

#### Root Cause Analysis
- `root_cause` - Detailed cause
- `corrective_action` - Action taken
- `estimated_cost` - Financial impact

#### Approval Workflow
- `approved_by` - Release approval

#### Auto-escalation
- `expires_at` - Escalation deadline

#### Additional Reasons
- `RECALL` - Product recall
- `REGULATORY` - Regulatory hold

#### Additional Resolutions
- `DONATED` - Donation disposition

### 11. **Location History Enhancements**

#### Movement Metrics
- `distance_meters` - Distance traveled
- `duration_seconds` - Movement duration

#### Additional Movement Types
- `RETURN` - Returns processing
- `SCRAP` - Scrap/disposal

### 12. **BLE Scan Event Enhancements**

#### Distance Estimation
- `distance_estimate` - Calculated distance (meters)
- `tx_power` - Transmitted power for calculation

#### Performance Metrics
- `scan_duration_ms` - Scan time in milliseconds

#### GPS Integration
- `gps_coordinates` - {lat, lng, accuracy}

#### Additional Scan Types
- `PROXIMITY_ALERT` - Close proximity detection

### 13. **Activity Log Enhancements**

#### Severity Levels
```
DEBUG → INFO → WARNING → ERROR → CRITICAL
```

#### Session Tracking
- `session_id` - User session tracking

#### Additional Activity Types
- `BEACON_EVENT` - Beacon-specific events

#### Indexed for Performance
```sql
CREATE INDEX idx_activity_logs_created_severity 
  ON activity_logs(created_at DESC, severity);
```

### 14. **User System Enhancements**

#### Contact Information
- `phone` - Phone number with format validation

#### Security Features
- `login_count` - Track login frequency
- `failed_login_attempts` - Security monitoring
- `account_locked_until` - Account lockout

#### Workload Management
- `assigned_zones` - Zone assignments (array)
- `max_task_capacity` - Concurrent task limit
- `current_task_count` - Active tasks

#### Additional Role
- `SUPERVISOR` - Supervisory role

---

## 🚀 Automatic Features

### 1. **Triggers for Data Integrity**

#### Auto-update Timestamps
```sql
-- Automatically updates updated_at on any UPDATE
CREATE TRIGGER update_[table]_updated_at 
  BEFORE UPDATE ON [table]
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### Location Occupancy Management
```sql
-- Automatically updates location occupancy when inventory changes
CREATE TRIGGER trigger_update_location_occupancy
  AFTER INSERT OR UPDATE OR DELETE ON inventory
  FOR EACH ROW EXECUTE FUNCTION update_location_occupancy();
```

#### Automatic Activity Logging
```sql
-- Logs inventory changes automatically
CREATE TRIGGER trigger_log_inventory_changes
  AFTER UPDATE ON inventory
  FOR EACH ROW EXECUTE FUNCTION log_inventory_changes();
```

### 2. **Computed Columns**

```sql
-- Auto-calculated available quantity
available_quantity GENERATED ALWAYS AS (quantity - reserved_quantity) STORED
```

### 3. **Default Values**

- Automatic UUID generation
- Default timestamps (NOW())
- Sensible defaults (is_active = true, status = 'AVAILABLE', etc.)

---

## 📊 Performance Optimizations

### 1. **Comprehensive Indexing**

#### Partial Indexes (Filtered)
```sql
-- Only index active records
CREATE INDEX idx_product_active ON products(is_active) WHERE is_active = true;

-- Only index available locations
CREATE INDEX idx_location_available ON warehouse_locations(is_available) 
  WHERE is_available = true;

-- Only index low battery beacons
CREATE INDEX idx_beacon_battery ON ble_beacons(battery_level) 
  WHERE battery_level < 20;
```

#### Composite Indexes
```sql
CREATE INDEX idx_inventory_composite 
  ON inventory(product_id, location_id, status);

CREATE INDEX idx_location_capacity 
  ON warehouse_locations(zone, location_type) 
  WHERE (capacity - current_occupancy - reserved_capacity) > 0;
```

#### Full-Text Search
```sql
CREATE INDEX idx_product_name_search 
  ON products USING gin(to_tsvector('english', name));
```

#### JSONB Indexes
```sql
CREATE INDEX idx_product_dimensions 
  ON products USING gin(dimensions) WHERE dimensions IS NOT NULL;
```

### 2. **Materialized Views**

Five pre-built views for common queries:
- `v_available_inventory` - Available stock with locations
- `v_active_tasks` - All active tasks (put-away + take-away)
- `v_low_battery_beacons` - Beacons needing replacement
- `v_location_capacity` - Location utilization
- `v_reorder_needed` - Products below reorder point

### 3. **Data Archiving Functions**

```sql
-- Archive old scan events (default: 30 days)
SELECT archive_old_scan_events(30);

-- Archive old activity logs (default: 90 days)
SELECT archive_old_activity_logs(90);
```

---

## 🔒 Security Features

### 1. **Input Validation**
- MAC address format validation
- Email format validation
- Phone number format validation
- Location code pattern validation
- RSSI range validation

### 2. **Row Level Security (RLS)**
Template policies included (commented out) for:
- Product access by role
- Task assignment restrictions
- Inventory visibility

### 3. **Soft Deletes**
- Products support soft delete (`deleted_at`)
- Prevents accidental data loss
- Maintains historical integrity

### 4. **Foreign Key Strategies**
- `ON DELETE RESTRICT` - Core data (products, locations)
- `ON DELETE CASCADE` - Child records (order items, scan events)
- `ON DELETE SET NULL` - Optional references (beacons, assignments)

---

## 📈 Business Intelligence Features

### 1. **ABC Classification**
Products classified as A/B/C for inventory prioritization

### 2. **Cost Tracking**
- `cost_per_unit` on inventory
- `estimated_cost` on hold items
- Financial impact analysis

### 3. **Performance Metrics**
- Task duration tracking (estimated vs actual)
- Movement distance/duration
- Cycle count variance
- User task capacity utilization

### 4. **Audit Trail**
- Complete location history
- All BLE scans logged
- Activity logs with severity
- Change tracking with old/new values

---

## 🔄 Workflow Improvements

### 1. **Status Transitions**

#### Put-Away
```
PENDING → ASSIGNED → SCANNING → MOVING → PLACING → COMPLETED
                                           ↓
                                        FAILED
```

#### Take-Away
```
PENDING → ASSIGNED → PICKING → PACKING → READY → SHIPPED → COMPLETED
```

#### QC Inspection
```
PENDING → IN_PROGRESS → PASSED/FAILED/ON_HOLD
```

### 2. **SLA Management**
- `due_at` fields on tasks, orders, inspections
- Enables deadline tracking
- Performance monitoring

### 3. **Partial Progress**
- `quantity_completed` on put-away
- `picked_items`, `packed_items` on orders
- Supports incremental workflows

---

## 🧪 Enhanced Sample Data

### v2 Seed Data Includes:
- **6 users** with different roles and zones
- **30+ locations** across 5 zones (R, A, B, C, P, S, Q, H)
- **11 products** with ABC classification
- **15 BLE beacons** (location, product, equipment, mobile)
- **15 inventory records** across all zones
- **6 put-away tasks** (completed, active, pending)
- **5 take-away orders** with 15 line items
- **6 QC inspections** (passed, failed, pending)
- **3 hold items** (active and resolved)
- **Complete audit trail** (history, scans, activity logs)

### Realistic Data Features:
- Valid MAC addresses with iBeacon UUIDs
- Proper lot/batch numbers
- Realistic timestamps and durations
- Temperature-controlled zone data
- Low battery beacon examples
- Failed QC inspection examples
- Capacity utilization examples

---

## 📋 Migration from v1 to v2

### Breaking Changes
1. New required fields (use defaults or NULL allowed)
2. Enhanced CHECK constraints (existing data must comply)
3. New validation functions (must be created first)

### Migration Steps
```sql
-- 1. Create new validation functions
-- 2. Add new columns with defaults
-- 3. Backfill data where needed
-- 4. Add new constraints
-- 5. Create new indexes
-- 6. Test thoroughly before production
```

### Backward Compatibility
- Original v1 fields preserved
- New fields are additions, not replacements
- Can migrate incrementally by table

---

## 🎯 Use Case Examples

### 1. Find Products Needing Reorder
```sql
SELECT * FROM v_reorder_needed;
```

### 2. Check Location Utilization
```sql
SELECT * FROM v_location_capacity 
WHERE total_utilization_pct > 80
ORDER BY total_utilization_pct DESC;
```

### 3. Find Low Battery Beacons
```sql
SELECT * FROM v_low_battery_beacons;
```

### 4. Track Order Progress
```sql
SELECT 
  order_number,
  status,
  picked_items || '/' || total_items as progress,
  ROUND((picked_items::decimal / total_items * 100), 1) as completion_pct
FROM take_away_orders
WHERE status IN ('PICKING', 'PACKING');
```

### 5. Audit Product Movement
```sql
SELECT 
  lh.moved_at,
  p.sku,
  wl_from.location_code as from_location,
  wl_to.location_code as to_location,
  lh.quantity,
  lh.movement_type,
  u.full_name as moved_by
FROM location_history lh
JOIN products p ON lh.product_id = p.id
LEFT JOIN warehouse_locations wl_from ON lh.from_location_id = wl_from.id
JOIN warehouse_locations wl_to ON lh.to_location_id = wl_to.id
JOIN users u ON lh.moved_by = u.id
WHERE p.sku = 'SKU-001'
ORDER BY lh.moved_at DESC;
```

### 6. Temperature-Controlled Inventory
```sql
SELECT 
  p.sku,
  p.name,
  i.quantity,
  wl.location_code,
  wl.current_temperature,
  p.min_storage_temp,
  p.max_storage_temp
FROM inventory i
JOIN products p ON i.product_id = p.id
JOIN warehouse_locations wl ON i.location_id = wl.id
WHERE wl.temperature_controlled = true
  AND (wl.current_temperature < p.min_storage_temp 
       OR wl.current_temperature > p.max_storage_temp);
```

### 7. BLE Beacon Health Check
```sql
SELECT 
  beacon_name,
  mac_address,
  battery_level,
  EXTRACT(EPOCH FROM (NOW() - last_seen_at))/3600 as hours_since_seen,
  CASE 
    WHEN battery_level < 20 THEN 'CRITICAL'
    WHEN battery_level < 40 THEN 'LOW'
    WHEN NOW() - last_seen_at > INTERVAL '1 hour' THEN 'OFFLINE'
    ELSE 'OK'
  END as health_status
FROM ble_beacons
WHERE is_active = true
ORDER BY battery_level ASC, last_seen_at ASC;
```

---

## 📚 Additional Documentation

For complete details, see:
- **create-tables-v2.sql** - Full SQL schema with all enhancements
- **seed-data-v2.sql** - Comprehensive sample data
- **README.md** - Original documentation
- **database-schema.ts** - TypeScript type definitions

---

## 🔮 Future Enhancements (v3 Roadmap)

Potential future improvements:
1. **Table partitioning** for high-volume tables (scan events, activity logs)
2. **Time-series data** for temperature/humidity monitoring
3. **Photo storage** integration for QC inspections
4. **Barcode validation** with checksum algorithms
5. **Zone-based routing** optimization
6. **Predictive reordering** using historical data
7. **Multi-warehouse** support with transfer workflows
8. **Integration tables** for ERP/WMS systems
9. **Advanced analytics** tables (daily summaries, KPIs)
10. **Real-time dashboards** materialized view refresh strategies

---

## ✅ Testing Checklist

Before deploying v2:
- [ ] Validate all constraints with sample data
- [ ] Test triggers on INSERT/UPDATE/DELETE
- [ ] Verify index performance with EXPLAIN ANALYZE
- [ ] Test validation functions with edge cases
- [ ] Confirm soft delete behavior
- [ ] Test location occupancy auto-updates
- [ ] Verify activity logging triggers
- [ ] Test all materialized views
- [ ] Run archiving functions
- [ ] Validate foreign key cascades
- [ ] Test RLS policies (if enabled)
- [ ] Performance test with production-like data volume

---

## 📞 Support

For schema questions or issues:
1. Review constraint errors carefully - most validation is self-documenting
2. Check function definitions for validation logic
3. Review trigger code for auto-update behavior
4. Consult materialized views for common query patterns
5. Review indexes if queries are slow

