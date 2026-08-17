export type CurrencyCode = 'EUR' | 'USD' | 'XOF' | 'GBP' | 'CAD' | 'CHF';

export type AccountType = 'BANK' | 'CASH' | 'MOBILE_MONEY' | 'ONLINE' | 'SAVINGS' | 'OTHER';

export type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER';

export type PaymentMethod = 'TRANSFER' | 'CARD' | 'CASH' | 'CHECK' | 'MOBILE_MONEY' | 'DIRECT_DEBIT' | 'ONLINE' | 'OTHER';

export type TransactionStatus = 'COMPLETED' | 'PENDING' | 'CANCELLED';

export type BudgetPeriod = 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'CUSTOM';

export type InvoiceType = 'OUTGOING' | 'INCOMING' | 'QUOTATION';

export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PARTIAL' | 'PAID' | 'OVERDUE' | 'CANCELLED';

export interface FinancialAccount {
  id: string;
  name: string;
  account_type: AccountType;
  account_type_display?: string;
  account_number?: string;
  institution_name?: string;
  currency: CurrencyCode;
  currency_display?: string;
  initial_balance: string | number;
  current_balance: string | number;
  color: string;
  is_active: boolean;
  is_default: boolean;
  description?: string;
  created_at: string;
  transactions_count?: number;
}

export interface FinancialCategory {
  id: string;
  name: string;
  category_type: 'INCOME' | 'EXPENSE';
  category_type_display?: string;
  code?: string;
  parent?: string | null;
  color: string;
  icon: string;
  description?: string;
  subcategories?: FinancialCategory[];
  transactions_count?: number;
  created_at: string;
}

export interface Transaction {
  id: string;
  transaction_type: TransactionType;
  transaction_type_display?: string;
  title: string;
  account: string;
  account_name?: string;
  account_color?: string;
  destination_account?: string | null;
  destination_account_name?: string | null;
  category?: string | null;
  category_name?: string | null;
  category_color?: string | null;
  category_icon?: string | null;
  amount: string | number;
  currency: CurrencyCode;
  destination_amount?: string | number | null;
  exchange_rate?: string | number;
  date: string;
  reference_number?: string;
  payment_method: PaymentMethod;
  payment_method_display?: string;
  payee_payer?: string;
  status: TransactionStatus;
  status_display?: string;
  notes?: string;
  receipt_url?: string;
  is_reconciled: boolean;
  created_at: string;
}

export interface Budget {
  id: string;
  name: string;
  category: string;
  category_name?: string;
  category_color?: string;
  category_icon?: string;
  allocated_amount: string | number;
  currency: CurrencyCode;
  period: BudgetPeriod;
  start_date: string;
  end_date: string;
  alert_threshold_percentage: number;
  is_active: boolean;
  notes?: string;
  spent_amount: number;
  remaining_amount: number;
  percentage_used: number;
  is_warning: boolean;
  is_exceeded: boolean;
  created_at: string;
}

export interface InvoiceItem {
  id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price?: number;
}

export interface Invoice {
  id: string;
  invoice_type: InvoiceType;
  invoice_type_display?: string;
  invoice_number: string;
  partner_name: string;
  partner_email?: string;
  partner_phone?: string;
  partner_address?: string;
  partner_tax_id?: string;
  issue_date: string;
  due_date: string;
  currency: CurrencyCode;
  status: InvoiceStatus;
  status_display?: string;
  subtotal: string | number;
  tax_rate: string | number;
  tax_amount: string | number;
  discount_amount: string | number;
  total_amount: string | number;
  paid_amount: string | number;
  remaining_due: string | number;
  notes?: string;
  terms?: string;
  items?: InvoiceItem[];
  created_at: string;
}

export interface CurrencySummary {
  currency: CurrencyCode;
  label: string;
  total_balance: number;
  accounts_count: number;
}

export interface CashflowPoint {
  month_name: string;
  period_key: string;
  income: number;
  expense: number;
  net: number;
}

export interface CategoryBreakdownItem {
  id: string | null;
  name: string;
  color: string;
  icon: string;
  total_spent: number;
  percentage: number;
  count: number;
}

