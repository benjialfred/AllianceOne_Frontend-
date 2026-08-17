import React, { useState, useEffect } from 'react';
import { X, ArrowDownRight, ArrowUpRight, Calendar, DollarSign, Tag, CreditCard, User, FileText } from 'lucide-react';
import { financeApi } from '../services/api';
import type { FinancialAccount, FinancialCategory, TransactionType, PaymentMethod, Transaction } from '../types';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialType?: 'INCOME' | 'EXPENSE';
  transactionToEdit?: Transaction | null;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialType = 'EXPENSE',
  transactionToEdit
}) => {
  const [txType, setTxType] = useState<TransactionType>(initialType);
  const [title, setTitle] = useState('');
  const [accountId, setAccountId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('TRANSFER');
  const [payeePayer, setPayeePayer] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notes, setNotes] = useState('');
  
  const [accounts, setAccounts] = useState<FinancialAccount[]>([]);
  const [categories, setCategories] = useState<FinancialCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadDependencies();
      if (transactionToEdit) {
        setTxType(transactionToEdit.transaction_type);
        setTitle(transactionToEdit.title);
        setAccountId(transactionToEdit.account);
        setCategoryId(transactionToEdit.category || '');
        setAmount(String(transactionToEdit.amount));
        setDate(transactionToEdit.date);
        setPaymentMethod(transactionToEdit.payment_method);
        setPayeePayer(transactionToEdit.payee_payer || '');
        setReferenceNumber(transactionToEdit.reference_number || '');
        setNotes(transactionToEdit.notes || '');
      } else {
        setTxType(initialType);
        setTitle('');
        setAmount('');
        setDate(new Date().toISOString().split('T')[0]);
        setPayeePayer('');
        setReferenceNumber('');
        setNotes('');
      }
    }
  }, [isOpen, initialType, transactionToEdit]);

  const loadDependencies = async () => {
    setLoading(true);
    try {
      const [accs, cats] = await Promise.all([
        financeApi.getAccounts({ is_active: 'true' }),
        financeApi.getCategories()
      ]);
      setAccounts(accs);
      setCategories(cats);
      if (accs.length > 0 && !accountId) {
        const defaultAcc = accs.find(a => a.is_default) || accs[0];
        setAccountId(defaultAcc.id);
      }
    } catch (err) {
      console.error('Failed to load accounts/categories:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const filteredCategories = categories.filter(c => c.category_type === txType);
  const selectedAccount = accounts.find(a => a.id === accountId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !amount || parseFloat(amount) <= 0 || !accountId) {
      setError('Veuillez renseigner un libellé, un montant valide et un compte de trésorerie.');
      return;
    }

    setSubmitting(true);
    try {
      const payload: Partial<Transaction> = {
        transaction_type: txType,
        title: title.trim(),
        account: accountId,
        category: categoryId || null,
        amount: parseFloat(amount),
        currency: selectedAccount?.currency || 'EUR',
        date,
        payment_method: paymentMethod,
        payee_payer: payeePayer.trim() || undefined,
        reference_number: referenceNumber.trim() || undefined,
        notes: notes.trim() || undefined,
        status: 'COMPLETED'
      };

      if (transactionToEdit) {
        await financeApi.updateTransaction(transactionToEdit.id, payload);
      } else {
        await financeApi.createTransaction(payload);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l’enregistrement de la transaction.');
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
        maxWidth: '560px',
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
              backgroundColor: txType === 'INCOME' ? '#ecfdf5' : '#fef2f2',
              color: txType === 'INCOME' ? '#059669' : '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {txType === 'INCOME' ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
            </div>
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                {transactionToEdit ? 'Modifier la transaction' : (txType === 'INCOME' ? 'Nouvel Encaissement' : 'Nouvelle Dépense')}
              </h2>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
                Enregistrement comptable et mise à jour du compte
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8' }}
          >
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

          {/* Type Toggle */}
          {!transactionToEdit && (
            <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem' }}>
              <button
                type="button"
                onClick={() => setTxType('EXPENSE')}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '10px',
                  border: txType === 'EXPENSE' ? '2px solid #ef4444' : '1px solid #e2e8f0',
                  backgroundColor: txType === 'EXPENSE' ? '#fef2f2' : '#ffffff',
                  color: txType === 'EXPENSE' ? '#b91c1c' : '#64748b',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <ArrowUpRight size={16} /> Dépense / Paiement
              </button>
              <button
                type="button"
                onClick={() => setTxType('INCOME')}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '10px',
                  border: txType === 'INCOME' ? '2px solid #10b981' : '1px solid #e2e8f0',
                  backgroundColor: txType === 'INCOME' ? '#ecfdf5' : '#ffffff',
                  color: txType === 'INCOME' ? '#047857' : '#64748b',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <ArrowDownRight size={16} /> Recette / Revenu
              </button>
            </div>
          )}

          {/* Amount & Account */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                Montant ({selectedAccount?.currency || 'EUR'}) *
              </label>
              <div style={{ position: 'relative' }}>
                <DollarSign size={16} style={{ position: 'absolute', left: '10px', top: '12px', color: '#94a3b8' }} />
                <input
                  type="number"
                  step="any"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 32px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '1.125rem',
                    fontWeight: 700,
                    color: '#0f172a',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                Compte / Caisse *
              </label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.875rem',
                  color: '#0f172a',
                  boxSizing: 'border-box',
                  backgroundColor: '#fff'
                }}
                required
              >
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} ({acc.currency}) - Solde: {parseFloat(String(acc.current_balance)).toLocaleString('fr-FR')} {acc.currency}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Title */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
              Libellé / Description *
            </label>
            <input
              type="text"
              placeholder="Ex: Achat fournitures bureau, Facture Client ACME, Plein carburant..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.875rem',
                color: '#0f172a',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>

          {/* Category & Date */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                Catégorie Analytique
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.875rem',
                  color: '#0f172a',
                  boxSizing: 'border-box',
                  backgroundColor: '#fff'
                }}
              >
                <option value="">-- Sans catégorie --</option>
                {filteredCategories.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.code ? `(${c.code})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                Date d'opération *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.875rem',
                  color: '#0f172a',
                  boxSizing: 'border-box'
                }}
                required
              />
            </div>
          </div>

          {/* Payment Method & Payee */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                Moyen de Paiement
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.875rem',
                  color: '#0f172a',
                  boxSizing: 'border-box',
                  backgroundColor: '#fff'
                }}
              >
                <option value="TRANSFER">Virement bancaire</option>
                <option value="CARD">Carte Bancaire</option>
                <option value="CASH">Espèces</option>
                <option value="CHECK">Chèque</option>
                <option value="MOBILE_MONEY">Mobile Money</option>
                <option value="DIRECT_DEBIT">Prélèvement</option>
                <option value="ONLINE">Paiement en ligne</option>
                <option value="OTHER">Autre</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                Tiers (Bénéficiaire / Émetteur)
              </label>
              <input
                type="text"
                placeholder="Ex: Total Energies, Adobe, Client Dupont..."
                value={payeePayer}
                onChange={(e) => setPayeePayer(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.875rem',
                  color: '#0f172a',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Reference & Notes */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                N° de Pièce / Référence
              </label>
              <input
                type="text"
                placeholder="Ex: CHQ-4819, VIR-8821, RECU-003"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.875rem',
                  color: '#0f172a',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                Notes internes
              </label>
              <input
                type="text"
                placeholder="Commentaire facultatif..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.875rem',
                  color: '#0f172a',
                  boxSizing: 'border-box'
                }}
              />
            </div>
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
                backgroundColor: txType === 'INCOME' ? '#059669' : '#dc2626',
                color: '#ffffff',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.7 : 1
              }}
            >
              {submitting ? 'Enregistrement...' : (transactionToEdit ? 'Mettre à jour' : 'Valider la Transaction')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
