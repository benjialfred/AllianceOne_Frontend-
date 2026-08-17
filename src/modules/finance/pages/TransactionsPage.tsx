import React, { useEffect, useState } from 'react';
import {
  ArrowDownRight, ArrowUpRight, ArrowRightLeft, Plus,
  Search, Filter, Download, Trash2, Edit, CheckCircle,
  Clock, XCircle, FileText, Calendar
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { CurrencyBadge, formatMoney } from '../components/CurrencyBadge';
import { TransactionModal } from '../components/TransactionModal';
import { TransferModal } from '../components/TransferModal';
import { financeApi } from '../services/api';
import type {
  Transaction, FinancialAccount, FinancialCategory,
  TransactionType, CurrencyCode
} from '../types';

export const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<FinancialAccount[]>([]);
  const [categories, setCategories] = useState<FinancialCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterAccount, setFilterAccount] = useState<string>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterCurrency, setFilterCurrency] = useState<string>('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Modals
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [txModalType, setTxModalType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (filterType !== 'ALL') params.type = filterType;
      if (filterAccount !== 'ALL') params.account = filterAccount;
      if (filterCategory !== 'ALL') params.category = filterCategory;
      if (filterCurrency !== 'ALL') params.currency = filterCurrency;
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const [txs, accs, cats] = await Promise.all([
        financeApi.getTransactions(params),
        financeApi.getAccounts({ is_active: 'true' }),
        financeApi.getCategories()
      ]);
      setTransactions(txs);
      setAccounts(accs);
      setCategories(cats);
    } catch (err) {
      console.error('Failed to load transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filterType, filterAccount, filterCategory, filterCurrency, startDate, endDate]);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Supprimer la transaction "${title}" ? Les soldes des comptes seront réajustés automatiquement.`)) return;
    try {
      await financeApi.deleteTransaction(id);
      await loadData();
    } catch (err) {
      console.error('Failed to delete transaction:', err);
    }
  };

  const handleExportCsv = () => {
    const baseUrl = 'http://127.0.0.1:8000/api/finance/transactions/export_csv/';
    window.open(baseUrl, '_blank');
  };

  const openNewTx = (type: 'INCOME' | 'EXPENSE') => {
    setTransactionToEdit(null);
    setTxModalType(type);
    setIsTxModalOpen(true);
  };

  const openEditTx = (tx: Transaction) => {
    if (tx.transaction_type === 'TRANSFER') {
      alert('La modification directe des virements internes n\'est pas autorisée pour préserver l\'intégrité des soldes. Vous pouvez supprimer le virement et le recréer.');
      return;
    }
    setTransactionToEdit(tx);
    setTxModalType(tx.transaction_type as 'INCOME' | 'EXPENSE');
    setIsTxModalOpen(true);
  };

  const filteredTransactions = transactions.filter(tx => {
    const s = search.toLowerCase();
    return (
      tx.title.toLowerCase().includes(s) ||
      (tx.payee_payer && tx.payee_payer.toLowerCase().includes(s)) ||
      (tx.reference_number && tx.reference_number.toLowerCase().includes(s)) ||
      (tx.notes && tx.notes.toLowerCase().includes(s))
    );
  });

  return (
    <div style={{ padding: '1.5rem 2rem' }}>
      <PageHeader
        title="Journal des Opérations & Transactions"
        subtitle="Historique détaillé de toutes les entrées, sorties et transferts de fonds de l'entreprise."
        badge={`${transactions.length} Écritures`}
        actions={
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={handleExportCsv}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#334155',
                fontSize: '0.875rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <Download size={16} /> Exporter CSV
            </button>

            <button
              onClick={() => setIsTransferModalOpen(true)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid #bfdbfe',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                fontSize: '0.875rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <ArrowRightLeft size={16} /> Virement
            </button>

            <button
              onClick={() => openNewTx('EXPENSE')}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#dc2626',
                color: '#ffffff',
                fontSize: '0.875rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <ArrowUpRight size={16} /> Dépense
            </button>

            <button
              onClick={() => openNewTx('INCOME')}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#059669',
                color: '#ffffff',
                fontSize: '0.875rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <ArrowDownRight size={16} /> Encaissement
            </button>
          </div>
        }
      />

      {/* Filter Toolbar */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '1rem 1.25rem',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        marginBottom: '1.5rem',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        alignItems: 'center'
      }}>
        {/* Search */}
        <div style={{ position: 'relative', minWidth: '240px', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Rechercher par libellé, tiers, référence..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 34px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.85rem',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Type Filter */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', backgroundColor: '#fff' }}
        >
          <option value="ALL">Tous les Types</option>
          <option value="INCOME">Recettes (+) uniquement</option>
          <option value="EXPENSE">Dépenses (-) uniquement</option>
          <option value="TRANSFER">Virements (⇄) uniquement</option>
        </select>

        {/* Account Filter */}
        <select
          value={filterAccount}
          onChange={(e) => setFilterAccount(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', backgroundColor: '#fff' }}
        >
          <option value="ALL">Tous les Comptes</option>
          {accounts.map(a => (
            <option key={a.id} value={a.id}>{a.name} ({a.currency})</option>
          ))}
        </select>

        {/* Category Filter */}
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', backgroundColor: '#fff' }}
        >
          <option value="ALL">Toutes les Catégories</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>
              {c.category_type === 'INCOME' ? '[+]' : '[-]'} {c.name}
            </option>
          ))}
        </select>

        {/* Currency Filter */}
        <select
          value={filterCurrency}
          onChange={(e) => setFilterCurrency(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', backgroundColor: '#fff' }}
        >
          <option value="ALL">Toutes les Devises</option>
          <option value="EUR">EUR (€)</option>
          <option value="USD">USD ($)</option>
          <option value="XOF">XOF (CFA)</option>
          <option value="GBP">GBP (£)</option>
          <option value="CAD">CAD ($ CA)</option>
          <option value="CHF">CHF</option>
        </select>

        {/* Date range */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
          />
          <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>à</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', textAlign: 'left' }}>
                <th style={{ padding: '12px 16px' }}>Date</th>
                <th style={{ padding: '12px 16px' }}>Type</th>
                <th style={{ padding: '12px 16px' }}>Libellé & Tiers</th>
                <th style={{ padding: '12px 16px' }}>Catégorie</th>
                <th style={{ padding: '12px 16px' }}>Compte</th>
                <th style={{ padding: '12px 16px' }}>Moyen & Réf.</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Montant</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', width: '80px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map(tx => {
                  const isIncome = tx.transaction_type === 'INCOME';
                  const isTransfer = tx.transaction_type === 'TRANSFER';

                  return (
                    <tr key={tx.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      {/* Date */}
                      <td style={{ padding: '12px 16px', color: '#64748b', whiteSpace: 'nowrap' }}>
                        {tx.date}
                      </td>

                      {/* Type Badge */}
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 700,
                          backgroundColor: isIncome ? '#ecfdf5' : (isTransfer ? '#eff6ff' : '#fef2f2'),
                          color: isIncome ? '#047857' : (isTransfer ? '#1d4ed8' : '#b91c1c')
                        }}>
                          {isIncome ? <ArrowDownRight size={13} /> : (isTransfer ? <ArrowRightLeft size={13} /> : <ArrowUpRight size={13} />)}
                          {tx.transaction_type_display}
                        </span>
                      </td>

                      {/* Title & Payee */}
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{tx.title}</div>
                        {tx.payee_payer && (
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                            Tiers : {tx.payee_payer}
                          </div>
                        )}
                      </td>

                      {/* Category */}
                      <td style={{ padding: '12px 16px' }}>
                        {tx.category_name ? (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            backgroundColor: '#f1f5f9',
                            color: '#334155',
                            fontSize: '0.75rem',
                            fontWeight: 500
                          }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: tx.category_color || '#94a3b8' }}></span>
                            {tx.category_name}
                          </span>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                            {isTransfer ? 'Transfert interne' : 'Non classé'}
                          </span>
                        )}
                      </td>

                      {/* Account */}
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                        <div style={{ fontWeight: 600, color: '#334155', fontSize: '0.8rem' }}>
                          {tx.account_name}
                        </div>
                        {isTransfer && tx.destination_account_name && (
                          <div style={{ fontSize: '0.7rem', color: '#2563eb' }}>
                            ↳ vers {tx.destination_account_name}
                          </div>
                        )}
                      </td>

                      {/* Payment Method & Reference */}
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                        <div style={{ fontSize: '0.8rem', color: '#334155' }}>
                          {tx.payment_method_display}
                        </div>
                        {tx.reference_number && (
                          <div style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: 'monospace' }}>
                            {tx.reference_number}
                          </div>
                        )}
                      </td>

                      {/* Amount */}
                      <td style={{
                        padding: '12px 16px',
                        textAlign: 'right',
                        fontWeight: 800,
                        fontSize: '0.95rem',
                        whiteSpace: 'nowrap',
                        color: isIncome ? '#059669' : (isTransfer ? '#2563eb' : '#dc2626')
                      }}>
                        {isIncome ? '+' : (isTransfer ? '⇄ ' : '-')}{formatMoney(tx.amount, tx.currency)}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '12px 16px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                          {!isTransfer && (
                            <button
                              title="Modifier"
                              onClick={() => openEditTx(tx)}
                              style={{ padding: '4px 6px', borderRadius: '4px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', color: '#64748b', cursor: 'pointer' }}
                            >
                              <Edit size={13} />
                            </button>
                          )}
                          <button
                            title="Supprimer"
                            onClick={() => handleDelete(tx.id, tx.title)}
                            style={{ padding: '4px 6px', borderRadius: '4px', border: '1px solid #fecaca', backgroundColor: '#fef2f2', color: '#dc2626', cursor: 'pointer' }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                    Aucune transaction ne correspond à vos critères de recherche.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={() => setIsTxModalOpen(false)}
        onSuccess={loadData}
        initialType={txModalType}
        transactionToEdit={transactionToEdit}
      />

      <TransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
};
