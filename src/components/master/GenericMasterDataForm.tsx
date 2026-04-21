import { useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Button } from '../ui/button';
import { DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';

interface GenericFormProps {
  item?: any;
  onSave: (item: any) => void;
  onCancel: () => void;
  title: string;
  description: string;
  fields: {
    name: string;
    label: string;
    type?: 'text' | 'number' | 'textarea' | 'color';
    required?: boolean;
    placeholder?: string;
    step?: string;
  }[];
}

export function GenericMasterDataForm({ 
  item, 
  onSave, 
  onCancel,
  title,
  description,
  fields
}: GenericFormProps) {
  const [formData, setFormData] = useState(
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
    onSave(formData);
  };

  const updateField = (name: string, value: any) => {
    setFormData({ ...formData, [name]: value });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{item ? `Edit ${title}` : `Add New ${title}`}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div className="grid grid-cols-2 gap-4">
          {fields.slice(0, 2).map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>
                {field.label} {field.required && '*'}
              </Label>
              <Input
                id={field.name}
                type={field.type || 'text'}
                value={formData[field.name] || ''}
                onChange={(e) => {
                  const value = field.type === 'number' 
                    ? parseFloat(e.target.value) || undefined 
                    : e.target.value;
                  updateField(field.name, value);
                }}
                placeholder={field.placeholder}
                required={field.required}
                step={field.step}
              />
            </div>
          ))}
        </div>

        {fields.slice(2).map((field) => {
          if (field.type === 'textarea') {
            return (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name}>{field.label}</Label>
                <Textarea
                  id={field.name}
                  value={formData[field.name] || ''}
                  onChange={(e) => updateField(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  rows={3}
                />
              </div>
            );
          }

          if (field.type === 'color') {
            return (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name}>{field.label}</Label>
                <Input
                  id={field.name}
                  type="color"
                  value={formData[field.name] || '#3B82F6'}
                  onChange={(e) => updateField(field.name, e.target.value)}
                />
              </div>
            );
          }

          return (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>
                {field.label} {field.required && '*'}
              </Label>
              <Input
                id={field.name}
                type={field.type || 'text'}
                value={formData[field.name] || ''}
                onChange={(e) => {
                  const value = field.type === 'number' 
                    ? parseFloat(e.target.value) || undefined 
                    : e.target.value;
                  updateField(field.name, value);
                }}
                placeholder={field.placeholder}
                required={field.required}
                step={field.step}
              />
            </div>
          );
        })}

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <Label htmlFor="active" className="cursor-pointer">Active</Label>
          <Switch
            id="active"
            checked={formData.is_active}
            onCheckedChange={(checked) => updateField('is_active', checked)}
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