export interface FinanceAlert {
  type: 'WARNING' | 'DANGER' | 'INFO';
  title: string;
  message: string;
  link?: string;
}

export interface FinanceDashboardData {
  summary: {
    this_month_income: number;
    this_month_expense: number;
    net_profit: number;
    currencies: CurrencySummary[];
    unpaid_invoices_sum: number;
    unpaid_invoices_count: number;
    overdue_invoices_count: number;
  };
  cashflow_timeline: CashflowPoint[];
  category_breakdown: CategoryBreakdownItem[];
  budgets: {
    id: string;
    name: string;
    category_name: string;
    allocated: number;
    spent: number;
    remaining: number;
    percentage: number;
    currency: CurrencyCode;
    is_warning: boolean;
    is_exceeded: boolean;
  }[];
  alerts: FinanceAlert[];
}

// =============================================================================
// TONTINES & ÉPARGNE COLLECTIVE TYPES
// =============================================================================

export type TontineType = 'ROTATIVE' | 'ACCUMULATIVE' | 'SOLIDARITY';
export type TontineFrequency = 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'QUARTERLY';
export type TontineStatus = 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'PAUSED';
export type TontineRoundStatus = 'PENDING' | 'COLLECTING' | 'COLLECTED' | 'PAID_OUT' | 'CLOSED';

export interface TontineMember {
  id: string;
  tontine: string;
  full_name: string;
  phone?: string;
  email?: string;
  address?: string;
  shares_count: number | string;
  payout_order: number;
  expected_payout_date?: string;
  has_received_payout: boolean;
  status: 'ACTIVE' | 'SUSPENDED' | 'COMPLETED' | 'EXITED';
  status_display?: string;
  notes?: string;
  total_contributed?: number;
  total_received?: number;
  created_at: string;
}

export interface TontineContribution {
  id: string;
  tontine: string;
  round: string;
  round_number?: number;
  member: string;
  member_name?: string;
  amount: number | string;
  penalty_paid: number | string;
  payment_date: string;
  payment_method: PaymentMethod;
  payment_method_display?: string;
  reference?: string;
  status: 'PAID' | 'PENDING' | 'LATE';
  status_display?: string;
  transaction?: string;
  created_at: string;
}

export interface TontinePayout {
  id: string;
  tontine: string;
  round: string;
  round_number?: number;
  beneficiary: string;
  beneficiary_name?: string;
  gross_amount: number | string;
  deductions: number | string;
  net_amount: number | string;
  payout_date: string;
  payment_method: PaymentMethod;
  payment_method_display?: string;
  reference?: string;
  notes?: string;
  transaction?: string;
  created_at: string;
}

export interface TontineRound {
  id: string;
  tontine: string;
  round_number: number;
  due_date: string;
  beneficiary?: string | null;
  beneficiary_name?: string | null;
  target_amount: number | string;
  collected_amount: number | string;
  payout_amount: number | string;
  status: TontineRoundStatus;
  status_display?: string;
  payout_date?: string | null;
  notes?: string;
  contributions?: TontineContribution[];
  contributions_count?: number;
  expected_members_count?: number;
  created_at: string;
}

export interface TontineGroup {
  id: string;
  name: string;
  tontine_type: TontineType;
  tontine_type_display?: string;
  contribution_amount: number | string;
  currency: CurrencyCode;
  frequency: TontineFrequency;
  frequency_display?: string;
  start_date: string;
  end_date?: string;
  status: TontineStatus;
  status_display?: string;
  account?: string | null;
  account_name?: string | null;
  late_penalty_amount: number | string;
  description?: string;
  rules?: string;
  members_count?: number;
  rounds_count?: number;
  total_pot_per_round?: number;
  total_collected?: number;
  total_paid_out?: number;
  current_round?: {
    id: string;
    round_number: number;
    due_date: string;
    beneficiary_name: string | null;
    status: string;
    collected_amount: number;
    target_amount: number;
  } | null;
  members?: TontineMember[];
  rounds?: TontineRound[];
  created_at: string;
}

