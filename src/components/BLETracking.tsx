import { useState } from 'react';
import { Bluetooth, Signal, MapPin, Package, Search, Filter, Scan, Radio } from 'lucide-react';
import { toast } from 'sonner';

interface Beacon {
  id: string;
  macAddress: string;
  signalStrength: number;
  productName: string;
  location: string;
  status: 'active' | 'weak' | 'offline';
  lastSeen: string;
  battery: number;
}

export function BLETracking() {
  const [isScanning, setIsScanning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'weak' | 'offline'>('all');
  const [beacons, setBeacons] = useState<Beacon[]>([
    {
      id: 'BLE-A8F3C2E1',
      macAddress: 'A8:F3:C2:E1:4D:7B',
      signalStrength: -45,
      productName: 'Industrial Bearing Set',
      location: 'WH-A-B2-12-R3-B05',
      status: 'active',
      lastSeen: 'Just now',
      battery: 87,
    },
    {
      id: 'BLE-7D2E9B4F',
      macAddress: '7D:2E:9B:4F:1A:C5',
      signalStrength: -68,
      productName: 'Hydraulic Pump',
      location: 'WH-B-C1-08-R2-B12',
      status: 'weak',
      lastSeen: '2 min ago',
      battery: 45,
    },
    {
      id: 'BLE-F1A5D8C3',
      macAddress: 'F1:A5:D8:C3:6E:2B',
      signalStrength: -52,
      productName: 'Electric Motor 3HP',
      location: 'WH-A-A1-05-R1-B03',
      status: 'active',
      lastSeen: 'Just now',
      battery: 92,
    },
    {
      id: 'BLE-B9E4F7A2',
      macAddress: 'B9:E4:F7:A2:3C:8D',
      signalStrength: -38,
      productName: 'Steel Cable 50m',
      location: 'WH-C-A1-15-R1-B08',
      status: 'active',
      lastSeen: 'Just now',
      battery: 78,
    },
    {
      id: 'BLE-C3D8E1F4',
      macAddress: 'C3:D8:E1:F4:5A:9B',
      signalStrength: -95,
      productName: 'Valve Assembly',
      location: 'HOLD-Area-3',
      status: 'offline',
      lastSeen: '15 min ago',
      battery: 12,
    },
    {
      id: 'BLE-E5B7F2A9',
      macAddress: 'E5:B7:F2:A9:1D:4C',
      signalStrength: -55,
      productName: 'Pneumatic Cylinder',
      location: 'WH-B-B3-10-R4-B15',
      status: 'active',
      lastSeen: '1 min ago',
      battery: 65,
    },
  ]);

  const handleScan = () => {
    setIsScanning(true);
    toast.info('Scanning for BLE beacons...');
    
    setTimeout(() => {
      // Simulate updating signal strengths
      setBeacons(prev => prev.map(beacon => ({
        ...beacon,
        signalStrength: -Math.floor(Math.random() * 60 + 35),
        lastSeen: 'Just now',
      })));
      setIsScanning(false);
      toast.success('Scan complete! Found ' + beacons.length + ' beacons');
    }, 2000);
  };

  const getSignalColor = (strength: number) => {
    if (strength > -50) return 'text-green-600';
    if (strength > -70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSignalBars = (strength: number) => {
    if (strength > -50) return 4;
    if (strength > -60) return 3;
    if (strength > -70) return 2;
    return 1;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'weak': return 'bg-yellow-100 text-yellow-700';
      case 'offline': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getBatteryColor = (battery: number) => {
    if (battery > 50) return 'bg-green-500';
    if (battery > 20) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const filteredBeacons = beacons.filter(beacon => {
    const matchesSearch = beacon.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         beacon.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         beacon.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || beacon.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const statusCounts = {
    all: beacons.length,
    active: beacons.filter(b => b.status === 'active').length,
    weak: beacons.filter(b => b.status === 'weak').length,
    offline: beacons.filter(b => b.status === 'offline').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Bluetooth className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">BLE Beacon Tracking</h1>
              <p className="text-sm text-gray-600">Monitor all active beacons in real-time</p>
            </div>
          </div>
          <button
            onClick={handleScan}
            disabled={isScanning}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2 disabled:bg-gray-400 font-medium"
          >
            <Scan className={`w-5 h-5 ${isScanning ? 'animate-pulse' : ''}`} />
            {isScanning ? 'Scanning...' : 'Scan Beacons'}
          </button>
        </div>

        {/* Status Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setFilterStatus('all')}
            className={`p-4 rounded-lg border-2 transition ${
              filterStatus === 'all' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-2xl font-bold text-gray-800">{statusCounts.all}</div>
            <div className="text-sm text-gray-600">Total Beacons</div>
          </button>
          <button
            onClick={() => setFilterStatus('active')}
            className={`p-4 rounded-lg border-2 transition ${
              filterStatus === 'active' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-2xl font-bold text-green-600">{statusCounts.active}</div>
            <div className="text-sm text-gray-600">Active</div>
          </button>
          <button
            onClick={() => setFilterStatus('weak')}
            className={`p-4 rounded-lg border-2 transition ${
              filterStatus === 'weak' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-2xl font-bold text-yellow-600">{statusCounts.weak}</div>
            <div className="text-sm text-gray-600">Weak Signal</div>
          </button>
          <button
            onClick={() => setFilterStatus('offline')}
            className={`p-4 rounded-lg border-2 transition ${
              filterStatus === 'offline' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-2xl font-bold text-red-600">{statusCounts.offline}</div>
            <div className="text-sm text-gray-600">Offline</div>
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by beacon ID, product, or location..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Beacon List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Beacon ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Signal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Battery</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Last Seen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBeacons.map((beacon) => (
                <tr key={beacon.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Radio className="w-4 h-4 text-purple-600" />
                      <div>
                        <div className="font-mono font-medium text-gray-800">{beacon.id}</div>
                        <div className="text-xs text-gray-500 font-mono">{beacon.macAddress}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-800">{beacon.productName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="font-mono text-sm text-gray-600">{beacon.location}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4].map((bar) => (
                          <div
                            key={bar}
                            className={`w-1 rounded-sm ${
                              bar <= getSignalBars(beacon.signalStrength)
                                ? getSignalColor(beacon.signalStrength).replace('text-', 'bg-')
                                : 'bg-gray-300'
                            }`}
                            style={{ height: `${bar * 4 + 4}px` }}
                          ></div>
                        ))}
                      </div>
                      <span className={`font-mono text-sm font-medium ${getSignalColor(beacon.signalStrength)}`}>
                        {beacon.signalStrength} dBm
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(beacon.status)}`}>
                      {beacon.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getBatteryColor(beacon.battery)}`}
                          style={{ width: `${beacon.battery}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{beacon.battery}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{beacon.lastSeen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBeacons.length === 0 && (
          <div className="text-center py-12">
            <Bluetooth className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No beacons found</p>
          </div>
        )}
      </div>
    </div>
  );
}
