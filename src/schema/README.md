# Database Schema Documentation
## BLE-based Warehouse Management System

This directory contains the complete database schema for the warehouse management system.

---

## 📋 Files Overview

### `database-schema.ts`
TypeScript interface definitions for all database tables. Use this for:
- Type-safe development in TypeScript/React
- Understanding data structures and relationships
- API contract documentation

### `create-tables.sql`
PostgreSQL/Supabase SQL script to create all database tables. Includes:
- Complete table definitions with constraints
- Foreign key relationships
- Indexes for optimal performance
- Triggers for automatic timestamp updates
- Comments for Row Level Security (RLS) policies

### `seed-data.sql`
Sample data for development and testing. Includes:
- 5 sample users with different roles
- Multiple warehouse locations across zones
- Sample products and inventory records
- Active and completed tasks/orders
- QC inspections and hold items
- BLE beacon records and scan events

---

## 🗄️ Database Tables

### Core Tables

#### 1. **products**
Master product catalog
- SKU, name, description, category
- Physical attributes (weight, dimensions)
- Reorder points and QC requirements
- **Key Fields**: `sku` (unique), `requires_quality_check`

#### 2. **warehouse_locations**
Physical storage locations
- Hierarchical addressing: Zone → Aisle → Rack → Shelf → Bin
- Location types: RECEIVING, STORAGE, PICKING, SHIPPING, HOLD, QC
- Capacity tracking and availability status
- Special handling flags (temperature controlled, etc.)
- **Key Fields**: `location_code` (unique), `location_type`, `capacity`

#### 3. **ble_beacons**
BLE beacon devices for tracking
- MAC address identification
- Beacon types: PRODUCT, LOCATION, EQUIPMENT, MOBILE
- Battery monitoring and signal strength
- Optional location association
- **Key Fields**: `mac_address` (unique), `beacon_type`, `battery_level`

#### 4. **inventory**
Current inventory records
- Links products to specific locations
- Quantity and status tracking
- Lot/serial number management
- Expiration date tracking
- Optional beacon assignment
- **Statuses**: AVAILABLE, RESERVED, ON_HOLD, IN_TRANSIT, DAMAGED, EXPIRED

#### 5. **users**
System users and warehouse staff
- Role-based access: ADMIN, WAREHOUSE_MANAGER, WAREHOUSE_STAFF, QC_INSPECTOR, VIEWER
- Employee information
- User preferences
- **Key Fields**: `username` (unique), `email` (unique), `role`

---

### Operational Tables

#### 6. **put_away_tasks**
Put-away process workflow
- 4-step workflow tracking
- Source and destination locations
- Priority levels and assignments
- BLE verification
- **Statuses**: PENDING, SCANNING, MOVING, PLACING, COMPLETED, CANCELLED

#### 7. **take_away_orders**
Order fulfillment and take-away processes
- Order types: CUSTOMER, TRANSFER, RETURN, SCRAP
- Customer and shipping information
- Multi-stage tracking (picking → packing → shipping)
- **Statuses**: PENDING, PICKING, PACKING, SHIPPED, COMPLETED, CANCELLED

#### 8. **take_away_order_items**
Line items for each order
- Product and inventory references
- Quantity tracking at each stage
- Source location and BLE scans
- Per-item status tracking

#### 9. **qc_inspections**
Quality control workflow
- Inspection types: RECEIVING, PERIODIC, DAMAGE, RETURN, PRE_SHIP
- Pass/fail quantity tracking
- Inspection criteria (JSONB)
- Defect documentation and photos
- Disposition decisions
- **Statuses**: PENDING, IN_PROGRESS, PASSED, FAILED, ON_HOLD

#### 10. **hold_items**
Items on hold with tracking
- Hold reasons: QUALITY_ISSUE, DAMAGE, EXPIRED, CUSTOMER_RETURN, INVESTIGATION, OTHER
- Hold types: TEMPORARY, PERMANENT
- Severity levels
- Resolution tracking
- Links to QC inspections

---

### Tracking & Audit Tables

#### 11. **location_history**
Complete movement audit trail
- All inventory movements
- Movement types: PUT_AWAY, PICK, TRANSFER, ADJUSTMENT, CYCLE_COUNT
- Reference to originating tasks/orders
- User and timestamp tracking

