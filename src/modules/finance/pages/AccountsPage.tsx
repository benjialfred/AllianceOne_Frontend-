import React, { useEffect, useState } from 'react';
import {
  Landmark, Plus, RefreshCw, ArrowRightLeft, Edit,
  Trash2, Wallet, CreditCard, Smartphone, CheckCircle,
  ExternalLink, Search
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { CurrencyBadge, formatMoney } from '../components/CurrencyBadge';
import { AccountModal } from '../components/AccountModal';
import { TransferModal } from '../components/TransferModal';
import { financeApi } from '../services/api';
import type { FinancialAccount, AccountType } from '../types';

export const AccountsPage: React.FC = () => {
  const [accounts, setAccounts] = useState<FinancialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accountToEdit, setAccountToEdit] = useState<FinancialAccount | null>(null);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  const loadAccounts = async () => {
    setLoading(true);
    try {
      const data = await financeApi.getAccounts();
      setAccounts(data);
    } catch (err) {
      console.error('Failed to load accounts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const handleRecalculate = async (id: string) => {
    try {
      await financeApi.recalculateAccountBalance(id);
      await loadAccounts();
    } catch (err) {
      console.error('Failed to recalculate balance:', err);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer le compte "${name}" ?`)) return;
    try {
      await financeApi.deleteAccount(id);
      await loadAccounts();
    } catch (err) {
      console.error('Failed to delete account:', err);
    }
  };

  const openCreateModal = () => {
    setAccountToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (acc: FinancialAccount) => {
    setAccountToEdit(acc);
    setIsModalOpen(true);
  };

  const getAccountIcon = (type: AccountType) => {
    switch (type) {
      case 'BANK': return <Landmark size={20} />;
      case 'CASH': return <Wallet size={20} />;
      case 'MOBILE_MONEY': return <Smartphone size={20} />;
      case 'ONLINE': return <CreditCard size={20} />;
      default: return <Landmark size={20} />;
    }
  };

  const filteredAccounts = accounts.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
      (a.institution_name && a.institution_name.toLowerCase().includes(search.toLowerCase())) ||
      (a.account_number && a.account_number.toLowerCase().includes(search.toLowerCase()));
    const matchesType = selectedType === 'ALL' || a.account_type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div style={{ padding: '1.5rem 2rem' }}>
      <PageHeader
        title="Comptes & Caisses de Trésorerie"
        subtitle="Gestion des comptes bancaires, caisses physiques, portefeuilles électroniques et devises."
        badge={`${accounts.length} Comptes`}
        actions={
          <div style={{ display: 'flex', gap: '8px' }}>
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
              <ArrowRightLeft size={16} /> Virement Interne
            </button>
            <button
              onClick={openCreateModal}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#0f172a',
                color: '#ffffff',
                fontSize: '0.875rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <Plus size={16} /> Nouveau Compte
            </button>
          </div>
        }
      />

      {/* Filter Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        {/* Search */}
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Rechercher par nom, banque, IBAN..."
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

        {/* Type selector */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: 'Tous' },
            { id: 'BANK', label: 'Banques' },
            { id: 'CASH', label: 'Caisses Espèces' },
            { id: 'MOBILE_MONEY', label: 'Mobile Money' },
            { id: 'ONLINE', label: 'En Ligne (Stripe, Paypal)' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setSelectedType(t.id)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: selectedType === t.id ? '1px solid #0f172a' : '1px solid #e2e8f0',
                backgroundColor: selectedType === t.id ? '#0f172a' : '#ffffff',
                color: selectedType === t.id ? '#ffffff' : '#64748b',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Accounts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '1.25rem'
      }}>
        {filteredAccounts.map(acc => {
          const balance = parseFloat(String(acc.current_balance)) || 0;
          const isNegative = balance < 0;

          return (
            <div
              key={acc.id}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Top color bar */}
              <div style={{ height: '6px', backgroundColor: acc.color || '#3b82f6' }} />

              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        backgroundColor: `${acc.color || '#3b82f6'}15`,
                        color: acc.color || '#3b82f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {getAccountIcon(acc.account_type)}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>{acc.name}</h3>
                          {acc.is_default && (
                            <span style={{ fontSize: '10px', fontWeight: 700, backgroundColor: '#eff6ff', color: '#2563eb', padding: '1px 6px', borderRadius: '4px' }}>
                              Défaut
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                          {acc.institution_name || acc.account_type_display}
                        </div>
                      </div>
                    </div>
                    <CurrencyBadge currency={acc.currency} />
                  </div>

                  {acc.account_number && (
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'monospace', marginBottom: '12px', backgroundColor: '#f8fafc', padding: '4px 8px', borderRadius: '4px' }}>
                      {acc.account_number}
                    </div>
                  )}

                  {/* Balance Display */}
                  <div style={{ margin: '14px 0 8px 0' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>Solde Disponible</div>
                    <div style={{
                      fontSize: '1.65rem',
                      fontWeight: 800,
                      letterSpacing: '-0.02em',
                      color: isNegative ? '#dc2626' : '#0f172a'
                    }}>
                      {formatMoney(balance, acc.currency)}
                    </div>
                  </div>
                </div>

                {/* Footer details & Actions */}
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {acc.transactions_count || 0} opération(s)
                  </span>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      title="Recalculer et synchroniser le solde"
                      onClick={() => handleRecalculate(acc.id)}
                      style={{ padding: '6px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', color: '#64748b', cursor: 'pointer' }}
                    >
                      <RefreshCw size={14} />
                    </button>
                    <button
                      title="Modifier"
                      onClick={() => openEditModal(acc)}
                      style={{ padding: '6px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', color: '#64748b', cursor: 'pointer' }}
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      title="Supprimer"
                      onClick={() => handleDelete(acc.id, acc.name)}
                      style={{ padding: '6px', borderRadius: '6px', border: '1px solid #fecaca', backgroundColor: '#fef2f2', color: '#dc2626', cursor: 'pointer' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      <AccountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadAccounts}
        accountToEdit={accountToEdit}
      />

      <TransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        onSuccess={loadAccounts}
      />
    </div>
  );
};
