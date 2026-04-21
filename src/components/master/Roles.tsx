import { Shield } from 'lucide-react';
import { createSimpleMasterDataComponent } from './createSimpleMasterDataComponent';

export const Roles = createSimpleMasterDataComponent({
  title: 'Roles & Permissions',
  description: 'Manage user roles and permission levels',
  icon: <Shield className="w-6 h-6 text-purple-600" />,
  apiKey: 'roles',
  searchPlaceholder: 'Search roles...'
});