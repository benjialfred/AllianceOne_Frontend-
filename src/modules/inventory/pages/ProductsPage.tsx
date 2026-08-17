import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search, Filter, Plus, Package, ArrowRightLeft, SlidersHorizontal,
  ChevronRight, AlertCircle, Eye, Edit, Layers, Check
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { StockBadge } from '../components/StockBadge';
import { StockAdjustmentModal } from '../components/StockAdjustmentModal';
import { StockTransferModal } from '../components/StockTransferModal';
import { inventoryApi } from '../services/api';
import type { Product, Category, Unit, Warehouse } from '../types';

export const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>(searchParams.get('status') || '');
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('');

  // Modals state
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(searchParams.get('new') === '1');
  const [adjustmentProduct, setAdjustmentProduct] = useState<Product | null>(null);
  const [transferProduct, setTransferProduct] = useState<Product | null>(null);

  // Form state for new product
  const [formData, setFormData] = useState({
    sku: '',
    barcode: '',
    name: '',
    description: '',
    category: '',
    unit: '',
    purchase_price: '0',
    selling_price: '0',
    min_stock_level: '5',
    reorder_quantity: '10',
    initial_warehouse: '',
    initial_quantity: '0',
    image: null as File | null
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, cats, unts, whs] = await Promise.all([
        inventoryApi.getProducts(),
        inventoryApi.getCategories(),
        inventoryApi.getUnits(),
        inventoryApi.getWarehouses()
      ]);
      setProducts(prods);
      setCategories(cats);
      setUnits(unts);
      setWarehouses(whs);

      if (whs.length > 0 && !formData.initial_warehouse) {
        setFormData((prev) => ({ ...prev, initial_warehouse: whs[0].id }));
      }
      if (unts.length > 0 && !formData.unit) {
        setFormData((prev) => ({ ...prev, unit: unts[0].id }));
      }
      if (cats.length > 0 && !formData.category) {
        setFormData((prev) => ({ ...prev, category: cats[0].id }));
      }
    } catch (err) {
      console.error('Failed to fetch products data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.sku) {
      setFormError('Le nom de l\'article et la référence SKU sont obligatoires.');
      return;
    }

    setSubmitting(true);
    setFormError(null);
    try {
      const payload = new FormData();
      payload.append('sku', formData.sku);
      if (formData.barcode) payload.append('barcode', formData.barcode);
      payload.append('name', formData.name);
      if (formData.description) payload.append('description', formData.description);
      if (formData.category) payload.append('category', formData.category);
      if (formData.unit) payload.append('unit', formData.unit);
      payload.append('purchase_price', (parseFloat(formData.purchase_price) || 0).toString());
      payload.append('selling_price', (parseFloat(formData.selling_price) || 0).toString());
      payload.append('min_stock_level', (parseFloat(formData.min_stock_level) || 5).toString());
      payload.append('reorder_quantity', (parseFloat(formData.reorder_quantity) || 10).toString());
      if (formData.initial_warehouse) payload.append('initial_warehouse', formData.initial_warehouse);
      payload.append('initial_quantity', (parseFloat(formData.initial_quantity) || 0).toString());
      if (formData.image) {
        payload.append('image', formData.image);
      }

      await inventoryApi.createProduct(payload);

      setIsNewProductModalOpen(false);
      setFormData({
        sku: '',
        barcode: '',
        name: '',
        description: '',
        category: categories[0]?.id || '',
        unit: units[0]?.id || '',
        purchase_price: '0',
        selling_price: '0',
        min_stock_level: '5',
        reorder_quantity: '10',
        initial_warehouse: warehouses[0]?.id || '',
        initial_quantity: '0',
        image: null
      });
      loadData();
    } catch (err: any) {
      setFormError(err.message || 'Erreur lors de la création du produit.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(val);
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.barcode && p.barcode.includes(searchQuery));

    const matchesCategory = !selectedCategory || p.category === selectedCategory;
    const matchesStatus = !selectedStatus || p.stock_status === selectedStatus;
    const matchesWarehouse =
      !selectedWarehouse || p.stocks.some((s) => s.warehouse === selectedWarehouse && s.quantity_on_hand > 0);

    return matchesSearch && matchesCategory && matchesStatus && matchesWarehouse;
  });

  return (
    <div style={{ padding: '1.5rem 2rem' }}>
      <PageHeader
        title="Catalogue des Articles & Stocks"
        subtitle="Gestion fine des références, seuils d'alertes, prix et répartition physique."
        breadcrumbs={[{ label: 'Stock & Logistique' }, { label: 'Articles' }]}
        actions={
          <button
            onClick={() => setIsNewProductModalOpen(true)}
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
            <Plus size={15} />
            Créer un Article
          </button>
        }
      />

      {/* Filter Bar */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e4e9',
        borderRadius: '12px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        flexWrap: 'wrap',
        marginBottom: '1.5rem'
      }}>
        {/* Search */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#f9f9fb',
          border: '1px solid #e2e4e9',
          borderRadius: '8px',
          padding: '6px 12px',
          flex: 1,
          minWidth: '240px'
        }}>
          <Search size={15} color="#868c98" />
          <input
            type="text"
            placeholder="Rechercher par libellé, SKU ou code-barres..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: '13px',
              width: '100%',
              color: '#0e121b'
            }}
          />
        </div>

        {/* Categories */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            padding: '6px 10px',
            borderRadius: '8px',
            border: '1px solid #e2e4e9',
            fontSize: '13px',
            backgroundColor: '#ffffff',
            color: '#0e121b'
          }}
        >
          <option value="">Toutes les catégories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Stock status */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          style={{
            padding: '6px 10px',
            borderRadius: '8px',
            border: '1px solid #e2e4e9',
            fontSize: '13px',
            backgroundColor: '#ffffff',
            color: '#0e121b'
          }}
        >
          <option value="">Tous les états de stock</option>
          <option value="IN_STOCK">En Stock (Normal)</option>
          <option value="LOW_STOCK">Stock Critique</option>
          <option value="OUT_OF_STOCK">En Rupture</option>
        </select>

        {/* Warehouse */}
        <select
          value={selectedWarehouse}
          onChange={(e) => setSelectedWarehouse(e.target.value)}
          style={{
            padding: '6px 10px',
            borderRadius: '8px',
            border: '1px solid #e2e4e9',
            fontSize: '13px',
            backgroundColor: '#ffffff',
            color: '#0e121b'
          }}
        >
          <option value="">Tous les entrepôts</option>
          {warehouses.map((w) => (
            <option key={w.id} value={w.id}>
              {w.name}
            </option>
          ))}
        </select>

        {(searchQuery || selectedCategory || selectedStatus || selectedWarehouse) && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('');
              setSelectedStatus('');
              setSelectedWarehouse('');
            }}
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              border: 'none',
              background: '#f3f3f6',
              color: '#525866',
              fontSize: '12px',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            Réinitialiser
          </button>
        )}
      </div>

      {/* Products Table */}
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
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Article & SKU</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Catégorie</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>État & Quantité</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Stock par Dépôt</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'right' }}>Prix Achat (PMP)</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'right' }}>Prix Vente</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#868c98' }}>
                  Chargement des articles...
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#868c98' }}>
                  <Package size={36} style={{ margin: '0 auto 8px', color: '#cdd0d5' }} />
                  <div style={{ fontWeight: 600, color: '#0e121b' }}>Aucun article trouvé</div>
                  <div style={{ fontSize: '12px', marginTop: '4px' }}>Modifiez vos critères de recherche ou ajoutez une référence.</div>
                </td>
              </tr>
            ) : (
              filteredProducts.map((prod) => (
                <tr
                  key={prod.id}
                  style={{
                    borderBottom: '1px solid #f3f3f6',
                    cursor: 'pointer',
                    transition: 'background-color 100ms ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f9f9fb')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  {/* Article & SKU */}
                  <td style={{ padding: '12px 16px' }} onClick={() => navigate(`/inventory/products/${prod.id}`)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {prod.image ? (
                        <img
                          src={prod.image}
                          alt={prod.name}
                          style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #e2e4e9' }}
                        />
                      ) : (
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          backgroundColor: '#f3f3f6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#868c98'
                        }}>
                          <Package size={20} />
                        </div>
                      )}
                      <div>
                        <div style={{ fontWeight: 600, color: '#0e121b' }}>{prod.name}</div>
                        <div style={{ fontSize: '11px', color: '#868c98', display: 'flex', gap: '8px' }}>
                          <span>SKU: <strong style={{ color: '#525866' }}>{prod.sku}</strong></span>
                          {prod.barcode && <span>EAN: {prod.barcode}</span>}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td style={{ padding: '12px 16px', color: '#525866' }} onClick={() => navigate(`/inventory/products/${prod.id}`)}>
                    <span style={{
                      backgroundColor: '#f3f3f6',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 500
                    }}>
                      {prod.category_name || 'Général'}
                    </span>
                  </td>

                  {/* Stock State */}
                  <td style={{ padding: '12px 16px' }} onClick={() => navigate(`/inventory/products/${prod.id}`)}>
                    <StockBadge
                      status={prod.stock_status}
                      quantity={prod.total_stock_on_hand}
                      unitSymbol={prod.unit_symbol}
                    />
                    <div style={{ fontSize: '11px', color: '#868c98', marginTop: '3px' }}>
                      Seuil alerte: {prod.min_stock_level} {prod.unit_symbol}
                    </div>
                  </td>

                  {/* Stock by Warehouse */}
                  <td style={{ padding: '12px 16px' }} onClick={() => navigate(`/inventory/products/${prod.id}`)}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {prod.stocks.map((stk) => (
                        <span
                          key={stk.id}
                          style={{
                            fontSize: '11px',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: stk.quantity_on_hand > 0 ? '#ecfdf5' : '#f3f3f6',
                            color: stk.quantity_on_hand > 0 ? '#059669' : '#868c98',
                            border: `1px solid ${stk.quantity_on_hand > 0 ? '#a7f3d0' : '#e2e4e9'}`
                          }}
                        >
                          {stk.warehouse_code}: {stk.quantity_on_hand}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Purchase price / PMP */}
                  <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#0e121b' }} onClick={() => navigate(`/inventory/products/${prod.id}`)}>
                    {formatCurrency(prod.purchase_price)}
                  </td>

                  {/* Selling Price */}
                  <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#4f46e5' }} onClick={() => navigate(`/inventory/products/${prod.id}`)}>
                    {formatCurrency(prod.selling_price)}
                  </td>

                  {/* Quick Actions */}
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                      <button
                        title="Ajuster le stock"
                        onClick={(e) => {
                          e.stopPropagation();
                          setAdjustmentProduct(prod);
                        }}
                        style={{
                          padding: '6px',
                          borderRadius: '6px',
                          border: '1px solid #e2e4e9',
                          background: '#ffffff',
                          cursor: 'pointer',
                          color: '#525866'
                        }}
                      >
                        <SlidersHorizontal size={14} />
                      </button>
                      <button
                        title="Transférer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setTransferProduct(prod);
                        }}
                        style={{
                          padding: '6px',
                          borderRadius: '6px',
                          border: '1px solid #e2e4e9',
                          background: '#ffffff',
                          cursor: 'pointer',
                          color: '#525866'
                        }}
                      >
                        <ArrowRightLeft size={14} />
                      </button>
                      <button
                        title="Fiche produit 360°"
                        onClick={() => navigate(`/inventory/products/${prod.id}`)}
                        style={{
                          padding: '6px',
                          borderRadius: '6px',
                          border: '1px solid #e2e4e9',
                          background: '#ffffff',
                          cursor: 'pointer',
                          color: '#0e121b'
                        }}
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* New Product Modal */}
      {isNewProductModalOpen && (
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
            maxWidth: '620px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
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
                  Nouvelle Fiche Article
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#525866' }}>
                  Enregistrement d'un produit avec valorisation et seuils d'alerte.
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateProduct} style={{ padding: '1.5rem', overflowY: 'auto' }}>
              {formError && (
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
                  <span>{formError}</span>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#0e121b', marginBottom: '4px' }}>
                    Désignation de l'article *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Câble Réseau Blindé RJ45"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cdd0d5', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#0e121b', marginBottom: '4px' }}>
                    Référence SKU *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: CAB-RJ45-10M"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cdd0d5', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#525866', marginBottom: '4px' }}>
                    Catégorie
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cdd0d5', fontSize: '13px', backgroundColor: '#ffffff' }}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#525866', marginBottom: '4px' }}>
                    Unité de mesure
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cdd0d5', fontSize: '13px', backgroundColor: '#ffffff' }}
                  >
                    {units.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.symbol})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#525866', marginBottom: '4px' }}>
                    Code-barres / EAN
                  </label>
                  <input
                    type="text"
                    placeholder="37601234..."
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cdd0d5', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#0e121b', marginBottom: '4px' }}>
                    Prix d'Achat HT (XAF)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.purchase_price}
                    onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cdd0d5', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#0e121b', marginBottom: '4px' }}>
                    Prix de Vente Conseillé HT (XAF)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.selling_price}
                    onChange={(e) => setFormData({ ...formData, selling_price: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cdd0d5', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#0e121b', marginBottom: '4px' }}>
                  Photo de l'article (Optionnel)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setFormData({ ...formData, image: file });
                  }}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cdd0d5', fontSize: '13px' }}
                />
              </div>

              {/* Initial stock assignment */}
              <div style={{
                backgroundColor: '#f9f9fb',
                border: '1px solid #e2e4e9',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '12px'
              }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#0e121b', marginBottom: '8px' }}>
                  Stock Initial de démarrage (Optionnel)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#525866', marginBottom: '4px' }}>
                      Entrepôt de dépôt
                    </label>
                    <select
                      value={formData.initial_warehouse}
                      onChange={(e) => setFormData({ ...formData, initial_warehouse: e.target.value })}
                      style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cdd0d5', fontSize: '12px', backgroundColor: '#ffffff' }}
                    >
                      {warehouses.map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#525866', marginBottom: '4px' }}>
                      Quantité initiale
                    </label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={formData.initial_quantity}
                      onChange={(e) => setFormData({ ...formData, initial_quantity: e.target.value })}
                      style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cdd0d5', fontSize: '12px' }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setIsNewProductModalOpen(false)}
                  style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #cdd0d5', background: '#ffffff', color: '#525866', fontSize: '13px', cursor: 'pointer' }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#0e121b', color: '#ffffff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                >
                  {submitting ? 'Création...' : 'Créer l\'Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Adjust Stock Modal */}
      {adjustmentProduct && (
        <StockAdjustmentModal
          isOpen={!!adjustmentProduct}
          onClose={() => setAdjustmentProduct(null)}
          onSuccess={loadData}
          product={adjustmentProduct}
          warehouses={warehouses}
        />
      )}

      {/* Transfer Stock Modal */}
      {transferProduct && (
        <StockTransferModal
          isOpen={!!transferProduct}
          onClose={() => setTransferProduct(null)}
          onSuccess={loadData}
          preselectedProduct={transferProduct}
        />
      )}
    </div>
  );
};
