import React, { useState, useEffect } from 'react';
import { X, CreditCard, DollarSign } from 'lucide-react';
import { financeApi } from '../services/api';
import type { Invoice, FinancialAccount } from '../types';

interface InvoicePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  invoice: Invoice | null;
}

export const InvoicePaymentModal: React.FC<InvoicePaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  invoice
}) => {
  const [accountId, setAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('TRANSFER');
  const [reference, setReference] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const [accounts, setAccounts] = useState<FinancialAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && invoice) {
      loadAccounts();
      const remaining = parseFloat(String(invoice.remaining_due)) || 0;
      setAmount(remaining.toFixed(2));
      setReference(`REG-${invoice.invoice_number}`);
      setDate(new Date().toISOString().split('T')[0]);
      setError(null);
    }
  }, [isOpen, invoice]);

  const loadAccounts = async () => {
    setLoading(true);
    try {
      const accs = await financeApi.getAccounts({ is_active: 'true' });
      setAccounts(accs);
      if (accs.length > 0) {
        // Sélectionner le compte qui match la devise de la facture si possible
        const matching = accs.find(a => a.currency === invoice?.currency) || accs[0];
        setAccountId(matching.id);
      }
    } catch (err) {
      console.error('Failed to load accounts:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !invoice) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const numAmount = parseFloat(amount);
    if (!accountId || !numAmount || numAmount <= 0) {
      setError('Veuillez spécifier un compte et un montant supérieur à 0.');
      return;
    }

    setSubmitting(true);
    try {
      await financeApi.recordInvoicePayment(invoice.id, {
        account_id: accountId,
        amount: numAmount,
        payment_method: paymentMethod,
        reference: reference.trim() || undefined,
        date
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l’enregistrement du règlement.');
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
        maxWidth: '480px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid #e2e8f0'
      }}>
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
              backgroundColor: '#ecfdf5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CreditCard size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                Enregistrer un Règlement
              </h2>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
                Facture {invoice.invoice_number} ({invoice.partner_name})
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8' }}>
            <X size={20} />
          </button>
        </div>

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

          <div style={{
            backgroundColor: '#f8fafc',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            marginBottom: '1.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.85rem'
          }}>
            <div>
              <div style={{ color: '#64748b', fontSize: '0.75rem' }}>Total Facture</div>
              <div style={{ fontWeight: 700, color: '#0f172a' }}>{parseFloat(String(invoice.total_amount)).toLocaleString()} {invoice.currency}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#64748b', fontSize: '0.75rem' }}>Reste à Payer</div>
              <div style={{ fontWeight: 700, color: '#dc2626' }}>{parseFloat(String(invoice.remaining_due)).toLocaleString()} {invoice.currency}</div>
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
              Compte / Caisse de Destination *
            </label>
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', backgroundColor: '#fff', boxSizing: 'border-box' }}
              required
            >
              {accounts.map(a => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.currency}) - Solde : {parseFloat(String(a.current_balance)).toLocaleString()} {a.currency}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                Montant Réglé ({invoice.currency}) *
              </label>
              <input
                type="number"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', fontWeight: 700, boxSizing: 'border-box' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                Moyen de Paiement
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', backgroundColor: '#fff', boxSizing: 'border-box' }}
              >
                <option value="TRANSFER">Virement Bancaire</option>
                <option value="CARD">Carte Bancaire</option>
                <option value="CASH">Espèces</option>
                <option value="CHECK">Chèque</option>
                <option value="MOBILE_MONEY">Mobile Money</option>
                <option value="ONLINE">Paiement en ligne</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                Date d'Encaissement *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', boxSizing: 'border-box' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                Référence / Reçu
              </label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: '10px 18px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', color: '#475569', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}
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
                backgroundColor: '#059669',
                color: '#ffffff',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.7 : 1
              }}
            >
              {submitting ? 'Validation...' : 'Valider le Règlement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
