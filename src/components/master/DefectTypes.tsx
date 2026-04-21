import { AlertTriangle } from 'lucide-react';
import { createSimpleMasterDataComponent } from './createSimpleMasterDataComponent';

export const DefectTypes = createSimpleMasterDataComponent({
  title: 'Defect Types',
  description: 'Manage product defect categories',
  icon: <AlertTriangle className="w-6 h-6 text-purple-600" />,
  apiKey: 'defect-types',
  searchPlaceholder: 'Search defect types...'
});