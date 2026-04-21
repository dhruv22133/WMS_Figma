import { useState } from 'react';
import { Settings, ChevronRight } from 'lucide-react';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ProductCategories } from './master/ProductCategories';
import { UnitsOfMeasure } from './master/UnitsOfMeasure';
import { WarehouseZones } from './master/WarehouseZones';
import { LocationTypes } from './master/LocationTypes';
import { PriorityLevels } from './master/PriorityLevels';
import { Statuses } from './master/Statuses';
import { OrderTypes } from './master/OrderTypes';
import { InspectionTypes } from './master/InspectionTypes';
import { DefectTypes } from './master/DefectTypes';
import { HoldReasons } from './master/HoldReasons';
import { ShippingMethods } from './master/ShippingMethods';
import { Roles } from './master/Roles';
import { SystemConfig } from './master/SystemConfig';
import { BLEGateways } from './master/BLEGateways';

export function MasterDataManagement() {
  const [activeCategory, setActiveCategory] = useState('products');

  const categories = [
    {
      id: 'products',
      label: 'Products & Inventory',
      icon: '📦',
      items: [
        { id: 'categories', label: 'Product Categories', component: ProductCategories },
        { id: 'uom', label: 'Units of Measure', component: UnitsOfMeasure },
      ]
    },
    {
      id: 'warehouse',
      label: 'Warehouse',
      icon: '🏭',
      items: [
        { id: 'zones', label: 'Warehouse Zones', component: WarehouseZones },
        { id: 'locations', label: 'Location Types', component: LocationTypes },
      ]
    },
    {
      id: 'ble',
      label: 'BLE Infrastructure',
      icon: '📡',
      items: [
        { id: 'gateways', label: 'BLE Gateways', component: BLEGateways },
      ]
    },
    {
      id: 'workflow',
      label: 'Workflow',
      icon: '⚙️',
      items: [
        { id: 'priorities', label: 'Priority Levels', component: PriorityLevels },
        { id: 'statuses', label: 'Statuses', component: Statuses },
        { id: 'order-types', label: 'Order Types', component: OrderTypes },
      ]
    },
    {
      id: 'quality',
      label: 'Quality Control',
      icon: '✅',
      items: [
        { id: 'inspections', label: 'Inspection Types', component: InspectionTypes },
        { id: 'defects', label: 'Defect Types', component: DefectTypes },
        { id: 'holds', label: 'Hold Reasons', component: HoldReasons },
      ]
    },
    {
      id: 'shipping',
      label: 'Shipping',
      icon: '🚚',
      items: [
        { id: 'methods', label: 'Shipping Methods', component: ShippingMethods },
      ]
    },
    {
      id: 'system',
      label: 'System',
      icon: '🔧',
      items: [
        { id: 'roles', label: 'Roles & Permissions', component: Roles },
        { id: 'config', label: 'System Configuration', component: SystemConfig },
      ]
    }
  ];

  const [activeTab, setActiveTab] = useState(categories[0].items[0].id);
  const ActiveComponent = categories
    .flatMap(cat => cat.items)
    .find(item => item.id === activeTab)?.component || ProductCategories;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Settings className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Master Data Management</h1>
            <p className="text-gray-600">Configure system reference data and lookup tables</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <div className="space-y-6">
              {categories.map((category) => (
                <div key={category.id}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{category.icon}</span>
                    <h3 className="font-semibold text-gray-900">{category.label}</h3>
                  </div>
                  <div className="space-y-1 ml-1">
                    {category.items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition ${
                          activeTab === item.id
                            ? 'bg-purple-50 text-purple-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <span>{item.label}</span>
                        {activeTab === item.id && <ChevronRight className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
}