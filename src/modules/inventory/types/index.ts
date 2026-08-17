export interface Category {
  id: string;
  name: string;
  code: string;
  description?: string;
  parent?: string;
  products_count?: number;
  created_at: string;
}

export interface Unit {
  id: string;
  name: string;
  symbol: string;
  description?: string;
  created_at: string;
}

export interface WarehouseLocation {
  id: string;
  warehouse: string;
  warehouse_name?: string;
  code: string;
  zone?: string;
  aisle?: string;
  shelf?: string;
  bin?: string;
}

export interface Warehouse {
  id: string;
  code: string;
  name: string;
  address?: string;
  city?: string;
  manager_name?: string;
  phone?: string;
  is_default: boolean;
  is_active: boolean;
  capacity_m3: number;
  locations_count?: number;
  total_stock_items?: number;
  total_stock_value?: number;
  created_at: string;
}

export interface ProductStock {
  id: string;
  product: string;
  warehouse: string;
  warehouse_code: string;
  warehouse_name: string;
  location?: string;
  location_code?: string;
  quantity_on_hand: number;
  quantity_reserved: number;
  quantity_available: number;
  pmp_cost: number;
  total_value: number;
  updated_at: string;
}

export interface Product {
  id: string;
  sku: string;
  barcode?: string;
  name: string;
  description?: string;
  category?: string;
  category_name?: string;
  unit?: string;
  unit_name?: string;
  unit_symbol?: string;
  purchase_price: number;
  selling_price: number;
  min_stock_level: number;
  max_stock_level: number;
  reorder_quantity: number;
  image?: string;
  tracking_serial: boolean;
  is_active: boolean;
  total_stock_on_hand: number;
  total_stock_available: number;
  total_valuation: number;
  stock_status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  stocks: ProductStock[];
  created_at: string;
  updated_at: string;
}

export interface ProductBatch {
  id: string;
  product: string;
  product_name: string;
  product_sku: string;
  batch_number: string;
  manufacturing_date?: string;
  expiry_date?: string;
  best_before_date?: string;
  current_quantity: number;
  is_expired: boolean;
  created_at: string;
  updated_at: string;
}

export interface SerialNumber {
  id: string;
  product: string;
  product_name: string;
  batch?: string;
  batch_number?: string;
  warehouse?: string;
  warehouse_name?: string;
  serial_number: string;
  status: 'IN_STOCK' | 'SOLD' | 'IN_TRANSIT' | 'LOST';
  status_display: string;
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  id: string;
  code: string;
  name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  payment_terms?: string;
  tax_id?: string;
  rating?: number;
  notes?: string;
  is_active: boolean;
  orders_count?: number;
  created_at: string;
}

export interface PurchaseOrderItem {
  id: string;
  purchase_order: string;
  product: string;
  product_sku: string;
  product_name: string;
  unit_symbol: string;
  ordered_quantity: number;
  received_quantity: number;
  unit_price: number;
  tax_rate: number;
  total_price: number;
}

export interface PurchaseOrder {
  id: string;
  order_number: string;
  supplier: string;
  supplier_name: string;
  warehouse: string;
  warehouse_name: string;
  status: 'BROUILLON' | 'COMMANDE' | 'RECEPTION_PARTIELLE' | 'RECU_TOTAL' | 'ANNULE';
  status_display: string;
  order_date: string;
  expected_delivery_date?: string;
  notes?: string;
  total_ht: number;
  total_tax: number;
  total_ttc: number;
  items: PurchaseOrderItem[];
  created_at: string;
}

export interface StockMovement {
  id: string;
  movement_number: string;
  product: string;
  product_sku: string;
  product_name: string;
  unit_symbol: string;
  source_warehouse?: string;
  source_warehouse_name?: string;
  target_warehouse?: string;
  target_warehouse_name?: string;
  movement_type: string;
  movement_type_display: string;
  quantity: number;
  unit_cost: number;
  total_cost: number;
  reference_document?: string;
  reason?: string;
  performed_by_name?: string;
  created_at: string;
}

export interface InventoryAuditItem {
  id: string;
  audit: string;
  product: string;
  product_sku: string;
  product_name: string;
  unit_symbol: string;
  theoretical_quantity: number;
  physical_quantity: number;
  variance_quantity: number;
  unit_cost: number;
  variance_cost: number;
  notes?: string;
}

export interface InventoryAudit {
  id: string;
  audit_number: string;
  title: string;
  warehouse: string;
  warehouse_name: string;
  status: 'PLANIFIE' | 'EN_COURS' | 'VALIDE' | 'ANNULE';
  status_display: string;
  scheduled_date: string;
  completed_date?: string;
  notes?: string;
  total_variance_value: number;
  items_count?: number;
  items?: InventoryAuditItem[];
  created_at: string;
}

export interface BOMItem {
  id: string;
  bom: string;
  component: string;
  component_name: string;
  component_sku: string;
  unit_symbol: string;
  quantity: string | number;
}

export interface BillOfMaterial {
  id: string;
  product: string;
  product_name: string;
  product_sku: string;
  name: string;
  version: string;
  is_active: boolean;
  items: BOMItem[];
}

export interface WorkOrder {
  id: string;
  order_number: string;
  product: string;
  product_name: string;
  product_sku: string;
  unit_symbol: string;
  bom: string;
  bom_name: string;
  warehouse: string;
  warehouse_name: string;
  planned_quantity: string | number;
  completed_quantity: string | number;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  status_display: string;
  start_date?: string;
  end_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardKPIs {
  total_valuation_pmp: number;
  total_stock_units: number;
  total_products_count: number;
  out_of_stock_count: number;
  low_stock_count: number;
  in_stock_count: number;
  total_warehouses_count: number;
  pending_orders_count: number;
  inbound_expected_value: number;
}

export interface CategoryBreakdown {
  id: string;
  name: string;
  code: string;
  items_count: number;
  total_quantity: number;
  total_valuation: number;
}

export interface WarehouseBreakdown {
  id: string;
  code: string;
  name: string;
  total_quantity: number;
  total_valuation: number;
}

export interface IntelligenceAlert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  type: string;
  title: string;
  message: string;
  action_label: string;
  suggested_reorder_qty?: number;
  product_id?: string;
  sku?: string;
  category?: string;
  order_id?: string;
}
