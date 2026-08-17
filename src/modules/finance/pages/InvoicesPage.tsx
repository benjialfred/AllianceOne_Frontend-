import React, { useEffect, useState } from 'react';
import {
  FileText, Plus, Search, Filter, CheckCircle2,
  Clock, AlertCircle, CreditCard, Send, Edit, Trash2,
  DollarSign, ArrowUpRight, ArrowDownRight, Eye
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { CurrencyBadge, formatMoney } from '../components/CurrencyBadge';
import { InvoiceModal } from '../components/InvoiceModal';
import { InvoicePaymentModal } from '../components/InvoicePaymentModal';
import { financeApi } from '../services/api';
import type { Invoice, InvoiceType, InvoiceStatus, CurrencyCode } from '../types';

export const InvoicesPage: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterCurrency, setFilterCurrency] = useState<string>('ALL');

  // Modals
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [invoiceToEdit, setInvoiceToEdit] = useState<Invoice | null>(null);
  const [initialInvoiceType, setInitialInvoiceType] = useState<InvoiceType>('OUTGOING');

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [invoiceForPayment, setInvoiceForPayment] = useState<Invoice | null>(null);

  const loadInvoices = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (filterType !== 'ALL') params.type = filterType;
      if (filterStatus !== 'ALL') params.status = filterStatus;
      if (filterCurrency !== 'ALL') params.currency = filterCurrency;

      const data = await financeApi.getInvoices(params);
      setInvoices(data);
    } catch (err) {
      console.error('Failed to load invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, [filterType, filterStatus, filterCurrency]);

  const handleDelete = async (id: string, num: string) => {
    if (!window.confirm(`Supprimer la pièce commerciale "${num}" ?`)) return;
    try {
      await financeApi.deleteInvoice(id);
      await loadInvoices();
    } catch (err) {
      console.error('Failed to delete invoice:', err);
    }
  };

  const handleMarkStatus = async (id: string, newStatus: string) => {
    try {
      await financeApi.markInvoiceStatus(id, newStatus);
      await loadInvoices();
    } catch (err) {
      console.error('Failed to update invoice status:', err);
    }
  };

  const openCreateModal = (type: InvoiceType = 'OUTGOING') => {
    setInvoiceToEdit(null);
    setInitialInvoiceType(type);
    setIsInvoiceModalOpen(true);
  };

  const openEditModal = (inv: Invoice) => {
    setInvoiceToEdit(inv);
    setInitialInvoiceType(inv.invoice_type);
    setIsInvoiceModalOpen(true);
  };

  const openPaymentModal = (inv: Invoice) => {
    setInvoiceForPayment(inv);
    setIsPaymentModalOpen(true);
  };

  const getStatusBadge = (status: InvoiceStatus, display?: string) => {
    switch (status) {
      case 'PAID':
        return { bg: '#ecfdf5', color: '#047857', border: '#a7f3d0', label: display || 'Payée' };
      case 'PARTIAL':
        return { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe', label: display || 'Partiellement Payée' };
      case 'OVERDUE':
        return { bg: '#fef2f2', color: '#b91c1c', border: '#fecaca', label: display || 'En Retard' };
      case 'SENT':
        return { bg: '#fffbeb', color: '#b45309', border: '#fde68a', label: display || 'Émise / En attente' };
      case 'CANCELLED':
        return { bg: '#f1f5f9', color: '#64748b', border: '#cbd5e1', label: display || 'Annulée' };
      default:
        return { bg: '#f8fafc', color: '#475569', border: '#e2e8f0', label: display || 'Brouillon' };
    }
  };

  const filteredInvoices = invoices.filter(inv => {
    const s = search.toLowerCase();
    return (
      inv.invoice_number.toLowerCase().includes(s) ||
      inv.partner_name.toLowerCase().includes(s) ||
      (inv.partner_email && inv.partner_email.toLowerCase().includes(s))
    );
  });

  return (
    <div style={{ padding: '1.5rem 2rem' }}>
      <PageHeader
        title="Facturation & Documents Commerciaux"
        subtitle="Émission de factures clients, suivi des factures fournisseurs, devis et enregistrement des règlements."
        badge={`${invoices.length} Factures`}
        actions={
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => openCreateModal('QUOTATION')}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#334155',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              + Nouveau Devis
            </button>

            <button
              onClick={() => openCreateModal('INCOMING')}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid #fecaca',
                backgroundColor: '#fef2f2',
                color: '#dc2626',
                fontSize: '0.875rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <ArrowUpRight size={16} /> Facture Fournisseur
            </button>

            <button
              onClick={() => openCreateModal('OUTGOING')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                fontSize: '0.875rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <Plus size={16} /> Facture Client (Vente)
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
            placeholder="Rechercher par numéro, tiers, email..."
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

        {/* Type filter */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', backgroundColor: '#fff' }}
        >
          <option value="ALL">Tous les Documents</option>
          <option value="OUTGOING">Factures Clients (Ventes)</option>
          <option value="INCOMING">Factures Fournisseurs (Achats)</option>
          <option value="QUOTATION">Devis / Proforma</option>
        </select>

        {/* Status filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', backgroundColor: '#fff' }}
        >
          <option value="ALL">Tous les Statuts</option>
          <option value="DRAFT">Brouillons</option>
          <option value="SENT">Émises / En Attente</option>
          <option value="PARTIAL">Partiellement Payées</option>
          <option value="PAID">Payées Intégralement</option>
          <option value="OVERDUE">En Retard de Paiement</option>
        </select>

        {/* Currency filter */}
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
        </select>
      </div>

      {/* Invoices Table */}
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
                <th style={{ padding: '12px 16px' }}>N° Facture</th>
                <th style={{ padding: '12px 16px' }}>Type</th>
                <th style={{ padding: '12px 16px' }}>Tiers (Client / Fournisseur)</th>
                <th style={{ padding: '12px 16px' }}>Date Émission</th>
                <th style={{ padding: '12px 16px' }}>Échéance</th>
                <th style={{ padding: '12px 16px' }}>Statut</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Total TTC</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Reste Dû</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map(inv => {
                  const badge = getStatusBadge(inv.status, inv.status_display);
                  const isPaid = inv.status === 'PAID';
                  const remaining = parseFloat(String(inv.remaining_due)) || 0;

                  return (
                    <tr key={inv.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      {/* Number */}
                      <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap' }}>
                        {inv.invoice_number}
                      </td>

                      {/* Type */}
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: inv.invoice_type === 'OUTGOING' ? '#eff6ff' : (inv.invoice_type === 'INCOMING' ? '#fef2f2' : '#f8fafc'),
                          color: inv.invoice_type === 'OUTGOING' ? '#2563eb' : (inv.invoice_type === 'INCOMING' ? '#dc2626' : '#475569')
                        }}>
                          {inv.invoice_type_display}
                        </span>
                      </td>

                      {/* Partner */}
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{inv.partner_name}</div>
                        {inv.partner_email && (
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{inv.partner_email}</div>
                        )}
                      </td>

                      {/* Issue Date */}
                      <td style={{ padding: '12px 16px', color: '#64748b', whiteSpace: 'nowrap' }}>
                        {inv.issue_date}
                      </td>

                      {/* Due Date */}
                      <td style={{ padding: '12px 16px', color: '#64748b', whiteSpace: 'nowrap' }}>
                        {inv.due_date}
                      </td>

                      {/* Status */}
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                        <span style={{
                          display: 'inline-block',
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          backgroundColor: badge.bg,
                          color: badge.color,
                          border: `1px solid ${badge.border}`
                        }}>
                          {badge.label}
                        </span>
                      </td>

                      {/* Total */}
                      <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap' }}>
                        {formatMoney(inv.total_amount, inv.currency)}
                      </td>

                      {/* Remaining Due */}
                      <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: remaining > 0 ? '#dc2626' : '#059669', whiteSpace: 'nowrap' }}>
                        {formatMoney(remaining, inv.currency)}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '12px 16px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                          {!isPaid && (
                            <button
                              title="Enregistrer un règlement"
                              onClick={() => openPaymentModal(inv)}
                              style={{
                                padding: '4px 8px',
                                borderRadius: '6px',
                                border: '1px solid #a7f3d0',
                                backgroundColor: '#ecfdf5',
                                color: '#059669',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                cursor: 'pointer'
                              }}
                            >
                              <CreditCard size={13} /> Payer
                            </button>
                          )}

                          <button
                            title="Modifier"
                            onClick={() => openEditModal(inv)}
                            style={{ padding: '4px 6px', borderRadius: '4px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', color: '#64748b', cursor: 'pointer' }}
                          >
                            <Edit size={13} />
                          </button>

                          <button
                            title="Supprimer"
                            onClick={() => handleDelete(inv.id, inv.invoice_number)}
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
                  <td colSpan={9} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                    Aucune facture ne correspond aux critères sélectionnés.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        onSuccess={loadInvoices}
        invoiceToEdit={invoiceToEdit}
        initialType={initialInvoiceType}
      />

      <InvoicePaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={loadInvoices}
        invoice={invoiceForPayment}
      />
    </div>
  );
};
