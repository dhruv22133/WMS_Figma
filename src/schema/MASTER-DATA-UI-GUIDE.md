# Master Data Management UI - User Guide

## 🎯 Overview

The Master Data Management UI provides a comprehensive interface for configuring all reference data and lookup tables in your warehouse management system. This eliminates the need for database-level changes when adding new categories, priorities, or other reference values.

---

## 🚀 Quick Start

### Accessing Master Data

1. Click **"Master Data"** in the main navigation
2. Use the sidebar to navigate between different master tables
3. Each table provides full CRUD operations (Create, Read, Update, Delete)

---

## 📋 Available Master Tables

### **Products & Inventory**
- **Product Categories** - Hierarchical product classification with QC requirements
- **Units of Measure** - Units with conversion factors and symbols

### **Warehouse**
- **Warehouse Zones** - Physical warehouse zones with temperature settings
- **Location Types** - Storage location templates with default capacities

### **Workflow**
- **Priority Levels** - Task/order priorities with SLA deadlines
- **Statuses** - Workflow state definitions with valid transitions
- **Order Types** - Order type configurations

### **Quality Control**
- **Inspection Types** - QC inspection templates with sample sizes
- **Defect Types** - Defect classifications with severity levels
- **Hold Reasons** - Hold codes with auto-escalation rules

### **Shipping**
- **Shipping Methods** - Carrier services with costs and delivery times

### **System**
- **Roles & Permissions** - User roles with permission settings
- **System Configuration** - Key-value system settings

---

## ✨ Key Features

### **Search & Filter**
- **Real-time search** across all fields
- **Show/Hide inactive** records toggle
- **Quick stats** - Total, Active, Inactive counts

### **Bulk Operations**
- Toggle active/inactive status without editing
- Quick edit inline actions
- Batch operations support

### **Color Coding**
- Visual color indicators for priorities, zones, and statuses
- Hex color picker for easy customization
- Consistent UI theming

### **Smart Forms**
- **Validation** - Required fields marked
- **Context help** - Descriptions for each field
- **Conditional fields** - Show/hide based on selections
- **Type safety** - Proper input types (number, color, date, etc.)

---

## 🔧 Common Operations

### Adding New Record

1. Click **"Add New"** button (top right)
2. Fill in required fields (marked with *)
3. Configure optional settings
4. Click **"Create"**

### Editing Record

1. Click **Edit** icon (pencil) on the record row
2. Modify fields as needed
3. Click **"Update"**

### Deactivating Record

1. Click **Power** icon to toggle active status
2. Record is marked inactive but preserved
3. Use "Show Inactive" to view deactivated records

### Deleting Record

1. Click **Delete** icon (trash) on the record row
2. Confirm deletion in dialog
3. **Warning**: This permanently removes the record

---

## 📊 Master Table Details

### **Product Categories**

#### Fields:
- **Code** - Unique identifier (e.g., ELECTRONICS)
- **Name** - Display name
- **Description** - Optional detailed description
- **Hierarchy Level** - Category depth (0 = root)
- **Default Shelf Life** - Days until expiration
- **Requires Quality Check** - Toggle QC requirement
- **Temperature Control** - Toggle temp monitoring

#### Use Cases:
- Create product hierarchies (Electronics → Components → Semiconductors)
- Set default QC requirements by category
- Define shelf life expectations

---

### **Units of Measure**

#### Fields:
- **Code** - Short code (e.g., KG, EA, BOX)
- **Name** - Full name
- **Unit Type** - QUANTITY, WEIGHT, VOLUME, LENGTH, AREA
- **Symbol** - Display symbol (e.g., kg, lb)
- **Base Unit** - For conversions
- **Conversion Factor** - Multiplier to base unit

#### Use Cases:
- Add custom units for specific products
- Define conversion relationships (1 LB = 0.453592 KG)
- Support multi-unit inventory tracking

---

### **Warehouse Zones**

