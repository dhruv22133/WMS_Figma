import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
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

interface WarehouseZone {
  id: string;
  code: string;
  name: string;
  description?: string;
  zone_type: string;
  temperature_controlled: boolean;
  min_temperature?: number;
  max_temperature?: number;
  color_code?: string;
  is_active: boolean;
  display_order?: number;
}

function ZoneForm({ item, onSave, onCancel }: any) {
  const [formData, setFormData] = useState(item || { 
    code: '', 
    name: '', 
    description: '',
    zone_type: 'STORAGE', 
    temperature_controlled: false, 
    color_code: '#3B82F6',
    is_active: true,
    display_order: 0,
  });
  
  return (
    <>
      <DialogHeader>
        <DialogTitle>{item ? 'Edit Zone' : 'Add New Zone'}</DialogTitle>
        <DialogDescription>
          Configure warehouse zone with location and temperature settings
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-4 mt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="code">Code *</Label>
            <Input 
              id="code"
              value={formData.code} 
              onChange={(e) => setFormData({ ...formData, code: e.target.value })} 
              placeholder="e.g., ZONE-A"
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input 
              id="name"
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
              placeholder="e.g., Zone A"
              required 
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description"
            value={formData.description || ''} 
            onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
            placeholder="Zone description..."
            rows={3}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="zone_type">Zone Type *</Label>
            <Select value={formData.zone_type} onValueChange={(value) => setFormData({ ...formData, zone_type: value })}>
              <SelectTrigger id="zone_type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="RECEIVING">Receiving</SelectItem>
                <SelectItem value="STORAGE">Storage</SelectItem>
                <SelectItem value="PICKING">Picking</SelectItem>
                <SelectItem value="SHIPPING">Shipping</SelectItem>
                <SelectItem value="QC">Quality Control</SelectItem>
                <SelectItem value="HOLD">Hold</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="color_code">Color Code</Label>
            <Input 
              id="color_code"
              type="color" 
              value={formData.color_code || '#3B82F6'} 
              onChange={(e) => setFormData({ ...formData, color_code: e.target.value })} 
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <Label htmlFor="temp_ctrl" className="cursor-pointer">Temperature Controlled</Label>
          <Switch 
            id="temp_ctrl"
            checked={formData.temperature_controlled} 
            onCheckedChange={(checked) => setFormData({ ...formData, temperature_controlled: checked })} 
          />
        </div>
        
        {formData.temperature_controlled && (
          <div className="grid grid-cols-2 gap-4 p-4 bg-cyan-50 rounded-lg border border-cyan-200">
            <div className="space-y-2">
              <Label htmlFor="min_temp">Min Temperature (°C)</Label>
              <Input 
                id="min_temp"
                type="number" 
                step="0.1" 
                value={formData.min_temperature || ''} 
                onChange={(e) => setFormData({ ...formData, min_temperature: parseFloat(e.target.value) || undefined })} 
                placeholder="e.g., 2"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_temp">Max Temperature (°C)</Label>
              <Input 
                id="max_temp"
                type="number" 
                step="0.1" 
                value={formData.max_temperature || ''} 
                onChange={(e) => setFormData({ ...formData, max_temperature: parseFloat(e.target.value) || undefined })} 
                placeholder="e.g., 8"
              />
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <Label htmlFor="active" className="cursor-pointer">Active</Label>
          <Switch 
            id="active"
            checked={formData.is_active} 
            onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })} 
          />
        </div>
        
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" className="bg-purple-600 hover:bg-purple-700">{item ? 'Update' : 'Create'}</Button>
        </div>
      </form>
    </>
  );
}

export function WarehouseZones() {
  const [data, setData] = useState<WarehouseZone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const zones = await masterDataApi.getWarehouseZones();
        setData(zones);
      } catch (error) {
        console.error('Error fetching warehouse zones:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns: Column<WarehouseZone>[] = [
    { 
      key: 'code', 
      label: 'Code', 
      render: (item) => (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color_code }} />
          <span className="font-mono font-medium">{item.code}</span>
        </div>
      ) 
    },
    { 
      key: 'name', 
      label: 'Name', 
      render: (item) => (
        <div>
          <div className="font-medium">{item.name}</div>
          {item.description && <div className="text-sm text-gray-500">{item.description}</div>}
        </div>
      ) 
    },
    { 
      key: 'zone_type', 
      label: 'Type', 
      render: (item) => <Badge variant="outline">{item.zone_type}</Badge> 
    },
    { 
      key: 'temp', 
      label: 'Temperature', 
      render: (item) => item.temperature_controlled ? (
        <div className="text-sm">
          <Badge className="bg-cyan-100 text-cyan-700">Temp Ctrl</Badge>
          {item.min_temperature !== undefined && item.max_temperature !== undefined && (
            <div className="text-gray-500 mt-1">{item.min_temperature}°C - {item.max_temperature}°C</div>
          )}
        </div>
      ) : (
        <span className="text-gray-400">-</span>
      ) 
    },
    { 
      key: 'is_active', 
      label: 'Status', 
      render: (item) => (
        <Badge variant={item.is_active ? 'default' : 'secondary'}>
          {item.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ) 
    },
  ];

  const handleAdd = async (item: WarehouseZone) => {
    try {
      const newZone = await masterDataApi.createWarehouseZone(item);
      setData([...data, newZone]);
    } catch (error) {
      console.error('Error creating zone:', error);
      throw error;
    }
  };

  const handleEdit = async (item: WarehouseZone) => {
    try {
      const updated = await masterDataApi.updateWarehouseZone(item.id, item);
      setData(data.map(d => d.id === item.id ? updated : d));
    } catch (error) {
      console.error('Error updating zone:', error);
      throw error;
    }
  };

  const handleDelete = async (item: WarehouseZone) => {
    try {
      await masterDataApi.deleteWarehouseZone(item.id);
      setData(data.filter(d => d.id !== item.id));
    } catch (error) {
      console.error('Error deleting zone:', error);
      throw error;
    }
  };

  const handleToggleActive = async (item: WarehouseZone) => {
    try {
      const updated = await masterDataApi.updateWarehouseZone(item.id, {
        ...item,
        is_active: !item.is_active
      });
      setData(data.map(d => d.id === item.id ? updated : d));
    } catch (error) {
      console.error('Error toggling zone status:', error);
      throw error;
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <MasterTable
      title="Warehouse Zones"
      description="Manage warehouse zones and areas"
      icon={<MapPin className="w-6 h-6 text-purple-600" />}
      data={data}
      columns={columns}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onToggleActive={handleToggleActive}
      FormComponent={ZoneForm}
      searchPlaceholder="Search zones..."
    />
  );
}