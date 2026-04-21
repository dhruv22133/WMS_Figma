import { Circle } from 'lucide-react';
import { createSimpleMasterDataComponent } from './createSimpleMasterDataComponent';

export const Statuses = createSimpleMasterDataComponent({
  title: 'Statuses',
  description: 'Manage workflow statuses across the system',
  icon: <Circle className="w-6 h-6 text-purple-600" />,
  apiKey: 'statuses',
  showColor: true,
  searchPlaceholder: 'Search statuses...'
});