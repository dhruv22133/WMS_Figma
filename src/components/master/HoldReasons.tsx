import { Ban } from 'lucide-react';
import { createSimpleMasterDataComponent } from './createSimpleMasterDataComponent';

export const HoldReasons = createSimpleMasterDataComponent({
  title: 'Hold Reasons',
  description: 'Manage reasons for placing items on hold',
  icon: <Ban className="w-6 h-6 text-purple-600" />,
  apiKey: 'hold-reasons',
  searchPlaceholder: 'Search hold reasons...'
});