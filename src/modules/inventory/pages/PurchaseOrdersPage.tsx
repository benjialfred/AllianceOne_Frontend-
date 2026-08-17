import React, { useEffect, useState } from 'react';
import {
  ShoppingCart, Plus, Search, Calendar, Warehouse as WarehouseIcon,
  Truck, CheckCircle2, Clock, PackageCheck, AlertCircle, Eye, ChevronRight
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { GoodsReceiptModal } from '../components/GoodsReceiptModal';
import { inventoryApi } from '../services/api';
import type { PurchaseOrder, Supplier, Warehouse, Product } from '../types';

export const PurchaseOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [receiptOrder, setReceiptOrder] = useState<PurchaseOrder | null>(null);
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);

  // New PO form state
  const [formData, setFormData] = useState({
    supplier: '',
    warehouse: '',
    expected_delivery_date: '',
    notes: '',
    items: [{ product: '', ordered_quantity: '1', unit_price: '0' }]
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [orderData, supData, whData, prodData] = await Promise.all([
        inventoryApi.getPurchaseOrders(),
        inventoryApi.getSuppliers(),
        inventoryApi.getWarehouses(),
        inventoryApi.getProducts()
      ]);
      setOrders(orderData);
      setSuppliers(supData);
      setWarehouses(whData);
      setProducts(prodData);

      if (supData.length > 0 && !formData.supplier) {
        setFormData((prev) => ({ ...prev, supplier: supData[0].id }));
      }
      if (whData.length > 0 && !formData.warehouse) {
        setFormData((prev) => ({ ...prev, warehouse: whData[0].id }));
      }
      if (prodData.length > 0 && formData.items[0]?.product === '') {
        setFormData((prev) => ({
          ...prev,
          items: [{ product: prodData[0].id, ordered_quantity: '1', unit_price: prodData[0].purchase_price.toString() }]
        }));
      }
    } catch (err) {
      console.error('Failed to load purchase orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(val);
  };

  const handleAddItemRow = () => {
    if (products.length === 0) return;
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { product: products[0].id, ordered_quantity: '1', unit_price: products[0].purchase_price.toString() }]
    }));
  };

  const handleRemoveItemRow = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx)
    }));
  };

  const handleItemChange = (idx: number, field: string, val: string) => {
    setFormData((prev) => {
      const newItems = [...prev.items];
      newItems[idx] = { ...newItems[idx], [field]: val };
      if (field === 'product') {
        const p = products.find((prod) => prod.id === val);
        if (p) {
          newItems[idx].unit_price = p.purchase_price.toString();
        }
      }
      return { ...prev, items: newItems };
    });
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.supplier || !formData.warehouse || formData.items.length === 0) {
      setError('Veuillez renseigner le fournisseur, le dépôt et au moins un article.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await inventoryApi.createPurchaseOrder({
        supplier: formData.supplier,
        warehouse: formData.warehouse,
        expected_delivery_date: formData.expected_delivery_date || undefined,
        notes: formData.notes,
        items: formData.items.map((it) => ({
          product: it.product,
          ordered_quantity: parseFloat(it.ordered_quantity) || 1,
          unit_price: parseFloat(it.unit_price) || 0
        }))
      });
      setIsNewOrderOpen(false);
      loadData();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création de la commande.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmOrder = async (orderId: string) => {
    try {
      await inventoryApi.confirmPurchaseOrder(orderId);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      !searchQuery ||
      o.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.supplier_name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = !selectedStatus || o.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ padding: '1.5rem 2rem' }}>
      <PageHeader
        title="Bons de Commande Fournisseurs"
        subtitle="Cycle d'approvisionnement, bons de commande, réceptions partielles et intégration en stock."
        breadcrumbs={[{ label: 'Stock & Logistique' }, { label: 'Commandes d\'Achat' }]}
        actions={
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={async () => {
                try {
                  const res = await inventoryApi.autoReplenish();
                  alert(res.message);
                  loadData();
                } catch (err: any) {
                  alert(err.message || "Erreur de réassort");
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid #e2e4e9',
                backgroundColor: '#ffffff',
                color: '#525866',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <RefreshCw size={14} />
              Auto-Réassort
            </button>
            <button
              onClick={() => setIsNewOrderOpen(true)}
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
              Nouveau Bon de Commande
            </button>
          </div>
        }
      />

      {/* Filter bar */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e4e9',
        borderRadius: '12px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap',
        marginBottom: '1.5rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#f9f9fb',
          border: '1px solid #e2e4e9',
          borderRadius: '8px',
          padding: '6px 12px',
          flex: 1,
          minWidth: '220px'
        }}>
          <Search size={15} color="#868c98" />
          <input
            type="text"
            placeholder="Rechercher par N° de commande ou fournisseur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '13px', width: '100%' }}
          />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #e2e4e9', fontSize: '13px', backgroundColor: '#ffffff' }}
        >
          <option value="">Tous les statuts</option>
          <option value="BROUILLON">Brouillon</option>
          <option value="COMMANDE">Commandé (En attente)</option>
          <option value="RECEPTION_PARTIELLE">Réception Partielle</option>
          <option value="RECU_TOTAL">Réception Totale (Soldé)</option>
        </select>
      </div>

      {/* Table */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e4e9',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(14, 18, 27, 0.05)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9f9fb', borderBottom: '1px solid #e2e4e9', textAlign: 'left', color: '#525866' }}>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>N° Commande</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Fournisseur</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Dépôt Cible</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Statut</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Date d'émission</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'right' }}>Total TTC</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#868c98' }}>Chargement des commandes...</td></tr>
            ) : filteredOrders.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#868c98' }}>Aucune commande fournisseur trouvée.</td></tr>
            ) : (
              filteredOrders.map((po) => {
                const isDraft = po.status === 'BROUILLON';
                const isOrdered = po.status === 'COMMANDE';
                const isPartial = po.status === 'RECEPTION_PARTIELLE';
                const isCompleted = po.status === 'RECU_TOTAL';

                return (
                  <tr key={po.id} style={{ borderBottom: '1px solid #f3f3f6' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: '#0e121b' }}>
                      {po.order_number}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 600, color: '#0e121b' }}>{po.supplier_name}</div>
                      <div style={{ fontSize: '11px', color: '#868c98' }}>{po.items.length} lignes d'articles</div>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#525866' }}>
                      {po.warehouse_name}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 600,
                        backgroundColor: isCompleted ? '#ecfdf5' : isPartial ? '#fef3c7' : isOrdered ? '#eff6ff' : '#f3f3f6',
                        color: isCompleted ? '#059669' : isPartial ? '#d97706' : isOrdered ? '#2563eb' : '#525866'
                      }}>
                        {po.status_display}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#525866' }}>
                      {po.order_date}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: '#0e121b' }}>
                      {formatCurrency(po.total_ttc)}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                        {isDraft && (
                          <button
                            onClick={() => handleConfirmOrder(po.id)}
                            style={{
                              padding: '5px 10px',
                              borderRadius: '6px',
                              border: '1px solid #e2e4e9',
                              background: '#ffffff',
                              color: '#2563eb',
                              fontSize: '12px',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            Valider la commande
                          </button>
                        )}
                        {(isOrdered || isPartial) && (
                          <button
                            onClick={() => setReceiptOrder(po)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '5px 10px',
                              borderRadius: '6px',
                              border: 'none',
                              background: '#059669',
                              color: '#ffffff',
                              fontSize: '12px',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            <PackageCheck size={13} />
                            Réceptionner
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Goods Receipt Modal */}
      {receiptOrder && (
        <GoodsReceiptModal
          isOpen={!!receiptOrder}
          onClose={() => setReceiptOrder(null)}
          onSuccess={loadData}
          purchaseOrder={receiptOrder}
        />
      )}

      {/* New Purchase Order Modal */}
      {isNewOrderOpen && (
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
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e4e9',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f3f3f6' }}>
              <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: '#0e121b' }}>
                Nouveau Bon de Commande Fournisseur
              </h3>
            </div>

            <form onSubmit={handleCreateOrder} style={{ padding: '1.5rem', overflowY: 'auto' }}>
              {error && (
                <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '10px 12px', borderRadius: '8px', fontSize: '13px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#0e121b', marginBottom: '4px' }}>Fournisseur *</label>
                  <select
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cdd0d5', fontSize: '13px', backgroundColor: '#ffffff' }}
                  >
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#0e121b', marginBottom: '4px' }}>Dépôt de livraison *</label>
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
              </div>

              {/* Items Rows */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#0e121b' }}>Articles commandés</label>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    style={{ fontSize: '12px', color: '#6366f1', background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer' }}
                  >
                    + Ajouter une ligne
                  </button>
                </div>

                {formData.items.map((it, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                    <select
                      value={it.product}
                      onChange={(e) => handleItemChange(idx, 'product', e.target.value)}
                      style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cdd0d5', fontSize: '12px', backgroundColor: '#ffffff' }}
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                      ))}
                    </select>

                    <input
                      type="number"
                      step="any"
                      min="1"
                      placeholder="Qte"
                      value={it.ordered_quantity}
                      onChange={(e) => handleItemChange(idx, 'ordered_quantity', e.target.value)}
                      style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cdd0d5', fontSize: '12px' }}
                    />

                    <input
                      type="number"
                      step="any"
                      placeholder="Prix HT"
                      value={it.unit_price}
                      onChange={(e) => handleItemChange(idx, 'unit_price', e.target.value)}
                      style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cdd0d5', fontSize: '12px' }}
                    />

                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItemRow(idx)}
                        style={{ border: 'none', background: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '14px' }}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#525866', marginBottom: '4px' }}>Notes / Instructions logistiques</label>
                <input
                  type="text"
                  placeholder="Ex: Livraison impérative avant fin de semaine"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cdd0d5', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setIsNewOrderOpen(false)}
                  style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #cdd0d5', background: '#ffffff', color: '#525866', fontSize: '13px', cursor: 'pointer' }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#0e121b', color: '#ffffff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                >
                  {submitting ? 'Création...' : 'Créer la Commande'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
