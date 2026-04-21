import { useState, useEffect } from 'react';
import { Ruler } from 'lucide-react';
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

interface UnitOfMeasure {
  id: string;
  code: string;
  name: string;
  description?: string;
  is_active: boolean;
  display_order?: number;
}

function UOMForm({ item, onSave, onCancel }: { item?: UnitOfMeasure; onSave: (item: UnitOfMeasure) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState<Partial<UnitOfMeasure>>(
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
    onSave(formData as UnitOfMeasure);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{item ? 'Edit Unit of Measure' : 'Add New Unit of Measure'}</DialogTitle>
        <DialogDescription>Configure unit of measure settings</DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="code">Code *</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="e.g., EA, KG"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Each, Kilogram"
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
            placeholder="Unit description..."
            rows={3}
          />
        </div>
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <Label htmlFor="active" className="cursor-pointer">Active</Label>
          <Switch id="active" checked={formData.is_active} onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })} />
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" className="bg-purple-600 hover:bg-purple-700">{item ? 'Update' : 'Create'}</Button>
        </div>
      </form>
    </>
  );
}

export function UnitsOfMeasure() {
  const [data, setData] = useState<UnitOfMeasure[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const units = await masterDataApi.get('units-of-measure');
        setData(units);
      } catch (error) {
        console.error('Error fetching units of measure:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns: Column<UnitOfMeasure>[] = [
    { key: 'code', label: 'Code', render: (item) => <span className="font-mono text-sm font-medium">{item.code}</span> },
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
    { key: 'is_active', label: 'Status', render: (item) => <Badge variant={item.is_active ? 'default' : 'secondary'}>{item.is_active ? 'Active' : 'Inactive'}</Badge> },
  ];

  const handleAdd = async (item: UnitOfMeasure) => {
    try {
      const newUnit = await masterDataApi.create('units-of-measure', item);
      setData([...data, newUnit]);
    } catch (error) {
      console.error('Error creating unit:', error);
      throw error;
    }
  };

  const handleEdit = async (item: UnitOfMeasure) => {
    try {
      const updated = await masterDataApi.update('units-of-measure', item.id, item);
      setData(data.map(d => d.id === item.id ? updated : d));
    } catch (error) {
      console.error('Error updating unit:', error);
      throw error;
    }
  };

  const handleDelete = async (item: UnitOfMeasure) => {
    try {
      await masterDataApi.delete('units-of-measure', item.id);
      setData(data.filter(d => d.id !== item.id));
    } catch (error) {
      console.error('Error deleting unit:', error);
      throw error;
    }
  };

  const handleToggleActive = async (item: UnitOfMeasure) => {
    try {
      const updated = await masterDataApi.update('units-of-measure', item.id, {
        ...item,
        is_active: !item.is_active
      });
      setData(data.map(d => d.id === item.id ? updated : d));
    } catch (error) {
      console.error('Error toggling unit status:', error);
      throw error;
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <MasterTable
      title="Units of Measure"
      description="Manage units of measure and conversions"
      icon={<Ruler className="w-6 h-6 text-purple-600" />}
      data={data}
      columns={columns}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onToggleActive={handleToggleActive}
      FormComponent={UOMForm}
      searchPlaceholder="Search units..."
    />
  );
}