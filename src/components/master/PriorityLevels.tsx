import { Flag } from 'lucide-react';
import { createSimpleMasterDataComponent } from './createSimpleMasterDataComponent';

export const PriorityLevels = createSimpleMasterDataComponent({
  title: 'Priority Levels',
  description: 'Manage task and order priority levels',
  icon: <Flag className="w-6 h-6 text-purple-600" />,
  apiKey: 'priority-levels',
  showColor: true,
  searchPlaceholder: 'Search priorities...'
});