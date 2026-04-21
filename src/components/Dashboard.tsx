import { ArrowDownToLine, ArrowUpFromLine, Package, MapPin, ClipboardCheck, Bluetooth, AlertTriangle, TrendingUp, Activity } from 'lucide-react';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const stats = [
    { label: 'Total Items', value: '2,847', change: '+12%', icon: Package, color: 'blue' },
    { label: 'Active Beacons', value: '156', change: '+5', icon: Bluetooth, color: 'purple' },
    { label: 'Pending QC', value: '23', change: '-8', icon: ClipboardCheck, color: 'orange' },
    { label: 'Locations Used', value: '89%', change: '+3%', icon: MapPin, color: 'green' },
  ];

  const recentActivity = [
    { type: 'put-away', item: 'Industrial Bearing Set', location: 'WH-A-B2-12-R3-B05', time: '5 min ago', beacon: 'BLE-A8F3C2E1' },
    { type: 'take-away', item: 'Hydraulic Pump', location: 'WH-B-C1-08-R2-B12', time: '12 min ago', beacon: 'BLE-7D2E9B4F' },
    { type: 'qc-pass', item: 'Electric Motor 3HP', location: 'QC-Station-2', time: '18 min ago', beacon: 'BLE-F1A5D8C3' },
    { type: 'put-away', item: 'Steel Cable 50m', location: 'WH-C-A1-15-R1-B08', time: '25 min ago', beacon: 'BLE-B9E4F7A2' },
    { type: 'qc-hold', item: 'Valve Assembly', location: 'HOLD-Area-3', time: '32 min ago', beacon: 'BLE-C3D8E1F4' },
  ];

  const alerts = [
    { message: 'Low stock alert: Bearing Set XY-450', severity: 'warning', time: '1 hour ago' },
    { message: 'Beacon BLE-A1B2C3D4 weak signal detected', severity: 'info', time: '2 hours ago' },
    { message: 'QC inspection overdue for 3 items', severity: 'error', time: '3 hours ago' },
  ];

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'put-away': return 'bg-blue-100 text-blue-700';
      case 'take-away': return 'bg-green-100 text-green-700';
      case 'qc-pass': return 'bg-emerald-100 text-emerald-700';
      case 'qc-hold': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getActivityLabel = (type: string) => {
    switch (type) {
      case 'put-away': return 'Put-Away';
      case 'take-away': return 'Take-Away';
      case 'qc-pass': return 'QC Passed';
      case 'qc-hold': return 'QC Hold';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = stat.change.startsWith('+');
          
          return (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <div className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'} flex items-center gap-1`}>
                  {isPositive ? '↑' : '↓'} {stat.change}
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => onNavigate('put-away')}
            className="p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition group"
          >
            <ArrowDownToLine className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-sm font-medium text-gray-800">Put-Away</div>
          </button>
          <button
            onClick={() => onNavigate('take-away')}
            className="p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 transition group"
          >
            <ArrowUpFromLine className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-sm font-medium text-gray-800">Take-Away</div>
          </button>
          <button
            onClick={() => onNavigate('quality-control')}
            className="p-4 border-2 border-orange-200 rounded-lg hover:bg-orange-50 transition group"
          >
            <ClipboardCheck className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <div className="text-sm font-medium text-gray-800">Quality Control</div>
          </button>
          <button
            onClick={() => onNavigate('ble-tracking')}
            className="p-4 border-2 border-purple-200 rounded-lg hover:bg-purple-50 transition group"
          >
            <Bluetooth className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="text-sm font-medium text-gray-800">BLE Tracking</div>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Activity className="w-5 h-5 text-gray-600" />
              Recent Activity
            </h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
                <div className={`px-2 py-1 rounded text-xs font-medium ${getActivityColor(activity.type)} mt-0.5`}>
                  {getActivityLabel(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-800 mb-1">{activity.item}</div>
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {activity.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bluetooth className="w-3 h-3" />
                      {activity.beacon}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 whitespace-nowrap">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              Alerts
            </h2>
            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">3</span>
          </div>
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border-l-4 ${
                  alert.severity === 'error'
                    ? 'bg-red-50 border-red-500'
                    : alert.severity === 'warning'
                    ? 'bg-orange-50 border-orange-500'
                    : 'bg-blue-50 border-blue-500'
                }`}
              >
                <div className="text-sm font-medium text-gray-800 mb-1">{alert.message}</div>
                <div className="text-xs text-gray-600">{alert.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Warehouse Capacity Chart */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-gray-600" />
          Warehouse Capacity Overview
        </h2>
        <div className="space-y-4">
          {[
            { warehouse: 'WH-A', used: 245, total: 300, color: 'blue' },
            { warehouse: 'WH-B', used: 189, total: 250, color: 'green' },
            { warehouse: 'WH-C', used: 156, total: 200, color: 'purple' },
            { warehouse: 'WH-D', used: 92, total: 150, color: 'orange' },
          ].map((wh, index) => {
            const percentage = Math.round((wh.used / wh.total) * 100);
            return (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-800">{wh.warehouse}</span>
                  <span className="text-sm text-gray-600">
                    {wh.used} / {wh.total} bins ({percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`bg-${wh.color}-600 h-2.5 rounded-full transition-all`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
