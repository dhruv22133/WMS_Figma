import { useState } from 'react';
import { BookOpen, Download, Printer, Search, ChevronDown, ChevronRight, Home, ArrowDownToLine, ArrowUpFromLine, ClipboardCheck, Bluetooth, MapPin, Settings, BarChart3, UserCheck } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';

export function Documentation() {
  const [expandedSection, setExpandedSection] = useState<string | null>('getting-started');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    // Create a formatted text version
    const doc = document.getElementById('documentation-content');
    if (doc) {
      const docText = doc.innerText;
      const blob = new Blob([docText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'WMS-Pro-User-Guide.txt';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Home,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Welcome to WMS Pro</h3>
          <p className="text-gray-700">
            WMS Pro is a comprehensive Bluetooth Low Energy (BLE) based warehouse management system designed to streamline 
            warehouse operations through real-time tracking and automated workflows.
          </p>
          
          <h4 className="font-semibold text-gray-800 mt-6">System Overview</h4>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Real-time BLE beacon tracking for inventory location monitoring</li>
            <li>Automated put-away and take-away processes</li>
            <li>Quality control and inspection workflows</li>
            <li>Comprehensive reporting and analytics</li>
            <li>Master data management for all lookup values</li>
            <li>User approval and role-based access control</li>
          </ul>

          <h4 className="font-semibold text-gray-800 mt-6">Logging In</h4>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
            <li>Navigate to the WMS Pro login page</li>
            <li>Enter your registered email address</li>
            <li>Enter your password</li>
            <li>Click "Sign In" to access the system</li>
            <li>If you're a new user, click "Sign Up" and wait for administrator approval</li>
          </ol>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-6">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> New users must be approved by an administrator before gaining access to the system.
            </p>
          </div>

          <h4 className="font-semibold text-gray-800 mt-6">Navigation</h4>
          <p className="text-gray-700">
            The system uses a vertical sidebar navigation (left side on desktop, hamburger menu on mobile) with the following sections:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mt-2">
            <li><strong>Dashboard:</strong> Overview of warehouse operations and key metrics</li>
            <li><strong>Put-Away:</strong> Receiving and storage process management</li>
            <li><strong>Take-Away:</strong> Order picking and shipping workflows</li>
            <li><strong>Quality Control:</strong> Inspection and quality assurance</li>
            <li><strong>BLE Tracking:</strong> Real-time beacon monitoring</li>
            <li><strong>Location Tracking:</strong> Warehouse location and utilization</li>
            <li><strong>Master Data:</strong> Configuration and lookup data management</li>
            <li><strong>User Approvals:</strong> User access management (admin only)</li>
            <li><strong>Reporting:</strong> Analytics and performance reports</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: Home,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Dashboard Overview</h3>
          <p className="text-gray-700">
            The Dashboard provides a real-time overview of all warehouse operations and key performance indicators.
          </p>

          <h4 className="font-semibold text-gray-800 mt-6">Key Metrics Cards</h4>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li><strong>Total Products:</strong> Count of all products in the system</li>
            <li><strong>Active Locations:</strong> Number of warehouse locations currently in use</li>
            <li><strong>BLE Beacons:</strong> Active tracking beacons deployed in the warehouse</li>
            <li><strong>Pending Tasks:</strong> Outstanding put-away and take-away tasks</li>
          </ul>

          <h4 className="font-semibold text-gray-800 mt-6">Quick Actions</h4>
          <p className="text-gray-700">
            Quick action buttons provide one-click navigation to frequently used functions:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>New Put-Away Task</li>
            <li>New Take-Away Order</li>
            <li>Track BLE Beacons</li>
            <li>View Locations</li>
            <li>Quality Inspection</li>
            <li>View Reports</li>
          </ul>

          <h4 className="font-semibold text-gray-800 mt-6">Recent Activity</h4>
          <p className="text-gray-700">
            The activity feed displays the latest warehouse operations including put-away completions, 
            take-away orders, quality checks, and system events.
          </p>
        </div>
      ),
    },
    {
      id: 'putaway',
      title: 'Put-Away Process',
      icon: ArrowDownToLine,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Put-Away Process</h3>
          <p className="text-gray-700">
            The Put-Away process guides warehouse operators through receiving incoming inventory and storing it in designated locations.
          </p>

          <h4 className="font-semibold text-gray-800 mt-6">Step 1: Product Registration</h4>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
            <li>Click "Start Put-Away Process" to begin</li>
            <li>Select the product from the dropdown list</li>
            <li>Enter the quantity received</li>
            <li>Select the supplier (if applicable)</li>
            <li>Add any relevant notes about the shipment</li>
            <li>Click "Next Step" to continue</li>
          </ol>

          <h4 className="font-semibold text-gray-800 mt-6">Step 2: BLE Beacon Assignment</h4>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
            <li>Click "Scan Beacon" to activate BLE scanning</li>
            <li>The system will detect nearby BLE beacons automatically</li>
            <li>Select the appropriate beacon from the detected list</li>
            <li>The beacon's MAC address and signal strength will be displayed</li>
            <li>Attach the physical beacon to the product/pallet</li>
            <li>Click "Next Step" to proceed</li>
          </ol>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-4">
            <p className="text-sm text-yellow-800">
              <strong>Important:</strong> Ensure the BLE beacon is securely attached to the item before proceeding.
              The beacon will be used to track the item throughout the warehouse.
            </p>
          </div>

          <h4 className="font-semibold text-gray-800 mt-6">Step 3: Location Assignment</h4>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
            <li>The system will suggest optimal storage locations based on:</li>
            <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
              <li>Product category and type</li>
              <li>Available space in zones</li>
              <li>Zone utilization rates</li>
              <li>Product characteristics</li>
            </ul>
            <li>Review the suggested location or select a different one</li>
            <li>Note the warehouse zone, aisle, rack, and bin information</li>
            <li>Click "Next Step" to continue</li>
          </ol>

          <h4 className="font-semibold text-gray-800 mt-6">Step 4: Confirmation</h4>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
            <li>Review all entered information:</li>
            <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
              <li>Product details and quantity</li>
              <li>Assigned BLE beacon ID</li>
              <li>Storage location</li>
            </ul>
            <li>Make any necessary corrections by clicking "Previous Step"</li>
            <li>Click "Complete Put-Away" to finalize the process</li>
            <li>The system will update inventory and location records</li>
            <li>A success message will confirm the completion</li>
          </ol>

          <h4 className="font-semibold text-gray-800 mt-6">Batch Put-Away</h4>
          <p className="text-gray-700">
            For multiple items from the same shipment, use the "Add Another Item" feature to register 
            multiple products without restarting the entire process.
          </p>
        </div>
      ),
    },
    {
      id: 'takeaway',
      title: 'Take-Away Process',
      icon: ArrowUpFromLine,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Take-Away Process</h3>
          <p className="text-gray-700">
            The Take-Away process manages order picking and shipping operations with BLE-guided location finding.
          </p>

          <h4 className="font-semibold text-gray-800 mt-6">Step 1: Order Information</h4>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
            <li>Click "Start Take-Away Process"</li>
            <li>Enter the order number or ID</li>
            <li>Select the customer or destination</li>
            <li>Set the priority level (Normal, High, Urgent)</li>
            <li>Enter the required shipping date</li>
            <li>Click "Next Step"</li>
          </ol>

          <h4 className="font-semibold text-gray-800 mt-6">Step 2: Item Selection</h4>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
            <li>Select products from the available inventory list</li>
            <li>Enter the quantity needed for each item</li>
            <li>The system displays current stock levels and locations</li>
            <li>Add multiple items to the order as needed</li>
            <li>Review the pick list</li>
            <li>Click "Next Step" to continue</li>
          </ol>

          <h4 className="font-semibold text-gray-800 mt-6">Step 3: BLE-Guided Picking</h4>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
            <li>The system displays the location of each item via BLE tracking</li>
            <li>Navigate to each location using the warehouse map</li>
            <li>BLE signal strength helps pinpoint exact item location</li>
            <li>Scan the BLE beacon on the item to verify correct pick</li>
            <li>Confirm the quantity picked</li>
            <li>Mark each line item as "Picked" when complete</li>
            <li>Proceed to the next item on the list</li>
          </ol>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-4">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> Use the signal strength indicator (RSSI) to help locate items. 
              Stronger signal (higher negative number) means you're closer to the item.
            </p>
          </div>

          <h4 className="font-semibold text-gray-800 mt-6">Step 4: Packing & Shipping</h4>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
            <li>Review all picked items</li>
            <li>Select the shipping method</li>
            <li>Generate packing slip and shipping label</li>
            <li>Enter tracking number (if applicable)</li>
            <li>Confirm packaging is complete</li>
            <li>Click "Complete Order" to finalize</li>
            <li>System updates inventory and creates shipment record</li>
          </ol>

          <h4 className="font-semibold text-gray-800 mt-6">Partial Fulfillment</h4>
          <p className="text-gray-700">
            If items are out of stock or unavailable, you can create a partial shipment. The system will 
            automatically create a backorder for remaining items.
          </p>
        </div>
      ),
    },
    {
      id: 'quality',
      title: 'Quality Control',
      icon: ClipboardCheck,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Quality Control & Inspection</h3>
          <p className="text-gray-700">
            The Quality Control module manages inspection workflows, defect tracking, and hold area management.
          </p>

          <h4 className="font-semibold text-gray-800 mt-6">Creating an Inspection</h4>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
            <li>Navigate to Quality Control section</li>
            <li>Click "New Inspection"</li>
            <li>Select the inspection type:</li>
            <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
              <li>Visual Inspection</li>
              <li>Dimensional Check</li>
              <li>Functional Test</li>
              <li>Packaging Inspection</li>
            </ul>
            <li>Scan or select the item to inspect (via BLE beacon)</li>
            <li>Complete the inspection checklist</li>
            <li>Record measurements or observations</li>
            <li>Capture photos if needed (upload feature)</li>
          </ol>

          <h4 className="font-semibold text-gray-800 mt-6">Inspection Results</h4>
          <p className="text-gray-700">After completing the inspection, you can:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li><strong>Pass:</strong> Item meets quality standards and is approved for storage/shipment</li>
            <li><strong>Fail:</strong> Item fails inspection and requires disposition decision</li>
            <li><strong>Hold:</strong> Item requires further review or awaits decision</li>
          </ul>

          <h4 className="font-semibold text-gray-800 mt-6">Defect Recording</h4>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
            <li>For failed items, select the defect type:</li>
            <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
              <li>Damaged - Physical</li>
              <li>Damaged - Packaging</li>
              <li>Incorrect Labeling</li>
              <li>Dimension Out of Spec</li>
              <li>Surface Defects</li>
              <li>Missing Components</li>
            </ul>
            <li>Enter detailed description of the defect</li>
            <li>Set severity level (Minor, Major, Critical)</li>
            <li>Attach photos or documentation</li>
            <li>Submit for review</li>
          </ol>

          <h4 className="font-semibold text-gray-800 mt-6">Hold Area Management</h4>
          <p className="text-gray-700">
            Items placed on hold are tracked separately with the following information:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Hold reason (Quality Issue, Damaged, Customer Return, etc.)</li>
            <li>BLE beacon location tracking</li>
            <li>Hold duration and aging</li>
            <li>Assigned reviewer/approver</li>
            <li>Resolution status and notes</li>
          </ul>

          <h4 className="font-semibold text-gray-800 mt-6">Releasing from Hold</h4>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
            <li>Review hold items in the Hold Area tab</li>
            <li>Examine the item and documentation</li>
            <li>Make a disposition decision:</li>
            <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
              <li>Release to Inventory</li>
              <li>Return to Supplier</li>
              <li>Scrap/Dispose</li>
              <li>Rework/Repair</li>
            </ul>
            <li>Enter resolution notes</li>
            <li>Confirm the action</li>
          </ol>
        </div>
      ),
    },
    {
      id: 'ble',
      title: 'BLE Tracking',
      icon: Bluetooth,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">BLE Beacon Tracking</h3>
          <p className="text-gray-700">
            The BLE Tracking module provides real-time monitoring and management of all Bluetooth Low Energy beacons in the warehouse.
          </p>

          <h4 className="font-semibold text-gray-800 mt-6">Scanning for Beacons</h4>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
            <li>Click the "Scan BLE Devices" button</li>
            <li>The system begins scanning for nearby beacons</li>
            <li>Detected beacons appear in the list with:</li>
            <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
              <li>MAC Address (unique identifier)</li>
              <li>Signal Strength (RSSI in dBm)</li>
              <li>Last seen timestamp</li>
              <li>Battery level (if available)</li>
              <li>Associated product (if registered)</li>
            </ul>
            <li>Click "Stop Scan" when finished</li>
          </ol>

          <h4 className="font-semibold text-gray-800 mt-6">Understanding Signal Strength</h4>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <ul className="space-y-2 text-gray-700">
              <li><strong className="text-green-600">Excellent (-40 to -60 dBm):</strong> Very close proximity, within 1-2 meters</li>
              <li><strong className="text-blue-600">Good (-60 to -70 dBm):</strong> Close range, within 2-5 meters</li>
              <li><strong className="text-yellow-600">Fair (-70 to -80 dBm):</strong> Medium range, within 5-10 meters</li>
              <li><strong className="text-orange-600">Poor (-80 to -90 dBm):</strong> Far range, within 10-20 meters</li>
              <li><strong className="text-red-600">Very Poor (&lt; -90 dBm):</strong> Edge of range, may lose connection</li>
            </ul>
          </div>

          <h4 className="font-semibold text-gray-800 mt-6">Beacon Registration</h4>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
            <li>Scan to detect new beacons</li>
            <li>Select an unregistered beacon from the list</li>
            <li>Click "Register Beacon"</li>
            <li>Enter beacon details:</li>
            <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
              <li>Beacon ID/Name</li>
              <li>Beacon type (Asset Tag, Location Anchor, Gateway)</li>
              <li>Description</li>
            </ul>
            <li>Save the registration</li>
          </ol>

          <h4 className="font-semibold text-gray-800 mt-6">Filtering and Search</h4>
          <p className="text-gray-700">Use the filter controls to:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Filter by signal strength (Excellent, Good, Fair, Poor)</li>
            <li>Show only registered vs unregistered beacons</li>
            <li>Search by MAC address or product name</li>
            <li>Sort by distance (nearest first)</li>
          </ul>

          <h4 className="font-semibold text-gray-800 mt-6">Beacon Maintenance</h4>
          <p className="text-gray-700">
            Monitor beacon health by checking:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Battery levels (replace when below 20%)</li>
            <li>Last seen timestamps (investigate if not detected in 24 hours)</li>
            <li>Signal strength consistency</li>
            <li>Physical condition during inventory checks</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'location',
      title: 'Location Tracking',
      icon: MapPin,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Location Tracking</h3>
          <p className="text-gray-700">
            Monitor warehouse locations, capacity utilization, and inventory placement with interactive map and list views.
          </p>

          <h4 className="font-semibold text-gray-800 mt-6">Map View</h4>
          <p className="text-gray-700">
            The warehouse map provides a visual representation of:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li><strong>Zone Layout:</strong> Different warehouse zones displayed with color coding</li>
            <li><strong>Location Status:</strong> Color-coded dots showing utilization:
              <ul className="list-circle list-inside ml-6 mt-2 space-y-1">
                <li>Gray: Empty (0%)</li>
                <li>Green: Low utilization (&lt;60%)</li>
                <li>Yellow: Medium utilization (60-90%)</li>
                <li>Red: High utilization (&gt;90%)</li>
              </ul>
            </li>
            <li><strong>BLE Gateways:</strong> Gateway positions marked with radio icons</li>
            <li><strong>Location Details:</strong> Click any location for detailed information</li>
          </ul>

          <h4 className="font-semibold text-gray-800 mt-6">List View</h4>
          <p className="text-gray-700">
            The list view displays all locations with:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Location ID (Warehouse-Zone-Aisle-Rack-Bin)</li>
            <li>Current capacity (items stored / total capacity)</li>
            <li>Utilization percentage with color-coded bar</li>
            <li>Expandable details showing stored items</li>
          </ul>

          <h4 className="font-semibold text-gray-800 mt-6">Search and Filter</h4>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
            <li>Use the search bar to find locations by:</li>
            <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
              <li>Location ID</li>
              <li>Product name</li>
              <li>Beacon ID</li>
            </ul>
            <li>Filter by warehouse using the dropdown</li>
            <li>Toggle between Map View and List View</li>
          </ol>

          <h4 className="font-semibold text-gray-800 mt-6">Location Details</h4>
          <p className="text-gray-700">
            Click on any location to view:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Complete location coordinates</li>
            <li>Capacity utilization metrics</li>
            <li>List of all items stored at that location</li>
            <li>Associated BLE beacon information</li>
            <li>Last updated timestamp</li>
          </ul>

          <h4 className="font-semibold text-gray-800 mt-6">Warehouse Statistics</h4>
          <p className="text-gray-700">
            The statistics panel shows for each warehouse:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Total storage capacity</li>
            <li>Used slots count</li>
            <li>Overall utilization percentage</li>
            <li>Visual progress bar</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'master-data',
      title: 'Master Data Management',
      icon: Settings,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Master Data Management</h3>
          <p className="text-gray-700">
            Configure and maintain all system lookup data and reference tables.
          </p>

          <h4 className="font-semibold text-gray-800 mt-6">Accessing Master Data</h4>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
            <li>Click "Master Data" in the main navigation</li>
            <li>Select a category from the left panel:</li>
            <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
              <li>Products & Inventory</li>
              <li>Warehouse</li>
              <li>BLE Infrastructure</li>
              <li>Workflow</li>
              <li>Quality Control</li>
              <li>Shipping</li>
              <li>System</li>
            </ul>
            <li>Choose the specific data type to manage</li>
          </ol>

          <h4 className="font-semibold text-gray-800 mt-6">Available Master Data Types</h4>
          
          <div className="space-y-4 mt-4">
            <div>
              <h5 className="font-semibold text-gray-800">Products & Inventory</h5>
              <ul className="list-disc list-inside ml-4 text-gray-700">
                <li><strong>Product Categories:</strong> Organize products into hierarchical categories</li>
                <li><strong>Units of Measure:</strong> Define measurement units (EA, BOX, KG, etc.)</li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold text-gray-800">Warehouse</h5>
              <ul className="list-disc list-inside ml-4 text-gray-700">
                <li><strong>Warehouse Zones:</strong> Define zones, aisles, and storage areas</li>
                <li><strong>Location Types:</strong> Configure location types (Shelf, Pallet, Floor, etc.)</li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold text-gray-800">BLE Infrastructure</h5>
              <ul className="list-disc list-inside ml-4 text-gray-700">
                <li><strong>BLE Gateways:</strong> Manage BLE gateway devices and configurations</li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold text-gray-800">Workflow</h5>
              <ul className="list-disc list-inside ml-4 text-gray-700">
                <li><strong>Priority Levels:</strong> Define task priority levels</li>
                <li><strong>Statuses:</strong> Configure workflow statuses</li>
                <li><strong>Order Types:</strong> Set up order type categories</li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold text-gray-800">Quality Control</h5>
              <ul className="list-disc list-inside ml-4 text-gray-700">
                <li><strong>Inspection Types:</strong> Define QC inspection categories</li>
                <li><strong>Defect Types:</strong> Configure defect classifications</li>
                <li><strong>Hold Reasons:</strong> Set up hold/quarantine reasons</li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold text-gray-800">Shipping</h5>
              <ul className="list-disc list-inside ml-4 text-gray-700">
                <li><strong>Shipping Methods:</strong> Manage carriers and shipping options</li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold text-gray-800">System</h5>
              <ul className="list-disc list-inside ml-4 text-gray-700">
                <li><strong>Roles & Permissions:</strong> Configure user roles and access levels</li>
                <li><strong>System Configuration:</strong> General system settings</li>
              </ul>
            </div>
          </div>

          <h4 className="font-semibold text-gray-800 mt-6">CRUD Operations</h4>
          
          <div className="space-y-4 mt-4">
            <div>
              <h5 className="font-semibold text-gray-800">Create New Entry</h5>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                <li>Click the "+ Add New" button</li>
                <li>Fill in all required fields (marked with *)</li>
                <li>Enter optional information as needed</li>
                <li>Set Active/Inactive status</li>
                <li>Click "Create" to save</li>
              </ol>
            </div>

            <div>
              <h5 className="font-semibold text-gray-800">Edit Existing Entry</h5>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                <li>Locate the entry in the table</li>
                <li>Click the Edit (pencil) icon</li>
                <li>Modify the fields as needed</li>
                <li>Click "Update" to save changes</li>
              </ol>
            </div>

            <div>
              <h5 className="font-semibold text-gray-800">Delete Entry</h5>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                <li>Click the Delete (trash) icon on the entry</li>
                <li>Confirm the deletion in the dialog</li>
                <li>The entry will be permanently removed</li>
              </ol>
            </div>

            <div>
              <h5 className="font-semibold text-gray-800">Toggle Active/Inactive</h5>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                <li>Click the Power icon on the entry</li>
                <li>The status will toggle between Active and Inactive</li>
                <li>Inactive entries can be hidden using the "Show Inactive" toggle</li>
              </ol>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-6">
            <p className="text-sm text-yellow-800">
              <strong>Caution:</strong> Deleting master data entries that are in use by other records 
              may cause errors. Consider marking entries as "Inactive" instead of deleting them.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'reporting',
      title: 'Reporting & Analytics',
      icon: BarChart3,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Reporting & Analytics</h3>
          <p className="text-gray-700">
            Access comprehensive reports and analytics to monitor warehouse performance and make data-driven decisions.
          </p>

          <h4 className="font-semibold text-gray-800 mt-6">Report Filters</h4>
          <p className="text-gray-700">Customize reports using the filter controls:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li><strong>Date Range:</strong> Today, Last 7/30/90 Days, or Custom Range</li>
            <li><strong>Warehouse:</strong> Filter by specific warehouse or view all</li>
            <li><strong>Format:</strong> Interactive Dashboard, PDF, Excel, or CSV</li>
          </ul>

          <h4 className="font-semibold text-gray-800 mt-6">Available Reports</h4>
          
          <div className="space-y-4 mt-4">
            <div>
              <h5 className="font-semibold text-gray-800">Overview Reports</h5>
              <ul className="list-disc list-inside ml-4 text-gray-700">
                <li><strong>Warehouse Utilization:</strong> Capacity usage across all warehouses</li>
                <li><strong>Inventory Movement Trends:</strong> Put-away and take-away activity over time</li>
                <li><strong>Zone Utilization:</strong> Storage usage by warehouse zone</li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold text-gray-800">Inventory Reports</h5>
              <ul className="list-disc list-inside ml-4 text-gray-700">
                <li><strong>Top Moving Products:</strong> Most frequently moved items with revenue</li>
                <li><strong>Inventory Status:</strong> Distribution of passed, failed, and held items</li>
                <li><strong>Inventory Age Analysis:</strong> Time-based inventory categorization</li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold text-gray-800">Performance Reports</h5>
              <ul className="list-disc list-inside ml-4 text-gray-700">
                <li><strong>Put-Away Performance:</strong> Average time and completed tasks</li>
                <li><strong>Take-Away Performance:</strong> Order fulfillment metrics</li>
                <li><strong>Operator Rankings:</strong> Individual performance by warehouse staff</li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold text-gray-800">Quality Reports</h5>
              <ul className="list-disc list-inside ml-4 text-gray-700">
                <li><strong>QC Inspection Results:</strong> Pass/fail rates by inspection type</li>
                <li><strong>Defect Analysis:</strong> Most common defect types and frequencies</li>
                <li><strong>Quality Trends:</strong> Quality metrics over time</li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold text-gray-800">BLE Tracking Reports</h5>
              <ul className="list-disc list-inside ml-4 text-gray-700">
                <li><strong>Beacon Activity:</strong> 24-hour beacon detection patterns</li>
                <li><strong>Gateway Performance:</strong> Uptime and scan statistics</li>
                <li><strong>Signal Strength Distribution:</strong> BLE signal quality metrics</li>
              </ul>
            </div>
          </div>

          <h4 className="font-semibold text-gray-800 mt-6">Exporting Reports</h4>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
            <li>Navigate to the desired report tab</li>
            <li>Set appropriate filters (date range, warehouse, etc.)</li>
            <li>Click the Download icon on individual charts or "Export All" for complete report</li>
            <li>Select export format (PDF, Excel, CSV)</li>
            <li>The file will be downloaded to your device</li>
          </ol>

          <h4 className="font-semibold text-gray-800 mt-6">Key Performance Indicators</h4>
          <p className="text-gray-700">Monitor these KPIs at the top of the reporting page:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li><strong>Avg Put-Away Time:</strong> How long it takes to store incoming items</li>
            <li><strong>Avg Take-Away Time:</strong> How long it takes to pick and ship orders</li>
            <li><strong>QC Pass Rate:</strong> Percentage of items passing quality inspection</li>
            <li><strong>Location Accuracy:</strong> Precision of inventory location tracking</li>
          </ul>

          <p className="text-gray-700 mt-4">
            Each KPI displays the current value and trend (percentage change) with color coding:
          </p>
          <ul className="list-disc list-inside ml-4 text-gray-700">
            <li>Green badge: Positive trend (improvement)</li>
            <li>Red badge: Negative trend (needs attention)</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'user-approvals',
      title: 'User Approvals',
      icon: UserCheck,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">User Approvals (Admin Only)</h3>
          <p className="text-gray-700">
            Manage user registration requests and control system access.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This feature is only available to administrators and authorized approvers.
            </p>
          </div>

          <h4 className="font-semibold text-gray-800 mt-6">Reviewing Registration Requests</h4>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
            <li>Navigate to "User Approvals" in the main menu</li>
            <li>View the list of pending registration requests</li>
            <li>Each request displays:</li>
            <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
              <li>User's email address</li>
              <li>Full name (if provided)</li>
              <li>Registration date/time</li>
              <li>Current approval status</li>
            </ul>
          </ol>

          <h4 className="font-semibold text-gray-800 mt-6">Approving Users</h4>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
            <li>Locate the pending user request</li>
            <li>Review the user's information</li>
            <li>Click the "Approve" button (green checkmark)</li>
            <li>Confirm the approval action</li>
            <li>The user will receive notification and can now log in</li>
          </ol>

          <h4 className="font-semibold text-gray-800 mt-6">Rejecting Users</h4>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
            <li>Locate the pending user request</li>
            <li>Click the "Reject" button (red X)</li>
            <li>Optionally enter a rejection reason</li>
            <li>Confirm the rejection</li>
            <li>The user will be notified of the rejection</li>
          </ol>

          <h4 className="font-semibold text-gray-800 mt-6">Status Indicators</h4>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li><strong className="text-yellow-600">Pending:</strong> Awaiting approval decision</li>
            <li><strong className="text-green-600">Approved:</strong> User has system access</li>
            <li><strong className="text-red-600">Rejected:</strong> Access denied</li>
          </ul>

          <h4 className="font-semibold text-gray-800 mt-6">Best Practices</h4>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Verify user identity before approving access</li>
            <li>Check with department managers to confirm employment</li>
            <li>Review pending requests regularly (daily recommended)</li>
            <li>Document rejection reasons for audit trail</li>
            <li>Notify users of approval status via email</li>
          </ul>

          <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-6">
            <p className="text-sm text-red-800">
              <strong>Security:</strong> Only approve users you can verify are authorized warehouse personnel. 
              Unauthorized access can compromise inventory security and data integrity.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: Settings,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Troubleshooting</h3>
          
          <h4 className="font-semibold text-gray-800 mt-6">BLE Connection Issues</h4>
          <div className="space-y-3">
            <div className="bg-gray-50 border-l-4 border-gray-400 p-4">
              <p className="font-semibold text-gray-800">Problem: Cannot detect BLE beacons</p>
              <p className="text-gray-700 mt-2">Solutions:</p>
              <ul className="list-disc list-inside ml-4 text-gray-700 space-y-1 mt-2">
                <li>Ensure Bluetooth is enabled on your device</li>
                <li>Grant browser permissions for Bluetooth access</li>
                <li>Check if beacons have sufficient battery power</li>
                <li>Verify you're within range (typically 10-50 meters)</li>
                <li>Refresh the page and try scanning again</li>
              </ul>
            </div>

            <div className="bg-gray-50 border-l-4 border-gray-400 p-4">
              <p className="font-semibold text-gray-800">Problem: Weak signal strength</p>
              <p className="text-gray-700 mt-2">Solutions:</p>
              <ul className="list-disc list-inside ml-4 text-gray-700 space-y-1 mt-2">
                <li>Move closer to the beacon location</li>
                <li>Check for physical obstructions (metal racks, walls)</li>
                <li>Verify gateway placement and coverage</li>
                <li>Replace beacon battery if level is low</li>
              </ul>
            </div>
          </div>

          <h4 className="font-semibold text-gray-800 mt-6">Login Issues</h4>
          <div className="space-y-3">
            <div className="bg-gray-50 border-l-4 border-gray-400 p-4">
              <p className="font-semibold text-gray-800">Problem: Account not approved</p>
              <p className="text-gray-700 mt-2">Solutions:</p>
              <ul className="list-disc list-inside ml-4 text-gray-700 space-y-1 mt-2">
                <li>Contact your system administrator</li>
                <li>Verify you registered with the correct email</li>
                <li>Wait for approval notification</li>
                <li>Check spam/junk folder for approval emails</li>
              </ul>
            </div>

            <div className="bg-gray-50 border-l-4 border-gray-400 p-4">
              <p className="font-semibold text-gray-800">Problem: Forgot password</p>
              <p className="text-gray-700 mt-2">Solutions:</p>
              <ul className="list-disc list-inside ml-4 text-gray-700 space-y-1 mt-2">
                <li>Click "Forgot Password" on the login page</li>
                <li>Enter your registered email address</li>
                <li>Check your email for password reset link</li>
                <li>Follow the link to create a new password</li>
              </ul>
            </div>
          </div>

          <h4 className="font-semibold text-gray-800 mt-6">Data Sync Issues</h4>
          <div className="space-y-3">
            <div className="bg-gray-50 border-l-4 border-gray-400 p-4">
              <p className="font-semibold text-gray-800">Problem: Changes not saving</p>
              <p className="text-gray-700 mt-2">Solutions:</p>
              <ul className="list-disc list-inside ml-4 text-gray-700 space-y-1 mt-2">
                <li>Check your internet connection</li>
                <li>Verify you have permission to edit the data</li>
                <li>Look for error messages on screen</li>
                <li>Try refreshing the page and re-entering data</li>
                <li>Contact IT support if issue persists</li>
              </ul>
            </div>
          </div>

          <h4 className="font-semibold text-gray-800 mt-6">Performance Issues</h4>
          <div className="space-y-3">
            <div className="bg-gray-50 border-l-4 border-gray-400 p-4">
              <p className="font-semibold text-gray-800">Problem: Slow loading or freezing</p>
              <p className="text-gray-700 mt-2">Solutions:</p>
              <ul className="list-disc list-inside ml-4 text-gray-700 space-y-1 mt-2">
                <li>Clear browser cache and cookies</li>
                <li>Close unnecessary browser tabs</li>
                <li>Check your internet speed</li>
                <li>Try a different browser (Chrome recommended)</li>
                <li>Restart your device</li>
              </ul>
            </div>
          </div>

          <h4 className="font-semibold text-gray-800 mt-6">Getting Help</h4>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
            <p className="text-gray-700">
              If you encounter issues not covered here:
            </p>
            <ul className="list-disc list-inside ml-4 text-gray-700 space-y-1 mt-2">
              <li>Contact your system administrator</li>
              <li>Email: support@wmspro.com</li>
              <li>Phone: 1-800-WMS-HELP</li>
              <li>Include error messages and screenshots when reporting issues</li>
            </ul>
          </div>
        </div>
      ),
    },
  ];

  const filteredSections = sections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.content.toString().toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">User Documentation</h1>
              <p className="text-sm text-gray-600">WMS Pro - Comprehensive User Guide</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documentation..."
            className="pl-10"
          />
        </div>
      </div>

      {/* Documentation Content */}
      <div id="documentation-content" className="print:bg-white">
        <Card className="p-6">
          <div className="space-y-4">
            {filteredSections.map((section) => {
              const Icon = section.icon;
              const isExpanded = expandedSection === section.id;

              return (
                <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-purple-600" />
                      <span className="font-semibold text-gray-800">{section.title}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="p-6 bg-white border-t border-gray-200">
                      {section.content}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filteredSections.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No documentation found matching your search</p>
            </div>
          )}
        </Card>
      </div>

      {/* Footer Information */}
      <Card className="p-6 print:hidden">
        <div className="text-center text-sm text-gray-600">
          <p className="font-semibold text-gray-800 mb-2">WMS Pro User Documentation</p>
          <p>Version 2.0.1 | Last Updated: April 13, 2026</p>
          <p className="mt-2">© 2026 WMS Pro. All rights reserved.</p>
        </div>
      </Card>
    </div>
  );
}
