import { projectId, publicAnonKey } from './supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-36ac7b49`;

console.log('API Configuration:', {
  projectId,
  baseUrl: API_BASE_URL,
  hasKey: !!publicAnonKey
});

interface RequestOptions {
  method?: string;
  body?: any;
}

async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body } = options;

  const headers: HeadersInit = {
    'Authorization': `Bearer ${publicAnonKey}`,
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const fullUrl = `${API_BASE_URL}${endpoint}`;

  try {
    console.log(`API Request: ${method} ${fullUrl}`);
    if (body) console.log('Request body:', body);
    
    const response = await fetch(fullUrl, config);
    
    console.log(`API Response status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorData: any = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
        console.error(`API Error Response:`, errorData);
      } catch (e) {
        // Response wasn't JSON, use status text
        const text = await response.text();
        console.error(`API Error Text:`, text);
        if (text) errorMessage = text;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json() as T;
    console.log(`API Response data:`, data);
    return data;
  } catch (error) {
    console.error(`API Error (${method} ${fullUrl}):`, error);
    throw error;
  }
}

// ============================================================================
// MASTER DATA API
// ============================================================================

export const masterDataApi = {
  // Product Categories
  getProductCategories: () => apiRequest<any[]>('/master/product-categories'),
  createProductCategory: (data: any) => apiRequest<any>('/master/product-categories', { method: 'POST', body: data }),
  updateProductCategory: (id: string, data: any) => apiRequest<any>(`/master/product-categories/${id}`, { method: 'PUT', body: data }),
  deleteProductCategory: (id: string) => apiRequest<any>(`/master/product-categories/${id}`, { method: 'DELETE' }),

  // Warehouse Zones
  getWarehouseZones: () => apiRequest<any[]>('/master/warehouse-zones'),
  createWarehouseZone: (data: any) => apiRequest<any>('/master/warehouse-zones', { method: 'POST', body: data }),
  updateWarehouseZone: (id: string, data: any) => apiRequest<any>(`/master/warehouse-zones/${id}`, { method: 'PUT', body: data }),
  deleteWarehouseZone: (id: string) => apiRequest<any>(`/master/warehouse-zones/${id}`, { method: 'DELETE' }),

  // Generic master data functions
  get: (type: string) => apiRequest<any[]>(`/master/${type}`),
  create: (type: string, data: any) => apiRequest<any>(`/master/${type}`, { method: 'POST', body: data }),
  update: (type: string, id: string, data: any) => apiRequest<any>(`/master/${type}/${id}`, { method: 'PUT', body: data }),
  delete: (type: string, id: string) => apiRequest<any>(`/master/${type}/${id}`, { method: 'DELETE' }),
};

// ============================================================================
// PRODUCTS API
// ============================================================================

export const productsApi = {
  getAll: () => apiRequest<any[]>('/products'),
  getById: (id: string) => apiRequest<any>(`/products/${id}`),
  create: (data: any) => apiRequest('/products', { method: 'POST', body: data }),
  update: (id: string, data: any) => apiRequest(`/products/${id}`, { method: 'PUT', body: data }),
  delete: (id: string) => apiRequest(`/products/${id}`, { method: 'DELETE' }),
};

// ============================================================================
// LOCATIONS API
// ============================================================================

export const locationsApi = {
  getAll: () => apiRequest<any[]>('/locations'),
  create: (data: any) => apiRequest('/locations', { method: 'POST', body: data }),
  update: (id: string, data: any) => apiRequest(`/locations/${id}`, { method: 'PUT', body: data }),
  delete: (id: string) => apiRequest(`/locations/${id}`, { method: 'DELETE' }),
};

// ============================================================================
// BLE BEACONS API
// ============================================================================

export const beaconsApi = {
  getAll: () => apiRequest<any[]>('/beacons'),
  create: (data: any) => apiRequest('/beacons', { method: 'POST', body: data }),
  update: (id: string, data: any) => apiRequest(`/beacons/${id}`, { method: 'PUT', body: data }),
};

// ============================================================================
// INVENTORY API
// ============================================================================

export const inventoryApi = {
  getAll: () => apiRequest<any[]>('/inventory'),
  create: (data: any) => apiRequest('/inventory', { method: 'POST', body: data }),
  update: (id: string, data: any) => apiRequest(`/inventory/${id}`, { method: 'PUT', body: data }),
};

// ============================================================================
// PUT-AWAY TASKS API
// ============================================================================

export const putAwayApi = {
  getAll: () => apiRequest<any[]>('/putaway-tasks'),
  create: (data: any) => apiRequest('/putaway-tasks', { method: 'POST', body: data }),
  update: (id: string, data: any) => apiRequest(`/putaway-tasks/${id}`, { method: 'PUT', body: data }),
};

// ============================================================================
// TAKE-AWAY ORDERS API
// ============================================================================

export const takeAwayApi = {
  getAll: () => apiRequest<any[]>('/takeaway-orders'),
  create: (data: any) => apiRequest('/takeaway-orders', { method: 'POST', body: data }),
  update: (id: string, data: any) => apiRequest(`/takeaway-orders/${id}`, { method: 'PUT', body: data }),
};

// ============================================================================
// QC INSPECTIONS API
// ============================================================================

export const qcApi = {
  getAll: () => apiRequest<any[]>('/qc-inspections'),
  create: (data: any) => apiRequest('/qc-inspections', { method: 'POST', body: data }),
  update: (id: string, data: any) => apiRequest(`/qc-inspections/${id}`, { method: 'PUT', body: data }),
};

// ============================================================================
// HOLD ITEMS API
// ============================================================================

export const holdItemsApi = {
  getAll: () => apiRequest<any[]>('/hold-items'),
  create: (data: any) => apiRequest('/hold-items', { method: 'POST', body: data }),
  update: (id: string, data: any) => apiRequest(`/hold-items/${id}`, { method: 'PUT', body: data }),
};

// ============================================================================
// HEALTH CHECK
// ============================================================================

export const healthCheck = () => apiRequest('/health');