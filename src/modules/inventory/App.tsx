import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { WarehousesPage } from './pages/WarehousesPage';
import { StockMovementsPage } from './pages/StockMovementsPage';
import { SuppliersPage } from './pages/SuppliersPage';
import { PurchaseOrdersPage } from './pages/PurchaseOrdersPage';
import { AuditsPage } from './pages/AuditsPage';
import { SettingsPage } from './pages/SettingsPage';
import { ManufacturingPage } from './pages/ManufacturingPage';

export default function InventoryModuleRoutes() {
  return (
    <div style={{ height: '100%', overflowY: 'auto', backgroundColor: '#f9f9fb' }}>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/warehouses" element={<WarehousesPage />} />
        <Route path="/stock-movements" element={<StockMovementsPage />} />
        <Route path="/manufacturing" element={<ManufacturingPage />} />
        <Route path="/suppliers" element={<SuppliersPage />} />
        <Route path="/purchase-orders" element={<PurchaseOrdersPage />} />
        <Route path="/audits" element={<AuditsPage />} />
        <Route path="/settings" element={<SettingsPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
