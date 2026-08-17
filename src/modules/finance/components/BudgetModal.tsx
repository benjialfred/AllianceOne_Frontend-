import React, { useState, useEffect } from 'react';
import { X, PieChart, DollarSign, Calendar } from 'lucide-react';
import { financeApi } from '../services/api';
import type { Budget, FinancialCategory, BudgetPeriod, CurrencyCode } from '../types';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  budgetToEdit?: Budget | null;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  budgetToEdit
}) => {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [allocatedAmount, setAllocatedAmount] = useState('');
  const [currency, setCurrency] = useState<CurrencyCode>('EUR');
  const [period, setPeriod] = useState<BudgetPeriod>('MONTHLY');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [threshold, setThreshold] = useState('80');
  const [notes, setNotes] = useState('');

  const [categories, setCategories] = useState<FinancialCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadCategories();
      const today = new Date();
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];

      if (budgetToEdit) {
        setName(budgetToEdit.name);
        setCategoryId(budgetToEdit.category);
        setAllocatedAmount(String(budgetToEdit.allocated_amount));
        setCurrency(budgetToEdit.currency);
        setPeriod(budgetToEdit.period);
        setStartDate(budgetToEdit.start_date);
        setEndDate(budgetToEdit.end_date);
        setThreshold(String(budgetToEdit.alert_threshold_percentage));
        setNotes(budgetToEdit.notes || '');
      } else {
        setName('');
        setAllocatedAmount('');
        setCurrency('EUR');
        setPeriod('MONTHLY');
        setStartDate(firstDay);
        setEndDate(lastDay);
        setThreshold('80');
        setNotes('');
      }
      setError(null);
    }
  }, [isOpen, budgetToEdit]);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const cats = await financeApi.getCategories({ category_type: 'EXPENSE' });
      setCategories(cats);
      if (cats.length > 0 && !categoryId && !budgetToEdit) {
        setCategoryId(cats[0].id);
      }
    } catch (err) {
      console.error('Failed to load expense categories:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !categoryId || !allocatedAmount || parseFloat(allocatedAmount) <= 0 || !startDate || !endDate) {
      setError('Veuillez remplir tous les champs obligatoires (nom, catégorie, montant, dates).');
      return;
    }

    setSubmitting(true);
    try {
      const payload: Partial<Budget> = {
        name: name.trim(),
        category: categoryId,
        allocated_amount: parseFloat(allocatedAmount),
        currency,
        period,
        start_date: startDate,
        end_date: endDate,
        alert_threshold_percentage: parseInt(threshold, 10) || 80,
        notes: notes.trim() || undefined,
        is_active: true
      };

      if (budgetToEdit) {
        await financeApi.updateBudget(budgetToEdit.id, payload);
      } else {
        await financeApi.createBudget(payload);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la sauvegarde du budget.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '520px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid #e2e8f0'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: '#fdf4ff',
              color: '#c026d3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <PieChart size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                {budgetToEdit ? 'Modifier l\'Enveloppe Budgétaire' : 'Nouveau Budget Prévisionnel'}
              </h2>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
                Fixez des plafonds de dépenses et suivez la consommation
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8' }}>
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          {error && (
            <div style={{
              padding: '0.75rem 1rem',
              backgroundColor: '#fef2f2',
              color: '#991b1b',
              borderRadius: '8px',
              fontSize: '0.875rem',
              marginBottom: '1.25rem',
              border: '1px solid #fecaca'
            }}>
              {error}
            </div>
          )}

          {/* Name */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
              Nom du Budget *
            </label>
            <input
              type="text"
              placeholder="Ex: Budget Marketing Q3, Enveloppe Salaires 2026..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', boxSizing: 'border-box' }}
              required
            />
          </div>

          {/* Category & Amount */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                Catégorie Cible *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', backgroundColor: '#fff', boxSizing: 'border-box' }}
                required
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                Plafond Alloué *
              </label>
              <input
                type="number"
                step="any"
                placeholder="0.00"
                value={allocatedAmount}
                onChange={(e) => setAllocatedAmount(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', fontWeight: 700, boxSizing: 'border-box' }}
                required
              />
            </div>
          </div>

          {/* Currency & Period */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                Devise *
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', backgroundColor: '#fff', boxSizing: 'border-box' }}
              >
                <option value="EUR">Euro (EUR - €)</option>
                <option value="USD">Dollar US (USD - $)</option>
                <option value="XOF">Franc CFA (XOF - F.CFA)</option>
                <option value="GBP">Livre Sterling (GBP - £)</option>
                <option value="CAD">Dollar Canadien (CAD - $ CA)</option>
                <option value="CHF">Franc Suisse (CHF - CHF)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                Périodicité
              </label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as BudgetPeriod)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', backgroundColor: '#fff', boxSizing: 'border-box' }}
              >
                <option value="MONTHLY">Mensuel</option>
                <option value="QUARTERLY">Trimestriel</option>
                <option value="YEARLY">Annuel</option>
                <option value="CUSTOM">Personnalisé</option>
              </select>
            </div>
          </div>

          {/* Dates & Threshold */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                Début *
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                Fin *
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                Alerte à (%)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* Notes */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
              Notes / Objectifs budgétaires
            </label>
            <input
              type="text"
              placeholder="Ex: Réduction des dépenses publicitaires de 15%..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', boxSizing: 'border-box' }}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#f8fafc',
                color: '#475569',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: '10px 22px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#c026d3',
                color: '#ffffff',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.7 : 1
              }}
            >
              {submitting ? 'Enregistrement...' : (budgetToEdit ? 'Mettre à jour' : 'Activer l\'Enveloppe')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
