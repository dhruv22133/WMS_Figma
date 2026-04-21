import { ClipboardCheck } from 'lucide-react';
import { createSimpleMasterDataComponent } from './createSimpleMasterDataComponent';

export const InspectionTypes = createSimpleMasterDataComponent({
  title: 'Inspection Types',
  description: 'Manage quality control inspection types',
  icon: <ClipboardCheck className="w-6 h-6 text-purple-600" />,
  apiKey: 'inspection-types',
  searchPlaceholder: 'Search inspection types...'
});