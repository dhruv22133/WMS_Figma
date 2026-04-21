import React, { useState, useEffect } from 'react';
import { Radio } from 'lucide-react';
import { MasterTable, Column } from './MasterTable';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Button } from '../ui/button';
import { DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { masterDataApi } from '../../utils/api';

// Strict interface for API data
export interface BLEGateway {
  id: string;
  code: string;
  name: string;
  mac_address: string;
  ip_address?: string;
  location: string;
  zone_id?: string;
  gateway_type: string;
  firmware_version?: string;
  connection_protocol?: string;
  port?: number;
  heartbeat_interval?: number;
  scan_interval: number; 
  signal_range: number;  
  is_online: boolean;
  last_heartbeat?: string;
  description?: string;
  is_active: boolean;
  display_order?: number;
}

// Flexible interface for form state
interface GatewayFormState {
  id?: string;
  code: string;
  name: string;
  mac_address: string;
  ip_address?: string;
  location: string;
  zone_id?: string;
  gateway_type: string;
  firmware_version?: string;
  connection_protocol?: string;
  port?: number | string;
  heartbeat_interval?: number | string;
  scan_interval: number | string; 
  signal_range: number | string;  
  is_online: boolean;
  last_heartbeat?: string;
  description?: string;
  is_active: boolean;
  display_order?: number;
}

interface GatewayFormProps {
  item?: BLEGateway | null;
  onSave: (item: any) => void;
  onCancel: () => void;
}

const defaultFormData: GatewayFormState = { 
  code: '', 
  name: '', 
  mac_address: '',
  ip_address: '',
  location: '',
  zone_id: '',
  gateway_type: 'FIXED',
  firmware_version: '',
  connection_protocol: 'MQTT',
  port: 1883,
  heartbeat_interval: 60,
  scan_interval: 1000,
  signal_range: 50,
  description: '',
  is_online: false,
  is_active: true,
  display_order: 0,
};

function GatewayForm({ item, onSave, onCancel }: GatewayFormProps) {
  const [formData, setFormData] = useState<GatewayFormState>(
    item ? { ...item } : { ...defaultFormData }
  );
  
  useEffect(() => {
    if (item) {
      setFormData({ ...item });
    } else {
      setFormData({ ...defaultFormData });
    }
  }, [item]);

  const applyRecommendedSettings = () => {
    const presets: Record<string, Partial<GatewayFormState>> = {
      FIXED: { scan_interval: 1000, signal_range: 50, connection_protocol: 'MQTT', port: 1883, heartbeat_interval: 60 },
      MOBILE: { scan_interval: 2000, signal_range: 30, connection_protocol: 'HTTP', port: 8080, heartbeat_interval: 90 },
      HANDHELD: { scan_interval: 3000, signal_range: 20, connection_protocol: 'HTTP', port: 8080, heartbeat_interval: 120 },
      ANCHOR: { scan_interval: 500, signal_range: 60, connection_protocol: 'TCP', port: 9000, heartbeat_interval: 30 },
    };

    setFormData({ ...formData, ...presets[formData.gateway_type] });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{item ? 'Edit BLE Gateway' : 'Add New BLE Gateway'}</DialogTitle>
        <DialogDescription>
          Configure BLE gateway device for warehouse tracking
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={(e: React.FormEvent) => { e.preventDefault(); onSave(formData); }} className="space-y-4 mt-4">
        <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-blue-900">Quick setup for BLE Gateway</p>
              <p className="text-xs text-blue-700 mt-1">
                Use recommended values based on gateway type, then update MAC/IP to match your physical device.
              </p>
            </div>
            <Button type="button" variant="outline" onClick={applyRecommendedSettings}>
              Apply Recommended
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="code">Code *</Label>
            <Input 
              id="code"
              value={formData.code} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, code: e.target.value })} 
              placeholder="e.g., GW-001"
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input 
              id="name"
              value={formData.name} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })} 
              placeholder="e.g., Gateway 1"
              required 
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="mac_address">MAC Address *</Label>
            <Input 
              id="mac_address"
              value={formData.mac_address} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, mac_address: e.target.value })} 
              placeholder="e.g., AA:BB:CC:DD:EE:FF"
              pattern="^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$"
              title="Use MAC format XX:XX:XX:XX:XX:XX"
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ip_address">IP Address</Label>
            <Input 
              id="ip_address"
              value={formData.ip_address || ''} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, ip_address: e.target.value })} 
              placeholder="e.g., 192.168.1.100"
              pattern="^$|^((25[0-5]|2[0-4][0-9]|1?[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1?[0-9]{1,2})$"
              title="Use IPv4 format, e.g. 192.168.1.100"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="location">Physical Location *</Label>
            <Input 
              id="location"
              value={formData.location} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, location: e.target.value })} 
              placeholder="e.g., Zone A - Entrance"
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="zone_id">Zone ID</Label>
            <Input 
              id="zone_id"
              value={formData.zone_id || ''} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, zone_id: e.target.value })} 
              placeholder="e.g., ZONE-A"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="gateway_type">Gateway Type *</Label>
            <Select value={formData.gateway_type} onValueChange={(value: string) => setFormData({ ...formData, gateway_type: value })}>
              <SelectTrigger id="gateway_type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FIXED">Fixed</SelectItem>
                <SelectItem value="MOBILE">Mobile</SelectItem>
                <SelectItem value="HANDHELD">Handheld</SelectItem>
                <SelectItem value="ANCHOR">Anchor Point</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="firmware_version">Firmware Version</Label>
            <Input 
              id="firmware_version"
              value={formData.firmware_version || ''} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, firmware_version: e.target.value })} 
              placeholder="e.g., v2.1.3"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="connection_protocol">Connection Protocol *</Label>
            <Select value={formData.connection_protocol} onValueChange={(value: string) => setFormData({ ...formData, connection_protocol: value })}>
              <SelectTrigger id="connection_protocol">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MQTT">MQTT</SelectItem>
                <SelectItem value="HTTP">HTTP</SelectItem>
                <SelectItem value="TCP">TCP Socket</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="port">Port *</Label>
            <Input
              id="port"
              type="number"
              min="1"
              max="65535"
              value={formData.port ?? ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const val = e.target.value;
                setFormData({ ...formData, port: val === '' ? '' : Number(val) });
              }}
              placeholder="e.g., 1883"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="scan_interval">Scan Interval (ms) *</Label>
            <Input 
              id="scan_interval"
              type="number"
              value={formData.scan_interval} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const val = e.target.value;
                setFormData({ ...formData, scan_interval: val === '' ? '' : Number(val) });
              }} 
              placeholder="e.g., 1000"
              min="100"
              max="10000"
              required 
            />
            <p className="text-xs text-gray-500">How often the gateway scans for beacons</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="heartbeat_interval">Heartbeat Interval (sec) *</Label>
            <Input 
              id="heartbeat_interval"
              type="number"
              value={formData.heartbeat_interval ?? ''} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const val = e.target.value;
                setFormData({ ...formData, heartbeat_interval: val === '' ? '' : Number(val) });
              }} 
              placeholder="e.g., 60"
              min="5"
              max="600"
              required
            />
            <p className="text-xs text-gray-500">Health-check report frequency</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="signal_range">Signal Range (meters) *</Label>
            <Input 
              id="signal_range"
              type="number"
              value={formData.signal_range} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const val = e.target.value;
                setFormData({ ...formData, signal_range: val === '' ? '' : Number(val) });
              }} 
              placeholder="e.g., 50"
              min="1"
              max="200"
              required 
            />
            <p className="text-xs text-gray-500">Maximum detection range</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description"
            value={formData.description || ''} 
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })} 
            placeholder="Gateway description and notes..."
            rows={3}
          />
        </div>
        
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <Label htmlFor="is_online" className="cursor-pointer">Gateway Online</Label>
          <Switch 
            id="is_online"
            checked={formData.is_online} 
            onCheckedChange={(checked: boolean) => setFormData({ ...formData, is_online: checked })} 
          />
        </div>
        
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <Label htmlFor="active" className="cursor-pointer">Active</Label>
          <Switch 
            id="active"
            checked={formData.is_active} 
            onCheckedChange={(checked: boolean) => setFormData({ ...formData, is_active: checked })} 
          />
        </div>
        
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            {item ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </>
  );
}

