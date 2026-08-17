import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Package, ArrowLeft, ArrowRightLeft, SlidersHorizontal,
  TrendingUp, Calendar, MapPin, Layers, History, DollarSign,
  AlertTriangle, CheckCircle2, RefreshCw
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { StockBadge } from '../components/StockBadge';
import { StockAdjustmentModal } from '../components/StockAdjustmentModal';
import { StockTransferModal } from '../components/StockTransferModal';
import { inventoryApi } from '../services/api';
import type { Product, Warehouse, StockMovement, ProductBatch, SerialNumber } from '../types';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [batches, setBatches] = useState<ProductBatch[]>([]);
  const [serialNumbers, setSerialNumbers] = useState<SerialNumber[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  const loadProduct = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [prodData, mvtData, whData, batchData, serialsData] = await Promise.all([
        inventoryApi.getProduct(id),
        inventoryApi.getProductMovements(id),
        inventoryApi.getWarehouses(),
        inventoryApi.getProductBatches(id),
        inventoryApi.getProductSerialNumbers({ product: id })
      ]);
      setProduct(prodData);
      setMovements(mvtData);
      setWarehouses(whData);
      setBatches(batchData);
      setSerialNumbers(serialsData);
    } catch (err) {
      console.error('Failed to load product detail:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(val);
  };

  if (loading || !product) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#868c98' }}>
        Chargement de la fiche produit 360°...
      </div>
    );
  }

  const margin = product.selling_price - product.purchase_price;
  const marginPercentage = product.purchase_price > 0 ? Math.round((margin / product.purchase_price) * 100) : 0;

  return (
    <div style={{ padding: '1.5rem 2rem' }}>
      <button
        onClick={() => navigate('/inventory/products')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'none',
          border: 'none',
          color: '#525866',
          fontSize: '13px',
          cursor: 'pointer',
          marginBottom: '1rem',
          padding: 0
        }}
      >
        <ArrowLeft size={16} />
        Retour au catalogue
      </button>

      <PageHeader
        title={product.name}
        subtitle={`SKU: ${product.sku} • Catégorie: ${product.category_name || 'Général'} • Unité: ${product.unit_name || 'Unitaire'}`}
        breadcrumbs={[{ label: 'Articles', href: '/inventory/products' }, { label: product.sku }]}
        actions={
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setIsAdjustOpen(true)}
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
              <SlidersHorizontal size={14} />
              Ajuster le Stock
            </button>
            <button
              onClick={() => setIsTransferOpen(true)}
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
              <ArrowRightLeft size={14} />
              Transférer
            </button>
          </div>
        }
      />

      {/* Hero Overview Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {/* Product Image */}
        {product.image && (
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e4e9', borderRadius: '12px', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={product.image} alt={product.name} style={{ maxHeight: '100px', maxWidth: '100%', objectFit: 'contain', borderRadius: '8px' }} />
          </div>
        )}
        
        {/* Total Stock */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e4e9', borderRadius: '12px', padding: '1.25rem' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#868c98', textTransform: 'uppercase', marginBottom: '4px' }}>
            Stock Physique (Total)
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0e121b' }}>
            {product.total_stock_on_hand} <span style={{ fontSize: '1rem', color: '#525866', fontWeight: 500 }}>{product.unit_symbol}</span>
          </div>
          
          <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 600 }}>
              <span style={{ color: '#059669' }}>Dispo: {product.total_stock_available}</span>
              <span style={{ color: '#d97706' }}>Réservé: {(product.total_stock_on_hand - product.total_stock_available).toFixed(2)}</span>
            </div>
            {/* Progress Bar */}
            <div style={{ width: '100%', height: '6px', backgroundColor: '#e2e4e9', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
              <div style={{ 
                width: `${product.total_stock_on_hand > 0 ? (product.total_stock_available / product.total_stock_on_hand) * 100 : 0}%`, 
                backgroundColor: '#10b981' 
              }}></div>
              <div style={{ 
                width: `${product.total_stock_on_hand > 0 ? ((product.total_stock_on_hand - product.total_stock_available) / product.total_stock_on_hand) * 100 : 0}%`, 
                backgroundColor: '#f59e0b' 
              }}></div>
            </div>
          </div>

          <div style={{ marginTop: '12px' }}>
            <StockBadge status={product.stock_status} />
          </div>
        </div>

        {/* Global Valuation */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e4e9', borderRadius: '12px', padding: '1.25rem' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#868c98', textTransform: 'uppercase', marginBottom: '4px' }}>
            Valorisation au CUMP
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0e121b' }}>
            {formatCurrency(product.total_valuation)}
          </div>
          <div style={{ fontSize: '12px', color: '#525866', marginTop: '4px' }}>
            Coût unitaire : {formatCurrency(product.purchase_price)}
          </div>
        </div>

        {/* Selling Price & Margin */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e4e9', borderRadius: '12px', padding: '1.25rem' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#868c98', textTransform: 'uppercase', marginBottom: '4px' }}>
            Prix de Vente & Marge
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#4f46e5' }}>
            {formatCurrency(product.selling_price)}
          </div>
          <div style={{ fontSize: '12px', color: '#059669', fontWeight: 600, marginTop: '4px' }}>
            +{formatCurrency(margin)} (+{marginPercentage}%)
          </div>
        </div>

        {/* Thresholds */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e4e9', borderRadius: '12px', padding: '1.25rem' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#868c98', textTransform: 'uppercase', marginBottom: '4px' }}>
            Paramètres Réappro
          </div>
          <div style={{ fontSize: '13px', color: '#0e121b', display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
            <div>Seuil critique : <strong>{product.min_stock_level} {product.unit_symbol}</strong></div>
            <div>Qte suggérée : <strong>{product.reorder_quantity} {product.unit_symbol}</strong></div>
          </div>
        </div>
      </div>

      {/* Warehouses Breakdown Table */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e4e9',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '24px'
      }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.125rem', fontWeight: 600, color: '#0e121b' }}>
          Stock Physique par Entrepôt & Emplacement
        </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9f9fb', borderBottom: '1px solid #e2e4e9', textAlign: 'left', color: '#525866' }}>
              <th style={{ padding: '10px 12px', fontWeight: 600 }}>Entrepôt</th>
              <th style={{ padding: '10px 12px', fontWeight: 600 }}>Emplacement</th>
              <th style={{ padding: '10px 12px', fontWeight: 600, textAlign: 'right' }}>Stock Réel</th>
              <th style={{ padding: '10px 12px', fontWeight: 600, textAlign: 'right' }}>Réservé</th>
              <th style={{ padding: '10px 12px', fontWeight: 600, textAlign: 'right' }}>Disponible</th>
              <th style={{ padding: '10px 12px', fontWeight: 600, textAlign: 'right' }}>Valorisation (CUMP)</th>
            </tr>
          </thead>
          <tbody>
            {product.stocks.map((stk) => (
              <tr key={stk.id} style={{ borderBottom: '1px solid #f3f3f6' }}>
                <td style={{ padding: '12px', fontWeight: 600, color: '#0e121b' }}>
                  {stk.warehouse_name} [{stk.warehouse_code}]
                </td>
                <td style={{ padding: '12px', color: '#525866' }}>
                  {stk.location_code || 'Non assigné'}
                </td>
                <td style={{ padding: '12px', textAlign: 'right', fontWeight: 700, color: '#0e121b' }}>
                  {stk.quantity_on_hand} {product.unit_symbol}
                </td>
                <td style={{ padding: '12px', textAlign: 'right', color: '#868c98' }}>
                  {stk.quantity_reserved} {product.unit_symbol}
                </td>
                <td style={{ padding: '12px', textAlign: 'right', fontWeight: 600, color: '#059669' }}>
                  {stk.quantity_available} {product.unit_symbol}
                </td>
                <td style={{ padding: '12px', textAlign: 'right', fontWeight: 600, color: '#0e121b' }}>
                  {formatCurrency(stk.total_value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Batches Table */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e4e9',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: '#0e121b' }}>
              Lots & Péremptions (DLC/DLUO)
            </h3>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#525866' }}>
              Suivi de la traçabilité des lots et dates limites.
            </p>
          </div>
        </div>

        {batches.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#868c98', fontSize: '13px' }}>
            Aucun lot enregistré pour cet article.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9f9fb', borderBottom: '1px solid #e2e4e9', textAlign: 'left', color: '#525866' }}>
                <th style={{ padding: '10px 12px', fontWeight: 600 }}>N° Lot</th>
                <th style={{ padding: '10px 12px', fontWeight: 600 }}>Date de Fabrication</th>
                <th style={{ padding: '10px 12px', fontWeight: 600 }}>Date d'Expiration</th>
                <th style={{ padding: '10px 12px', fontWeight: 600 }}>Statut</th>
                <th style={{ padding: '10px 12px', fontWeight: 600, textAlign: 'right' }}>Quantité</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((batch) => (
                <tr key={batch.id} style={{ borderBottom: '1px solid #f3f3f6' }}>
                  <td style={{ padding: '12px', fontWeight: 600, color: '#0e121b' }}>
                    {batch.batch_number}
                  </td>
                  <td style={{ padding: '12px', color: '#525866' }}>
                    {batch.manufacturing_date || '-'}
                  </td>
                  <td style={{ padding: '12px', color: '#525866' }}>
                    {batch.expiry_date || '-'}
                  </td>
                  <td style={{ padding: '12px' }}>
                    {batch.is_expired ? (
                      <span style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
                        Expiré
                      </span>
                    ) : (
                      <span style={{ backgroundColor: '#d1fae5', color: '#059669', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
                        Valide
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: 700, color: '#0e121b' }}>
                    {batch.current_quantity} {product.unit_symbol}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Serial Numbers Table */}
      {product.tracking_serial && (
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e4e9',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: '#0e121b' }}>
                Numéros de Série
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#525866' }}>
                Suivi unitaire des articles.
              </p>
            </div>
          </div>

          {serialNumbers.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#868c98', fontSize: '13px' }}>
              Aucun numéro de série enregistré pour cet article.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9f9fb', borderBottom: '1px solid #e2e4e9', textAlign: 'left', color: '#525866' }}>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>S/N</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>Statut</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>Dépôt</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>Lot</th>
                </tr>
              </thead>
              <tbody>
                {serialNumbers.map((sn) => (
                  <tr key={sn.id} style={{ borderBottom: '1px solid #f3f3f6' }}>
                    <td style={{ padding: '12px', fontWeight: 600, color: '#0e121b' }}>
                      {sn.serial_number}
                    </td>
                    <td style={{ padding: '12px' }}>
                      {sn.status === 'IN_STOCK' ? (
                        <span style={{ backgroundColor: '#d1fae5', color: '#059669', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
                          En stock
                        </span>
                      ) : sn.status === 'SOLD' ? (
                        <span style={{ backgroundColor: '#f3f4f6', color: '#4b5563', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
                          Vendu
                        </span>
                      ) : (
                        <span style={{ backgroundColor: '#fef3c7', color: '#d97706', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
                          {sn.status_display}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '12px', color: '#525866' }}>
                      {sn.warehouse_name || '-'}
                    </td>
                    <td style={{ padding: '12px', color: '#525866' }}>
                      {sn.batch_number || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Movements Ledger */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e4e9',
        borderRadius: '12px',
        padding: '1.5rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: '#0e121b' }}>
              Grand Livre des Mouvements de Stock
            </h3>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#525866' }}>
              Traçabilité chronologique complète des entrées, sorties et transferts.
            </p>
          </div>
          <button
            onClick={loadProduct}
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#868c98' }}
            title="Rafraîchir"
          >
            <RefreshCw size={14} />
          </button>
        </div>

        {movements.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#868c98', fontSize: '13px' }}>
            Aucun mouvement enregistré pour cet article.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9f9fb', borderBottom: '1px solid #e2e4e9', textAlign: 'left', color: '#525866' }}>
                <th style={{ padding: '10px 12px', fontWeight: 600 }}>Date & Heure</th>
                <th style={{ padding: '10px 12px', fontWeight: 600 }}>N° Mouvement</th>
                <th style={{ padding: '10px 12px', fontWeight: 600 }}>Type de Flux</th>
                <th style={{ padding: '10px 12px', fontWeight: 600 }}>Origine / Destination</th>
                <th style={{ padding: '10px 12px', fontWeight: 600, textAlign: 'right' }}>Quantité</th>
                <th style={{ padding: '10px 12px', fontWeight: 600, textAlign: 'right' }}>Coût Total</th>
                <th style={{ padding: '10px 12px', fontWeight: 600 }}>Motif / Référence</th>
              </tr>
            </thead>
            <tbody>
              {movements.map((mvt) => {
                const isEntry = mvt.movement_type.startsWith('ENTREE');
                const isExit = mvt.movement_type.startsWith('SORTIE');
                return (
                  <tr key={mvt.id} style={{ borderBottom: '1px solid #f3f3f6' }}>
                    <td style={{ padding: '12px', color: '#525866' }}>
                      {new Date(mvt.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td style={{ padding: '12px', fontWeight: 600, color: '#0e121b' }}>
                      {mvt.movement_number}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 600,
                        backgroundColor: isEntry ? '#ecfdf5' : isExit ? '#fee2e2' : '#e0e7ff',
                        color: isEntry ? '#059669' : isExit ? '#dc2626' : '#4f46e5'
                      }}>
                        {mvt.movement_type_display}
                      </span>
                    </td>
                    <td style={{ padding: '12px', color: '#525866' }}>
                      {mvt.source_warehouse_name && mvt.target_warehouse_name
                        ? `${mvt.source_warehouse_name} ➔ ${mvt.target_warehouse_name}`
                        : mvt.target_warehouse_name || mvt.source_warehouse_name || '-'}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 700, color: isEntry ? '#059669' : isExit ? '#dc2626' : '#0e121b' }}>
                      {isEntry ? `+${mvt.quantity}` : isExit ? `-${mvt.quantity}` : mvt.quantity} {mvt.unit_symbol}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 600, color: '#0e121b' }}>
                      {formatCurrency(mvt.total_cost)}
                    </td>
                    <td style={{ padding: '12px', color: '#525866', fontSize: '12px' }}>
                      {mvt.reference_document && <span style={{ fontWeight: 600, marginRight: '6px' }}>[{mvt.reference_document}]</span>}
                      {mvt.reason || '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Adjust Modal */}
      {isAdjustOpen && (
        <StockAdjustmentModal
          isOpen={isAdjustOpen}
          onClose={() => setIsAdjustOpen(false)}
          onSuccess={loadProduct}
          product={product}
          warehouses={warehouses}
        />
      )}

      {/* Transfer Modal */}
      {isTransferOpen && (
        <StockTransferModal
          isOpen={isTransferOpen}
          onClose={() => setIsTransferOpen(false)}
          onSuccess={loadProduct}
          preselectedProduct={product}
        />
      )}
    </div>
  );
};
