import React, { useEffect, useState } from 'react';
import {
  ClipboardList, Plus, Search, CheckCircle2, Clock,
  AlertTriangle, Save, Play, Check, AlertCircle, RefreshCw
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { inventoryApi } from '../services/api';
import type { InventoryAudit, Warehouse } from '../types';

export const AuditsPage: React.FC = () => {
  const [audits, setAudits] = useState<InventoryAudit[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [activeAudit, setActiveAudit] = useState<InventoryAudit | null>(null);
  const [loading, setLoading] = useState(true);

  // Counts state
  const [counts, setCounts] = useState<Record<string, string>>({});
  const [isNewAuditOpen, setIsNewAuditOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    warehouse: '',
    scheduled_date: new Date().toISOString().split('T')[0],
    responsible_name: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [auditData, whData] = await Promise.all([
        inventoryApi.getAudits(),
        inventoryApi.getWarehouses()
      ]);
      setAudits(auditData);
      setWarehouses(whData);

      if (auditData.length > 0 && !activeAudit) {
        selectAudit(auditData[0]);
      } else if (activeAudit) {
        const refreshed = auditData.find((a) => a.id === activeAudit.id);
        if (refreshed) selectAudit(refreshed);
      }

      if (whData.length > 0 && !formData.warehouse) {
        setFormData((prev) => ({ ...prev, warehouse: whData[0].id }));
      }
    } catch (err) {
      console.error('Failed to load audits:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectAudit = (audit: InventoryAudit) => {
    setActiveAudit(audit);
    const countMap: Record<string, string> = {};
    if (audit.items) {
      audit.items.forEach((it) => {
        countMap[it.id] = it.physical_quantity.toString();
      });
    }
    setCounts(countMap);
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(val);
  };

  const handleCountChange = (itemId: string, val: string) => {
    setCounts((prev) => ({ ...prev, [itemId]: val }));
  };

  const handleSaveCounts = async () => {
    if (!activeAudit) return;
    setSubmitting(true);
    try {
      const payload = Object.entries(counts).map(([itemId, qty]) => ({
        item_id: itemId,
        physical_quantity: parseFloat(qty) || 0
      }));
      const updated = await inventoryApi.saveAuditCounts(activeAudit.id, payload);
      selectAudit(updated);
      loadData();
    } catch (err) {
      console.error('Failed to save counts:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleValidateAndApply = async () => {
    if (!activeAudit) return;
    if (!confirm('Confirmez-vous la régularisation automatique des écarts d\'inventaire en stock ? Cette action générera les écritures comptables d\'ajustement.')) {
      return;
    }

    setSubmitting(true);
    try {
      const validated = await inventoryApi.validateAndApplyAudit(activeAudit.id);
      selectAudit(validated);
      loadData();
    } catch (err) {
      console.error('Failed to validate audit:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.warehouse) return;

    setSubmitting(true);
    try {
      const newAudit = await inventoryApi.createAudit(formData);
      setIsNewAuditOpen(false);
      loadData();
      selectAudit(newAudit);
    } catch (err) {
      console.error('Failed to create audit:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '1.5rem 2rem' }}>
      <PageHeader
        title="Inventaires Physiques & Audits"
        subtitle="Campagnes de comptage tournant ou annuel, calcul d'écarts et régularisation automatique."
        breadcrumbs={[{ label: 'Stock & Logistique' }, { label: 'Inventaires Physiques' }]}
        actions={
          <button
            onClick={() => setIsNewAuditOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#0e121b',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Plus size={14} />
            Nouvelle Session d'Inventaire
          </button>
        }
      />

      <div style={{
        display: 'grid',
        gridTemplateColumns: '320px 1fr',
        gap: '24px',
        alignItems: 'flex-start'
      }}>
        {/* Left: Audit Sessions List */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e4e9',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 600, color: '#868c98', textTransform: 'uppercase' }}>
            Sessions d'Inventaires
          </h3>

          {audits.map((a) => {
            const isSelected = activeAudit?.id === a.id;
            const isValide = a.status === 'VALIDE';
            return (
              <div
                key={a.id}
                onClick={() => selectAudit(a)}
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: `1px solid ${isSelected ? '#6366f1' : '#e2e4e9'}`,
                  backgroundColor: isSelected ? '#f5f7ff' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 100ms ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600, fontSize: '13px', color: '#0e121b' }}>{a.audit_number}</span>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 600,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    backgroundColor: isValide ? '#d1fae5' : '#fef3c7',
                    color: isValide ? '#065f46' : '#92400e'
                  }}>
                    {a.status_display}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#525866', fontWeight: 500 }}>{a.title}</div>
                <div style={{ fontSize: '11px', color: '#868c98', marginTop: '2px' }}>
                  {a.warehouse_name} • {a.scheduled_date}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Active Audit Workspace */}
        {activeAudit ? (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e4e9',
            padding: '1.5rem'
          }}>
            {/* Header info */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              paddingBottom: '1rem',
              borderBottom: '1px solid #f3f3f6',
              marginBottom: '1.25rem'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#0e121b' }}>
                    {activeAudit.title}
                  </h2>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    backgroundColor: activeAudit.status === 'VALIDE' ? '#d1fae5' : '#fef3c7',
                    color: activeAudit.status === 'VALIDE' ? '#065f46' : '#92400e'
                  }}>
                    {activeAudit.status_display}
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: '#525866', marginTop: '4px' }}>
                  Entrepôt : <strong>{activeAudit.warehouse_name}</strong> • Responsable : {activeAudit.responsible_name || 'Non assigné'}
                </div>
              </div>

              {activeAudit.status !== 'VALIDE' && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={handleSaveCounts}
                    disabled={submitting}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cdd0d5',
                      backgroundColor: '#ffffff',
                      color: '#0e121b',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <Save size={14} />
                    Sauvegarder
                  </button>
                  <button
                    onClick={handleValidateAndApply}
                    disabled={submitting}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: '#059669',
                      color: '#ffffff',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <CheckCircle2 size={14} />
                    Valider & Régulariser
                  </button>
                </div>
              )}
            </div>

            {/* Items Counts Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9f9fb', borderBottom: '1px solid #e2e4e9', textAlign: 'left', color: '#525866' }}>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>Article</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600, textAlign: 'center' }}>Stock Théorique</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600, textAlign: 'center', width: '140px' }}>Comptage Physique</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600, textAlign: 'center' }}>Écart Quantité</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600, textAlign: 'right' }}>Impact Financier</th>
                </tr>
              </thead>
              <tbody>
                {activeAudit.items?.map((item) => {
                  const physicalVal = parseFloat(counts[item.id] ?? item.physical_quantity.toString()) || 0;
                  const varianceQty = physicalVal - item.theoretical_quantity;
                  const varianceCost = varianceQty * item.unit_cost;

                  return (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f3f3f6' }}>
                      <td style={{ padding: '12px' }}>
                        <div style={{ fontWeight: 600, color: '#0e121b' }}>{item.product_name}</div>
                        <div style={{ fontSize: '11px', color: '#868c98' }}>SKU: {item.product_sku}</div>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center', fontWeight: 600, color: '#525866' }}>
                        {item.theoretical_quantity} {item.unit_symbol}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        {activeAudit.status === 'VALIDE' ? (
                          <span style={{ fontWeight: 700 }}>{item.physical_quantity} {item.unit_symbol}</span>
                        ) : (
                          <input
                            type="number"
                            step="any"
                            min="0"
                            value={counts[item.id] ?? '0'}
                            onChange={(e) => handleCountChange(item.id, e.target.value)}
                            style={{
                              width: '90px',
                              padding: '6px 8px',
                              borderRadius: '6px',
                              border: '1px solid #cdd0d5',
                              textAlign: 'center',
                              fontWeight: 600,
                              fontSize: '13px'
                            }}
                          />
                        )}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center', fontWeight: 700, color: varianceQty > 0 ? '#059669' : varianceQty < 0 ? '#dc2626' : '#525866' }}>
                        {varianceQty > 0 ? `+${varianceQty}` : varianceQty} {item.unit_symbol}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right', fontWeight: 700, color: varianceCost > 0 ? '#059669' : varianceCost < 0 ? '#dc2626' : '#525866' }}>
                        {varianceCost > 0 ? `+${formatCurrency(varianceCost)}` : formatCurrency(varianceCost)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#868c98' }}>
            Sélectionnez une session d'inventaire.
          </div>
        )}
      </div>

      {/* New Audit Modal */}
      {isNewAuditOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(14, 18, 27, 0.45)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '500px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e4e9',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f3f3f6' }}>
              <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: '#0e121b' }}>
                Nouvelle Session de Comptage
              </h3>
            </div>

            <form onSubmit={handleCreateAudit} style={{ padding: '1.5rem' }}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#0e121b', marginBottom: '4px' }}>Titre / Objet *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Inventaire Mensuel Fin Août"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cdd0d5', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#0e121b', marginBottom: '4px' }}>Entrepôt à recenser *</label>
                  <select
                    value={formData.warehouse}
                    onChange={(e) => setFormData({ ...formData, warehouse: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cdd0d5', fontSize: '13px', backgroundColor: '#ffffff' }}
                  >
                    {warehouses.map((w) => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#0e121b', marginBottom: '4px' }}>Date programmée</label>
                  <input
                    type="date"
                    value={formData.scheduled_date}
                    onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cdd0d5', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#525866', marginBottom: '4px' }}>Responsable de session</label>
                <input
                  type="text"
                  placeholder="Nom de l'auditeur"
                  value={formData.responsible_name}
                  onChange={(e) => setFormData({ ...formData, responsible_name: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cdd0d5', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setIsNewAuditOpen(false)}
                  style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #cdd0d5', background: '#ffffff', color: '#525866', fontSize: '13px', cursor: 'pointer' }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#0e121b', color: '#ffffff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                >
                  {submitting ? 'Création...' : 'Lancer la session'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
