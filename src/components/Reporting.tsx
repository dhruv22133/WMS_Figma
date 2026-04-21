import { useState } from 'react';
import { BarChart3, TrendingUp, Package, MapPin, Clock, CheckCircle, AlertTriangle, Download, Calendar, Filter } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

export function Reporting() {
  const [dateRange, setDateRange] = useState('7days');
  const [selectedWarehouse, setSelectedWarehouse] = useState('all');

  // Sample data for warehouse utilization
  const warehouseUtilizationData = [
    { warehouse: 'WH-A', utilized: 75, available: 25 },
    { warehouse: 'WH-B', utilized: 82, available: 18 },
    { warehouse: 'WH-C', utilized: 65, available: 35 },
    { warehouse: 'WH-D', utilized: 90, available: 10 },
  ];

  // Sample data for inventory movement trends
  const inventoryMovementData = [
    { date: 'Mon', putAway: 45, takeAway: 38, total: 83 },
    { date: 'Tue', putAway: 52, takeAway: 41, total: 93 },
    { date: 'Wed', putAway: 48, takeAway: 45, total: 93 },
    { date: 'Thu', putAway: 61, takeAway: 52, total: 113 },
    { date: 'Fri', putAway: 55, takeAway: 48, total: 103 },
    { date: 'Sat', putAway: 38, takeAway: 35, total: 73 },
    { date: 'Sun', putAway: 28, takeAway: 22, total: 50 },
  ];

  // Sample data for zone utilization
  const zoneUtilizationData = [
    { zone: 'Zone A', value: 456, percentage: 78 },
    { zone: 'Zone B', value: 398, percentage: 85 },
    { zone: 'Zone C', value: 287, percentage: 62 },
    { zone: 'Zone D', value: 512, percentage: 92 },
  ];

  // Sample data for quality control
  const qcData = [
    { name: 'Passed', value: 892, color: '#10B981' },
    { name: 'Failed', value: 45, color: '#EF4444' },
    { name: 'On Hold', value: 23, color: '#F59E0B' },
  ];

  // Sample data for performance metrics
  const performanceData = [
    { metric: 'Avg Put-Away Time', value: '12.5 min', trend: '+5%', trendUp: false },
    { metric: 'Avg Take-Away Time', value: '8.3 min', trend: '-12%', trendUp: true },
    { metric: 'QC Pass Rate', value: '92.8%', trend: '+3%', trendUp: true },
    { metric: 'Location Accuracy', value: '98.5%', trend: '+1%', trendUp: true },
  ];

  // Sample data for BLE tracking statistics
  const bleTrackingData = [
    { hour: '00:00', active: 45, total: 156 },
    { hour: '04:00', active: 38, total: 156 },
    { hour: '08:00', active: 128, total: 156 },
    { hour: '12:00', active: 145, total: 156 },
    { hour: '16:00', active: 132, total: 156 },
    { hour: '20:00', active: 98, total: 156 },
  ];

  // Sample data for top products
  const topProductsData = [
    { name: 'Industrial Bearing Set', movements: 145, revenue: '$45,230' },
    { name: 'Hydraulic Pump', movements: 132, revenue: '$38,450' },
    { name: 'Electric Motor 3HP', movements: 128, revenue: '$35,120' },
    { name: 'Steel Cable 50m', movements: 115, revenue: '$28,900' },
    { name: 'Pneumatic Cylinder', movements: 98, revenue: '$25,670' },
  ];

  const handleExport = (reportType: string) => {
    console.log(`Exporting ${reportType} report...`);
    // In a real application, this would trigger a download
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
              <p className="text-sm text-gray-600">Comprehensive warehouse performance insights</p>
            </div>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Date Range</Label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Warehouse</Label>
            <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
              <SelectTrigger>
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Warehouses</SelectItem>
                <SelectItem value="WH-A">Warehouse A</SelectItem>
                <SelectItem value="WH-B">Warehouse B</SelectItem>
                <SelectItem value="WH-C">Warehouse C</SelectItem>
                <SelectItem value="WH-D">Warehouse D</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Report Format</Label>
            <Select defaultValue="interactive">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="interactive">Interactive Dashboard</SelectItem>
                <SelectItem value="pdf">PDF Export</SelectItem>
                <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                <SelectItem value="csv">CSV Data</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {performanceData.map((item, index) => (
          <Card key={index} className="p-5 hover:shadow-lg transition">
            <div className="flex items-start justify-between mb-3">
              <div className="text-sm text-gray-600">{item.metric}</div>
              <Badge variant={item.trendUp ? 'default' : 'secondary'} className={item.trendUp ? 'bg-green-500' : 'bg-red-500'}>
                {item.trend}
              </Badge>
            </div>
            <div className="flex items-end gap-2">
              <div className="text-2xl font-bold text-gray-800">{item.value}</div>
              {item.trendUp ? (
                <TrendingUp className="w-5 h-5 text-green-500 mb-1" />
              ) : (
                <TrendingUp className="w-5 h-5 text-red-500 mb-1 rotate-180" />
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Report Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="ble">BLE Tracking</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Warehouse Utilization */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Warehouse Utilization</h3>
                <Button variant="outline" size="sm" onClick={() => handleExport('warehouse-utilization')}>
                  <Download className="w-4 h-4" />
                </Button>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={warehouseUtilizationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="warehouse" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="utilized" stackId="a" fill="#3B82F6" name="Utilized %" />
                  <Bar dataKey="available" stackId="a" fill="#E5E7EB" name="Available %" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Inventory Movement Trends */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Inventory Movement Trends</h3>
                <Button variant="outline" size="sm" onClick={() => handleExport('movement-trends')}>
                  <Download className="w-4 h-4" />
                </Button>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={inventoryMovementData}>
                  <defs>
                    <linearGradient id="colorPutAway" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorTakeAway" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="putAway" stroke="#3B82F6" fillOpacity={1} fill="url(#colorPutAway)" name="Put-Away" />
                  <Area type="monotone" dataKey="takeAway" stroke="#10B981" fillOpacity={1} fill="url(#colorTakeAway)" name="Take-Away" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Zone Utilization */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Zone Utilization Analysis</h3>
              <Button variant="outline" size="sm" onClick={() => handleExport('zone-utilization')}>
                <Download className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              {zoneUtilizationData.map((zone, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-800">{zone.zone}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-600">{zone.value} items</span>
                      <span className="font-semibold text-gray-800">{zone.percentage}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        zone.percentage >= 90 ? 'bg-red-500' :
                        zone.percentage >= 75 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${zone.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Moving Products */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Top Moving Products</h3>
                <Button variant="outline" size="sm" onClick={() => handleExport('top-products')}>
                  <Download className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-3">
                {topProductsData.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                        index === 0 ? 'bg-yellow-500' :
                        index === 1 ? 'bg-gray-400' :
                        index === 2 ? 'bg-orange-600' :
                        'bg-gray-300'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800 text-sm">{product.name}</div>
                        <div className="text-xs text-gray-500">{product.movements} movements</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">{product.revenue}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Inventory Status Distribution */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Inventory Status</h3>
                <Button variant="outline" size="sm" onClick={() => handleExport('inventory-status')}>
                  <Download className="w-4 h-4" />
                </Button>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={qcData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {qcData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Inventory Age Analysis */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Inventory Age Analysis</h3>
              <Button variant="outline" size="sm" onClick={() => handleExport('inventory-age')}>
                <Download className="w-4 h-4" />
              </Button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { range: '0-7 days', items: 245 },
                { range: '8-14 days', items: 189 },
                { range: '15-30 days', items: 156 },
                { range: '31-60 days', items: 98 },
                { range: '60+ days', items: 42 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="items" fill="#8B5CF6" name="Items Count" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Put-Away Performance */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Put-Away Performance</h3>
                <Button variant="outline" size="sm" onClick={() => handleExport('putaway-performance')}>
                  <Download className="w-4 h-4" />
                </Button>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={[
                  { day: 'Mon', avgTime: 13.2, tasks: 45 },
                  { day: 'Tue', avgTime: 11.8, tasks: 52 },
                  { day: 'Wed', avgTime: 12.5, tasks: 48 },
                  { day: 'Thu', avgTime: 10.9, tasks: 61 },
                  { day: 'Fri', avgTime: 12.1, tasks: 55 },
                  { day: 'Sat', avgTime: 14.5, tasks: 38 },
                  { day: 'Sun', avgTime: 15.2, tasks: 28 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis yAxisId="left" label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
                  <YAxis yAxisId="right" orientation="right" label={{ value: 'Tasks', angle: 90, position: 'insideRight' }} />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="avgTime" stroke="#3B82F6" name="Avg Time (min)" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="tasks" stroke="#10B981" name="Tasks Completed" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Take-Away Performance */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Take-Away Performance</h3>
                <Button variant="outline" size="sm" onClick={() => handleExport('takeaway-performance')}>
                  <Download className="w-4 h-4" />
                </Button>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={[
                  { day: 'Mon', avgTime: 9.2, orders: 38 },
                  { day: 'Tue', avgTime: 8.1, orders: 41 },
                  { day: 'Wed', avgTime: 7.8, orders: 45 },
                  { day: 'Thu', avgTime: 7.5, orders: 52 },
                  { day: 'Fri', avgTime: 8.3, orders: 48 },
                  { day: 'Sat', avgTime: 9.8, orders: 35 },
                  { day: 'Sun', avgTime: 10.5, orders: 22 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis yAxisId="left" label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
                  <YAxis yAxisId="right" orientation="right" label={{ value: 'Orders', angle: 90, position: 'insideRight' }} />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="avgTime" stroke="#F59E0B" name="Avg Time (min)" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#8B5CF6" name="Orders Completed" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Operator Performance */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Operator Performance Rankings</h3>
              <Button variant="outline" size="sm" onClick={() => handleExport('operator-performance')}>
                <Download className="w-4 h-4" />
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Rank</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Operator</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Tasks Completed</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Avg Time</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Accuracy</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { rank: 1, name: 'John Smith', tasks: 256, avgTime: '8.2 min', accuracy: '99.2%', rating: 5 },
                    { rank: 2, name: 'Maria Garcia', tasks: 243, avgTime: '8.5 min', accuracy: '98.8%', rating: 5 },
                    { rank: 3, name: 'David Chen', tasks: 238, avgTime: '8.9 min', accuracy: '98.5%', rating: 5 },
                    { rank: 4, name: 'Sarah Johnson', tasks: 225, avgTime: '9.1 min', accuracy: '98.1%', rating: 4 },
                    { rank: 5, name: 'Mike Wilson', tasks: 218, avgTime: '9.4 min', accuracy: '97.8%', rating: 4 },
                  ].map((operator) => (
                    <tr key={operator.rank} className="border-b border-gray-100 hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <Badge variant={operator.rank === 1 ? 'default' : 'secondary'} className={operator.rank === 1 ? 'bg-yellow-500' : ''}>
                          #{operator.rank}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-800">{operator.name}</td>
                      <td className="py-3 px-4 text-gray-600">{operator.tasks}</td>
                      <td className="py-3 px-4 text-gray-600">{operator.avgTime}</td>
                      <td className="py-3 px-4">
                        <span className="text-green-600 font-medium">{operator.accuracy}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: operator.rating }).map((_, i) => (
                            <span key={i} className="text-yellow-500">★</span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Quality Tab */}
        <TabsContent value="quality" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* QC Inspection Results */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">QC Inspection Results</h3>
                <Button variant="outline" size="sm" onClick={() => handleExport('qc-results')}>
                  <Download className="w-4 h-4" />
                </Button>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[
                  { type: 'Visual', passed: 145, failed: 8 },
                  { type: 'Dimensional', passed: 132, failed: 12 },
                  { type: 'Functional', passed: 128, failed: 6 },
                  { type: 'Packaging', passed: 156, failed: 4 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="passed" fill="#10B981" name="Passed" />
                  <Bar dataKey="failed" fill="#EF4444" name="Failed" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Defect Analysis */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Top Defect Types</h3>
                <Button variant="outline" size="sm" onClick={() => handleExport('defect-analysis')}>
                  <Download className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-3">
                {[
                  { type: 'Damaged Packaging', count: 18, percentage: 40 },
                  { type: 'Incorrect Labeling', count: 12, percentage: 27 },
                  { type: 'Dimension Out of Spec', count: 8, percentage: 18 },
                  { type: 'Surface Defects', count: 5, percentage: 11 },
                  { type: 'Other', count: 2, percentage: 4 },
                ].map((defect, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-800">{defect.type}</span>
                      <span className="text-gray-600">{defect.count} cases</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-red-500"
                        style={{ width: `${defect.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* QC Trend Over Time */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Quality Trend Over Time</h3>
              <Button variant="outline" size="sm" onClick={() => handleExport('quality-trend')}>
                <Download className="w-4 h-4" />
              </Button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={[
                { week: 'Week 1', passRate: 89.5, inspections: 245 },
                { week: 'Week 2', passRate: 91.2, inspections: 268 },
                { week: 'Week 3', passRate: 90.8, inspections: 252 },
                { week: 'Week 4', passRate: 92.8, inspections: 289 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis yAxisId="left" domain={[85, 95]} label={{ value: 'Pass Rate %', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" label={{ value: 'Inspections', angle: 90, position: 'insideRight' }} />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="passRate" stroke="#10B981" name="Pass Rate %" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="inspections" stroke="#3B82F6" name="Total Inspections" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        {/* BLE Tracking Tab */}
        <TabsContent value="ble" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* BLE Beacon Activity */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">BLE Beacon Activity (24h)</h3>
                <Button variant="outline" size="sm" onClick={() => handleExport('ble-activity')}>
                  <Download className="w-4 h-4" />
                </Button>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={bleTrackingData}>
                  <defs>
                    <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="active" stroke="#3B82F6" fillOpacity={1} fill="url(#colorActive)" name="Active Beacons" />
                  <Line type="monotone" dataKey="total" stroke="#94A3B8" strokeDasharray="5 5" name="Total Beacons" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            {/* Gateway Performance */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Gateway Performance</h3>
                <Button variant="outline" size="sm" onClick={() => handleExport('gateway-performance')}>
                  <Download className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-4">
                {[
                  { gateway: 'GW-001', zone: 'Zone A', uptime: 99.8, scans: 12456, status: 'online' },
                  { gateway: 'GW-002', zone: 'Zone B', uptime: 99.5, scans: 11892, status: 'online' },
                  { gateway: 'GW-003', zone: 'Zone C', uptime: 98.2, scans: 9834, status: 'online' },
                  { gateway: 'GW-004', zone: 'Zone D', uptime: 95.5, scans: 8567, status: 'warning' },
                ].map((gw, index) => (
                  <div key={index} className="p-4 bg-slate-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${gw.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                        <div>
                          <div className="font-medium text-gray-800">{gw.gateway}</div>
                          <div className="text-xs text-gray-500">{gw.zone}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-800">{gw.uptime}% uptime</div>
                        <div className="text-xs text-gray-500">{gw.scans.toLocaleString()} scans</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${gw.uptime >= 99 ? 'bg-green-500' : gw.uptime >= 95 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${gw.uptime}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Signal Strength Distribution */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Signal Strength Distribution</h3>
              <Button variant="outline" size="sm" onClick={() => handleExport('signal-strength')}>
                <Download className="w-4 h-4" />
              </Button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { range: 'Excellent (>-60dBm)', count: 78 },
                { range: 'Good (-60 to -70dBm)', count: 56 },
                { range: 'Fair (-70 to -80dBm)', count: 32 },
                { range: 'Poor (-80 to -90dBm)', count: 18 },
                { range: 'Very Poor (<-90dBm)', count: 5 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8B5CF6" name="Beacon Count" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
