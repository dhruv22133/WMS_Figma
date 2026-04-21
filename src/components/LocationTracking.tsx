import { useState } from 'react';
import { MapPin, Package, Search, Building2, Grid3x3, ChevronDown, ChevronUp, Layers, Map, List, Radio, X } from 'lucide-react';

interface LocationItem {
  beaconId: string;
  productName: string;
  quantity: number;
  lastUpdated: string;
}

interface Location {
  id: string;
  warehouse: string;
  zone: string;
  aisle: string;
  rack: string;
  bin: string;
  capacity: number;
  items: LocationItem[];
  x?: number; // Map coordinates
  y?: number;
}

export function LocationTracking() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('all');
  const [expandedLocation, setExpandedLocation] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('map');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const locations: Location[] = [
    {
      id: 'WH-A-B2-12-R3-B05',
      warehouse: 'WH-A',
      zone: 'B2',
      aisle: '12',
      rack: 'R3',
      bin: 'B05',
      capacity: 4,
      items: [
        { beaconId: 'BLE-A8F3C2E1', productName: 'Industrial Bearing Set', quantity: 25, lastUpdated: '5 min ago' },
      ],
      x: 100,
      y: 100,
    },
    {
      id: 'WH-B-C1-08-R2-B12',
      warehouse: 'WH-B',
      zone: 'C1',
      aisle: '08',
      rack: 'R2',
      bin: 'B12',
      capacity: 3,
      items: [
        { beaconId: 'BLE-7D2E9B4F', productName: 'Hydraulic Pump', quantity: 8, lastUpdated: '12 min ago' },
      ],
      x: 200,
      y: 100,
    },
    {
      id: 'WH-A-A1-05-R1-B03',
      warehouse: 'WH-A',
      zone: 'A1',
      aisle: '05',
      rack: 'R1',
      bin: 'B03',
      capacity: 5,
      items: [
        { beaconId: 'BLE-F1A5D8C3', productName: 'Electric Motor 3HP', quantity: 12, lastUpdated: '18 min ago' },
        { beaconId: 'BLE-D4E7B1A5', productName: 'Gear Assembly', quantity: 30, lastUpdated: '1 hour ago' },
      ],
      x: 150,
      y: 150,
    },
    {
      id: 'WH-C-A1-15-R1-B08',
      warehouse: 'WH-C',
      zone: 'A1',
      aisle: '15',
      rack: 'R1',
      bin: 'B08',
      capacity: 6,
      items: [
        { beaconId: 'BLE-B9E4F7A2', productName: 'Steel Cable 50m', quantity: 15, lastUpdated: '25 min ago' },
      ],
      x: 250,
      y: 150,
    },
    {
      id: 'WH-B-B3-10-R4-B15',
      warehouse: 'WH-B',
      zone: 'B3',
      aisle: '10',
      rack: 'R4',
      bin: 'B15',
      capacity: 4,
      items: [
        { beaconId: 'BLE-E5B7F2A9', productName: 'Pneumatic Cylinder', quantity: 6, lastUpdated: '1 min ago' },
      ],
      x: 300,
      y: 100,
    },
    {
      id: 'WH-A-C2-18-R2-B10',
      warehouse: 'WH-A',
      zone: 'C2',
      aisle: '18',
      rack: 'R2',
      bin: 'B10',
      capacity: 4,
      items: [],
      x: 350,
      y: 100,
    },
    {
      id: 'WH-D-A1-03-R1-B01',
      warehouse: 'WH-D',
      zone: 'A1',
      aisle: '03',
      rack: 'R1',
      bin: 'B01',
      capacity: 3,
      items: [
        { beaconId: 'BLE-C8F3A1D9', productName: 'Control Panel', quantity: 5, lastUpdated: '2 hours ago' },
        { beaconId: 'BLE-A1E9D4B7', productName: 'Circuit Breaker', quantity: 20, lastUpdated: '3 hours ago' },
        { beaconId: 'BLE-F2C5B8E3', productName: 'Relay Module', quantity: 45, lastUpdated: '4 hours ago' },
      ],
      x: 400,
      y: 100,
    },
  ];

  const warehouses = ['all', 'WH-A', 'WH-B', 'WH-C', 'WH-D'];

  const filteredLocations = locations.filter(location => {
    const matchesSearch = location.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         location.items.some(item => 
                           item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.beaconId.toLowerCase().includes(searchQuery.toLowerCase())
                         );
    const matchesWarehouse = selectedWarehouse === 'all' || location.warehouse === selectedWarehouse;
    return matchesSearch && matchesWarehouse;
  });

  const getUtilization = (location: Location) => {
    return Math.round((location.items.length / location.capacity) * 100);
  };

  const getUtilizationColor = (percentage: number) => {
    if (percentage === 0) return 'bg-gray-300';
    if (percentage < 60) return 'bg-green-500';
    if (percentage < 90) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const warehouseStats = warehouses.slice(1).map(wh => {
    const whLocations = locations.filter(l => l.warehouse === wh);
    const totalCapacity = whLocations.reduce((sum, l) => sum + l.capacity, 0);
    const usedSlots = whLocations.reduce((sum, l) => sum + l.items.length, 0);
    const utilization = Math.round((usedSlots / totalCapacity) * 100);
    
    return { warehouse: wh, totalCapacity, usedSlots, utilization };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <MapPin className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Location Tracking</h1>
            <p className="text-sm text-gray-600">Monitor warehouse locations and inventory placement</p>
          </div>
        </div>

        {/* Warehouse Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {warehouseStats.map((stat) => (
            <div key={stat.warehouse} className="p-4 bg-slate-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-800">{stat.warehouse}</span>
                <Building2 className="w-4 h-4 text-gray-400" />
              </div>
              <div className="text-sm text-gray-600 mb-2">
                {stat.usedSlots} / {stat.totalCapacity} slots
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getUtilizationColor(stat.utilization)}`}
                  style={{ width: `${stat.utilization}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">{stat.utilization}% utilized</div>
            </div>
          ))}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by location, product, or beacon ID..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            />
          </div>
          <select
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
          >
            {warehouses.map((wh) => (
              <option key={wh} value={wh}>
                {wh === 'all' ? 'All Warehouses' : wh}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition ${
              viewMode === 'map' 
                ? 'bg-green-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Map className="w-5 h-5" />
            <span className="font-medium">Map View</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition ${
              viewMode === 'list' 
                ? 'bg-green-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <List className="w-5 h-5" />
            <span className="font-medium">List View</span>
          </button>
        </div>
      </div>

      {/* Locations List */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {filteredLocations.map((location) => {
            const utilization = getUtilization(location);
            const isExpanded = expandedLocation === location.id;
            
            return (
              <div key={location.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                <button
                  onClick={() => setExpandedLocation(isExpanded ? null : location.id)}
                  className="w-full p-5 flex items-center justify-between hover:bg-slate-50 transition"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-green-600" />
                    </div>
                    
                    <div className="flex-1 text-left">
                      <div className="font-mono font-bold text-gray-800 mb-1">{location.id}</div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5" />
                          {location.warehouse}
                        </span>
                        <span className="flex items-center gap-1">
                          <Grid3x3 className="w-3.5 h-3.5" />
                          Zone {location.zone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5" />
                          Aisle {location.aisle}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-800 mb-1">
                        {location.items.length} / {location.capacity} items
                      </div>
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getUtilizationColor(utilization)}`}
                          style={{ width: `${utilization}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="ml-4">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-gray-200 bg-slate-50 p-5">
                    {location.items.length > 0 ? (
                      <div className="space-y-3">
                        <h3 className="font-semibold text-gray-800 mb-3">Stored Items:</h3>
                        {location.items.map((item, index) => (
                          <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 flex-1">
                                <Package className="w-5 h-5 text-green-600" />
                                <div className="flex-1">
                                  <div className="font-medium text-gray-800 mb-1">{item.productName}</div>
                                  <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <span className="font-mono">{item.beaconId}</span>
                                    <span>Qty: {item.quantity}</span>
                                    <span className="text-gray-500">Updated {item.lastUpdated}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500">Empty location - Available for storage</p>
                        <p className="text-sm text-gray-400 mt-1">Capacity: {location.capacity} items</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {filteredLocations.length === 0 && (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No locations found</p>
            </div>
          )}
        </div>
      )}

      {/* Locations Map */}
      {viewMode === 'map' && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Map Legend */}
          <div className="p-4 border-b border-gray-200 bg-slate-50">
            <h3 className="font-semibold text-gray-800 mb-3">Map Legend</h3>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                <span className="text-gray-600">Empty (0%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span className="text-gray-600">Low (&lt;60%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                <span className="text-gray-600">Medium (60-90%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span className="text-gray-600">High (&gt;90%)</span>
              </div>
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-blue-600" />
                <span className="text-gray-600">BLE Gateway</span>
              </div>
            </div>
          </div>

          {/* Warehouse Map */}
          <div className="p-4">
            <div className="bg-slate-100 rounded-lg p-6 border-2 border-slate-300 relative" style={{ height: '600px' }}>
              {/* Warehouse zones */}
              <div className="absolute top-4 left-4 right-4 bottom-4 grid grid-cols-4 gap-4">
                {/* Zone A */}
                <div className="border-2 border-blue-400 bg-blue-50 rounded-lg p-3 relative">
                  <div className="text-xs font-bold text-blue-800 mb-2">Zone A - Storage</div>
                  <div className="space-y-2">
                    {filteredLocations
                      .filter(l => l.zone === 'A1' || l.zone === 'A2')
                      .map((location) => {
                        const utilization = getUtilization(location);
                        const color = 
                          utilization === 0 ? '#D1D5DB' :
                          utilization < 60 ? '#10B981' :
                          utilization < 90 ? '#F59E0B' : '#EF4444';
                        
                        return (
                          <button
                            key={location.id}
                            onClick={() => setSelectedLocation(location.id)}
                            className="w-full flex items-center gap-2 p-2 bg-white rounded border hover:shadow-md transition group"
                            title={location.id}
                          >
                            <div 
                              className="w-3 h-3 rounded-full flex-shrink-0" 
                              style={{ backgroundColor: color }}
                            ></div>
                            <div className="flex-1 text-left min-w-0">
                              <div className="text-xs font-mono text-gray-800 truncate group-hover:text-blue-600">
                                {location.aisle}-{location.rack}-{location.bin}
                              </div>
                              <div className="text-xs text-gray-500">
                                {location.items.length}/{location.capacity}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                  </div>
                  {/* BLE Gateway indicator */}
                  <div className="absolute bottom-2 right-2">
                    <Radio className="w-5 h-5 text-blue-600" />
                  </div>
                </div>

                {/* Zone B */}
                <div className="border-2 border-purple-400 bg-purple-50 rounded-lg p-3 relative">
                  <div className="text-xs font-bold text-purple-800 mb-2">Zone B - Storage</div>
                  <div className="space-y-2">
                    {filteredLocations
                      .filter(l => l.zone === 'B2' || l.zone === 'B3')
                      .map((location) => {
                        const utilization = getUtilization(location);
                        const color = 
                          utilization === 0 ? '#D1D5DB' :
                          utilization < 60 ? '#10B981' :
                          utilization < 90 ? '#F59E0B' : '#EF4444';
                        
                        return (
                          <button
                            key={location.id}
                            onClick={() => setSelectedLocation(location.id)}
                            className="w-full flex items-center gap-2 p-2 bg-white rounded border hover:shadow-md transition group"
                            title={location.id}
                          >
                            <div 
                              className="w-3 h-3 rounded-full flex-shrink-0" 
                              style={{ backgroundColor: color }}
                            ></div>
                            <div className="flex-1 text-left min-w-0">
                              <div className="text-xs font-mono text-gray-800 truncate group-hover:text-purple-600">
                                {location.aisle}-{location.rack}-{location.bin}
                              </div>
                              <div className="text-xs text-gray-500">
                                {location.items.length}/{location.capacity}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                  </div>
                  {/* BLE Gateway indicator */}
                  <div className="absolute bottom-2 right-2">
                    <Radio className="w-5 h-5 text-blue-600" />
                  </div>
                </div>

                {/* Zone C */}
                <div className="border-2 border-orange-400 bg-orange-50 rounded-lg p-3 relative">
                  <div className="text-xs font-bold text-orange-800 mb-2">Zone C - Picking</div>
                  <div className="space-y-2">
                    {filteredLocations
                      .filter(l => l.zone === 'C1' || l.zone === 'C2')
                      .map((location) => {
                        const utilization = getUtilization(location);
                        const color = 
                          utilization === 0 ? '#D1D5DB' :
                          utilization < 60 ? '#10B981' :
                          utilization < 90 ? '#F59E0B' : '#EF4444';
                        
                        return (
                          <button
                            key={location.id}
                            onClick={() => setSelectedLocation(location.id)}
                            className="w-full flex items-center gap-2 p-2 bg-white rounded border hover:shadow-md transition group"
                            title={location.id}
                          >
                            <div 
                              className="w-3 h-3 rounded-full flex-shrink-0" 
                              style={{ backgroundColor: color }}
                            ></div>
                            <div className="flex-1 text-left min-w-0">
                              <div className="text-xs font-mono text-gray-800 truncate group-hover:text-orange-600">
                                {location.aisle}-{location.rack}-{location.bin}
                              </div>
                              <div className="text-xs text-gray-500">
                                {location.items.length}/{location.capacity}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                  </div>
                  {/* BLE Gateway indicator */}
                  <div className="absolute bottom-2 right-2">
                    <Radio className="w-5 h-5 text-blue-600" />
                  </div>
                </div>

                {/* Receiving/Shipping Area */}
                <div className="border-2 border-green-400 bg-green-50 rounded-lg p-3 relative">
                  <div className="text-xs font-bold text-green-800 mb-2">Receiving/Shipping</div>
                  <div className="space-y-2">
                    {filteredLocations
                      .filter(l => !['A1', 'A2', 'B2', 'B3', 'C1', 'C2'].includes(l.zone))
                      .map((location) => {
                        const utilization = getUtilization(location);
                        const color = 
                          utilization === 0 ? '#D1D5DB' :
                          utilization < 60 ? '#10B981' :
                          utilization < 90 ? '#F59E0B' : '#EF4444';
                        
                        return (
                          <button
                            key={location.id}
                            onClick={() => setSelectedLocation(location.id)}
                            className="w-full flex items-center gap-2 p-2 bg-white rounded border hover:shadow-md transition group"
                            title={location.id}
                          >
                            <div 
                              className="w-3 h-3 rounded-full flex-shrink-0" 
                              style={{ backgroundColor: color }}
                            ></div>
                            <div className="flex-1 text-left min-w-0">
                              <div className="text-xs font-mono text-gray-800 truncate group-hover:text-green-600">
                                {location.aisle}-{location.rack}-{location.bin}
                              </div>
                              <div className="text-xs text-gray-500">
                                {location.items.length}/{location.capacity}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                  </div>
                  {/* BLE Gateway indicator */}
                  <div className="absolute bottom-2 right-2">
                    <Radio className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </div>

              {/* Warehouse label */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                Warehouse Floor Plan
              </div>
            </div>
          </div>

          {/* Location Details Modal */}
          {selectedLocation && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-500 to-green-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">Location Details</h2>
                        <p className="text-green-100 text-sm font-mono">
                          {selectedLocation}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedLocation(null)}
                      className="w-8 h-8 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg flex items-center justify-center transition"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {(() => {
                    const location = locations.find(l => l.id === selectedLocation);
                    if (!location) return null;

                    const utilization = getUtilization(location);

                    return (
                      <>
                        {/* Location Info */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                          <div className="p-3 bg-slate-50 rounded-lg border border-gray-200">
                            <div className="text-xs text-gray-500 mb-1">Warehouse</div>
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-gray-600" />
                              <span className="font-semibold text-gray-800">{location.warehouse}</span>
                            </div>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-lg border border-gray-200">
                            <div className="text-xs text-gray-500 mb-1">Zone</div>
                            <div className="flex items-center gap-2">
                              <Grid3x3 className="w-4 h-4 text-gray-600" />
                              <span className="font-semibold text-gray-800">{location.zone}</span>
                            </div>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-lg border border-gray-200">
                            <div className="text-xs text-gray-500 mb-1">Aisle</div>
                            <div className="flex items-center gap-2">
                              <Layers className="w-4 h-4 text-gray-600" />
                              <span className="font-semibold text-gray-800">{location.aisle}</span>
                            </div>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-lg border border-gray-200">
                            <div className="text-xs text-gray-500 mb-1">Rack-Bin</div>
                            <div className="font-semibold text-gray-800">{location.rack}-{location.bin}</div>
                          </div>
                        </div>

                        {/* Utilization */}
                        <div className="mb-6">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Capacity Utilization</span>
                            <span className="text-sm font-bold text-gray-800">
                              {location.items.length} / {location.capacity} items ({utilization}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className={`h-3 rounded-full ${getUtilizationColor(utilization)}`}
                              style={{ width: `${utilization}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Items */}
                        {location.items.length > 0 ? (
                          <div>
                            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                              <Package className="w-5 h-5 text-green-600" />
                              Stored Items ({location.items.length})
                            </h3>
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                              {location.items.map((item, index) => (
                                <div key={index} className="p-4 bg-slate-50 rounded-lg border border-gray-200">
                                  <div className="font-medium text-gray-800 mb-2">{item.productName}</div>
                                  <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <span className="flex items-center gap-1">
                                      <Radio className="w-3.5 h-3.5" />
                                      <span className="font-mono">{item.beaconId}</span>
                                    </span>
                                    <span className="font-medium">Qty: {item.quantity}</span>
                                    <span className="text-gray-500">• {item.lastUpdated}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8 bg-slate-50 rounded-lg border border-gray-200">
                            <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                            <p className="text-gray-600 font-medium">Empty Location</p>
                            <p className="text-sm text-gray-500 mt-1">Available for storage</p>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>

                <div className="p-4 border-t border-gray-200 bg-slate-50 flex justify-end">
                  <button
                    onClick={() => setSelectedLocation(null)}
                    className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}