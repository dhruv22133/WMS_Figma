import { useState, useEffect } from 'react';
import { Building2 } from 'lucide-react';
import { MasterTable, Column } from './MasterTable';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Button } from '../ui/button';
import { DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { masterDataApi } from '../../utils/api';

interface LocationType {
  id: string;
  code: string;
  name: string;
  description?: string;
  is_active: boolean;
  display_order?: number;
}

function LocationTypeForm({ item, onSave, onCancel }: {
  item?: LocationType;
  onSave: (item: LocationType) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Partial<LocationType>>(
    item || {
      code: '',
      name: '',
      description: '',
      is_active: true,
      display_order: 0,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as LocationType);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{item ? 'Edit Location Type' : 'Add New Location Type'}</DialogTitle>
        <DialogDescription>
          Configure warehouse location type settings
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="code">Code *</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="e.g., STORAGE"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Storage Location"
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
            placeholder="Location type description..."
            rows={3}
          />
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <Label htmlFor="active" className="cursor-pointer">Active</Label>
          <Switch
            id="active"
            checked={formData.is_active}
            onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
            {item ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </>
  );
}

export function LocationTypes() {
  const [data, setData] = useState<LocationType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const locationTypes = await masterDataApi.get('location-types');
        setData(locationTypes);
      } catch (error) {
        console.error('Error fetching location types:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns: Column<LocationType>[] = [
    {
      key: 'code',
      label: 'Code',
      render: (item) => <span className="font-mono font-medium">{item.code}</span>
    },
    {
      key: 'name',
      label: 'Name',
      render: (item) => (
        <div>
          <div className="font-medium">{item.name}</div>
          {item.description && (
            <div className="text-sm text-gray-500">{item.description}</div>
          )}
        </div>
      ),
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

  const handleAdd = async (item: LocationType) => {
    try {
      const newItem = await masterDataApi.create('location-types', item);
      setData([...data, newItem]);
    } catch (error) {
      console.error('Error creating location type:', error);
      throw error;
    }
  };

  const handleEdit = async (item: LocationType) => {
    try {
      const updated = await masterDataApi.update('location-types', item.id, item);
      setData(data.map(d => d.id === item.id ? updated : d));
    } catch (error) {
      console.error('Error updating location type:', error);
      throw error;
    }
  };

  const handleDelete = async (item: LocationType) => {
    try {
      await masterDataApi.delete('location-types', item.id);
      setData(data.filter(d => d.id !== item.id));
    } catch (error) {
      console.error('Error deleting location type:', error);
      throw error;
    }
  };

  const handleToggleActive = async (item: LocationType) => {
    try {
      const updated = await masterDataApi.update('location-types', item.id, {
        ...item,
        is_active: !item.is_active
      });
      setData(data.map(d => d.id === item.id ? updated : d));
    } catch (error) {
      console.error('Error toggling location type status:', error);
      throw error;
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <MasterTable
      title="Location Types"
      description="Manage warehouse location type templates"
      icon={<Building2 className="w-6 h-6 text-purple-600" />}
      data={data}
      columns={columns}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onToggleActive={handleToggleActive}
      FormComponent={LocationTypeForm}
      searchPlaceholder="Search location types..."
    />
  );
}