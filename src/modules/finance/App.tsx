import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';
import { AccountsPage } from './pages/AccountsPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { BudgetsPage } from './pages/BudgetsPage';
import { InvoicesPage } from './pages/InvoicesPage';
import { CategoriesPage } from './pages/CategoriesPage';

export default function FinanceModuleRoutes() {
  return (
    <div style={{ height: '100%', overflowY: 'auto', backgroundColor: '#f8fafc' }}>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/accounts" element={<AccountsPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/budgets" element={<BudgetsPage />} />
        <Route path="/invoices" element={<InvoicesPage />} />
        <Route path="/categories" element={<CategoriesPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
