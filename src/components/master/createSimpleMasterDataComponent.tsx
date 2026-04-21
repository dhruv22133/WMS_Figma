import { useState, useEffect } from 'react';
import { MasterTable, Column } from './MasterTable';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Button } from '../ui/button';
import { DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { masterDataApi } from '../../utils/api';

interface SimpleItem {
  id: string;
  code: string;
  name: string;
  description?: string;
  color?: string;
  is_active: boolean;
  display_order?: number;
}

export function createSimpleMasterDataComponent(config: {
  title: string;
  description: string;
  icon: React.ReactNode;
  apiKey: string;
  showColor?: boolean;
  searchPlaceholder?: string;
}) {
  function SimpleForm({ item, onSave, onCancel }: {
    item?: SimpleItem;
    onSave: (item: SimpleItem) => void;
    onCancel: () => void;
  }) {
    const [formData, setFormData] = useState<Partial<SimpleItem>>(
      item || {
        code: '',
        name: '',
        description: '',
        color: config.showColor ? '#3B82F6' : undefined,
        is_active: true,
        display_order: 0,
      }
    );

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData as SimpleItem);
    };

    return (
      <>
        <DialogHeader>
          <DialogTitle>{item ? `Edit ${config.title}` : `Add New ${config.title}`}</DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Code *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g., CODE"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Name"
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
              placeholder="Description..."
              rows={3}
            />
          </div>

          {config.showColor && (
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                type="color"
                value={formData.color || '#3B82F6'}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              />
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

  return function Component() {
    const [data, setData] = useState<SimpleItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          const items = await masterDataApi.get(config.apiKey);
          setData(items);
        } catch (error) {
          console.error(`Error fetching ${config.title}:`, error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, []);

    const columns: Column<SimpleItem>[] = [
      {
        key: 'code',
        label: 'Code',
        render: (item) => config.showColor ? (
          <div className="flex items-center gap-2">
            {item.color && <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }} />}
            <span className="font-mono font-medium">{item.code}</span>
          </div>
        ) : (
          <span className="font-mono font-medium">{item.code}</span>
        )
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

    const handleAdd = async (item: SimpleItem) => {
      try {
        const newItem = await masterDataApi.create(config.apiKey, item);
        setData([...data, newItem]);
      } catch (error) {
        console.error(`Error creating ${config.title}:`, error);
        throw error;
      }
    };

    const handleEdit = async (item: SimpleItem) => {
      try {
        const updated = await masterDataApi.update(config.apiKey, item.id, item);
        setData(data.map(d => d.id === item.id ? updated : d));
      } catch (error) {
        console.error(`Error updating ${config.title}:`, error);
        throw error;
      }
    };

    const handleDelete = async (item: SimpleItem) => {
      try {
        await masterDataApi.delete(config.apiKey, item.id);
        setData(data.filter(d => d.id !== item.id));
      } catch (error) {
        console.error(`Error deleting ${config.title}:`, error);
        throw error;
      }
    };

    const handleToggleActive = async (item: SimpleItem) => {
      try {
        const updated = await masterDataApi.update(config.apiKey, item.id, {
          ...item,
          is_active: !item.is_active
        });
        setData(data.map(d => d.id === item.id ? updated : d));
      } catch (error) {
        console.error(`Error toggling ${config.title} status:`, error);
        throw error;
      }
    };

    if (loading) {
      return <div className="p-6 text-center">Loading...</div>;
    }

    return (
      <MasterTable
        title={config.title}
        description={config.description}
        icon={config.icon}
        data={data}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleActive={handleToggleActive}
        FormComponent={SimpleForm}
        searchPlaceholder={config.searchPlaceholder || `Search ${config.title.toLowerCase()}...`}
      />
    );
  };
}
