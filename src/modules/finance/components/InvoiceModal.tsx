import React, { useState, useEffect } from 'react';
import { X, FileText, Plus, Trash2, DollarSign } from 'lucide-react';
import { financeApi } from '../services/api';
import type { Invoice, InvoiceItem, InvoiceType, InvoiceStatus, CurrencyCode } from '../types';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  invoiceToEdit?: Invoice | null;
  initialType?: InvoiceType;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  invoiceToEdit,
  initialType = 'OUTGOING'
}) => {
  const [invoiceType, setInvoiceType] = useState<InvoiceType>(initialType);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [partnerEmail, setPartnerEmail] = useState('');
  const [partnerPhone, setPartnerPhone] = useState('');
  const [partnerAddress, setPartnerAddress] = useState('');
  const [partnerTaxId, setPartnerTaxId] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [currency, setCurrency] = useState<CurrencyCode>('EUR');
  const [status, setStatus] = useState<InvoiceStatus>('DRAFT');
  const [taxRate, setTaxRate] = useState('20.00');
  const [discountAmount, setDiscountAmount] = useState('0.00');
  const [notes, setNotes] = useState('');
  const [terms, setTerms] = useState('');

  const [items, setItems] = useState<InvoiceItem[]>([
    { description: 'Prestation de service / Article', quantity: 1, unit_price: 0, total_price: 0 }
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      const due = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      if (invoiceToEdit) {
        setInvoiceType(invoiceToEdit.invoice_type);
        setInvoiceNumber(invoiceToEdit.invoice_number);
        setPartnerName(invoiceToEdit.partner_name);
        setPartnerEmail(invoiceToEdit.partner_email || '');
        setPartnerPhone(invoiceToEdit.partner_phone || '');
        setPartnerAddress(invoiceToEdit.partner_address || '');
        setPartnerTaxId(invoiceToEdit.partner_tax_id || '');
        setIssueDate(invoiceToEdit.issue_date);
        setDueDate(invoiceToEdit.due_date);
        setCurrency(invoiceToEdit.currency);
        setStatus(invoiceToEdit.status);
        setTaxRate(String(invoiceToEdit.tax_rate));
        setDiscountAmount(String(invoiceToEdit.discount_amount));
        setNotes(invoiceToEdit.notes || '');
        setTerms(invoiceToEdit.terms || '');
        if (invoiceToEdit.items && invoiceToEdit.items.length > 0) {
          setItems(invoiceToEdit.items);
        } else {
          setItems([{ description: '', quantity: 1, unit_price: 0, total_price: 0 }]);
        }
      } else {
        const randNum = Math.floor(1000 + Math.random() * 9000);
        const prefix = initialType === 'OUTGOING' ? 'FAC' : (initialType === 'INCOMING' ? 'ACH' : 'DEV');
        setInvoiceType(initialType);
        setInvoiceNumber(`${prefix}-${today.getFullYear()}-${randNum}`);
        setPartnerName('');
        setPartnerEmail('');
        setPartnerPhone('');
        setPartnerAddress('');
        setPartnerTaxId('');
        setIssueDate(todayStr);
        setDueDate(due);
        setCurrency('EUR');
        setStatus('DRAFT');
        setTaxRate('20.00');
        setDiscountAmount('0.00');
        setNotes('Paiement à 30 jours. Merci pour votre confiance.');
        setTerms('Virement bancaire / Tous frais à la charge du débiteur.');
        setItems([{ description: '', quantity: 1, unit_price: 0, total_price: 0 }]);
      }
      setError(null);
    }
  }, [isOpen, invoiceToEdit, initialType]);

  if (!isOpen) return null;

  const handleItemChange = (index: number, field: keyof InvoiceItem, val: any) => {
    const next = [...items];
    next[index] = { ...next[index], [field]: val };
    const q = parseFloat(String(next[index].quantity)) || 0;
    const p = parseFloat(String(next[index].unit_price)) || 0;
    next[index].total_price = q * p;
    setItems(next);
  };

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, unit_price: 0, total_price: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  // Calculations
  const calculatedSubtotal = items.reduce((acc, item) => acc + (parseFloat(String(item.quantity)) || 0) * (parseFloat(String(item.unit_price)) || 0), 0);
  const parsedTaxRate = parseFloat(taxRate) || 0;
  const calculatedTax = (calculatedSubtotal * parsedTaxRate) / 100;
  const parsedDiscount = parseFloat(discountAmount) || 0;
  const calculatedTotal = Math.max(0, calculatedSubtotal + calculatedTax - parsedDiscount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!invoiceNumber.trim() || !partnerName.trim() || !issueDate || !dueDate) {
      setError('Veuillez remplir le numéro, le tiers, et les dates.');
      return;
    }

    setSubmitting(true);
    try {
      const payload: Partial<Invoice> = {
        invoice_type: invoiceType,
        invoice_number: invoiceNumber.trim(),
        partner_name: partnerName.trim(),
        partner_email: partnerEmail.trim() || undefined,
        partner_phone: partnerPhone.trim() || undefined,
        partner_address: partnerAddress.trim() || undefined,
        partner_tax_id: partnerTaxId.trim() || undefined,
        issue_date: issueDate,
        due_date: dueDate,
        currency,
        status,
        subtotal: calculatedSubtotal,
        tax_rate: parsedTaxRate,
        tax_amount: calculatedTax,
        discount_amount: parsedDiscount,
        total_amount: calculatedTotal,
        notes: notes.trim() || undefined,
        terms: terms.trim() || undefined,
        items: items.map(it => ({
          description: it.description.trim() || 'Prestation',
          quantity: parseFloat(String(it.quantity)) || 1,
          unit_price: parseFloat(String(it.unit_price)) || 0
        }))
      };

      if (invoiceToEdit) {
        await financeApi.updateInvoice(invoiceToEdit.id, payload);
      } else {
        await financeApi.createInvoice(payload);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l’enregistrement de la facture.');
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
        maxWidth: '780px',
        maxHeight: '92vh',
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
              <FileText size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                {invoiceToEdit ? `Modifier la Pièce (${invoiceToEdit.invoice_number})` : 'Édition Facture / Devis'}
              </h2>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
                Création de document commercial professionnel avec TVA
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

          {/* Type Selector & Document Number */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                Type de Document *
              </label>
              <select
                value={invoiceType}
                onChange={(e) => setInvoiceType(e.target.value as InvoiceType)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', backgroundColor: '#fff', boxSizing: 'border-box' }}
              >
                <option value="OUTGOING">Facture Client (Vente)</option>
                <option value="INCOMING">Facture Fournisseur (Achat)</option>
                <option value="QUOTATION">Devis / Proforma</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                N° de Facture *
              </label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', fontWeight: 700, boxSizing: 'border-box' }}
                required
              />
            </div>

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
          </div>

          {/* Partner Info */}
          <div style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '12px',
            marginBottom: '1.25rem'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '8px' }}>
              {invoiceType === 'INCOMING' ? 'Informations Fournisseur' : 'Informations Client'}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '8px', marginBottom: '8px' }}>
              <input
                type="text"
                placeholder="Raison Sociale / Nom du contact *"
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                style={{ padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                required
              />
              <input
                type="email"
                placeholder="Email contact"
                value={partnerEmail}
                onChange={(e) => setPartnerEmail(e.target.value)}
                style={{ padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              />
              <input
                type="text"
                placeholder="Téléphone"
                value={partnerPhone}
                onChange={(e) => setPartnerPhone(e.target.value)}
                style={{ padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '8px' }}>
              <input
                type="text"
                placeholder="Adresse complète (Rue, Ville, Code Postal, Pays)"
                value={partnerAddress}
                onChange={(e) => setPartnerAddress(e.target.value)}
                style={{ padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              />
              <input
                type="text"
                placeholder="N° TVA / SIRET / NIF"
                value={partnerTaxId}
                onChange={(e) => setPartnerTaxId(e.target.value)}
                style={{ padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          {/* Dates & Status */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                Date d'Émission *
              </label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                Date d'Échéance *
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                Statut
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as InvoiceStatus)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', backgroundColor: '#fff', boxSizing: 'border-box' }}
              >
                <option value="DRAFT">Brouillon</option>
                <option value="SENT">Émise / Envoyée</option>
                <option value="PARTIAL">Partiellement Payée</option>
                <option value="PAID">Payée</option>
                <option value="OVERDUE">En Retard</option>
                <option value="CANCELLED">Annulée</option>
              </select>
            </div>
          </div>

          {/* Line Items Table */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Lignes de Facturation</span>
              <button
                type="button"
                onClick={addItem}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: '1px solid #3b82f6',
                  backgroundColor: '#eff6ff',
                  color: '#2563eb',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer'
                }}
              >
                <Plus size={14} /> Ajouter une ligne
              </button>
            </div>

            <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', textAlign: 'left' }}>
                    <th style={{ padding: '8px 12px' }}>Désignation / Service</th>
                    <th style={{ padding: '8px 12px', width: '80px' }}>Qté</th>
                    <th style={{ padding: '8px 12px', width: '120px' }}>Prix Unit. ({currency})</th>
                    <th style={{ padding: '8px 12px', width: '120px', textAlign: 'right' }}>Total HT</th>
                    <th style={{ padding: '8px', width: '36px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: idx < items.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                      <td style={{ padding: '6px 12px' }}>
                        <input
                          type="text"
                          placeholder="Description de la prestation ou de l'article"
                          value={item.description}
                          onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                          style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '0.8rem', boxSizing: 'border-box' }}
                          required
                        />
                      </td>
                      <td style={{ padding: '6px 12px' }}>
                        <input
                          type="number"
                          step="any"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                          style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '0.8rem', boxSizing: 'border-box' }}
                          required
                        />
                      </td>
                      <td style={{ padding: '6px 12px' }}>
                        <input
                          type="number"
                          step="any"
                          value={item.unit_price}
                          onChange={(e) => handleItemChange(idx, 'unit_price', e.target.value)}
                          style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '0.8rem', boxSizing: 'border-box' }}
                          required
                        />
                      </td>
                      <td style={{ padding: '6px 12px', textAlign: 'right', fontWeight: 600, color: '#0f172a' }}>
                        {((parseFloat(String(item.quantity)) || 0) * (parseFloat(String(item.unit_price)) || 0)).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} {currency}
                      </td>
                      <td style={{ padding: '6px', textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => removeItem(idx)}
                          disabled={items.length <= 1}
                          style={{
                            border: 'none',
                            background: 'transparent',
                            color: items.length <= 1 ? '#cbd5e1' : '#ef4444',
                            cursor: items.length <= 1 ? 'not-allowed' : 'pointer'
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals Calculation Card */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ marginBottom: '8px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Conditions & Mentions Légales
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px', color: '#475569' }}>
                <span>Sous-total HT :</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{calculatedSubtotal.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} {currency}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px', color: '#475569' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  TVA (%):
                  <input
                    type="number"
                    step="any"
                    value={taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                    style={{ width: '55px', padding: '2px 4px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                  />
                </span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{calculatedTax.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} {currency}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px', color: '#475569' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Remise ({currency}):
                  <input
                    type="number"
                    step="any"
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(e.target.value)}
                    style={{ width: '65px', padding: '2px 4px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                  />
                </span>
                <span style={{ fontWeight: 600, color: '#dc2626' }}>- {parsedDiscount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} {currency}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.05rem',
                fontWeight: 700,
                color: '#0f172a',
                borderTop: '2px dashed #cbd5e1',
                paddingTop: '8px',
                marginTop: '4px'
              }}>
                <span>Total TTC :</span>
                <span style={{ color: '#2563eb' }}>{calculatedTotal.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} {currency}</span>
              </div>
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
                backgroundColor: '#2563eb',
                color: '#ffffff',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.7 : 1
              }}
            >
              {submitting ? 'Enregistrement...' : (invoiceToEdit ? 'Mettre à jour' : 'Enregistrer la Facture')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
