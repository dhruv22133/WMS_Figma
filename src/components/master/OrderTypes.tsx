import { FileText } from 'lucide-react';
import { createSimpleMasterDataComponent } from './createSimpleMasterDataComponent';

export const OrderTypes = createSimpleMasterDataComponent({
  title: 'Order Types',
  description: 'Manage order and transaction types',
  icon: <FileText className="w-6 h-6 text-purple-600" />,
  apiKey: 'order-types',
  searchPlaceholder: 'Search order types...'
});