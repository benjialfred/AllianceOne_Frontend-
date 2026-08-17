import React, { useState } from 'react';
import { PackageCheck, AlertCircle, X } from 'lucide-react';
import { inventoryApi } from '../services/api';
import type { PurchaseOrder } from '../types';

interface GoodsReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  purchaseOrder: PurchaseOrder;
}

export const GoodsReceiptModal: React.FC<GoodsReceiptModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  purchaseOrder
}) => {
  const [receivedQtys, setReceivedQtys] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    purchaseOrder.items.forEach((it) => {
      const remaining = Math.max(0, it.ordered_quantity - it.received_quantity);
      initial[it.id] = remaining.toString();
    });
    return initial;
  });
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleQtyChange = (itemId: string, val: string) => {
    setReceivedQtys((prev) => ({ ...prev, [itemId]: val }));
  };

  const handleReceiveAll = () => {
    const all: Record<string, string> = {};
    purchaseOrder.items.forEach((it) => {
      all[it.id] = Math.max(0, it.ordered_quantity - it.received_quantity).toString();
    });
    setReceivedQtys(all);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const itemsPayload = purchaseOrder.items.map((it) => ({
      item_id: it.id,
      quantity: parseFloat(receivedQtys[it.id] || '0'),
      unit_cost: it.unit_price
    })).filter((it) => it.quantity > 0);

    if (itemsPayload.length === 0) {
      setError('Veuillez spécifier au moins une quantité à réceptionner (> 0).');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await inventoryApi.receivePurchaseOrderGoods(purchaseOrder.id, {
        received_items: itemsPayload,
        notes
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la réception des marchandises.');
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
        maxWidth: '680px',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: '#ecfdf5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#059669'
            }}>
              <PackageCheck size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: '#0e121b' }}>
                Réception de Marchandises
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#525866' }}>
                Bon de commande {purchaseOrder.order_number} • Fournisseur : {purchaseOrder.supplier_name}
              </p>
            </div>
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

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px'
          }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#0e121b' }}>
              Entrepôt de stockage : <span style={{ color: '#6366f1' }}>{purchaseOrder.warehouse_name}</span>
            </span>
            <button
              type="button"
              onClick={handleReceiveAll}
              style={{
                fontSize: '12px',
                color: '#6366f1',
                background: 'none',
                border: 'none',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Tout réceptionner
            </button>
          </div>

          {/* Items Table */}
          <div style={{
            border: '1px solid #e2e4e9',
            borderRadius: '8px',
            overflow: 'hidden',
            marginBottom: '1.25rem'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9f9fb', borderBottom: '1px solid #e2e4e9', textAlign: 'left', color: '#525866' }}>
                  <th style={{ padding: '8px 12px', fontWeight: 600 }}>Article</th>
                  <th style={{ padding: '8px 12px', fontWeight: 600, textAlign: 'center' }}>Commandé</th>
                  <th style={{ padding: '8px 12px', fontWeight: 600, textAlign: 'center' }}>Déjà reçu</th>
                  <th style={{ padding: '8px 12px', fontWeight: 600, textAlign: 'right', width: '140px' }}>À Réceptionner</th>
                </tr>
              </thead>
              <tbody>
                {purchaseOrder.items.map((item) => {
                  const remaining = Math.max(0, item.ordered_quantity - item.received_quantity);
                  return (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f3f3f6' }}>
                      <td style={{ padding: '10px 12px' }}>
                        <div style={{ fontWeight: 600, color: '#0e121b' }}>{item.product_name}</div>
                        <div style={{ fontSize: '11px', color: '#868c98' }}>SKU: {item.product_sku}</div>
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 500 }}>
                        {item.ordered_quantity} {item.unit_symbol}
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'center', color: '#059669', fontWeight: 600 }}>
                        {item.received_quantity} {item.unit_symbol}
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                        <input
                          type="number"
                          step="any"
                          min="0"
                          max={remaining}
                          value={receivedQtys[item.id] || '0'}
                          onChange={(e) => handleQtyChange(item.id, e.target.value)}
                          style={{
                            width: '90px',
                            padding: '6px 8px',
                            borderRadius: '6px',
                            border: '1px solid #cdd0d5',
                            textAlign: 'right',
                            fontWeight: 600,
                            fontSize: '13px'
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#0e121b', marginBottom: '6px' }}>
              Notes de réception / N° Bon de livraison transporteur
            </label>
            <input
              type="text"
              placeholder="Ex: BL-8942 livré par CamExpress sans réserve"
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
              disabled={loading}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: '#059669',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {loading ? 'Validation...' : 'Valider l\'Entrée en Stock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
