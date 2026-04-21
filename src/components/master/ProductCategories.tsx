import { useState, useEffect } from 'react';
import { Layers } from 'lucide-react';
import { MasterTable, Column } from './MasterTable';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Button } from '../ui/button';
import { DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { masterDataApi } from '../../utils/api';

interface ProductCategory {
  id: string;
  code: string;
  name: string;
  description?: string;
  parent_id?: string;
  level: number;
  requires_quality_check: boolean;
  requires_temperature_control: boolean;
  default_shelf_life_days?: number;
  is_active: boolean;
  display_order: number;
}

function CategoryForm({ 
  item, 
  onSave, 
  onCancel 
}: { 
  item?: ProductCategory; 
  onSave: (item: ProductCategory) => void; 
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Partial<ProductCategory>>(
    item || {
      code: '',
      name: '',
      description: '',
      level: 0,
      requires_quality_check: false,
      requires_temperature_control: false,
      is_active: true,
      display_order: 0,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as ProductCategory);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{item ? 'Edit Category' : 'Add New Category'}</DialogTitle>
        <DialogDescription>
          Configure product category with quality and storage requirements
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
              placeholder="e.g., ELECTRONICS"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Electronics"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Category description..."
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="level">Hierarchy Level</Label>
            <Input
              id="level"
              type="number"
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) || 0 })}
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shelf_life">Default Shelf Life (days)</Label>
            <Input
              id="shelf_life"
              type="number"
              value={formData.default_shelf_life_days || ''}
              onChange={(e) => setFormData({ ...formData, default_shelf_life_days: parseInt(e.target.value) || undefined })}
              placeholder="Optional"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <Label htmlFor="qc" className="cursor-pointer">Requires Quality Check</Label>
            <Switch
              id="qc"
              checked={formData.requires_quality_check}
              onCheckedChange={(checked) => setFormData({ ...formData, requires_quality_check: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <Label htmlFor="temp" className="cursor-pointer">Temperature Control</Label>
            <Switch
              id="temp"
              checked={formData.requires_temperature_control}
              onCheckedChange={(checked) => setFormData({ ...formData, requires_temperature_control: checked })}
            />
          </div>
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

export function ProductCategories() {
  const [data, setData] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const categories = await masterDataApi.getProductCategories();
        setData(categories);
      } catch (error) {
        console.error('Error fetching product categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns: Column<ProductCategory>[] = [
    {
      key: 'code',
      label: 'Code',
      render: (item) => (
        <span className="font-mono text-sm font-medium">{item.code}</span>
      ),
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
      key: 'level',
      label: 'Level',
      render: (item) => (
        <Badge variant="outline">Level {item.level}</Badge>
      ),
    },
    {
      key: 'requirements',
      label: 'Requirements',
      render: (item) => (
        <div className="flex gap-1 flex-wrap">
          {item.requires_quality_check && (
            <Badge className="bg-blue-100 text-blue-700">QC</Badge>
          )}
          {item.requires_temperature_control && (
            <Badge className="bg-cyan-100 text-cyan-700">Temp Ctrl</Badge>
          )}
          {item.default_shelf_life_days && (
            <Badge variant="outline">{item.default_shelf_life_days}d shelf life</Badge>
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
      ),
    },
  ];

  const handleAdd = async (item: ProductCategory) => {
    try {
      const newCategory = await masterDataApi.createProductCategory(item);
      setData([...data, newCategory]);
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  };

  const handleEdit = async (item: ProductCategory) => {
    try {
      const updated = await masterDataApi.updateProductCategory(item.id, item);
      setData(data.map(d => d.id === item.id ? updated : d));
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  };

  const handleDelete = async (item: ProductCategory) => {
    try {
      await masterDataApi.deleteProductCategory(item.id);
      setData(data.filter(d => d.id !== item.id));
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  };

  const handleToggleActive = async (item: ProductCategory) => {
    try {
      const updated = await masterDataApi.updateProductCategory(item.id, {
        ...item,
        is_active: !item.is_active
      });
      setData(data.map(d => d.id === item.id ? updated : d));
    } catch (error) {
      console.error('Error toggling category status:', error);
      throw error;
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <MasterTable
      title="Product Categories"
      description="Manage product categories and hierarchies"
      icon={<Layers className="w-6 h-6 text-purple-600" />}
      data={data}
      columns={columns}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onToggleActive={handleToggleActive}
      FormComponent={CategoryForm}
      searchPlaceholder="Search categories..."
    />
  );
}