import { Truck } from 'lucide-react';
import { createSimpleMasterDataComponent } from './createSimpleMasterDataComponent';

export const ShippingMethods = createSimpleMasterDataComponent({
  title: 'Shipping Methods',
  description: 'Manage shipping and delivery methods',
  icon: <Truck className="w-6 h-6 text-purple-600" />,
  apiKey: 'shipping-methods',
  searchPlaceholder: 'Search shipping methods...'
});