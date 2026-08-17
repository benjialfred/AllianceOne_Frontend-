import React, { useEffect, useState } from 'react';
import {
  PieChart, Plus, AlertTriangle, AlertCircle, CheckCircle,
  Calendar, Edit, Trash2, Tag, TrendingUp
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { CurrencyBadge, formatMoney } from '../components/CurrencyBadge';
import { BudgetModal } from '../components/BudgetModal';
import { financeApi } from '../services/api';
import type { Budget } from '../types';

export const BudgetsPage: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [budgetToEdit, setBudgetToEdit] = useState<Budget | null>(null);

  const loadBudgets = async () => {
    setLoading(true);
    try {
      const data = await financeApi.getBudgets();
      setBudgets(data);
    } catch (err) {
      console.error('Failed to load budgets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBudgets();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Supprimer l'enveloppe budgétaire "${name}" ?`)) return;
    try {
      await financeApi.deleteBudget(id);
      await loadBudgets();
    } catch (err) {
      console.error('Failed to delete budget:', err);
    }
  };

  const openCreateModal = () => {
    setBudgetToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (b: Budget) => {
    setBudgetToEdit(b);
    setIsModalOpen(true);
  };

  // Aggregated totals
  const totalAllocated = budgets.reduce((acc, b) => acc + (parseFloat(String(b.allocated_amount)) || 0), 0);
  const totalSpent = budgets.reduce((acc, b) => acc + (b.spent_amount || 0), 0);
  const totalRemaining = Math.max(0, totalAllocated - totalSpent);

  return (
    <div style={{ padding: '1.5rem 2rem' }}>
      <PageHeader
        title="Budgets Prévisionnels & Enveloppes"
        subtitle="Contrôle des coûts, plafonds de dépenses par catégorie et alertes de dépassement."
        badge={`${budgets.length} Budgets Actifs`}
        actions={
          <button
            onClick={openCreateModal}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#c026d3',
              color: '#ffffff',
              fontSize: '0.875rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <Plus size={16} /> Nouveau Budget
          </button>
        }
      />

      {/* Summary Banner */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>Total Enveloppes Allouées</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>{formatMoney(totalAllocated, 'EUR')}</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>Total Consommé Réel</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: totalSpent > totalAllocated ? '#dc2626' : '#2563eb' }}>{formatMoney(totalSpent, 'EUR')}</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>Marge / Reste Disponible</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#059669' }}>{formatMoney(totalRemaining, 'EUR')}</div>
        </div>
      </div>

      {/* Grid of Budget Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '1.25rem'
      }}>
        {budgets.map(b => {
          const isExceeded = b.is_exceeded;
          const isWarning = b.is_warning;
          const statusColor = isExceeded ? '#ef4444' : (isWarning ? '#f59e0b' : '#10b981');
          const statusBg = isExceeded ? '#fef2f2' : (isWarning ? '#fffbeb' : '#ecfdf5');

          return (
            <div
              key={b.id}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                {/* Card Top */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>{b.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: b.category_color || '#64748b',
                        backgroundColor: `${b.category_color || '#64748b'}15`,
                        padding: '2px 8px',
                        borderRadius: '4px'
                      }}>
                        <Tag size={12} /> {b.category_name}
                      </span>
                      <CurrencyBadge currency={b.currency} />
                    </div>
                  </div>

                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    backgroundColor: statusBg,
                    color: statusColor,
                    border: `1px solid ${statusColor}30`
                  }}>
                    {b.percentage_used}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div style={{ margin: '14px 0 10px 0' }}>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${Math.min(100, b.percentage_used)}%`,
                        height: '100%',
                        backgroundColor: statusColor,
                        borderRadius: '4px',
                        transition: 'width 0.3s ease'
                      }}
                    />
                  </div>
                </div>

                {/* Amounts Breakdown */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px', fontSize: '0.8rem' }}>
                  <div style={{ backgroundColor: '#f8fafc', padding: '8px 10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ color: '#64748b', fontSize: '0.7rem' }}>Dépensé Réel</div>
                    <div style={{ fontWeight: 700, color: statusColor }}>{formatMoney(b.spent_amount, b.currency)}</div>
                  </div>

                  <div style={{ backgroundColor: '#f8fafc', padding: '8px 10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ color: '#64748b', fontSize: '0.7rem' }}>Plafond Alloué</div>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{formatMoney(b.allocated_amount, b.currency)}</div>
                  </div>
                </div>

                {/* Dates & Alert status */}
                <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <Calendar size={13} />
                  <span>Période : {b.start_date} au {b.end_date}</span>
                </div>

                {isExceeded && (
                  <div style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertCircle size={13} /> Dépassement de {formatMoney((b.spent_amount - (parseFloat(String(b.allocated_amount)) || 0)), b.currency)} !
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '10px', marginTop: '10px', display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                <button
                  onClick={() => openEditModal(b)}
                  style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', color: '#64748b', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Edit size={13} /> Modifier
                </button>
                <button
                  onClick={() => handleDelete(b.id, b.name)}
                  style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #fecaca', backgroundColor: '#fef2f2', color: '#dc2626', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Trash2 size={13} /> Supprimer
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <BudgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadBudgets}
        budgetToEdit={budgetToEdit}
      />
    </div>
  );
};