#### Fields:
- **Code** - Zone identifier (e.g., A, B, R)
- **Name** - Zone name
- **Zone Type** - RECEIVING, STORAGE, PICKING, etc.
- **Color Code** - Visual indicator color
- **Temperature Controlled** - Toggle
- **Min/Max Temperature** - Range in Celsius

#### Use Cases:
- Define physical warehouse layout
- Set temperature requirements
- Visual zone identification on maps

---

### **Priority Levels**

#### Fields:
- **Code** - Priority code (e.g., URGENT, HIGH)
- **Name** - Display name
- **Level** - Numeric priority (1 = highest)
- **SLA Hours** - Service level agreement deadline
- **Color Code** - Visual indicator

#### Use Cases:
- Define escalation priorities
- Set automatic SLA deadlines
- Color-code urgent tasks

---

### **Statuses**

#### Fields:
- **Code** - Unique status code
- **Name** - Display name
- **Status Type** - Workflow category (PUT_AWAY, TAKE_AWAY, QC_INSPECTION, etc.)
- **Is Terminal** - Cannot transition further
- **Is Successful** - Positive outcome indicator
- **Color Code** - Visual indicator
- **Next Statuses** - Valid state transitions

#### Use Cases:
- Define workflow states
- Control state transitions
- Track success/failure outcomes

---

### **Inspection Types**

#### Fields:
- **Code** - Inspection code
- **Name** - Display name
- **Is Mandatory** - Required inspection
- **Default Sample Size %** - Inspection sample percentage
- **Min Sample Size** - Minimum items to inspect
- **Requires Photos** - Photo documentation required
- **SLA Hours** - Inspection deadline

#### Use Cases:
- Configure receiving inspections
- Set sampling requirements
- Define inspection workflows

---

### **Hold Reasons**

#### Fields:
- **Code** - Hold reason code
- **Name** - Display name
- **Category** - QUALITY, DAMAGE, REGULATORY, etc.
- **Default Severity** - CRITICAL, HIGH, MEDIUM, LOW
- **Requires QC Inspection** - Trigger QC workflow
- **Requires Manager Approval** - Approval needed
- **Auto Escalation Hours** - Automatic escalation timer

#### Use Cases:
- Define hold categories
- Set escalation rules
- Require approvals for specific holds

---

### **Shipping Methods**

#### Fields:
- **Code** - Shipping method code
- **Name** - Display name
- **Carrier** - UPS, FedEx, USPS, etc.
- **Service Level** - Ground, Express, etc.
- **Estimated Days** - Delivery time
- **Is Expedited** - Rush shipping flag
- **Base Cost** - Starting price

#### Use Cases:
- Configure carrier services
- Set delivery expectations
- Calculate shipping costs

---

### **Roles & Permissions**

#### Fields:
- **Code** - Role code
- **Name** - Display name
- **Level** - Authority level (1 = highest)
- **Can Approve Holds** - Hold approval permission
- **Can Approve Adjustments** - Inventory adjustment permission
- **Can Manage Users** - User management permission
- **Max Task Capacity** - Concurrent task limit

#### Use Cases:
- Define user roles
- Set permission levels
- Control task assignments

---

### **System Configuration**

#### Fields:
- **Config Key** - Unique configuration key
- **Config Value** - Current value
- **Value Type** - STRING, NUMBER, BOOLEAN, JSON
- **Category** - GENERAL, OPERATIONS, SECURITY, etc.
- **Is Editable** - Can be modified by users

#### Use Cases:
- Configure system behavior
- Set operational parameters
- Control security settings

#### Common Settings:
- `WAREHOUSE_NAME` - Warehouse display name
- `TIMEZONE` - System timezone
- `AUTO_ASSIGN_TASKS` - Automatic task assignment
- `REQUIRE_BEACON_SCAN` - Enforce BLE scanning
- `MIN_REORDER_DAYS` - Reorder threshold
- `BEACON_BATTERY_WARNING` - Low battery threshold (%)
- `SESSION_TIMEOUT_MINUTES` - User session timeout

---

## 🎨 UI Features