#### 12. **ble_scan_events**
BLE beacon scan log
- Scan types: PRODUCT_VERIFICATION, LOCATION_CHECK, INVENTORY_COUNT, GENERAL
- Signal strength (RSSI)
- Device information
- Links to related tasks

#### 13. **activity_logs**
General system audit trail
- All user and system actions
- Change tracking (old/new values)
- Metadata storage
- IP and user agent logging

---

## 🔗 Key Relationships

```
products ←─── inventory ───→ warehouse_locations
   ↓              ↓                    ↑
   ↓          beacon_id         associated_location_id
   ↓              ↓                    ↓
   ↓         ble_beacons ──────────────┘
   ↓
   ├──→ put_away_tasks
   ├──→ take_away_order_items → take_away_orders
   ├──→ qc_inspections
   └──→ hold_items
```

### Important Relationships:
- **Inventory** links Products to Locations (many-to-many via inventory records)
- **BLE Beacons** can be associated with specific inventory items OR fixed locations
- **Put-Away Tasks** move products from receiving to storage
- **Take-Away Orders** have multiple line items (order_items)
- **Hold Items** can be created from QC Inspections
- **Location History** tracks all inventory movements

---

## 📊 Indexes

Comprehensive indexing for:
- **Unique constraints**: SKU, location codes, MAC addresses, task/order numbers
- **Status fields**: For filtering active tasks and orders
- **Foreign keys**: All relationship fields
- **Timestamps**: For date-range queries
- **Composite indexes**: Product + Location combinations

---

## 🔒 Constraints

### Check Constraints
- Quantities must be non-negative
- Current occupancy ≤ capacity
- Battery levels 0-100
- Picked quantity ≤ ordered quantity
- Passed + failed ≤ inspected quantity

### Foreign Key Constraints
- **ON DELETE RESTRICT**: Prevents deletion of referenced core data (products, locations)
- **ON DELETE CASCADE**: Auto-deletes child records (order items, scan events)
- **ON DELETE SET NULL**: Clears optional references (beacons, assignments)

---

## 🚀 Setup Instructions

### Option 1: Supabase (Recommended for Production)

1. Create a new Supabase project at https://supabase.com
2. Navigate to the SQL Editor
3. Run `create-tables.sql` to create all tables
4. (Optional) Run `seed-data.sql` to populate with sample data
5. Configure Row Level Security (RLS) policies based on your auth requirements
6. Update your app's environment variables with Supabase credentials

### Option 2: Local PostgreSQL

```bash
# Create database
createdb warehouse_wms

# Run schema
psql warehouse_wms < schema/create-tables.sql

# Load seed data (optional)
psql warehouse_wms < schema/seed-data.sql
```

### Option 3: Docker PostgreSQL

```bash
# Start PostgreSQL container
docker run --name warehouse-db -e POSTGRES_PASSWORD=your_password -d -p 5432:5432 postgres

# Create database and run scripts
docker exec -i warehouse-db psql -U postgres -c "CREATE DATABASE warehouse_wms;"
docker exec -i warehouse-db psql -U postgres -d warehouse_wms < schema/create-tables.sql
docker exec -i warehouse-db psql -U postgres -d warehouse_wms < schema/seed-data.sql
```

---

## 🔐 Security Considerations

### Row Level Security (RLS)
When implementing with Supabase, enable RLS on sensitive tables:
- Products, inventory, and locations should be readable by authenticated users
- Modifications should be restricted by role
- Activity logs should be append-only for non-admins

### Data Validation
- Validate BLE MAC addresses format: `XX:XX:XX:XX:XX:XX`
- Enforce business rules via database constraints
- Use CHECK constraints to maintain data integrity

### PII and Sensitive Data
⚠️ **Important**: This schema includes fields for:
- Customer names and addresses (in `take_away_orders`)
- Employee information (in `users`)
- IP addresses and user agents (in `activity_logs`)

If deploying in Figma Make or similar environments, be aware:
- Do not store real PII in development/demo environments
- Use anonymized or synthetic data for testing
- Implement proper data retention and deletion policies
- Consider GDPR/CCPA compliance requirements

---

## 📈 Performance Optimization

