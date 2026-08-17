import React, { useState, useEffect } from 'react';
import { ArrowRight, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { inventoryApi } from '../services/api';
import type { Product, Warehouse } from '../types';

interface StockTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  preselectedProduct?: Product;
  preselectedSourceWarehouseId?: string;
}

export const StockTransferModal: React.FC<StockTransferModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  preselectedProduct,
  preselectedSourceWarehouseId
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [sourceWarehouseId, setSourceWarehouseId] = useState<string>('');
  const [targetWarehouseId, setTargetWarehouseId] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('1');
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      Promise.all([inventoryApi.getProducts(), inventoryApi.getWarehouses()])
        .then(([prods, whs]) => {
          setProducts(prods);
          setWarehouses(whs);

          if (preselectedProduct) {
            setSelectedProductId(preselectedProduct.id);
          } else if (prods.length > 0) {
            setSelectedProductId(prods[0].id);
          }

          if (preselectedSourceWarehouseId) {
            setSourceWarehouseId(preselectedSourceWarehouseId);
          } else if (whs.length > 0) {
            setSourceWarehouseId(whs[0].id);
            if (whs.length > 1) {
              setTargetWarehouseId(whs[1].id);
            }
          }
        })
        .catch((err) => setError(err.message));
    }
  }, [isOpen, preselectedProduct, preselectedSourceWarehouseId]);

  if (!isOpen) return null;

  const currentProduct = products.find((p) => p.id === selectedProductId);
  const currentSourceStock = currentProduct?.stocks?.find((s) => s.warehouse === sourceWarehouseId);
  const maxAvailable = currentSourceStock ? currentSourceStock.quantity_available : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const qtyNum = parseFloat(quantity);
    if (!selectedProductId || !sourceWarehouseId || !targetWarehouseId || isNaN(qtyNum) || qtyNum <= 0) {
      setError('Veuillez remplir tous les champs obligatoires avec une quantité valide.');
      return;
    }

    if (sourceWarehouseId === targetWarehouseId) {
      setError('Le dépôt source et le dépôt de destination doivent être différents.');
      return;
    }

    if (qtyNum > maxAvailable) {
      setError(`Quantité demandée (${qtyNum}) supérieure au stock disponible (${maxAvailable}).`);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await inventoryApi.transferStock({
        product_id: selectedProductId,
        source_warehouse_id: sourceWarehouseId,
        target_warehouse_id: targetWarehouseId,
        quantity: qtyNum,
        notes
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erreur lors du transfert.');
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
        maxWidth: '520px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e4e9',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #f3f3f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: '#0e121b' }}>
              Transfert Inter-Dépôts
            </h3>
            <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#525866' }}>
              Déplacez des stocks d'un entrepôt à un autre en temps réel.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: '#868c98',
              padding: '4px',
              borderRadius: '6px'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          {error && (
            <div style={{
              backgroundColor: '#fee2e2',
              border: '1px solid #fecaca',
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

          {/* Product Select */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#0e121b', marginBottom: '6px' }}>
              Article à transférer *
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #cdd0d5',
                fontSize: '13px',
                backgroundColor: '#ffffff'
              }}
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.sku}) - Dispo globale: {p.total_stock_available} {p.unit_symbol}
                </option>
              ))}
            </select>
          </div>

          {/* Warehouses Flow */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            gap: '8px',
            alignItems: 'center',
            marginBottom: '1.25rem'
          }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#525866', marginBottom: '4px' }}>
                Dépôt Source (Départ) *
              </label>
              <select
                value={sourceWarehouseId}
                onChange={(e) => setSourceWarehouseId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: '1px solid #cdd0d5',
                  fontSize: '12px',
                  backgroundColor: '#ffffff'
                }}
              >
                {warehouses.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} [{w.code}]
                  </option>
                ))}
              </select>
              <div style={{ fontSize: '11px', color: '#059669', marginTop: '3px', fontWeight: 500 }}>
                Dispo : {maxAvailable} {currentProduct?.unit_symbol || 'u'}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '10px' }}>
              <ArrowRight size={18} color="#868c98" />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#525866', marginBottom: '4px' }}>
                Dépôt Cible (Arrivée) *
              </label>
              <select
                value={targetWarehouseId}
                onChange={(e) => setTargetWarehouseId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: '1px solid #cdd0d5',
                  fontSize: '12px',
                  backgroundColor: '#ffffff'
                }}
              >
                {warehouses.map((w) => (
                  <option key={w.id} value={w.id} disabled={w.id === sourceWarehouseId}>
                    {w.name} [{w.code}]
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quantity */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 500, color: '#0e121b' }}>
                Quantité à transférer * ({currentProduct?.unit_symbol || 'u'})
              </label>
              <button
                type="button"
                onClick={() => setQuantity(maxAvailable.toString())}
                style={{ fontSize: '11px', color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
              >
                Tout transférer ({maxAvailable})
              </button>
            </div>
            <input
              type="number"
              step="any"
              min="0.01"
              max={maxAvailable}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #cdd0d5',
                fontSize: '13px'
              }}
            />
          </div>

          {/* Reason / Notes */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#0e121b', marginBottom: '6px' }}>
              Motif / Note du transfert
            </label>
            <input
              type="text"
              placeholder="Ex: Rééquilibrage vers le magasin de vente"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #cdd0d5',
                fontSize: '13px'
              }}
            />
          </div>

          {/* Footer Actions */}
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
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || maxAvailable <= 0}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: '#0e121b',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 600,
                cursor: maxAvailable <= 0 ? 'not-allowed' : 'pointer',
                opacity: loading || maxAvailable <= 0 ? 0.6 : 1
              }}
            >
              {loading ? 'Transfert en cours...' : 'Confirmer le transfert'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
