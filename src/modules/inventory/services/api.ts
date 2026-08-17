import { apiClient, API_BASE_URL } from '../../../core/api/client';
import { Workspace } from '../../../core/workspace-sdk';
import type {
  Product, Category, Unit, Warehouse, WarehouseLocation,
  Supplier, PurchaseOrder, StockMovement, InventoryAudit,
  DashboardKPIs, CategoryBreakdown, WarehouseBreakdown, IntelligenceAlert,
  BillOfMaterial, WorkOrder
} from '../types';

const interceptError = async (promise: Promise<any>, path: string) => {
  try {
    return await promise;
  } catch (error: any) {
    const statusMatch = error.message?.match(/API Error (\d+):/);
    const status = statusMatch ? parseInt(statusMatch[1], 10) : 500;

    Workspace.events.publish('Inventory:APIError', {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 7),
      status,
      message: error.message || 'Une erreur inattendue est survenue dans le module Stock',
      path: `/inventory${path}`,
      timestamp: Date.now()
    });

    throw error;
  }
};

export const inventoryApi = {
  // Dashboard & Analytics
  getKPIs: async (): Promise<{ kpis: DashboardKPIs; category_breakdown: CategoryBreakdown[]; warehouse_breakdown: WarehouseBreakdown[] }> =>
    interceptError(apiClient.get('/inventory/dashboard-stats/kpis/'), '/dashboard-stats/kpis/'),
  
  getIntelligenceAlerts: async (): Promise<{ alerts: IntelligenceAlert[]; count: number }> =>
    interceptError(apiClient.get('/inventory/dashboard-stats/intelligence/'), '/dashboard-stats/intelligence/'),
  
  getTimeline: async (): Promise<{ timeline: StockMovement[] }> =>
    interceptError(apiClient.get('/inventory/dashboard-stats/timeline/'), '/dashboard-stats/timeline/'),

  // Products
  getProducts: async (params?: Record<string, string>): Promise<Product[]> =>
    interceptError(apiClient.get('/inventory/products/', { params }), '/products/'),
  
  getProduct: async (id: string): Promise<Product> =>
    interceptError(apiClient.get(`/inventory/products/${id}/`), `/products/${id}/`),
  
  createProduct: async (data: FormData | (Partial<Product> & { initial_warehouse?: string; initial_quantity?: number })): Promise<Product> =>
    interceptError(apiClient.post('/inventory/products/', data), '/products/'),
  
  updateProduct: async (id: string, data: Partial<Product>): Promise<Product> =>
    interceptError(apiClient.patch(`/inventory/products/${id}/`, data), `/products/${id}/`),
  
  deleteProduct: async (id: string): Promise<void> =>
    interceptError(apiClient.delete(`/inventory/products/${id}/`), `/products/${id}/`),
  
  adjustProductStock: async (id: string, data: { warehouse_id: string; new_quantity: number; reason?: string }): Promise<StockMovement> =>
    interceptError(apiClient.post(`/inventory/products/${id}/adjust_stock/`, data), `/products/${id}/adjust_stock/`),
  
  reserveStock: async (id: string, data: { warehouse_id: string; quantity: number }): Promise<any> =>
    interceptError(apiClient.post(`/inventory/products/${id}/reserve/`, data), `/products/${id}/reserve/`),
  
  releaseStockReservation: async (id: string, data: { warehouse_id: string; quantity: number }): Promise<any> =>
    interceptError(apiClient.post(`/inventory/products/${id}/release_reservation/`, data), `/products/${id}/release_reservation/`),
  
  getProductMovements: async (id: string): Promise<StockMovement[]> =>
    interceptError(apiClient.get(`/inventory/products/${id}/movements/`), `/products/${id}/movements/`),

  getProductBatches: async (id: string): Promise<any[]> =>
    interceptError(apiClient.get(`/inventory/products/${id}/batches/`), `/products/${id}/batches/`),
    
  getAllBatches: async (params?: Record<string, string>): Promise<any[]> =>
    interceptError(apiClient.get(`/inventory/product-batches/`, { params }), `/product-batches/`),

  getProductSerialNumbers: async (params?: Record<string, string>): Promise<any[]> =>
    interceptError(apiClient.get(`/inventory/serial-numbers/`, { params }), `/serial-numbers/`),

  // Categories & Units
  getCategories: async (): Promise<Category[]> =>
    interceptError(apiClient.get('/inventory/categories/'), '/categories/'),
  
  createCategory: async (data: Partial<Category>): Promise<Category> =>
    interceptError(apiClient.post('/inventory/categories/', data), '/categories/'),
  
  getUnits: async (): Promise<Unit[]> =>
    interceptError(apiClient.get('/inventory/units/'), '/units/'),
  
  createUnit: async (data: Partial<Unit>): Promise<Unit> =>
    interceptError(apiClient.post('/inventory/units/', data), '/units/'),

  // Warehouses
  getWarehouses: async (): Promise<Warehouse[]> =>
    interceptError(apiClient.get('/inventory/warehouses/'), '/warehouses/'),
  
  createWarehouse: async (data: Partial<Warehouse>): Promise<Warehouse> =>
    interceptError(apiClient.post('/inventory/warehouses/', data), '/warehouses/'),
  
  transferStock: async (data: { product_id: string; source_warehouse_id: string; target_warehouse_id: string; quantity: number; notes?: string }): Promise<StockMovement> =>
    interceptError(apiClient.post('/inventory/warehouses/transfer_stock/', data), '/warehouses/transfer_stock/'),

  // Suppliers & Orders
  getSuppliers: async (): Promise<Supplier[]> =>
    interceptError(apiClient.get('/inventory/suppliers/'), '/suppliers/'),
  
  createSupplier: async (data: Partial<Supplier>): Promise<Supplier> =>
    interceptError(apiClient.post('/inventory/suppliers/', data), '/suppliers/'),
  
  getPurchaseOrders: async (): Promise<PurchaseOrder[]> =>
    interceptError(apiClient.get('/inventory/purchase-orders/'), '/purchase-orders/'),

  updatePurchaseOrder: async (id: string, data: Partial<PurchaseOrder>): Promise<PurchaseOrder> =>
    interceptError(apiClient.patch(`/inventory/purchase-orders/${id}/`, data), `/purchase-orders/${id}/`),

  receivePurchaseOrder: async (id: string, data: any): Promise<PurchaseOrder> =>
    interceptError(apiClient.post(`/inventory/purchase-orders/${id}/receive/`, data), `/purchase-orders/${id}/receive/`),

  autoReplenish: async (): Promise<{ message: string }> =>
    interceptError(apiClient.post('/inventory/purchase-orders/auto-replenish/', {}), '/purchase-orders/auto-replenish/'),
  
  getPurchaseOrder: async (id: string): Promise<PurchaseOrder> =>
    interceptError(apiClient.get(`/inventory/purchase-orders/${id}/`), `/purchase-orders/${id}/`),
  
  createPurchaseOrder: async (data: any): Promise<PurchaseOrder> =>
    interceptError(apiClient.post('/inventory/purchase-orders/', data), '/purchase-orders/'),
  
  confirmPurchaseOrder: async (id: string): Promise<PurchaseOrder> =>
    interceptError(apiClient.post(`/inventory/purchase-orders/${id}/confirm_order/`, {}), `/purchase-orders/${id}/confirm_order/`),
  
  receivePurchaseOrderGoods: async (id: string, data?: { received_items?: any[]; notes?: string }): Promise<PurchaseOrder> =>
    interceptError(apiClient.post(`/inventory/purchase-orders/${id}/receive_goods/`, data || {}), `/purchase-orders/${id}/receive_goods/`),

  // Stock Movements & Audits
  getStockMovements: async (params?: Record<string, string>): Promise<StockMovement[]> =>
    interceptError(apiClient.get('/inventory/stock-movements/', { params }), '/stock-movements/'),
  
  getAudits: async (): Promise<InventoryAudit[]> =>
    interceptError(apiClient.get('/inventory/audits/'), '/audits/'),
  
  getAudit: async (id: string): Promise<InventoryAudit> =>
    interceptError(apiClient.get(`/inventory/audits/${id}/`), `/audits/${id}/`),
  
  createAudit: async (data: Partial<InventoryAudit>): Promise<InventoryAudit> =>
    interceptError(apiClient.post('/inventory/audits/', data), '/audits/'),
  
  saveAuditCounts: async (id: string, counts: Array<{ item_id: string; physical_quantity: number; notes?: string }>): Promise<InventoryAudit> =>
    interceptError(apiClient.post(`/inventory/audits/${id}/save_counts/`, { counts }), `/audits/${id}/save_counts/`),
  
  validateAndApplyAudit: async (id: string): Promise<InventoryAudit> =>
    interceptError(apiClient.post(`/inventory/audits/${id}/validate_and_apply/`, {}), `/audits/${id}/validate_and_apply/`),

  // Manufacturing / WMS
  getBOMs: async (): Promise<BillOfMaterial[]> =>
    interceptError(apiClient.get('/inventory/boms/'), '/boms/'),
  
  createBOM: async (data: Partial<BillOfMaterial>): Promise<BillOfMaterial> =>
    interceptError(apiClient.post('/inventory/boms/', data), '/boms/'),

  getWorkOrders: async (): Promise<WorkOrder[]> =>
    interceptError(apiClient.get('/inventory/work-orders/'), '/work-orders/'),
    
  createWorkOrder: async (data: Partial<WorkOrder>): Promise<WorkOrder> =>
    interceptError(apiClient.post('/inventory/work-orders/', data), '/work-orders/'),
    
  executeWorkOrder: async (id: string, quantity: number | string): Promise<WorkOrder> =>
    interceptError(apiClient.post(`/inventory/work-orders/${id}/execute/`, { quantity }), `/work-orders/${id}/execute/`),
};

export { API_BASE_URL };
