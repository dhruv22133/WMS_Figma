import { masterDataApi, healthCheck } from './api';

// Seed data for initial database population
export const seedMasterData = async () => {
  try {
    console.log('Starting database seeding...');

    // First check if server is accessible
    try {
      const health = await healthCheck();
      console.log('✓ Server health check passed:', health);
    } catch (error) {
      console.error('❌ Server health check failed:', error);
      console.error('Make sure the Supabase Edge Function is deployed and running.');
      throw new Error('Server is not accessible');
    }

    // Check if data already exists
    let existingCategories = [];
    try {
      existingCategories = await masterDataApi.getProductCategories();
      console.log(`Found ${existingCategories.length} existing categories`);
    } catch (error) {
      console.warn('Could not check existing categories, will proceed with seeding:', error);
    }

    if (existingCategories.length > 0) {
      console.log('Database already contains data, skipping seed.');
      return;
    }

    console.log('Database is empty, starting seed...');

    // Seed Product Categories
    const categories = [
      {
        code: 'ELECTRONICS',
        name: 'Electronics',
        description: 'Electronic components and devices',
        level: 0,
        requires_quality_check: true,
        requires_temperature_control: false,
        default_shelf_life_days: 1095,
        is_active: true,
        display_order: 1,
      },
      {
        code: 'ELEC-COMP',
        name: 'Components',
        description: 'Electronic components',
        level: 1,
        requires_quality_check: true,
        requires_temperature_control: false,
        is_active: true,
        display_order: 1,
      },
      {
        code: 'HARDWARE',
        name: 'Hardware',
        description: 'Mechanical hardware and fasteners',
        level: 0,
        requires_quality_check: false,
        requires_temperature_control: false,
        is_active: true,
        display_order: 2,
      },
      {
        code: 'PHARMA',
        name: 'Pharmaceuticals',
        description: 'Medical and pharmaceutical products',
        level: 0,
        requires_quality_check: true,
        requires_temperature_control: true,
        default_shelf_life_days: 730,
        is_active: true,
        display_order: 3,
      },
    ];

    for (const category of categories) {
      await masterDataApi.createProductCategory(category);
    }
    console.log('✓ Product categories seeded');

    // Seed Warehouse Zones
    const zones = [
      {
        code: 'ZONE-A',
        name: 'Zone A',
        description: 'Main storage area - ambient temperature',
        zone_type: 'STORAGE',
        temperature_controlled: false,
        is_active: true,
        display_order: 1,
      },
      {
        code: 'ZONE-B',
        name: 'Zone B',
        description: 'Temperature controlled storage',
        zone_type: 'STORAGE',
        temperature_controlled: true,
        is_active: true,
        display_order: 2,
      },
      {
        code: 'RECEIVING',
        name: 'Receiving Area',
        description: 'Incoming shipments processing',
        zone_type: 'RECEIVING',
        temperature_controlled: false,
        is_active: true,
        display_order: 3,
      },
      {
        code: 'SHIPPING',
        name: 'Shipping Area',
        description: 'Outgoing shipments staging',
        zone_type: 'SHIPPING',
        temperature_controlled: false,
        is_active: true,
        display_order: 4,
      },
    ];

    for (const zone of zones) {
      await masterDataApi.createWarehouseZone(zone);
    }
    console.log('✓ Warehouse zones seeded');

    // Seed Location Types
    const locationTypes = [
      {
        code: 'RECEIVING',
        name: 'Receiving',
        description: 'Receiving area for incoming goods',
        is_active: true,
        display_order: 1,
      },
      {
        code: 'STORAGE',
        name: 'Storage',
        description: 'Main storage locations',
        is_active: true,
        display_order: 2,
      },
      {
        code: 'PICKING',
        name: 'Picking',
        description: 'Pick locations for order fulfillment',
        is_active: true,
        display_order: 3,
      },
      {
        code: 'SHIPPING',
        name: 'Shipping',
        description: 'Shipping staging area',
        is_active: true,
        display_order: 4,
      },
      {
        code: 'QC',
        name: 'Quality Control',
        description: 'Quality inspection area',
        is_active: true,
        display_order: 5,
      },
      {
        code: 'HOLD',
        name: 'Hold Area',
        description: 'Items on hold for various reasons',
        is_active: true,
        display_order: 6,
      },
    ];

    for (const locationType of locationTypes) {
      await masterDataApi.create('location-types', locationType);
    }
    console.log('✓ Location types seeded');

    // Seed Units of Measure
    const unitsOfMeasure = [
      { code: 'EA', name: 'Each', description: 'Individual units', is_active: true, display_order: 1 },
      { code: 'BOX', name: 'Box', description: 'Boxed items', is_active: true, display_order: 2 },
      { code: 'PALLET', name: 'Pallet', description: 'Palletized goods', is_active: true, display_order: 3 },
      { code: 'KG', name: 'Kilogram', description: 'Weight in kilograms', is_active: true, display_order: 4 },
      { code: 'LB', name: 'Pound', description: 'Weight in pounds', is_active: true, display_order: 5 },
      { code: 'LITER', name: 'Liter', description: 'Volume in liters', is_active: true, display_order: 6 },
    ];

    for (const uom of unitsOfMeasure) {
      await masterDataApi.create('units-of-measure', uom);
    }
    console.log('✓ Units of measure seeded');

    // Seed Priority Levels
    const priorityLevels = [
      { code: 'LOW', name: 'Low', description: 'Low priority', color: '#9CA3AF', is_active: true, display_order: 1 },
      { code: 'MEDIUM', name: 'Medium', description: 'Medium priority', color: '#3B82F6', is_active: true, display_order: 2 },
      { code: 'HIGH', name: 'High', description: 'High priority', color: '#F59E0B', is_active: true, display_order: 3 },
      { code: 'URGENT', name: 'Urgent', description: 'Urgent priority', color: '#EF4444', is_active: true, display_order: 4 },
    ];

    for (const priority of priorityLevels) {
      await masterDataApi.create('priority-levels', priority);
    }
    console.log('✓ Priority levels seeded');

    // Seed Statuses
    const statuses = [
      { code: 'PENDING', name: 'Pending', description: 'Awaiting action', color: '#9CA3AF', category: 'GENERAL', is_active: true, display_order: 1 },
      { code: 'IN_PROGRESS', name: 'In Progress', description: 'Currently being processed', color: '#3B82F6', category: 'GENERAL', is_active: true, display_order: 2 },
      { code: 'COMPLETED', name: 'Completed', description: 'Successfully completed', color: '#10B981', category: 'GENERAL', is_active: true, display_order: 3 },
      { code: 'CANCELLED', name: 'Cancelled', description: 'Cancelled or aborted', color: '#EF4444', category: 'GENERAL', is_active: true, display_order: 4 },
      { code: 'ON_HOLD', name: 'On Hold', description: 'Temporarily suspended', color: '#F59E0B', category: 'GENERAL', is_active: true, display_order: 5 },
    ];

    for (const status of statuses) {
      await masterDataApi.create('statuses', status);
    }
    console.log('✓ Statuses seeded');

    // Seed Order Types
    const orderTypes = [
      { code: 'CUSTOMER', name: 'Customer Order', description: 'Customer sales order', is_active: true, display_order: 1 },
      { code: 'TRANSFER', name: 'Transfer Order', description: 'Inter-warehouse transfer', is_active: true, display_order: 2 },
      { code: 'RETURN', name: 'Return Order', description: 'Customer return', is_active: true, display_order: 3 },
      { code: 'SCRAP', name: 'Scrap Order', description: 'Scrap or disposal', is_active: true, display_order: 4 },
    ];

    for (const orderType of orderTypes) {
      await masterDataApi.create('order-types', orderType);
    }
    console.log('✓ Order types seeded');

    // Seed Inspection Types
    const inspectionTypes = [
      { code: 'RECEIVING', name: 'Receiving Inspection', description: 'Inspection of incoming goods', is_active: true, display_order: 1 },
      { code: 'PERIODIC', name: 'Periodic Inspection', description: 'Regular scheduled inspection', is_active: true, display_order: 2 },
      { code: 'DAMAGE', name: 'Damage Inspection', description: 'Inspection of damaged items', is_active: true, display_order: 3 },
      { code: 'RETURN', name: 'Return Inspection', description: 'Inspection of returned items', is_active: true, display_order: 4 },
      { code: 'PRE_SHIP', name: 'Pre-Ship Inspection', description: 'Final inspection before shipping', is_active: true, display_order: 5 },
    ];

    for (const inspectionType of inspectionTypes) {
      await masterDataApi.create('inspection-types', inspectionType);
    }
    console.log('✓ Inspection types seeded');

    // Seed Defect Types
    const defectTypes = [
      { code: 'PHYSICAL_DAMAGE', name: 'Physical Damage', description: 'Visible physical damage', severity: 'HIGH', is_active: true, display_order: 1 },
      { code: 'PACKAGING_DAMAGE', name: 'Packaging Damage', description: 'Damaged packaging', severity: 'MEDIUM', is_active: true, display_order: 2 },
      { code: 'MISSING_PARTS', name: 'Missing Parts', description: 'Incomplete product', severity: 'HIGH', is_active: true, display_order: 3 },
      { code: 'WRONG_ITEM', name: 'Wrong Item', description: 'Incorrect item received', severity: 'HIGH', is_active: true, display_order: 4 },
      { code: 'COSMETIC', name: 'Cosmetic Defect', description: 'Cosmetic imperfections', severity: 'LOW', is_active: true, display_order: 5 },
    ];

    for (const defectType of defectTypes) {
      await masterDataApi.create('defect-types', defectType);
    }
    console.log('✓ Defect types seeded');

    // Seed Hold Reasons
    const holdReasons = [
      { code: 'QUALITY_ISSUE', name: 'Quality Issue', description: 'Failed quality inspection', severity: 'HIGH', is_active: true, display_order: 1 },
      { code: 'DAMAGE', name: 'Damage', description: 'Damaged goods', severity: 'MEDIUM', is_active: true, display_order: 2 },
      { code: 'EXPIRED', name: 'Expired', description: 'Expired product', severity: 'HIGH', is_active: true, display_order: 3 },
      { code: 'CUSTOMER_RETURN', name: 'Customer Return', description: 'Returned by customer', severity: 'MEDIUM', is_active: true, display_order: 4 },
      { code: 'INVESTIGATION', name: 'Under Investigation', description: 'Pending investigation', severity: 'LOW', is_active: true, display_order: 5 },
    ];

    for (const holdReason of holdReasons) {
      await masterDataApi.create('hold-reasons', holdReason);
    }
    console.log('✓ Hold reasons seeded');

    // Seed BLE Gateways
    const bleGateways = [
      {
        code: 'GW-001',
        name: 'Gateway 1 - Receiving',
        mac_address: 'AA:BB:CC:DD:EE:01',
        ip_address: '192.168.1.101',
        location: 'Receiving Area - Main Entrance',
        zone_id: 'RECEIVING',
        gateway_type: 'FIXED',
        firmware_version: 'v2.1.3',
        scan_interval: 1000,
        signal_range: 50,
        is_online: true,
        description: 'Main gateway covering receiving area entrance',
        is_active: true,
        display_order: 1,
      },
      {
        code: 'GW-002',
        name: 'Gateway 2 - Zone A',
        mac_address: 'AA:BB:CC:DD:EE:02',
        ip_address: '192.168.1.102',
        location: 'Zone A - North Corner',
        zone_id: 'ZONE-A',
        gateway_type: 'FIXED',
        firmware_version: 'v2.1.3',
        scan_interval: 1000,
        signal_range: 50,
        is_online: true,
        description: 'Coverage for Zone A storage area',
        is_active: true,
        display_order: 2,
      },
      {
        code: 'GW-003',
        name: 'Gateway 3 - Zone B',
        mac_address: 'AA:BB:CC:DD:EE:03',
        ip_address: '192.168.1.103',
        location: 'Zone B - Temperature Controlled',
        zone_id: 'ZONE-B',
        gateway_type: 'FIXED',
        firmware_version: 'v2.1.3',
        scan_interval: 1000,
        signal_range: 40,
        is_online: true,
        description: 'Temperature controlled zone coverage',
        is_active: true,
        display_order: 3,
      },
      {
        code: 'GW-004',
        name: 'Gateway 4 - Shipping',
        mac_address: 'AA:BB:CC:DD:EE:04',
        ip_address: '192.168.1.104',
        location: 'Shipping Area - Loading Dock',
        zone_id: 'SHIPPING',
        gateway_type: 'FIXED',
        firmware_version: 'v2.1.3',
        scan_interval: 1000,
        signal_range: 50,
        is_online: true,
        description: 'Shipping dock coverage',
        is_active: true,
        display_order: 4,
      },
      {
        code: 'GW-MOBILE-01',
        name: 'Mobile Gateway 1',
        mac_address: 'AA:BB:CC:DD:EE:05',
        ip_address: '192.168.1.150',
        location: 'Mobile - Warehouse Floor',
        zone_id: '',
        gateway_type: 'MOBILE',
        firmware_version: 'v2.0.8',
        scan_interval: 2000,
        signal_range: 30,
        is_online: false,
        description: 'Portable gateway for spot coverage',
        is_active: true,
        display_order: 5,
      },
    ];

    for (const gateway of bleGateways) {
      await masterDataApi.create('ble-gateways', gateway);
    }
    console.log('✓ BLE gateways seeded');

    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};