### **Color Indicators**
- **Purple** - Master data theme color
- **Green** - Active/Success states
- **Red** - Critical/Error states
- **Orange** - Warning/High priority
- **Blue** - Info/Standard
- **Gray** - Inactive/Neutral

### **Badges**
- **Status badges** - Active/Inactive
- **Category badges** - Type classification
- **Requirement badges** - QC, Temp Control, etc.
- **Metric badges** - Hours, Days, Percentages

### **Icons**
- **Edit** (Pencil) - Modify record
- **Delete** (Trash) - Remove record
- **Power** - Toggle active status
- **Plus** - Add new record
- **Search** - Filter records

---

## 💡 Best Practices

### **Naming Conventions**
- Use UPPERCASE for codes (ELECTRONICS, URGENT)
- Use Title Case for names (Electronics, Urgent)
- Keep codes short but meaningful
- Avoid special characters in codes

### **Color Selection**
- Use consistent color schemes across related items
- High priority = Red/Orange
- Low priority = Green/Blue
- Neutral = Gray
- Ensure sufficient contrast for accessibility

### **Deactivation vs Deletion**
- **Deactivate** if the record is used in historical data
- **Delete** only if added by mistake
- Inactive records are hidden by default but preserved

### **Hierarchy Management**
- Start with root categories (level 0)
- Add subcategories incrementally
- Keep hierarchies shallow (2-3 levels max)

### **SLA Configuration**
- Set realistic deadlines based on operations
- Consider business hours vs 24/7 operations
- Account for peak periods

---

## 🔐 Security

### **Access Control**
- Only users with appropriate roles can access Master Data
- Some configurations require ADMIN role
- Audit logs track all changes

### **Data Validation**
- Required fields enforced
- Data types validated
- Relationships checked before deletion

---

## 📱 Mobile Support

- Responsive design works on tablets
- Touch-friendly buttons and forms
- Mobile navigation via hamburger menu
- Optimized for on-the-go configuration

---

## 🆘 Troubleshooting

### **Can't delete record**
- Record may be referenced by active data
- Deactivate instead of deleting
- Check foreign key constraints

### **Changes not appearing**
- Refresh the page
- Check active/inactive filter
- Verify save was successful

### **Form validation errors**
- Fill all required fields (marked with *)
- Check data format (numbers, emails, etc.)
- Review error messages

---

## 🔄 Integration

### **How Master Data Affects Operations**

- **Product Categories** → Product registration, QC requirements
- **Units of Measure** → Inventory quantities, conversions
- **Warehouse Zones** → Location assignments, temperature monitoring
- **Priority Levels** → Task sorting, SLA alerts
- **Statuses** → Workflow state machines, progress tracking
- **Inspection Types** → QC workflows, sampling rules
- **Hold Reasons** → Hold management, escalation
- **Shipping Methods** → Order fulfillment, cost calculation
- **Roles** → User permissions, task capacity

### **Sync with Database**
When using Supabase or PostgreSQL:
- Master data changes update lookup tables
- Existing records reference master IDs
- Deactivation prevents new usage
- Deletion checks referential integrity

---

## 📊 Reporting

### **Master Data Usage Reports**
- Products by category count
- Locations by zone utilization
- Tasks by priority distribution
- Inspections by type frequency
- Orders by shipping method

### **Audit Trail**
- All changes logged to `activity_logs` table
- Track who changed what and when
- Review historical configurations

---

## 🚀 Future Enhancements

Planned features:
- **Import/Export** - CSV/Excel support
- **Bulk Edit** - Update multiple records
- **Version History** - Track configuration changes over time
- **Templates** - Save common configurations
- **Multi-language** - Translation support
- **Custom Fields** - User-defined attributes
- **Validation Rules** - Custom business logic

---

## 📞 Support

For assistance with Master Data Management:
1. Check this guide for common operations
2. Review tooltips and field descriptions in forms
3. Consult database schema documentation
4. Contact system administrator for permission issues

---

**Last Updated**: February 2026  
**Version**: 2.0  
**Component**: Master Data Management UI