export function BLEGateways() {
  const [data, setData] = useState<BLEGateway[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // FIX: Assert type for get request
      const result = await masterDataApi.get('ble-gateways') as BLEGateway[];
      setData(result);
    } catch (error) {
      console.error('Error loading BLE gateways:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (item: any) => {
    try {
      const payload = {
        ...item,
        port: Number(item.port) || 1883,
        heartbeat_interval: Number(item.heartbeat_interval) || 60,
        scan_interval: Number(item.scan_interval) || 1000,
        signal_range: Number(item.signal_range) || 50,
      };
      // FIX: Assert type 'as BLEGateway' to resolve 'unknown' error
      const created = await masterDataApi.create('ble-gateways', payload) as BLEGateway;
      setData([...data, created]);
    } catch (error) {
      console.error('Error creating gateway:', error);
    }
  };

  const handleEdit = async (item: any) => {
    try {
      const payload = {
        ...item,
        port: Number(item.port) || 1883,
        heartbeat_interval: Number(item.heartbeat_interval) || 60,
        scan_interval: Number(item.scan_interval) || 1000,
        signal_range: Number(item.signal_range) || 50,
      };
      // FIX: Assert type 'as BLEGateway' to resolve 'unknown' error
      const updated = await masterDataApi.update('ble-gateways', item.id, payload) as BLEGateway;
      setData(data.map(d => d.id === item.id ? updated : d));
    } catch (error) {
      console.error('Error updating gateway:', error);
    }
  };

  const handleDelete = async (item: BLEGateway) => {
    try {
      await masterDataApi.delete('ble-gateways', item.id);
      setData(data.filter(d => d.id !== item.id));
    } catch (error) {
      console.error('Error deleting gateway:', error);
    }
  };

  const handleToggleActive = async (item: BLEGateway) => {
    try {
      // FIX: Assert type 'as BLEGateway' to resolve 'unknown' error
      const updated = await masterDataApi.update('ble-gateways', item.id, {
        ...item,
        is_active: !item.is_active
      }) as BLEGateway;
      setData(data.map(d => d.id === item.id ? updated : d));
    } catch (error) {
      console.error('Error toggling gateway status:', error);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  const columns: Column<BLEGateway>[] = [
    {
      key: 'code',
      label: 'Code',
      render: (item) => (
        <div className="flex items-center gap-2">
          <Radio className={`w-4 h-4 ${item.is_online ? 'text-green-500' : 'text-gray-400'}`} />
          <span className="font-medium">{item.code}</span>
        </div>
      ),
    },
    {
      key: 'name',
      label: 'Name',
      render: (item) => item.name,
    },
    {
      key: 'mac_address',
      label: 'MAC Address',
      render: (item) => <span className="font-mono text-sm">{item.mac_address}</span>,
    },
    {
      key: 'location',
      label: 'Location',
      render: (item) => item.location,
    },
    {
      key: 'gateway_type',
      label: 'Type',
      render: (item) => (
        <Badge variant="outline" className="border-blue-500 text-blue-600 bg-blue-50">
          {item.gateway_type}
        </Badge>
      ),
    },
    {
      key: 'connection_protocol',
      label: 'Protocol',
      render: (item) => <span>{item.connection_protocol || 'MQTT'}</span>,
    },
    {
      key: 'signal_range',
      label: 'Signal Range',
      render: (item) => <span>{item.signal_range}m</span>,
    },
    {
      key: 'is_online',
      label: 'Status',
      render: (item) => (
        <Badge variant={item.is_online ? 'default' : 'secondary'} className={item.is_online ? 'bg-green-500' : ''}>
          {item.is_online ? 'Online' : 'Offline'}
        </Badge>
      ),
    },
  ];

  return (
    <MasterTable<BLEGateway>
      title="BLE Gateways"
      description="Manage BLE gateway devices for warehouse tracking"
      icon={<Radio className="w-6 h-6 text-blue-600" />}
      data={data}
      columns={columns}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onToggleActive={handleToggleActive}
      FormComponent={GatewayForm}
      searchPlaceholder="Search gateways..."
    />
  );
}
