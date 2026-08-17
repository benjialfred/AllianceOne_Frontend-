import React, { useState } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { inventoryApi } from '../services/api';
import type { Product, Warehouse } from '../types';

interface StockAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product: Product;
  warehouses: Warehouse[];
}

export const StockAdjustmentModal: React.FC<StockAdjustmentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  product,
  warehouses
}) => {
  const [warehouseId, setWarehouseId] = useState<string>(warehouses[0]?.id || '');
  const [newQuantity, setNewQuantity] = useState<string>('0');
  const [reason, setReason] = useState<string>('Ajustement manuel suite à vérification visuelle');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentStock = product.stocks?.find((s) => s.warehouse === warehouseId);
  const currentQty = currentStock ? currentStock.quantity_on_hand : 0;
  const targetQtyNum = parseFloat(newQuantity) || 0;
  const difference = targetQtyNum - currentQty;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!warehouseId || isNaN(targetQtyNum) || targetQtyNum < 0) {
      setError('Veuillez spécifier une quantité valide (supérieure ou égale à 0).');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await inventoryApi.adjustProductStock(product.id, {
        warehouse_id: warehouseId,
        new_quantity: targetQtyNum,
        reason
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la régularisation du stock.');
    } finally {
      setLoading(false);
    }
  };

  return (
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
        maxWidth: '480px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e2e4e9',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #f3f3f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: '#0e121b' }}>
              Ajustement de Stock
            </h3>
            <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#525866' }}>
              {product.name} ({product.sku})
            </p>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#868c98' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          {error && (
            <div style={{
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              padding: '10px 12px',
              borderRadius: '8px',
              fontSize: '13px',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#0e121b', marginBottom: '6px' }}>
              Entrepôt concerné *
            </label>
            <select
              value={warehouseId}
              onChange={(e) => {
                setWarehouseId(e.target.value);
                const s = product.stocks?.find((st) => st.warehouse === e.target.value);
                setNewQuantity(s ? s.quantity_on_hand.toString() : '0');
              }}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #cdd0d5',
                fontSize: '13px',
                backgroundColor: '#ffffff'
              }}
            >
              {warehouses.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} [{w.code}]
                </option>
              ))}
            </select>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            backgroundColor: '#f9f9fb',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '1.25rem',
            border: '1px solid #e2e4e9'
          }}>
            <div>
              <div style={{ fontSize: '11px', color: '#868c98', textTransform: 'uppercase', fontWeight: 600 }}>Stock Actuel</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#0e121b', marginTop: '2px' }}>
                {currentQty} {product.unit_symbol || 'u'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#868c98', textTransform: 'uppercase', fontWeight: 600 }}>Variation calculée</div>
              <div style={{
                fontSize: '16px',
                fontWeight: 700,
                color: difference > 0 ? '#059669' : difference < 0 ? '#dc2626' : '#525866',
                marginTop: '2px'
              }}>
                {difference > 0 ? `+${difference}` : difference} {product.unit_symbol || 'u'}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#0e121b', marginBottom: '6px' }}>
              Nouveau Stock Réel ({product.unit_symbol || 'u'}) *
            </label>
            <input
              type="number"
              step="any"
              min="0"
              value={newQuantity}
              onChange={(e) => setNewQuantity(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #cdd0d5',
                fontSize: '14px',
                fontWeight: 600
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#0e121b', marginBottom: '6px' }}>
              Justification du mouvement *
            </label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #cdd0d5',
                fontSize: '13px',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid #cdd0d5',
                background: '#ffffff',
                color: '#525866',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || difference === 0}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: '#0e121b',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 600,
                cursor: difference === 0 ? 'not-allowed' : 'pointer',
                opacity: loading || difference === 0 ? 0.6 : 1
              }}
            >
              {loading ? 'Application...' : 'Appliquer l\'ajustement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
