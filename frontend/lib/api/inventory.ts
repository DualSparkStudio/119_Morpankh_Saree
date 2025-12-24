import api from './api';

export interface StockLog {
  id: string;
  productId: string;
  variantId?: string;
  transactionType: 'IN' | 'OUT';
  quantity: number;
  stockType: 'ONLINE' | 'OFFLINE';
  reason?: string;
  scannedBy?: string;
  notes?: string;
  createdAt: string;
  product?: {
    id: string;
    name: string;
    sku: string;
  };
  variant?: {
    id: string;
    name: string;
  };
}

export interface StockLogsResponse {
  logs: StockLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ScanStockRequest {
  barcode?: string;
  variant_code?: string;
  quantity: number;
  transactionType: 'IN' | 'OUT';
  stockType: 'ONLINE' | 'OFFLINE';
  reason?: string;
  notes?: string;
}

export interface ScanStockResponse {
  success: boolean;
  message: string;
  stockLog: StockLog;
  newQuantity: number;
}

export const inventoryApi = {
  scanStock: async (data: ScanStockRequest): Promise<ScanStockResponse> => {
    const { data: response } = await api.post('/inventory/scan', data);
    return response;
  },

  getStockLogs: async (params?: {
    page?: number;
    limit?: number;
    productId?: string;
    variantId?: string;
  }): Promise<StockLogsResponse> => {
    const { data } = await api.get('/inventory/logs', { params });
    return data;
  },
};

