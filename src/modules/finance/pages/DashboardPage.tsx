import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, TrendingDown, Landmark, ArrowDownRight,
  ArrowUpRight, ArrowRightLeft, Plus, RefreshCw,
  AlertTriangle, AlertCircle, FileText, PieChart,
  Calendar, CheckCircle2, DollarSign, Wallet
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { CurrencyBadge, formatMoney } from '../components/CurrencyBadge';
import { TransactionModal } from '../components/TransactionModal';
import { TransferModal } from '../components/TransferModal';
import { financeApi } from '../services/api';
import type {
  FinanceDashboardData, Transaction, CurrencyCode,
  FinancialAccount
} from '../types';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCurrency, setSelectedCurrency] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<FinanceDashboardData | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<FinancialAccount[]>([]);

  // Modals
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [txModalType, setTxModalType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [dashRes, txsRes, accsRes] = await Promise.all([
        financeApi.getDashboardData(selectedCurrency),
        financeApi.getTransactions(selectedCurrency !== 'ALL' ? { currency: selectedCurrency } : undefined),
        financeApi.getAccounts({ is_active: 'true' })
      ]);
      setDashboardData(dashRes);
      setRecentTransactions(txsRes.slice(0, 7));
      setAccounts(accsRes);
    } catch (err) {
      console.error('Failed to load finance dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCurrency]);

  const openTxModal = (type: 'INCOME' | 'EXPENSE') => {
    setTxModalType(type);
    setIsTxModalOpen(true);
  };

  const summary = dashboardData?.summary;
  const cashflow = dashboardData?.cashflow_timeline || [];
  const categories = dashboardData?.category_breakdown || [];
  const alerts = dashboardData?.alerts || [];
  const budgets = dashboardData?.budgets || [];

  // Max value for cashflow chart
  const maxCashflowVal = Math.max(
    ...cashflow.map(c => Math.max(c.income, c.expense)),
    100
  );

  return (
    <div style={{ padding: '1.5rem 2rem' }}>
      <PageHeader
        title="Tableau de Bord Financier & Trésorerie"
        subtitle="Supervision en temps réel des flux de trésorerie, multi-devises, budgets et facturation."
        badge="Multi-Devises API"
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* Currency Filter */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '2px',
              boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)'
            }}>
              {['ALL', 'EUR', 'USD', 'XOF', 'GBP', 'CAD'].map((cur) => (
                <button
                  key={cur}
                  onClick={() => setSelectedCurrency(cur)}
                  style={{
                    padding: '4px 10px',
                    fontSize: '11px',
                    fontWeight: 700,
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: selectedCurrency === cur ? '#0f172a' : 'transparent',
                    color: selectedCurrency === cur ? '#ffffff' : '#64748b',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {cur === 'ALL' ? '🌍 Toutes' : cur}
                </button>
              ))}
            </div>

            <button
              onClick={() => openTxModal('EXPENSE')}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid #fecaca',
                backgroundColor: '#fef2f2',
                color: '#dc2626',
                fontSize: '0.8rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <ArrowUpRight size={15} /> Dépense
            </button>

            <button
              onClick={() => openTxModal('INCOME')}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid #a7f3d0',
                backgroundColor: '#ecfdf5',
                color: '#059669',
                fontSize: '0.8rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <ArrowDownRight size={15} /> Encaissement
            </button>

            <button
              onClick={() => setIsTransferModalOpen(true)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid #bfdbfe',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                fontSize: '0.8rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <ArrowRightLeft size={15} /> Virement
            </button>
          </div>
        }
      />

      {/* Intelligent Alerts Banner */}
      {alerts.length > 0 && (
        <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {alerts.map((alt, idx) => (
            <div
              key={idx}
              style={{
                padding: '10px 16px',
                borderRadius: '10px',
                backgroundColor: alt.type === 'DANGER' ? '#fef2f2' : '#fffbeb',
                border: `1px solid ${alt.type === 'DANGER' ? '#fecaca' : '#fde68a'}`,
                color: alt.type === 'DANGER' ? '#991b1b' : '#92400e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.85rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {alt.type === 'DANGER' ? <AlertCircle size={18} /> : <AlertTriangle size={18} />}
                <div>
                  <strong>{alt.title} :</strong> {alt.message}
                </div>
              </div>
              {alt.link && (
                <button
                  onClick={() => navigate(alt.link!)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: alt.type === 'DANGER' ? '#ef4444' : '#f59e0b',
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Examiner
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Multi-Currency Balances Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        {summary?.currencies && summary.currencies.length > 0 ? (
          summary.currencies.map(cur => (
            <div
              key={cur.currency}
              onClick={() => setSelectedCurrency(cur.currency)}
              style={{
                backgroundColor: selectedCurrency === cur.currency ? '#0f172a' : '#ffffff',
                color: selectedCurrency === cur.currency ? '#ffffff' : '#0f172a',
                padding: '1.25rem',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
                cursor: 'pointer',
                transition: 'transform 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: selectedCurrency === cur.currency ? '#94a3b8' : '#64748b' }}>
                  Solde {cur.label}
                </span>
                <CurrencyBadge currency={cur.currency} />
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                {formatMoney(cur.total_balance, cur.currency)}
              </div>
              <div style={{ fontSize: '0.7rem', color: selectedCurrency === cur.currency ? '#94a3b8' : '#94a3b8', marginTop: '4px' }}>
                {cur.accounts_count} compte(s) actif(s)
              </div>
            </div>
          ))
        ) : (
          <div style={{
            backgroundColor: '#ffffff',
            padding: '1.25rem',
            borderRadius: '12px',
            border: '1px dashed #cbd5e1',
            gridColumn: '1 / -1',
            textAlign: 'center',
            color: '#64748b',
            fontSize: '0.875rem'
          }}>
            Aucun compte financier configuré pour le moment. Cliquez sur "Comptes" pour créer votre premier compte bancaire ou caisse.
          </div>
        )}
      </div>

      {/* KPI Hero Cards (Income / Expense / Net / Unpaid Invoices) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        {/* Incomes */}
        <div style={{
          backgroundColor: '#ffffff',
          padding: '1.25rem',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Entrées du Mois</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#059669' }}>
            +{formatMoney(summary?.this_month_income || 0, selectedCurrency !== 'ALL' ? (selectedCurrency as CurrencyCode) : 'EUR')}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '6px' }}>
            Recettes encaissées ce mois
          </div>
        </div>

        {/* Expenses */}
        <div style={{
          backgroundColor: '#ffffff',
          padding: '1.25rem',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Sorties du Mois</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#fef2f2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingDown size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#dc2626' }}>
            -{formatMoney(summary?.this_month_expense || 0, selectedCurrency !== 'ALL' ? (selectedCurrency as CurrencyCode) : 'EUR')}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '6px' }}>
            Dépenses décaissées ce mois
          </div>
        </div>

        {/* Net Margin */}
        <div style={{
          backgroundColor: '#ffffff',
          padding: '1.25rem',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Résultat Net (Cash)</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: (summary?.net_profit || 0) >= 0 ? '#eff6ff' : '#fff7ed', color: (summary?.net_profit || 0) >= 0 ? '#2563eb' : '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Wallet size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: (summary?.net_profit || 0) >= 0 ? '#2563eb' : '#ea580c' }}>
            {(summary?.net_profit || 0) >= 0 ? '+' : ''}{formatMoney(summary?.net_profit || 0, selectedCurrency !== 'ALL' ? (selectedCurrency as CurrencyCode) : 'EUR')}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '6px' }}>
            Flux net généré sur la période
          </div>
        </div>

        {/* Invoices Due */}
        <div style={{
          backgroundColor: '#ffffff',
          padding: '1.25rem',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Factures à Encaisser</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#7c3aed' }}>
            {formatMoney(summary?.unpaid_invoices_sum || 0, selectedCurrency !== 'ALL' ? (selectedCurrency as CurrencyCode) : 'EUR')}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '6px' }}>
            {summary?.unpaid_invoices_count || 0} facture(s) en attente / retard
          </div>
        </div>
      </div>

      {/* Main Charts Row: Cashflow Graph & Category Breakdown */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '1.5rem',
        marginBottom: '1.5rem'
      }}>
        {/* Cashflow Bar Chart */}
        <div style={{
          backgroundColor: '#ffffff',
          padding: '1.5rem',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                Flux Mensuels de Trésorerie (6 derniers mois)
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '2px 0 0 0' }}>
                Comparatif des encaissements et décaissements réels
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.75rem', fontWeight: 600 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#10b981' }}></span>
                Revenus
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#ef4444' }}></span>
                Dépenses
              </span>
            </div>
          </div>

          {/* Bar Graphic Container */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            height: '200px',
            paddingTop: '20px',
            borderBottom: '1px solid #e2e8f0',
            gap: '12px'
          }}>
            {cashflow.map((cf, idx) => {
              const inHeight = maxCashflowVal > 0 ? (cf.income / maxCashflowVal) * 160 : 4;
              const outHeight = maxCashflowVal > 0 ? (cf.expense / maxCashflowVal) * 160 : 4;

              return (
                <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', width: '100%', justifyContent: 'center' }}>
                    {/* Income Bar */}
                    <div
                      title={`Revenus: ${cf.income.toLocaleString()}`}
                      style={{
                        width: '40%',
                        maxWidth: '24px',
                        height: `${Math.max(4, inHeight)}px`,
                        backgroundColor: '#10b981',
                        borderRadius: '4px 4px 0 0',
                        transition: 'height 0.3s ease'
                      }}
                    />
                    {/* Expense Bar */}
                    <div
                      title={`Dépenses: ${cf.expense.toLocaleString()}`}
                      style={{
                        width: '40%',
                        maxWidth: '24px',
                        height: `${Math.max(4, outHeight)}px`,
                        backgroundColor: '#ef4444',
                        borderRadius: '4px 4px 0 0',
                        transition: 'height 0.3s ease'
                      }}
                    />
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '8px', fontWeight: 600 }}>
                    {cf.month_name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Expenses Category Breakdown */}
        <div style={{
          backgroundColor: '#ffffff',
          padding: '1.5rem',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
              Dépenses par Poste
            </h3>
            <button
              onClick={() => navigate('/finance/categories')}
              style={{ border: 'none', background: 'transparent', color: '#2563eb', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
            >
              Gérer
            </button>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto' }}>
            {categories.length > 0 ? (
              categories.map((cat, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: '#1e293b' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: cat.color }}></span>
                      {cat.name}
                    </span>
                    <span style={{ color: '#64748b' }}>
                      {cat.total_spent.toLocaleString('fr-FR')} ({cat.percentage}%)
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${cat.percentage}%`,
                        height: '100%',
                        backgroundColor: cat.color,
                        borderRadius: '3px'
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem', margin: 'auto' }}>
                Aucune dépense catégorisée ce mois-ci.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row: Budgets Consumption & Recent Transactions Table */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.5fr',
        gap: '1.5rem'
      }}>
        {/* Budgets Tracking */}
        <div style={{
          backgroundColor: '#ffffff',
          padding: '1.5rem',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
              Enveloppes Budgétaires
            </h3>
            <button
              onClick={() => navigate('/finance/budgets')}
              style={{ border: 'none', background: 'transparent', color: '#2563eb', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
            >
              Tous les budgets
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {budgets.length > 0 ? (
              budgets.map((b) => (
                <div key={b.id} style={{ padding: '10px 12px', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a' }}>{b.name}</span>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: b.is_exceeded ? '#dc2626' : (b.is_warning ? '#d97706' : '#059669'),
                      backgroundColor: b.is_exceeded ? '#fef2f2' : (b.is_warning ? '#fffbeb' : '#ecfdf5'),
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      {b.percentage}%
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden', marginBottom: '6px' }}>
                    <div
                      style={{
                        width: `${Math.min(100, b.percentage)}%`,
                        height: '100%',
                        backgroundColor: b.is_exceeded ? '#ef4444' : (b.is_warning ? '#f59e0b' : '#10b981')
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b' }}>
                    <span>Dépensé : {formatMoney(b.spent, b.currency)}</span>
                    <span>Alloué : {formatMoney(b.allocated, b.currency)}</span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem', padding: '1rem 0' }}>
                Aucun budget actif. Créez des enveloppes pour contrôler vos coûts.
              </div>
            )}
          </div>
        </div>

        {/* Recent Transactions Table */}
        <div style={{
          backgroundColor: '#ffffff',
          padding: '1.5rem',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
              Dernières Opérations
            </h3>
            <button
              onClick={() => navigate('/finance/transactions')}
              style={{ border: 'none', background: 'transparent', color: '#2563eb', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
            >
              Voir le journal complet
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', textAlign: 'left' }}>
                  <th style={{ padding: '8px 10px' }}>Date</th>
                  <th style={{ padding: '8px 10px' }}>Opération</th>
                  <th style={{ padding: '8px 10px' }}>Compte</th>
                  <th style={{ padding: '8px 10px', textAlign: 'right' }}>Montant</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((tx) => (
                    <tr key={tx.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '8px 10px', color: '#64748b', whiteSpace: 'nowrap' }}>
                        {tx.date}
                      </td>
                      <td style={{ padding: '8px 10px' }}>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{tx.title}</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                          {tx.category_name || (tx.transaction_type === 'TRANSFER' ? 'Virement interne' : 'Non classé')}
                        </div>
                      </td>
                      <td style={{ padding: '8px 10px', whiteSpace: 'nowrap' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: '#f1f5f9',
                          color: '#334155',
                          fontSize: '0.75rem',
                          fontWeight: 500
                        }}>
                          {tx.account_name}
                        </span>
                      </td>
                      <td style={{
                        padding: '8px 10px',
                        textAlign: 'right',
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        color: tx.transaction_type === 'INCOME' ? '#059669' : (tx.transaction_type === 'EXPENSE' ? '#dc2626' : '#2563eb')
                      }}>
                        {tx.transaction_type === 'INCOME' ? '+' : (tx.transaction_type === 'EXPENSE' ? '-' : '⇄ ')}
                        {formatMoney(tx.amount, tx.currency)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '1.5rem', color: '#94a3b8' }}>
                      Aucune transaction enregistrée.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={() => setIsTxModalOpen(false)}
        onSuccess={loadData}
        initialType={txModalType}
      />

      <TransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
};
