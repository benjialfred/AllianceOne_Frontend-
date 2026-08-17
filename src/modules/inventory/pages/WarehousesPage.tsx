import React, { useEffect, useState } from 'react';
import {
  Warehouse as WarehouseIcon, Plus, MapPin, Phone, User,
  Boxes, TrendingUp, ArrowRightLeft, CheckCircle2, AlertCircle
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { StockTransferModal } from '../components/StockTransferModal';
import { inventoryApi } from '../services/api';
import type { Warehouse } from '../types';

export const WarehousesPage: React.FC = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isNewWarehouseOpen, setIsNewWarehouseOpen] = useState(false);
  const [selectedWarehouseForTransfer, setSelectedWarehouseForTransfer] = useState<string>('');

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    address: '',
    city: '',
    manager_name: '',
    phone: '',
    capacity_m3: '500',
    is_default: false
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadWarehouses = async () => {
    setLoading(true);
    try {
      const data = await inventoryApi.getWarehouses();
      setWarehouses(data);
    } catch (err) {
      console.error('Failed to load warehouses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWarehouses();
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(val);
  };

  const handleCreateWarehouse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code) {
      setError('Le code et le nom de l\'entrepôt sont obligatoires.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await inventoryApi.createWarehouse({
        code: formData.code,
        name: formData.name,
        address: formData.address,
        city: formData.city,
        manager_name: formData.manager_name,
        phone: formData.phone,
        capacity_m3: parseFloat(formData.capacity_m3) || 500,
        is_default: formData.is_default
      });
      setIsNewWarehouseOpen(false);
      setFormData({
        code: '',
        name: '',
        address: '',
        city: '',
        manager_name: '',
        phone: '',
        capacity_m3: '500',
        is_default: false
      });
      loadWarehouses();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création de l\'entrepôt.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '1.5rem 2rem' }}>
      <PageHeader
        title="Entrepôts & Dépôts de Stockage"
        subtitle="Gestion multi-dépôts, cartographie des emplacements et valorisation par site."
        breadcrumbs={[{ label: 'Stock & Logistique' }, { label: 'Entrepôts' }]}
        actions={
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => {
                setSelectedWarehouseForTransfer('');
                setIsTransferOpen(true);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid #e2e4e9',
                backgroundColor: '#ffffff',
                color: '#0e121b',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <ArrowRightLeft size={14} />
              Transfert Inter-Dépôts
            </button>
            <button
              onClick={() => setIsNewWarehouseOpen(true)}
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
              Nouveau Dépôt
            </button>
          </div>
        }
      />

      {/* Warehouses Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px'
      }}>
        {warehouses.map((wh) => (
          <div
            key={wh.id}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e4e9',
              padding: '1.5rem',
              boxShadow: '0 1px 3px rgba(14, 18, 27, 0.05)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Top */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  backgroundColor: '#eef2ff',
                  color: '#4f46e5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <WarehouseIcon size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#0e121b' }}>
                    {wh.name}
                  </h3>
                  <div style={{ fontSize: '12px', color: '#868c98', marginTop: '2px' }}>
                    Code: <strong style={{ color: '#525866' }}>{wh.code}</strong>
                    {wh.is_default && (
                      <span style={{
                        marginLeft: '8px',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        backgroundColor: '#d1fae5',
                        color: '#065f46',
                        fontSize: '10px',
                        fontWeight: 600
                      }}>
                        Principal
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Info details */}
            <div style={{ fontSize: '13px', color: '#525866', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={14} color="#868c98" />
                <span>{wh.address ? `${wh.address}, ${wh.city || ''}` : wh.city || 'Adresse non renseignée'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={14} color="#868c98" />
                <span>Responsable : {wh.manager_name || 'Non assigné'}</span>
              </div>
              {wh.phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={14} color="#868c98" />
                  <span>{wh.phone}</span>
                </div>
              )}
            </div>

            {/* Financials & Stock stats */}
            <div style={{
              backgroundColor: '#f9f9fb',
              borderRadius: '8px',
              border: '1px solid #e2e4e9',
              padding: '12px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginBottom: '1.25rem',
              marginTop: 'auto'
            }}>
              <div>
                <div style={{ fontSize: '11px', color: '#868c98', textTransform: 'uppercase', fontWeight: 600 }}>
                  Valeur Totale
                </div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#0e121b', marginTop: '2px' }}>
                  {formatCurrency(wh.total_stock_value || 0)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#868c98', textTransform: 'uppercase', fontWeight: 600 }}>
                  Unités en Stock
                </div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#059669', marginTop: '2px' }}>
                  {wh.total_stock_items || 0} u
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => {
                  setSelectedWarehouseForTransfer(wh.id);
                  setIsTransferOpen(true);
                }}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '7px 12px',
                  borderRadius: '6px',
                  border: '1px solid #cdd0d5',
                  backgroundColor: '#ffffff',
                  color: '#0e121b',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <ArrowRightLeft size={13} />
                Transférer depuis ce dépôt
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* New Warehouse Modal */}
      {isNewWarehouseOpen && (
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
                Ajouter un Entrepôt / Dépôt
              </h3>
            </div>

            <form onSubmit={handleCreateWarehouse} style={{ padding: '1.5rem' }}>
              {error && (
                <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '10px 12px', borderRadius: '8px', fontSize: '13px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#0e121b', marginBottom: '4px' }}>Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="DEP-03"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cdd0d5', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#0e121b', marginBottom: '4px' }}>Nom du Dépôt *</label>
                  <input
                    type="text"
                    required
                    placeholder="Dépôt Nord Bâtiment 2"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cdd0d5', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#525866', marginBottom: '4px' }}>Adresse physique</label>
                  <input
                    type="text"
                    placeholder="Zone Industrielle Ouest"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cdd0d5', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#525866', marginBottom: '4px' }}>Ville</label>
                  <input
                    type="text"
                    placeholder="Douala"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cdd0d5', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#525866', marginBottom: '4px' }}>Responsable</label>
                  <input
                    type="text"
                    placeholder="Nom du gestionnaire"
                    value={formData.manager_name}
                    onChange={(e) => setFormData({ ...formData, manager_name: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cdd0d5', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#525866', marginBottom: '4px' }}>Téléphone</label>
                  <input
                    type="text"
                    placeholder="+237..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cdd0d5', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setIsNewWarehouseOpen(false)}
                  style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #cdd0d5', background: '#ffffff', color: '#525866', fontSize: '13px', cursor: 'pointer' }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#0e121b', color: '#ffffff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                >
                  {submitting ? 'Création...' : 'Créer l\'Entrepôt'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      <StockTransferModal
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
        onSuccess={loadWarehouses}
        preselectedSourceWarehouseId={selectedWarehouseForTransfer}
      />
    </div>
  );
};
