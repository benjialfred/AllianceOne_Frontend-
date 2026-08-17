import { apiClient } from '../../../core/api/client';
import { Workspace } from '../../../core/workspace-sdk';
import type {
  FinancialAccount, FinancialCategory, Transaction,
  Budget, Invoice, FinanceDashboardData, CurrencyCode,
  TontineGroup, TontineMember, TontineRound,
  TontineContribution, TontinePayout
} from '../types';

const interceptError = async (promise: Promise<any>, path: string) => {
  try {
    return await promise;
  } catch (error: any) {
    const statusMatch = error.message?.match(/API Error (\d+):/);
    const status = statusMatch ? parseInt(statusMatch[1], 10) : 500;

    Workspace.events.publish('Finance:APIError', {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 7),
      status,
      message: error.message || 'Une erreur inattendue est survenue dans le module Finance',
      path: `/finance${path}`,
      timestamp: Date.now()
    });

    throw error;
  }
};

export const financeApi = {
  // Dashboard & KPIs
  getDashboardData: async (currency: string = 'ALL'): Promise<FinanceDashboardData> =>
    interceptError(apiClient.get(`/finance/dashboard/stats/?currency=${currency}`), '/dashboard/stats/'),

  // Accounts
  getAccounts: async (params?: Record<string, string>): Promise<FinancialAccount[]> =>
    interceptError(apiClient.get('/finance/accounts/', { params }), '/accounts/'),

  getAccount: async (id: string): Promise<FinancialAccount> =>
    interceptError(apiClient.get(`/finance/accounts/${id}/`), `/accounts/${id}/`),

  createAccount: async (data: Partial<FinancialAccount>): Promise<FinancialAccount> =>
    interceptError(apiClient.post('/finance/accounts/', data), '/accounts/'),

  updateAccount: async (id: string, data: Partial<FinancialAccount>): Promise<FinancialAccount> =>
    interceptError(apiClient.patch(`/finance/accounts/${id}/`, data), `/accounts/${id}/`),

  deleteAccount: async (id: string): Promise<void> =>
    interceptError(apiClient.delete(`/finance/accounts/${id}/`), `/accounts/${id}/`),

  recalculateAccountBalance: async (id: string): Promise<{ message: string; current_balance: number }> =>
    interceptError(apiClient.post(`/finance/accounts/${id}/recalculate_balance/`, {}), `/accounts/${id}/recalculate_balance/`),

  // Categories
  getCategories: async (params?: Record<string, string>): Promise<FinancialCategory[]> =>
    interceptError(apiClient.get('/finance/categories/', { params }), '/categories/'),

  createCategory: async (data: Partial<FinancialCategory>): Promise<FinancialCategory> =>
    interceptError(apiClient.post('/finance/categories/', data), '/categories/'),

  updateCategory: async (id: string, data: Partial<FinancialCategory>): Promise<FinancialCategory> =>
    interceptError(apiClient.patch(`/finance/categories/${id}/`, data), `/categories/${id}/`),

  deleteCategory: async (id: string): Promise<void> =>
    interceptError(apiClient.delete(`/finance/categories/${id}/`), `/categories/${id}/`),

  generateDefaultCategories: async (): Promise<{ message: string; categories: FinancialCategory[] }> =>
    interceptError(apiClient.post('/finance/categories/generate_defaults/', {}), '/categories/generate_defaults/'),

  // Transactions
  getTransactions: async (params?: Record<string, string>): Promise<Transaction[]> =>
    interceptError(apiClient.get('/finance/transactions/', { params }), '/transactions/'),

  getTransaction: async (id: string): Promise<Transaction> =>
    interceptError(apiClient.get(`/finance/transactions/${id}/`), `/transactions/${id}/`),

  createTransaction: async (data: Partial<Transaction>): Promise<Transaction> =>
    interceptError(apiClient.post('/finance/transactions/', data), '/transactions/'),

  updateTransaction: async (id: string, data: Partial<Transaction>): Promise<Transaction> =>
    interceptError(apiClient.patch(`/finance/transactions/${id}/`, data), `/transactions/${id}/`),

  deleteTransaction: async (id: string): Promise<void> =>
    interceptError(apiClient.delete(`/finance/transactions/${id}/`), `/transactions/${id}/`),

  // Budgets
  getBudgets: async (params?: Record<string, string>): Promise<Budget[]> =>
    interceptError(apiClient.get('/finance/budgets/', { params }), '/budgets/'),

  createBudget: async (data: Partial<Budget>): Promise<Budget> =>
    interceptError(apiClient.post('/finance/budgets/', data), '/budgets/'),

  updateBudget: async (id: string, data: Partial<Budget>): Promise<Budget> =>
    interceptError(apiClient.patch(`/finance/budgets/${id}/`, data), `/budgets/${id}/`),

  deleteBudget: async (id: string): Promise<void> =>
    interceptError(apiClient.delete(`/finance/budgets/${id}/`), `/budgets/${id}/`),

  // Invoices
  getInvoices: async (params?: Record<string, string>): Promise<Invoice[]> =>
    interceptError(apiClient.get('/finance/invoices/', { params }), '/invoices/'),

  getInvoice: async (id: string): Promise<Invoice> =>
    interceptError(apiClient.get(`/finance/invoices/${id}/`), `/invoices/${id}/`),

  createInvoice: async (data: Partial<Invoice>): Promise<Invoice> =>
    interceptError(apiClient.post('/finance/invoices/', data), '/invoices/'),

  updateInvoice: async (id: string, data: Partial<Invoice>): Promise<Invoice> =>
    interceptError(apiClient.patch(`/finance/invoices/${id}/`, data), `/invoices/${id}/`),

  deleteInvoice: async (id: string): Promise<void> =>
    interceptError(apiClient.delete(`/finance/invoices/${id}/`), `/invoices/${id}/`),

  recordInvoicePayment: async (id: string, data: {
    account_id: string;
    amount: number | string;
    payment_method?: string;
    reference?: string;
    date?: string;
  }): Promise<{ message: string; invoice: Invoice; transaction: Transaction }> =>
    interceptError(apiClient.post(`/finance/invoices/${id}/record_payment/`, data), `/invoices/${id}/record_payment/`),

  markInvoiceStatus: async (id: string, newStatus: string): Promise<Invoice> =>
    interceptError(apiClient.post(`/finance/invoices/${id}/mark_status/`, { status: newStatus }), `/invoices/${id}/mark_status/`),

  // ===========================================================================
  // TONTINES & ÉPARGNE COLLECTIVE
  // ===========================================================================
  getTontines: async (params?: Record<string, string>): Promise<TontineGroup[]> =>
    interceptError(apiClient.get('/finance/tontines/', { params }), '/tontines/'),

  getTontine: async (id: string): Promise<TontineGroup> =>
    interceptError(apiClient.get(`/finance/tontines/${id}/`), `/tontines/${id}/`),

  createTontine: async (data: Partial<TontineGroup>): Promise<TontineGroup> =>
    interceptError(apiClient.post('/finance/tontines/', data), '/tontines/'),

  updateTontine: async (id: string, data: Partial<TontineGroup>): Promise<TontineGroup> =>
    interceptError(apiClient.patch(`/finance/tontines/${id}/`, data), `/tontines/${id}/`),

  deleteTontine: async (id: string): Promise<void> =>
    interceptError(apiClient.delete(`/finance/tontines/${id}/`), `/tontines/${id}/`),

  generateTontineRounds: async (id: string): Promise<{ message: string; rounds: TontineRound[] }> =>
    interceptError(apiClient.post(`/finance/tontines/${id}/generate_rounds/`, {}), `/tontines/${id}/generate_rounds/`),

  // Tontine Members
  getTontineMembers: async (params?: Record<string, string>): Promise<TontineMember[]> =>
    interceptError(apiClient.get('/finance/tontine-members/', { params }), '/tontine-members/'),

  createTontineMember: async (data: Partial<TontineMember>): Promise<TontineMember> =>
    interceptError(apiClient.post('/finance/tontine-members/', data), '/tontine-members/'),

  updateTontineMember: async (id: string, data: Partial<TontineMember>): Promise<TontineMember> =>
    interceptError(apiClient.patch(`/finance/tontine-members/${id}/`, data), `/tontine-members/${id}/`),

  deleteTontineMember: async (id: string): Promise<void> =>
    interceptError(apiClient.delete(`/finance/tontine-members/${id}/`), `/tontine-members/${id}/`),

  // Tontine Rounds & Payouts
  getTontineRounds: async (params?: Record<string, string>): Promise<TontineRound[]> =>
    interceptError(apiClient.get('/finance/tontine-rounds/', { params }), '/tontine-rounds/'),

  recordTontinePayout: async (roundId: string, data: {
    beneficiary?: string;
    gross_amount: number | string;
    deductions?: number | string;
    payout_date?: string;
    payment_method?: string;
    reference?: string;
    notes?: string;
  }): Promise<TontinePayout> =>
    interceptError(apiClient.post(`/finance/tontine-rounds/${roundId}/record_payout/`, data), `/tontine-rounds/${roundId}/record_payout/`),

  // Tontine Contributions
  getTontineContributions: async (params?: Record<string, string>): Promise<TontineContribution[]> =>
    interceptError(apiClient.get('/finance/tontine-contributions/', { params }), '/tontine-contributions/'),

  createTontineContribution: async (data: Partial<TontineContribution>): Promise<TontineContribution> =>
    interceptError(apiClient.post('/finance/tontine-contributions/', data), '/tontine-contributions/'),
};
