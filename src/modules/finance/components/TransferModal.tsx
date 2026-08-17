import React, { useState, useEffect } from 'react';
import { X, ArrowRightLeft, DollarSign, Calendar, RefreshCw } from 'lucide-react';
import { financeApi } from '../services/api';
import type { FinancialAccount, Transaction } from '../types';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const TransferModal: React.FC<TransferModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [sourceAccountId, setSourceAccountId] = useState('');
  const [destAccountId, setDestAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [destAmount, setDestAmount] = useState('');
  const [exchangeRate, setExchangeRate] = useState('1.0000');
  const [title, setTitle] = useState('Virement interne');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notes, setNotes] = useState('');

  const [accounts, setAccounts] = useState<FinancialAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadAccounts();
      setTitle('Virement interne');
      setAmount('');
      setDestAmount('');
      setExchangeRate('1.0000');
      setDate(new Date().toISOString().split('T')[0]);
      setReferenceNumber('');
      setNotes('');
      setError(null);
    }
  }, [isOpen]);

  const loadAccounts = async () => {
    setLoading(true);
    try {
      const accs = await financeApi.getAccounts({ is_active: 'true' });
      setAccounts(accs);
      if (accs.length >= 2) {
        setSourceAccountId(accs[0].id);
        setDestAccountId(accs[1].id);
      } else if (accs.length === 1) {
        setSourceAccountId(accs[0].id);
      }
    } catch (err) {
      console.error('Failed to load accounts:', err);
    } finally {
      setLoading(false);
    }
  };

  const sourceAccount = accounts.find(a => a.id === sourceAccountId);
  const destAccount = accounts.find(a => a.id === destAccountId);
  const isMultiCurrency = sourceAccount && destAccount && sourceAccount.currency !== destAccount.currency;

  const handleAmountChange = (val: string) => {
    setAmount(val);
    if (!isMultiCurrency) {
      setDestAmount(val);
    } else {
      const parsed = parseFloat(val) || 0;
      const rate = parseFloat(exchangeRate) || 1;
      setDestAmount((parsed * rate).toFixed(2));
    }
  };

  const handleRateChange = (rateVal: string) => {
    setExchangeRate(rateVal);
    const parsed = parseFloat(amount) || 0;
    const rate = parseFloat(rateVal) || 1;
    setDestAmount((parsed * rate).toFixed(2));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!sourceAccountId || !destAccountId) {
      setError('Veuillez sélectionner un compte source et un compte destinataire.');
      return;
    }

    if (sourceAccountId === destAccountId) {
      setError('Le compte source et le compte de destination doivent être différents.');
      return;
    }

    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      setError('Le montant doit être supérieur à 0.');
      return;
    }

    setSubmitting(true);
    try {
      const payload: Partial<Transaction> = {
        transaction_type: 'TRANSFER',
        title: title.trim() || `Virement ${sourceAccount?.name} -> ${destAccount?.name}`,
        account: sourceAccountId,
        destination_account: destAccountId,
        amount: numAmount,
        currency: sourceAccount?.currency || 'EUR',
        destination_amount: destAmount ? parseFloat(destAmount) : numAmount,
        exchange_rate: parseFloat(exchangeRate) || 1,
        date,
        payment_method: 'TRANSFER',
        reference_number: referenceNumber.trim() || undefined,
        notes: notes.trim() || undefined,
        status: 'COMPLETED'
      };

      await financeApi.createTransaction(payload);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erreur lors du virement.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

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
        maxWidth: '540px',
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
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ArrowRightLeft size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                Virement Interne de Trésorerie
              </h2>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
                Transfert de fonds entre comptes ou caisses
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

          {/* Accounts selection */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            gap: '8px',
            alignItems: 'center',
            marginBottom: '1.25rem',
            backgroundColor: '#f8fafc',
            padding: '12px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                Compte Source (Débité)
              </label>
              <select
                value={sourceAccountId}
                onChange={(e) => setSourceAccountId(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                required
              >
                {accounts.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.currency}) - {parseFloat(String(a.current_balance)).toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowRightLeft size={18} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                Compte Cible (Crédité)
              </label>
              <select
                value={destAccountId}
                onChange={(e) => setDestAccountId(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                required
              >
                {accounts.map(a => (
                  <option key={a.id} value={a.id} disabled={a.id === sourceAccountId}>
                    {a.name} ({a.currency}) - {parseFloat(String(a.current_balance)).toLocaleString()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Multi-currency alert */}
          {isMultiCurrency && (
            <div style={{
              padding: '10px 14px',
              backgroundColor: '#fffbeb',
              color: '#92400e',
              borderRadius: '8px',
              fontSize: '0.8rem',
              marginBottom: '1.25rem',
              border: '1px solid #fde68a',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <RefreshCw size={16} />
              <span>
                <strong>Transfert Multidevises :</strong> de {sourceAccount?.currency} vers {destAccount?.currency}. Précisez le taux de change ou le montant reçu.
              </span>
            </div>
          )}

          {/* Amount & Destination Amount */}
          <div style={{ display: 'grid', gridTemplateColumns: isMultiCurrency ? '1fr 1fr 1fr' : '1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                Montant Débité ({sourceAccount?.currency || 'EUR'}) *
              </label>
              <input
                type="number"
                step="any"
                placeholder="0.00"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '1rem',
                  fontWeight: 700,
                  boxSizing: 'border-box'
                }}
                required
              />
            </div>

            {isMultiCurrency && (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                    Taux de change
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="1.0000"
                    value={exchangeRate}
                    onChange={(e) => handleRateChange(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.9rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                    Montant Reçu ({destAccount?.currency})
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="0.00"
                    value={destAmount}
                    onChange={(e) => setDestAmount(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: '#059669',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </>
            )}
          </div>

          {/* Title & Date */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                Libellé de l'opération
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', boxSizing: 'border-box' }}
                required
              />
            </div>
          </div>

          {/* Notes */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
              Notes / Justification
            </label>
            <input
              type="text"
              placeholder="Ex: Alimentation caisse, Virement d'équilibrage..."
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
                backgroundColor: '#2563eb',
                color: '#ffffff',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.7 : 1
              }}
            >
              {submitting ? 'Exécution...' : 'Confirmer le Virement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
