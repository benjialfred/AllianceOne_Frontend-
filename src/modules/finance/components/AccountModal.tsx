import React, { useState, useEffect } from 'react';
import { X, Landmark, CreditCard, DollarSign } from 'lucide-react';
import { financeApi } from '../services/api';
import type { FinancialAccount, AccountType, CurrencyCode } from '../types';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  accountToEdit?: FinancialAccount | null;
}

const COLOR_OPTIONS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
  '#8b5cf6', '#ec4899', '#06b6d4', '#64748b'
];

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  accountToEdit
}) => {
  const [name, setName] = useState('');
  const [accountType, setAccountType] = useState<AccountType>('BANK');
  const [currency, setCurrency] = useState<CurrencyCode>('EUR');
  const [institutionName, setInstitutionName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [initialBalance, setInitialBalance] = useState('0.00');
  const [color, setColor] = useState('#3b82f6');
  const [isDefault, setIsDefault] = useState(false);
  const [description, setDescription] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (accountToEdit) {
        setName(accountToEdit.name);
        setAccountType(accountToEdit.account_type);
        setCurrency(accountToEdit.currency);
        setInstitutionName(accountToEdit.institution_name || '');
        setAccountNumber(accountToEdit.account_number || '');
        setInitialBalance(String(accountToEdit.initial_balance));
        setColor(accountToEdit.color || '#3b82f6');
        setIsDefault(accountToEdit.is_default);
        setDescription(accountToEdit.description || '');
      } else {
        setName('');
        setAccountType('BANK');
        setCurrency('EUR');
        setInstitutionName('');
        setAccountNumber('');
        setInitialBalance('0.00');
        setColor('#3b82f6');
        setIsDefault(false);
        setDescription('');
      }
      setError(null);
    }
  }, [isOpen, accountToEdit]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Le nom du compte est obligatoire.');
      return;
    }

    setSubmitting(true);
    try {
      const payload: Partial<FinancialAccount> = {
        name: name.trim(),
        account_type: accountType,
        currency,
        institution_name: institutionName.trim() || undefined,
        account_number: accountNumber.trim() || undefined,
        initial_balance: parseFloat(initialBalance) || 0,
        color,
        is_default: isDefault,
        description: description.trim() || undefined
      };

      if (accountToEdit) {
        await financeApi.updateAccount(accountToEdit.id, payload);
      } else {
        await financeApi.createAccount(payload);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la sauvegarde du compte.');
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
              backgroundColor: '#eff6ff',
              color: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Landmark size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                {accountToEdit ? 'Modifier le Compte' : 'Nouveau Compte / Caisse'}
              </h2>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
                Comptes bancaires, caisses physiques et portefeuilles
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

          {/* Name & Type */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
              Nom du compte *
            </label>
            <input
              type="text"
              placeholder="Ex: BNP Paribas Pro, Caisse Principale, Orange Money..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', boxSizing: 'border-box' }}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                Type de Compte *
              </label>
              <select
                value={accountType}
                onChange={(e) => setAccountType(e.target.value as AccountType)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', backgroundColor: '#fff', boxSizing: 'border-box' }}
              >
                <option value="BANK">Compte Bancaire</option>
                <option value="CASH">Caisse Espèces</option>
                <option value="MOBILE_MONEY">Mobile Money</option>
                <option value="ONLINE">Passerelle / En Ligne (Stripe, PayPal)</option>
                <option value="SAVINGS">Épargne & Réserve</option>
                <option value="OTHER">Autre</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                Devise Principale *
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                disabled={!!accountToEdit}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', backgroundColor: accountToEdit ? '#f1f5f9' : '#fff', boxSizing: 'border-box' }}
              >
                <option value="EUR">Euro (EUR - €)</option>
                <option value="USD">Dollar US (USD - $)</option>
                <option value="XOF">Franc CFA (XOF - F.CFA)</option>
                <option value="GBP">Livre Sterling (GBP - £)</option>
                <option value="CAD">Dollar Canadien (CAD - $ CA)</option>
                <option value="CHF">Franc Suisse (CHF - CHF)</option>
              </select>
            </div>
          </div>

          {/* Institution & Account Number */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                Banque / Établissement
              </label>
              <input
                type="text"
                placeholder="Ex: BNP Paribas, Wave, Chase..."
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                Numéro de Compte / IBAN
              </label>
              <input
                type="text"
                placeholder="FR76 3000 4000..."
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* Initial Balance */}
          {!accountToEdit && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                Solde Initial ({currency})
              </label>
              <input
                type="number"
                step="any"
                value={initialBalance}
                onChange={(e) => setInitialBalance(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', fontWeight: 700, boxSizing: 'border-box' }}
              />
            </div>
          )}

          {/* Color & Default */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                Couleur de badge
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {COLOR_OPTIONS.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: c,
                      border: color === c ? '3px solid #0f172a' : '1px solid transparent',
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </div>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#0f172a', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                style={{ width: '16px', height: '16px' }}
              />
              Compte par défaut
            </label>
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
                backgroundColor: '#3b82f6',
                color: '#ffffff',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.7 : 1
              }}
            >
              {submitting ? 'Enregistrement...' : (accountToEdit ? 'Mettre à jour' : 'Créer le Compte')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