### Recommended Practices
1. **Partitioning**: Consider table partitioning for high-volume tables:
   - `location_history` by date
   - `ble_scan_events` by date
   - `activity_logs` by date

2. **Archiving**: Implement data archiving strategies:
   - Archive completed orders older than 90 days
   - Archive scan events older than 30 days
   - Keep active inventory and current tasks

3. **Materialized Views**: Create for common queries:
   - Current inventory by location/product
   - Daily/weekly task completion metrics
   - Location capacity utilization

---

## 🔄 Migration Strategy

When updating the schema:

1. **Version Control**: Track schema changes in migration files
2. **Backward Compatibility**: Use additive changes when possible
3. **Data Migration**: Write scripts to transform existing data
4. **Testing**: Test migrations on development data first

Example migration pattern:
```sql
-- Migration: Add new column
ALTER TABLE products ADD COLUMN barcode VARCHAR(50);
CREATE INDEX idx_product_barcode ON products(barcode);

-- Migration: Backfill data
UPDATE products SET barcode = sku WHERE barcode IS NULL;
```

---

## 📞 Support and Customization

### Common Customizations

#### Adding New Location Types
```sql
ALTER TABLE warehouse_locations 
DROP CONSTRAINT warehouse_locations_location_type_check;

ALTER TABLE warehouse_locations 
ADD CONSTRAINT warehouse_locations_location_type_check 
CHECK (location_type IN ('RECEIVING', 'STORAGE', 'PICKING', 'SHIPPING', 'HOLD', 'QC', 'YOUR_NEW_TYPE'));
```

#### Adding Custom Product Attributes
```sql
ALTER TABLE products ADD COLUMN custom_attributes JSONB;
CREATE INDEX idx_product_custom_attrs ON products USING GIN (custom_attributes);
```

#### Extending QC Criteria
The `inspection_criteria` field in `qc_inspections` uses JSONB for flexibility:
```json
[
  {
    "criterion": "Visual Inspection",
    "result": "PASS",
    "notes": "No visible defects"
  },
  {
    "criterion": "Dimension Check",
    "result": "PASS",
    "notes": "Within tolerance ±0.5mm"
  }
]
```

---

## 📊 Sample Queries

### Current Inventory by Location
```sql
SELECT 
  wl.location_code,
  p.sku,
  p.name,
  i.quantity,
  i.status
FROM inventory i
JOIN products p ON i.product_id = p.id
JOIN warehouse_locations wl ON i.location_id = wl.id
WHERE i.status = 'AVAILABLE'
ORDER BY wl.location_code;
```

### Pending Tasks by Priority
```sql
SELECT 
  task_number,
  p.sku,
  p.name,
  quantity,
  priority,
  u.full_name as assigned_to
FROM put_away_tasks pat
JOIN products p ON pat.product_id = p.id
LEFT JOIN users u ON pat.assigned_to = u.id
WHERE status IN ('PENDING', 'SCANNING', 'MOVING')
ORDER BY 
  CASE priority 
    WHEN 'URGENT' THEN 1 
    WHEN 'HIGH' THEN 2 
    WHEN 'MEDIUM' THEN 3 
    WHEN 'LOW' THEN 4 
  END,
  created_at;
```

### Low Battery Beacons
```sql
SELECT 
  beacon_name,
  mac_address,
  battery_level,
  wl.location_code
FROM ble_beacons bb
LEFT JOIN warehouse_locations wl ON bb.associated_location_id = wl.id
WHERE battery_level < 20 AND is_active = true
ORDER BY battery_level;
```

### Location Capacity Utilization
```sql
SELECT 
  location_code,
  zone,
  location_type,
  capacity,
  current_occupancy,
  ROUND((current_occupancy::DECIMAL / capacity * 100), 2) as utilization_pct
FROM warehouse_locations
WHERE capacity > 0
ORDER BY utilization_pct DESC;
```

---

## 🧪 Testing

Sample data includes:
- ✅ Completed workflows (put-away, orders, inspections)
- ⏳ In-progress workflows
- 📋 Pending tasks
- ❌ Failed QC inspections
- 🚫 Items on hold
- 📡 BLE scan history

Use this data to test:
- Dashboard statistics
- Workflow transitions
- Search and filtering
- Reporting and analytics
