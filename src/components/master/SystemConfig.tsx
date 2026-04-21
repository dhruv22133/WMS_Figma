import { Settings } from 'lucide-react';
import { createSimpleMasterDataComponent } from './createSimpleMasterDataComponent';

export const SystemConfig = createSimpleMasterDataComponent({
  title: 'System Configuration',
  description: 'Manage system settings and configurations',
  icon: <Settings className="w-6 h-6 text-purple-600" />,
  apiKey: 'system-config',
  searchPlaceholder: 'Search configurations...'
});