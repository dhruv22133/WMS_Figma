import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Power, PowerOff } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface MasterTableProps<T> {
  title: string;
  description: string;
  icon: React.ReactNode;
  data: T[];
  columns: Column<T>[];
  onAdd: (item: T) => void | Promise<void>;
  onEdit: (item: T) => void | Promise<void>;
  onDelete?: (item: T) => void | Promise<void>;
  onToggleActive?: (item: T) => void | Promise<void>;
  FormComponent: React.ComponentType<{ item?: T; onSave: (item: T) => void; onCancel: () => void }>;
  searchPlaceholder?: string;
  showActiveToggle?: boolean;
  colorField?: keyof T;
  hasActiveField?: boolean;
}

export function MasterTable<T extends { id?: string; is_active?: boolean; [key: string]: any }>({
  title,
  description,
  icon,
  data,
  columns,
  onAdd,
  onEdit,
  onDelete,
  onToggleActive,
  FormComponent,
  searchPlaceholder = 'Search...',
  showActiveToggle = true,
  colorField,
  hasActiveField = true,
}: MasterTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter data
  const filteredData = data
    .filter(item => {
      if (!showInactive && hasActiveField && item.is_active === false) return false;
      if (!searchTerm) return true;
      
      return Object.values(item).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

  const handleAdd = () => {
    setSelectedItem(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (item: T) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  const handleSave = async (item: T) => {
    try {
      setIsSubmitting(true);
      if (selectedItem) {
        await onEdit(item);
      } else {
        await onAdd(item);
      }
      setIsFormOpen(false);
      setSelectedItem(undefined);
    } catch (error) {
      console.error('Error saving item:', error);
      // Keep form open on error so user can retry
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (item: T) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsSubmitting(true);
      if (selectedItem && onDelete) {
        await onDelete(selectedItem);
      }
      setIsDeleteDialogOpen(false);
      setSelectedItem(undefined);
    } catch (error) {
      console.error('Error deleting item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (item: T) => {
    try {
      if (onToggleActive) {
        await onToggleActive(item);
      }
    } catch (error) {
      console.error('Error toggling active status:', error);
    }
  };

  return (
    <>
      <Card className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              {icon}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{title}</h2>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          </div>
          <Button onClick={handleAdd} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Add New
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          {showActiveToggle && hasActiveField && (
            <Button
              variant={showInactive ? 'default' : 'outline'}
              onClick={() => setShowInactive(!showInactive)}
              className="whitespace-nowrap"
            >
              {showInactive ? (
                <>
                  <PowerOff className="w-4 h-4 mr-2" />
                  Hide Inactive
                </>
              ) : (
                <>
                  <Power className="w-4 h-4 mr-2" />
                  Show Inactive
                </>
              )}
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">{filteredData.length}</div>
            <div className="text-sm text-gray-600">Showing</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">
              {data.filter(item => hasActiveField ? item.is_active !== false : true).length}
            </div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-600">
              {data.filter(item => hasActiveField ? item.is_active === false : 0).length}
            </div>
            <div className="text-sm text-gray-600">Inactive</div>
          </div>
        </div>

        {/* Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                {columns.map((column, index) => (
                  <TableHead key={index} className="font-semibold">
                    {column.label}
                  </TableHead>
                ))}
                <TableHead className="font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} className="text-center py-8 text-gray-500">
                    No records found
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item, index) => (
                  <TableRow 
                    key={item.id || index}
                    className={hasActiveField && item.is_active === false ? 'bg-gray-50 opacity-60' : ''}
                  >
                    {columns.map((column, colIndex) => (
                      <TableCell key={colIndex}>
                        {column.render 
                          ? column.render(item) 
                          : String(item[column.key as keyof T] || '')}
                      </TableCell>
                    ))}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {onToggleActive && hasActiveField && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleActive(item)}
                            className={item.is_active ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-gray-600'}
                          >
                            {item.is_active ? (
                              <Power className="w-4 h-4" />
                            ) : (
                              <PowerOff className="w-4 h-4" />
                            )}
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        {onDelete && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(item)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <FormComponent
            item={selectedItem}
            onSave={handleSave}
            onCancel={() => {
              setIsFormOpen(false);
              setSelectedItem(undefined);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}